import { pathToFileURL } from "node:url";
import { quaternionFromEuler3d } from "@motion5/rig";
import { resolve } from "node:path";
import { DEFAULT_LIMITS, describeFinding, restFindings } from "../page/check";
import { readSceneModule, sampleScene, type SceneModule } from "./scene";
import { STEP_MS } from "../timeline/timeline";

export interface SceneReviewRequest {
  readonly file: string;
  readonly to?: number;
  readonly hold: number;
  /** Largest step of a position in one frame, in the scene's units. */
  readonly jump: number;
  /** Largest step of a turn in one frame, in degrees, the short way round. */
  readonly turn: number;
  /** Largest step of a scale or opacity in one frame. */
  readonly ratio: number;
}

/** Turn and ratio limits when no flag gives them. */
export const SCENE_LIMITS = Object.freeze({ turn: 150, ratio: 1.5 });

export type SceneReviewArgs =
  | ({ readonly kind: "ok" } & SceneReviewRequest)
  | { readonly kind: "usage"; readonly message: string };

export interface SceneReviewResult {
  readonly kind: "reviewed";
  /** One line per finding; none means clean. */
  readonly findings: readonly string[];
}

const USAGE =
  "usage: motion:review <scene.ts> [--to ms] [--hold ms] [--jump units] [--turn degrees] [--ratio n]";

/** A path ending in .ts or .tsx is a scene file, reviewed from its values with no page. */
export function isSceneFile(argv: readonly string[]): boolean {
  const file = argv[0];
  return file !== undefined && /\.tsx?$/.test(file);
}

export function parseSceneReviewArgs(argv: readonly string[]): SceneReviewArgs {
  const usage = (message: string): SceneReviewArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const [file, ...rest] = argv;
  if (file === undefined) return usage("A scene file is needed.");
  const flags = new Map<string, string>();
  for (let index = 0; index < rest.length; index += 2) {
    const flag = rest[index];
    const value = rest[index + 1];
    if (flag === undefined || !["--to", "--hold", "--jump", "--turn", "--ratio"].includes(flag))
      return usage(`Unknown argument ${flag ?? ""}.`);
    if (value === undefined) return usage(`${flag} needs a value.`);
    flags.set(flag, value);
  }
  const number = (flag: string, fallback?: number): number | undefined => {
    const text = flags.get(flag);
    if (text === undefined) return fallback;
    const value = Number(text);
    return text !== "" && Number.isFinite(value) && value >= 0 ? value : undefined;
  };
  const to = number("--to");
  const hold = number("--hold", DEFAULT_LIMITS.hold);
  const jump = number("--jump", DEFAULT_LIMITS.jump);
  const turn = number("--turn", SCENE_LIMITS.turn);
  const ratio = number("--ratio", SCENE_LIMITS.ratio);
  if (flags.has("--to") && to === undefined) return usage("--to needs the run's end, in ms.");
  if (hold === undefined || jump === undefined || turn === undefined || ratio === undefined)
    return usage("--hold, --jump, --turn and --ratio need non-negative numbers.");
  return { kind: "ok", file, hold, jump, turn, ratio, ...(to === undefined ? {} : { to }) };
}

/** Every number in a value, by path: `ball.x`, `letters[2].rotationY`. */
function numbersOf(value: unknown, path: string, into: Map<string, number>): void {
  if (typeof value === "number") into.set(path, value);
  else if (Array.isArray(value))
    value.forEach((item, index) => numbersOf(item, `${path}[${index}]`, into));
  else if (typeof value === "object" && value !== null)
    for (const [key, item] of Object.entries(value))
      numbersOf(item, path === "" ? key : `${path}.${key}`, into);
}

type FieldKind = "position" | "turn" | "ratio";

function kindOf(path: string): FieldKind {
  if (/(^|\.)rotation[XYZ]?$/.test(path)) return "turn";
  if (/(^|\.)(scale\w*|opacity)$/.test(path)) return "ratio";
  return "position";
}

type Limits = Pick<SceneReviewRequest, "hold" | "jump" | "turn" | "ratio">;

/** How far a field moved in one step, and how far it may: turns wrap at a full turn, so 179 to -179 is 2. */
function stepAndLimit(
  path: string,
  from: number,
  to: number,
  limits: Limits,
): readonly [number, number] {
  const step = Math.abs(to - from);
  const kind = kindOf(path);
  switch (kind) {
    case "position":
      return [step, limits.jump];
    case "turn":
      return [Math.min(step % 360, 360 - (step % 360)), limits.turn];
    case "ratio":
      return [step, limits.ratio];
    default: {
      const unknown: never = kind;
      throw new TypeError(`Unknown field kind: ${JSON.stringify(unknown)}`);
    }
  }
}

