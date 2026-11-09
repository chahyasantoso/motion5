import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { DEFAULT_LIMITS, describeFinding, restFindings } from "../page/check";
import { readSceneModule, sampleScene, type SceneModule } from "./scene";
import { STEP_MS } from "../timeline/timeline";

export interface SceneReviewRequest {
  readonly file: string;
  readonly to?: number;
  readonly hold: number;
  readonly jump: number;
}

export type SceneReviewArgs =
  | ({ readonly kind: "ok" } & SceneReviewRequest)
  | { readonly kind: "usage"; readonly message: string };

export interface SceneReviewResult {
  readonly kind: "reviewed";
  /** One line per finding; none means clean. */
  readonly findings: readonly string[];
}

const USAGE = "usage: motion:review <scene.ts> [--to ms] [--hold ms] [--jump n]";

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
    if (flag !== "--to" && flag !== "--hold" && flag !== "--jump")
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
  if (flags.has("--to") && to === undefined) return usage("--to needs the run's end, in ms.");
  if (hold === undefined || jump === undefined)
    return usage("--hold and --jump need non-negative numbers.");
  return { kind: "ok", file, hold, jump, ...(to === undefined ? {} : { to }) };
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

/** Ratios (scale, opacity) are about a hundredth of a position unit, so they get a hundredth of the limit. */
const RATIO_FIELD = /(^|\.)(scale\w*|opacity)$/;

function limitFor(path: string, jump: number): number {
  return RATIO_FIELD.test(path.replace(/\[\d+\]/g, "")) ? jump / 100 : jump;
}

/** Findings over a scene's values sampled every 16 ms: jumps, a short final hold, targets still moving. */
export function reviewValues(
  samples: readonly { readonly at: number; readonly targets: Readonly<Record<string, unknown>> }[],
  limits: { readonly hold: number; readonly jump: number },
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
    for (const [path, value] of now) {
      const earlier = before.get(path);
      if (earlier === undefined) continue;
      const step = Math.abs(value - earlier);
      if (step > limitFor(path, limits.jump))
        jumps.push(
          `${path} jumps ${Math.round(step * 100) / 100} at ${samples[index]?.at ?? 0} ms`,
        );
    }
  });
  const names = [...new Set(samples.flatMap(({ targets }) => Object.keys(targets)))];
  const prints = samples.map(({ targets }) =>
    Object.fromEntries(
      Object.entries(targets).map(([name, value]) => [name, JSON.stringify(value)]),
    ),
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
  request: Pick<SceneReviewRequest, "to" | "hold" | "jump">,
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