const TURN_KEYS = ["rotation", "rotationX", "rotationY"] as const;

/** The pose a turn field belongs to: `body.rotationX` belongs to `body`. */
function ownerOf(path: string): string {
  return path.replace(/.?rotation[XY]?$/, "");
}

/** Degrees between two 3D turns, as one rotation, however their Euler numbers are written. */
function turnBetween(
  before: ReadonlyMap<string, number>,
  now: ReadonlyMap<string, number>,
  owner: string,
): number {
  const at = (sample: ReadonlyMap<string, number>) => {
    const [z, x, y] = TURN_KEYS.map(
      (key) => sample.get(owner === "" ? key : `${owner}.${key}`) ?? 0,
    );
    return quaternionFromEuler3d({ rotation: z ?? 0, rotationX: x ?? 0, rotationY: y ?? 0 });
  };
  const a = at(before);
  const b = at(now);
  const dot = Math.min(1, Math.abs(a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z));
  return (2 * Math.acos(dot) * 180) / Math.PI;
}

/** A sample's values, rounded to a hundredth, so a spring's last thousandth does not count as moving. */
function fingerprint(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) =>
    typeof item === "number" ? Math.round(item * 100) / 100 : item,
  );
}

/** Findings over a scene's values sampled every 16 ms: jumps, a short final hold, targets still moving. */
export function reviewValues(
  samples: readonly { readonly at: number; readonly targets: Readonly<Record<string, unknown>> }[],
  limits: Limits,
): readonly string[] {
  const jumps: string[] = [];
  const numbers = samples.map(({ targets }) => {
    const found = new Map<string, number>();
    for (const [name, value] of Object.entries(targets)) numbersOf(value, name, found);
    return found;
  });
  numbers.forEach((now, index) => {
    const before = numbers[index - 1];
    if (before === undefined) return;
    const turned3d = new Set(
      [...now.keys(), ...before.keys()]
        .filter((path) => /(^|.)rotation[XY]$/.test(path))
        .map(ownerOf),
    );
    for (const owner of turned3d) {
      const step = turnBetween(before, now, owner);
      if (step > limits.turn)
        jumps.push(
          `${owner} turns ${Math.round(step * 100) / 100} at ${samples[index]?.at ?? 0} ms`,
        );
    }
    for (const [path, value] of now) {
      const earlier = before.get(path);
      if (earlier === undefined) continue;
      if (kindOf(path) === "turn" && turned3d.has(ownerOf(path))) continue;
      const [step, limit] = stepAndLimit(path, earlier, value, limits);
      if (step > limit)
        jumps.push(
          `${path} jumps ${Math.round(step * 100) / 100} at ${samples[index]?.at ?? 0} ms`,
        );
    }
  });
  const names = [...new Set(samples.flatMap(({ targets }) => Object.keys(targets)))];
  const prints = samples.map(({ targets }) =>
    Object.fromEntries(Object.entries(targets).map(([name, value]) => [name, fingerprint(value)])),
  );
  const rest = restFindings(
    samples.map(({ at }) => at),
    names,
    (name, before, after) => prints[before]?.[name] === prints[after]?.[name],
    limits.hold,
  );
  return [...jumps, ...rest.map(describeFinding)];
}

export function reviewSceneModule(
  module: SceneModule,
  request: Pick<SceneReviewRequest, "to"> & Limits,
): SceneReviewResult {
  const end = request.to ?? module.durationMs;
  const ms: number[] = [];
  for (let at = 0; at <= end; at += STEP_MS) ms.push(at);
  const samples = sampleScene(module, { kind: "time", ms });
  return { kind: "reviewed", findings: reviewValues(samples, request) };
}

/** Loads a scene file as `motion:sample` does and reviews its values, with no page. */
export async function reviewSceneFile(
  request: SceneReviewRequest,
): Promise<SceneReviewResult | { readonly kind: "usage"; readonly message: string }> {
  const module = readSceneModule(await import(pathToFileURL(resolve(request.file)).href));
  if ("reason" in module) return { kind: "usage", message: module.reason };
  return reviewSceneModule(module, request);
}
