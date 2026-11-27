import { readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import {
  INPUT_EVENTS,
  NO_INPUT,
  elapsedOf,
  liveAt,
  mergeInput,
  pathBounds,
  quaternionFromEuler3d,
  unreachable,
  valueField,
  withProbeStore,
  type Input,
  type Time,
} from "@gerak/core";
import { manualDriver, play } from "@gerak/player";
import {
  NO_REST,
  check,
  formatStageError,
  frame,
  placementOf,
  type Content,
  type Drive,
  type FrameInput,
  type FrameOutput,
  type Member,
  type RestReader,
  beatAt,
  type Stage,
  type Window,
} from "@gerak/stage";
import { drawStrokes } from "@gerak/stage/render";
import { DEFAULT_LIMITS, describeFinding, restFindings } from "../page/check";
import { readPreset } from "../page/presets";
import { piecesRoot } from "../page/root";
import { SCENE_LIMITS } from "./limits";
import {
  loadSceneFile,
  measuredInput,
  parseEvents,
  writtenOut,
  type Beat,
  type SceneModule,
} from "./scene";
import { STEP_MS } from "../timeline/timeline";

export interface SceneReviewRequest {
  readonly file: string;
  readonly to?: number;
  readonly events?: Input;
  readonly measure?: boolean;
  readonly hold: number;
  /** Largest step of a position in one frame, in the scene's units. */
  readonly jump: number;
  /** Largest step of a turn in one frame, in degrees, the short way round. */
  readonly turn: number;
  /** Largest step of a scale or opacity in one frame. */
  readonly ratio: number;
  /** Most a step may cost, in ms: one seek and the scene call it causes. */
  readonly budget: number;
}

/** The most one step of a scene may cost, in ms, when no flag gives it. */
export const DEFAULT_BUDGET_MS = 8;

export type SceneReviewArgs =
  | ({ readonly kind: "ok" } & SceneReviewRequest)
  | { readonly kind: "usage"; readonly message: string };

export interface SceneReviewResult {
  readonly kind: "reviewed";
  /** One line per finding; none means clean. */
  readonly findings: readonly string[];
}

const USAGE =
  "usage: gerak review <scene.ts> [--to ms] [--events list|@preset] [--measure] [--hold ms] [--jump units] [--turn degrees] [--ratio n] [--budget ms]";

/** A path ending in .ts or .tsx is a scene file, reviewed from its values with no page. */
export function isSceneFile(argv: readonly string[]): boolean {
  const file = argv[0];
  return file !== undefined && /\.tsx?$/.test(file);
}

function presetEvents(file: string, name: string): Input | { readonly reason: string } {
  const path = resolve(file);
  const found = piecesRoot(dirname(path));
  if (found.kind === "missing") return { reason: found.message };
  const piece = basename(path)
    .replace(/\.tsx?$/, "")
    .replace(/-scene$/, "");
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(piece))
    return { reason: `${basename(path)} names no piece, so it has no presets.` };
  return readPreset(found.root, piece, name);
}

export function parseSceneReviewArgs(argv: readonly string[]): SceneReviewArgs {
  const usage = (message: string): SceneReviewArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const [file, ...rest] = argv;
  if (file === undefined) return usage("A scene file is needed.");
  const flags = new Map<string, string>();
  let measure = false;
  for (let index = 0; index < rest.length; ) {
    const flag = rest[index];
    if (flag === "--measure") {
      if (measure) return usage("Repeated flag --measure.");
      measure = true;
      index += 1;
      continue;
    }
    const value = rest[index + 1];
    if (
      flag === undefined ||
      !["--to", "--events", "--hold", "--jump", "--turn", "--ratio", "--budget"].includes(flag)
    )
      return usage(`Unknown argument ${flag ?? ""}.`);
    if (value === undefined) return usage(`${flag} needs a value.`);
    flags.set(flag, value);
    index += 2;
  }
  const number = (flag: string, fallback?: number): number | undefined => {
    const text = flags.get(flag);
    if (text === undefined) return fallback;
    const value = Number(text);
    return text !== "" && Number.isFinite(value) && value >= 0 ? value : undefined;
  };
  const to = number("--to");
  const rawEvents = flags.get("--events");
  let parsedEvents: ReturnType<typeof parseEvents> | undefined;
  if (rawEvents !== undefined)
    parsedEvents = rawEvents.startsWith("@")
      ? presetEvents(file, rawEvents.slice(1))
      : parseEvents(rawEvents);
  if (flags.has("--events")) {
    if (parsedEvents === undefined) return usage("--events needs a list.");
    if ("reason" in parsedEvents) return usage(parsedEvents.reason);
  }
  const hold = number("--hold", DEFAULT_LIMITS.hold);
  const jump = number("--jump", DEFAULT_LIMITS.jump);
  const turn = number("--turn", SCENE_LIMITS.turn);
  const ratio = number("--ratio", SCENE_LIMITS.ratio);
  const budget = number("--budget", DEFAULT_BUDGET_MS);
  if (budget === undefined || budget === 0) return usage("--budget needs a positive number of ms.");
  if (flags.has("--to") && to === undefined) return usage("--to needs the run's end, in ms.");
  if (hold === undefined || jump === undefined || turn === undefined || ratio === undefined)
    return usage("--hold, --jump, --turn and --ratio need non-negative numbers.");
  return {
    kind: "ok",
    file,
    hold,
    jump,
    turn,
    ratio,
    budget,
    ...(to === undefined ? {} : { to }),
    ...(parsedEvents !== undefined && !("reason" in parsedEvents) ? { events: parsedEvents } : {}),
    ...(measure ? { measure: true } : {}),
  };
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

function isCustomPath(path: string): boolean {
  return /(^|\.)custom(\.|\[|$)/.test(path);
}

function kindOf(path: string): FieldKind {
  if (isCustomPath(path)) return "ratio";
  return valueField(path.slice(path.lastIndexOf(".") + 1))?.judged ?? "position";
}

function fractionalCustomPaths(
  numbers: readonly ReadonlyMap<string, number>[],
): ReadonlySet<string> {
  const fractional = new Set<string>();
  for (const sample of numbers) {
    for (const [path, value] of sample) {
      if (isCustomPath(path) && !Number.isInteger(value)) fractional.add(path);
    }
  }
  return fractional;
}

type Limits = Pick<SceneReviewRequest, "hold" | "jump" | "turn" | "ratio">;

/** The target a path belongs to: its first segment. */
function targetOf(path: string): string {
  return path.split(/[.[]/)[0] ?? "";
}

/** The flag's limits with a target's own given in their place. */
function limitsFor(flags: Limits, perTarget: SceneModule["limits"], target: string): Limits {
  const own = perTarget[target];
  return {
    hold: flags.hold,
    jump: own?.jump ?? flags.jump,
    turn: own?.turn ?? flags.turn,
    ratio: own?.ratio ?? flags.ratio,
  };
}

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

/** Findings over a scene's values sampled every 16 ms: jumps, a short final hold, targets still moving; a hidden
 * target counts as still, and an `ongoing` one is never asked to rest. */
export function reviewValues(
  samples: readonly { readonly at: number; readonly targets: Readonly<Record<string, unknown>> }[],
  limits: Limits,
  hidden: (path: string, ms: number) => boolean = () => false,
  ongoing: (name: string) => boolean = () => false,
  perTarget: SceneModule["limits"] = {},
): readonly string[] {
  const jumps: string[] = [];
  const numbers = samples.map(({ targets }) => {
    const found = new Map<string, number>();
    for (const [name, value] of Object.entries(targets)) numbersOf(value, name, found);
    return found;
  });
  const fractionalCustom = fractionalCustomPaths(numbers);
  numbers.forEach((now, index) => {
    const before = numbers[index - 1];
    if (before === undefined) return;
    const turned3d = new Set(
      [...now.keys(), ...before.keys()]
        .filter((path) => /(^|.)rotation[XY]$/.test(path) && kindOf(path) === "turn")
        .map(ownerOf),
    );
    const from = samples[index - 1]?.at ?? 0;
    const at = samples[index]?.at ?? 0;
    for (const owner of turned3d) {
      const step = turnBetween(before, now, owner);
      if (
        step > limitsFor(limits, perTarget, targetOf(owner)).turn &&
        !hidden(owner, from) &&
        !hidden(owner, at)
      )
        jumps.push(`${owner} turns ${Math.round(step * 100) / 100} at ${at} ms`);
    }
    for (const [path, value] of now) {
      const earlier = before.get(path);
      if (earlier === undefined) continue;
      if (isCustomPath(path) && !fractionalCustom.has(path)) continue;
      if (kindOf(path) === "turn" && turned3d.has(ownerOf(path))) continue;
      const [step, limit] = stepAndLimit(
        path,
        earlier,
        value,
        limitsFor(limits, perTarget, targetOf(path)),
      );
      if (step > limit && !hidden(path, from) && !hidden(path, at))
        jumps.push(`${path} jumps ${Math.round(step * 100) / 100} at ${at} ms`);
    }
  });
  const names = [...new Set(samples.flatMap(({ targets }) => Object.keys(targets)))].filter(
    (name) => !ongoing(name),
  );
  const prints = samples.map(({ targets }) =>
    Object.fromEntries(Object.entries(targets).map(([name, value]) => [name, fingerprint(value)])),
  );
  const rest = restFindings(
    samples.map(({ at }) => at),
    names,
    (name, before, after) =>
      hidden(name, samples[before]?.at ?? 0) ||
      hidden(name, samples[after]?.at ?? 0) ||
      prints[before]?.[name] === prints[after]?.[name],
    limits.hold,
  );
  const returned = new Set(samples.flatMap(({ targets }) => Object.keys(targets)));
  const ghosts = Object.keys(perTarget)
    .filter((name) => !returned.has(name))
    .map((name) => `limits names "${name}", which the scene never returns`);
  return [...jumps, ...rest.map(describeFinding), ...ghosts];
}

/** A scene module sampled over its run: each step's time and the value of each target. */
export type Samples = Parameters<typeof reviewValues>[0];

/** A member, or one item of a list, as review reads it. */
type Reviewed =
  | { readonly kind: "member"; readonly name: string; readonly member: Member }
  | {
      readonly kind: "item";
      readonly name: string;
      readonly member:
        | Extract<Member, { readonly kind: "list" }>
        | Extract<Member, { readonly kind: "object" }>;
      readonly index: number;
    };

function expandReviewedParts(
  own: Reviewed,
  member: Extract<Member, { readonly kind: "list" }> | Extract<Member, { readonly kind: "object" }>,
  counts: Readonly<Record<string, number>> | undefined,
): readonly Reviewed[] {
  const count = counts?.[member.name] ?? 1;
  return [
    own,
    ...Array.from(
      { length: count },
      (_, index): Reviewed => ({
        kind: "item",
        name: `${member.name}.${index}`,
        member,
        index,
      }),
    ),
  ];
}

/** Every member and list item of a stage, parents first. */
function reviewedOf(stage: Stage, counts?: Readonly<Record<string, number>>): readonly Reviewed[] {
  return stage.members.flatMap((member): readonly Reviewed[] => {
    const own: Reviewed = { kind: "member", name: member.name, member };
    switch (member.kind) {
      case "actor":
        return [own];
      case "list":
        return expandReviewedParts(own, member, counts);
      case "object":
        return member.parts === true ? expandReviewedParts(own, member, counts) : [own];
      default:
        return unreachable(member);
    }
  });
}

function contentOfReviewed(reviewed: Reviewed): Content | undefined {
  switch (reviewed.kind) {
    case "member":
      return reviewed.member.kind === "actor" ? reviewed.member.content : undefined;
    case "item":
      return undefined;
    default:
      return unreachable(reviewed);
  }
}

interface EvaluatedSample {
  readonly at: number;
  /** The scene's targets with each list's poses written out, one per item. */
  readonly targets: Readonly<Record<string, unknown>>;
  readonly visible: Readonly<Record<string, boolean>> | undefined;
  readonly drives: ReadonlyMap<string, Drive>;
  readonly errors: readonly string[];
}

function evaluate(
  stage: Stage,
  input: Pick<FrameInput, "counts" | "lines" | "rest">,
  time: Time,
  events: Input,
  at: number,
): EvaluatedSample {
  let out: FrameOutput;
  let errors: string[];
  let targets: Readonly<Record<string, unknown>>;
  const drives = new Map<string, Drive>();
  try {
    out = frame(stage, { time, events, ...input, drives });
    errors = check(stage, out.targets, input.counts).map(formatStageError);
    targets = writtenOut(stage, out.targets, input.counts);
  } catch (error) {
    return { at, targets: {}, visible: undefined, drives: new Map(), errors: [errorText(error)] };
  }
  for (const member of stage.members) {
    if (member.kind !== "actor" || member.content.kind !== "readout") continue;
    try {
      member.content.format(time);
    } catch (error) {
      const raw = errorText(error);
      const prefix = `The text of "${member.name}" `;
      const detail = raw.startsWith(prefix)
        ? raw.slice(prefix.length).replace(/.$/, "")
        : `fails: ${raw}`;
      errors.push(`text of "${member.name}" ${detail}`);
    }
  }
  return { at, targets, visible: out.visible, drives, errors };
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Runs the stage at each requested ms, collecting samples and per-step evaluation timings. */
function sampleStageFrames(
  stage: Stage,
  input: Pick<FrameInput, "counts" | "lines" | "rest">,
  ms: readonly number[],
  events: Input = NO_INPUT,
): { readonly evaluated: readonly EvaluatedSample[]; readonly costs: readonly number[] } {
  let latest: EvaluatedSample | undefined;
  const driver = manualDriver({ durationMs: stage.durationMs });
  let at = 0;
  const playStart = performance.now();
  play(
    (time, seen) => {
      latest = evaluate(stage, input, time, seen, at);
      return latest.targets;
    },
    driver,
    { cues: mergeInput(stage.cues, events) },
  );
  const initialCost = performance.now() - playStart;
  const costs: number[] = [];
  const evaluated = ms.map((next, index) => {
    at = next;
    if (index === 0 && next === 0 && latest !== undefined) {
      costs.push(initialCost);
      return latest;
    }
    const start = performance.now();
    driver.seekMs(next);
    costs.push(performance.now() - start);
    return latest ?? evaluate(stage, input, driver.now(), NO_INPUT, next);
  });
  return { evaluated, costs };
}

/** A member's value in written-out targets: its own, or one item of its list. */
function valueOfReview(targets: Readonly<Record<string, unknown>>, reviewed: Reviewed): unknown {
  switch (reviewed.kind) {
    case "member":
      return targets[reviewed.name];
    case "item": {
      const list = targets[reviewed.member.name];
      return Array.isArray(list) ? list[reviewed.index] : undefined;
    }
    default:
      return unreachable(reviewed);
  }
}

/** Whether a member or item shows: a list item shows while its list does, and a child while its parent in the cache does. */
function shown(
  sample: EvaluatedSample,
  reviewed: Reviewed,
  parents?: Readonly<Record<string, string>>,
): boolean {
  if (sample.visible?.[reviewed.member.name] === false) return false;
  const seen = new Set<string>([reviewed.name, reviewed.member.name]);
  for (
    let name =
      parents?.[reviewed.name] ??
      parents?.[reviewed.member.name] ??
      parents?.[`${reviewed.member.name}.0`];
    name !== undefined && !seen.has(name);
    name = parents?.[name]
  ) {
    seen.add(name);
    if (sample.visible?.[name] === false) return false;
  }
  return true;
}

/** Each mistake once, at the first ms it happens: shapes, unknown targets, failing readouts. */
function frameEvaluationFindings(evaluated: readonly EvaluatedSample[]): readonly string[] {
  const first = new Map<string, number>();
  for (const { at, errors } of evaluated)
    for (const error of errors) if (!first.has(error)) first.set(error, at);
  return [...first].map(([error, at]) =>
    error.startsWith("text of ") ? `${error} at ${at} ms` : error,
  );
}

/** The measured frame's size, which ambient members stay inside. */
type FrameSize = { readonly width: number; readonly height: number };

/** An ambient member that leaves the measured frame while it shows. */
function ambientBoundsFindings(
  frame: FrameSize,
  reviewed: Reviewed,
  evaluated: readonly EvaluatedSample[],
  rest: RestReader,
  parents?: Readonly<Record<string, string>>,
): readonly string[] {
  if (reviewed.kind === "member" && reviewed.member.kind !== "actor") return [];
  if (!rest.has(reviewed.name)) return [];
  const box = rest.get(reviewed.name);
  for (const sample of evaluated) {
    if (!shown(sample, reviewed, parents)) continue;
    const pose = valueOfReview(sample.targets, reviewed);
    if (typeof pose !== "object" || pose === null || Array.isArray(pose)) continue;
    const x: unknown = Reflect.get(pose, "x");
    const y: unknown = Reflect.get(pose, "y");
    if (typeof x === "number" && Number.isFinite(x)) {
      const px = box.x + x;
      if (px < 0 || px > frame.width)
        return [
          `ambient member "${reviewed.name}" leaves stage bounds at ${sample.at} ms (x=${Math.round(px * 100) / 100}, frame width ${frame.width}).`,
        ];
    }
    if (typeof y === "number" && Number.isFinite(y)) {
      const py = box.y + y;
      if (py < 0 || py > frame.height)
        return [
          `ambient member "${reviewed.name}" leaves stage bounds at ${sample.at} ms (y=${Math.round(py * 100) / 100}, frame height ${frame.height}).`,
        ];
    }
  }
  return [];
}

/** The beats a window starts and ends on, named for findings; an unnamed edge is its ms. */
function stretchOf(beats: readonly Beat[], [from, to]: Window): { start: Beat; end: Beat } {
  const start = beats.find((beat) => beat.from === from) ?? { name: `${from} ms`, from, to: from };
  const end =
    to === Infinity
      ? (beats.reduce<Beat | undefined>(
          (last, beat) => (last === undefined || beat.to >= last.to ? beat : last),
          undefined,
        ) ?? start)
      : (beats.find((beat) => beat.to === to) ?? { name: `${to} ms`, from: to, to });
  return { start, end };
}

const PAGE_INTERACTION_VALUES = ["hovered", "pressed", "focused"] as const;

/** Probes synthetic input samples for an unmoved settle member under its own reported driver. */
function movedUnderDriver(
  stage: Stage,
  reviewed: Reviewed,
  drive: Drive,
  input: Pick<FrameInput, "counts" | "lines" | "rest">,
  baseline: string,
): boolean {
  return withProbeStore(() => {
    const rest = input.rest ?? NO_REST;
    const differs = (time: Time, events: Input): boolean => {
      try {
        const out = frame(stage, {
          time,
          events,
          ...input,
          only: new Set([reviewed.member.name]),
        });
        const targets = writtenOut(stage, out.targets, input.counts);
        return fingerprint(valueOfReview(targets, reviewed)) !== baseline;
      } catch {
        return false;
      }
    };
    switch (drive.kind) {
      case "scroll":
        for (const item of drive.beats) {
          const from = item.from.at(rest);
          const to = item.to.at(rest);
          const probes = to > from ? [from, (from + to) / 2, to] : [from, from + 1];
          for (const y of probes) {
            if (differs(liveAt(0), [{ kind: "value", name: INPUT_EVENTS.scroll, at: 0, value: y }]))
              return true;
          }
        }
        return false;
      case "trigger": {
        const threshold = drive.beat.when.point.at(rest);
        if (threshold > 0 && differs(liveAt(0), NO_INPUT)) return true;
        const crossed: Input = [
          { kind: "value", name: INPUT_EVENTS.scroll, at: 0, value: threshold },
        ];
        return (
          differs(liveAt(0), crossed) ||
          differs(liveAt(drive.beat.ms / 2), crossed) ||
          differs(liveAt(drive.beat.ms), crossed)
        );
      }
      case "more": {
        const maxBottom = Math.max(
          1000,
          ...rest.keys().map((key) => {
            const box = rest.get(key);
            return box.y + box.height / 2;
          }),
        );
        const scrollProbes = new Set<number>();
        const steps = Math.max(16, Math.min(64, Math.ceil(maxBottom / 250)));
        for (let k = 1; k <= steps; k += 1) scrollProbes.add((maxBottom * k) / steps);
        for (const key of rest.keys()) {
          const placement = placementOf(rest.get(key));
          switch (placement.kind) {
            case "sticky":
              scrollProbes.add(placement.minY);
              scrollProbes.add(placement.maxY);
              for (const f of [0.125, 0.375, 0.625, 0.875])
                scrollProbes.add(placement.minY + (placement.maxY - placement.minY) * f);
              break;
            case "flow":
            case "fixed":
              break;
            default:
              unreachable(placement);
          }
        }
        for (const y of scrollProbes) {
          if (
            differs(liveAt(1000), [{ kind: "value", name: INPUT_EVENTS.scroll, at: 0, value: y }])
          )
            return true;
        }
        if (
          differs(liveAt(500), [
            { kind: "value", name: INPUT_EVENTS.pointerX, at: 0, value: 0.9 },
            { kind: "value", name: INPUT_EVENTS.pointerY, at: 0, value: 0.9 },
          ])
        )
          return true;
        for (const member of stage.members) {
          for (const name of PAGE_INTERACTION_VALUES)
            if (
              differs(liveAt(500), [{ kind: "value", name, at: 0, value: 1, target: member.name }])
            )
              return true;
        }
        return false;
      }
      default:
        return unreachable(drive);
    }
  });
}

/** Checks expectations (`"settle"`, `"ambient"`, `"static"`), shapes on non-morphs, and changes outside stretches. */
function stageMemberFindings(
  stage: Stage,
  beats: readonly Beat[],
  evaluated: readonly EvaluatedSample[],
  input: Pick<FrameInput, "counts" | "lines" | "rest">,
  frame: FrameSize | undefined,
  parents: Readonly<Record<string, string>> | undefined,
): readonly string[] {
  const rest = input.rest ?? NO_REST;
  const counts = input.counts;
  const found: string[] = [];

  if (evaluated.some(({ errors }) => errors.length > 0)) return found;
  for (const reviewed of reviewedOf(stage, counts)) {
    const { member } = reviewed;
    const prints = evaluated.map(({ targets }) => fingerprint(valueOfReview(targets, reviewed)));
    const unmoved = prints.every((print) => print === prints[0]);

    switch (member.expect) {
      case "settle":
        if (reviewed.kind === "member" && unmoved) {
          const drive = evaluated
            .find((sample) => sample.drives.has(member.name))
            ?.drives.get(member.name);
          if (
            drive === undefined ||
            !movedUnderDriver(stage, reviewed, drive, input, prints[0] ?? "")
          ) {
            found.push(
              `cast member "${reviewed.name}" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.`,
            );
          }
        }
        break;
      case "ambient":
        if (reviewed.kind === "member" && unmoved)
          found.push(
            `ambient member "${reviewed.name}" never moves; an ambient member keeps moving.`,
          );
        if (frame !== undefined)
          found.push(...ambientBoundsFindings(frame, reviewed, evaluated, rest, parents));
        break;
      case "static":
        break;
      default:
        return unreachable(member.expect);
    }

    const givenShape = evaluated.some(({ targets }) => {
      const value = valueOfReview(targets, reviewed);
      return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Reflect.get(value, "shape") !== undefined
      );
    });
    if (givenShape && contentOfReviewed(reviewed)?.kind !== "morph")
      found.push(`cast member "${reviewed.name}" is given shape, but has no shapes.`);

    if (reviewed.kind === "item" || member.on === undefined) continue;
    const changes = prints.flatMap((print, index) => {
      const before = evaluated[index - 1];
      const now = evaluated[index];
      return before === undefined ||
        now === undefined ||
        print === prints[index - 1] ||
        shown(now, reviewed, parents)
        ? []
        : [{ from: before.at, at: now.at }];
    });
    const stretches = member.on
      .map((window) => stretchOf(beats, window))
      .sort((a, b) => a.start.from - b.start.from);
    for (const outside of outsides(stretches, stage.durationMs)) {
      const change = changes.find(({ from, at }) => at < outside.until && from >= outside.after);
      if (change !== undefined)
        found.push(
          `${reviewed.name} changes at ${change.at} ms${labelAt(stage, change.at)}, ${outside.where}.`,
        );
    }
  }
  return found;
}

/** Draws every path against the rest boxes and finds loops, self-reads and failures. */
function stagePathFindings(stage: Stage, rest: RestReader): readonly string[] {
  // With no measured boxes, a path may divide by zero; only non-cubic errors fail then.
  const measured = rest.keys().length > 0;
  const drawn = drawStrokes(stage, rest);
  if (!drawn.ok) return [formatStageError(drawn.error).replace(/\.$/, "")];
  return [
    ...drawn.strokes.selfReads.map((name) => `path "${name}" reads its own rest box`),
    ...drawn.strokes.failures.flatMap(({ name, error }) =>
      measured || !(error instanceof TypeError && /cubic/i.test(error.message))
        ? [`path "${name}" fails: ${errorText(error)}`]
        : [],
    ),
  ];
}

interface Outside {
  readonly after: number;
  readonly until: number;
  readonly where: string;
}

/** The times a member is hidden: before its first stretch, in each gap, after its last unless that
 * ends at the story's end. */
function outsides(
  stretches: readonly { readonly start: Beat; readonly end: Beat }[],
  durationMs: number,
): readonly Outside[] {
  const found: Outside[] = [];
  let shownTo = -Infinity;
  let lastEnd: Beat | undefined;
  for (const { start, end } of stretches) {
    if (start.from > shownTo)
      found.push({
        after: lastEnd === undefined ? -Infinity : lastEnd.to,
        until: start.from,
        where:
          lastEnd === undefined
            ? `before its beat "${start.name}" starts at ${start.from} ms`
            : `between its beats "${lastEnd.name}", ending at ${lastEnd.to} ms, and "${start.name}", starting at ${start.from} ms`,
      });
    if (end.to > shownTo) {
      shownTo = end.to;
      lastEnd = end;
    }
  }
  if (lastEnd !== undefined && lastEnd.to < durationMs)
    found.push({
      after: lastEnd.to,
      until: Infinity,
      where: `after its beat "${lastEnd.name}" ends at ${lastEnd.to} ms`,
    });
  return found;
}

function labelAt(stage: Stage, ms: number): string {
  const name = beatAt(stage.beats, stage.durationMs, ms);
  return name === undefined ? "" : ` (beat "${name}")`;
}

/** A finding that names a time, `at 480 ms`, also names the beat it falls in. */
function labelled(stage: Stage, finding: string): string {
  return finding.replace(
    /\bat (\d+(?:\.\d+)?) ms\b/,
    (time, ms: string) => `${time}${labelAt(stage, Number(ms))}`,
  );
}

/** Every fourth sampled ms, in an order fixed by a seed that seeks back and forth. */
function soughtOrder(ms: readonly number[]): readonly number[] {
  const order = ms.filter((_, index) => index % 4 === 0);
  let seed = 7;
  for (let index = order.length - 1; index > 0; index -= 1) {
    seed = (seed * 16807) % 2147483647;
    const other = seed % (index + 1);
    const here = order[index];
    const there = order[other];
    if (here === undefined || there === undefined) continue;
    order[index] = there;
    order[other] = here;
  }
  return order;
}

/** One finding per target whose value at some ms differs when sought out of order from when played. */
function seekFindingsFrom(played: Samples, sought: Samples): readonly string[] {
  const byMs = new Map(played.map((sample) => [sample.at, sample.targets] as const));
  const found = new Map<string, number>();
  for (const { at, targets } of sought) {
    const reached = byMs.get(at);
    if (reached === undefined) continue;
    for (const [name, value] of Object.entries(targets))
      if (!found.has(name) && fingerprint(value) !== fingerprint(reached[name]))
        found.set(name, at);
  }
  return [...found].map(
    ([name, at]) =>
      `${name} at ${at} ms differs when sought from when played to; the scene keeps state between frames.`,
  );
}

/** One finding when cues fall after the module's end, which no clock reaches: how many, and the first. */
function lateCueFindings(module: SceneModule): readonly string[] {
  const late = module.cues.filter(({ at }) => at > module.durationMs);
  const [first] = late;
  if (first === undefined) return [];
  const count = late.length === 1 ? "a cue comes" : `${late.length} cues come`;
  return [
    `${count} after the end at ${module.durationMs} ms, the first "${first.name}" at ${first.at} ms; no clock reaches them, so lengthen the story or cut the recording.`,
  ];
}

/** Evaluates `ms` in order on one fresh player, returning both samples and per-step elapsed ms. */
function timedScenePass(
  module: SceneModule,
  ms: readonly number[],
  events: Input = NO_INPUT,
): { readonly samples: Samples; readonly costs: readonly number[] } {
  const driver = manualDriver({ durationMs: module.durationMs });
  const initStart = performance.now();
  const player = play(module.scene, driver, { cues: mergeInput(module.cues, events) });
  const initCost = performance.now() - initStart;
  const samples: { readonly at: number; readonly targets: Readonly<Record<string, unknown>> }[] =
    [];
  const costs: number[] = [];
  for (let index = 0; index < ms.length; index += 1) {
    const at = ms[index];
    if (at === undefined) continue;
    if (index === 0 && at === 0) {
      costs.push(initCost);
    } else {
      const start = performance.now();
      driver.seekMs(at);
      costs.push(performance.now() - start);
    }
    samples.push({ at, targets: Object.fromEntries(Object.entries(player.values)) });
  }
  return { samples, costs };
}

/** The ms each of `ms` costs: a seek, which runs the scene once, on one fresh player, in the order given. */
function timedSteps(
  module: SceneModule,
  ms: readonly number[],
  events: Input = NO_INPUT,
): readonly number[] {
  const driver = manualDriver({ durationMs: module.durationMs });
  const initStart = performance.now();
  play(module.scene, driver, { cues: mergeInput(module.cues, events) });
  const initCost = performance.now() - initStart;
  return ms.map((at, index) => {
    if (index === 0 && at === 0) return initCost;
    const start = performance.now();
    driver.seekMs(at);
    return performance.now() - start;
  });
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

const GROWTH_RATIO = 4;
const GROWTH_FLOOR_MS = 1;

/** One finding when the last fifth of the in-order steps costs over 4 times the first fifth and over 1 ms. */
function growthFindings(inOrder: readonly number[], ms: readonly number[]): readonly string[] {
  const fifth = Math.floor(inOrder.length / 5);
  if (fifth === 0) return [];
  const first = mean(inOrder.slice(0, fifth));
  const last = mean(inOrder.slice(inOrder.length - fifth));
  if (!(last > GROWTH_RATIO * first && last > GROWTH_FLOOR_MS)) return [];
  const from = ms[inOrder.length - fifth] ?? 0;
  return [
    `cost grows with time: a step reads all of the past; the first fifth of the steps averages ${first.toFixed(2)} ms, the last fifth ${last.toFixed(2)} ms, from ${from} ms on.`,
  ];
}

/** One finding when any timed step, in order or a seek, costs more than the budget. */
function budgetFindings(
  steps: readonly { readonly at: number; readonly cost: number; readonly seek: boolean }[],
  budget: number,
): readonly string[] {
  const over = steps.filter(({ cost }) => cost > budget);
  const worst = over.reduce<(typeof over)[number] | undefined>(
    (found, step) => (found === undefined || step.cost > found.cost ? step : found),
    undefined,
  );
  if (worst === undefined) return [];
  return [
    `a step costs over the budget of ${budget} ms: the worst is ${worst.cost.toFixed(2)} ms ${worst.seek ? "seeking to" : "stepping to"} ${worst.at} ms, and ${over.length} of ${steps.length} steps are over.`,
  ];
}

function verifyOverBudgetSeeks(
  module: SceneModule,
  order: readonly number[],
  seeks: readonly number[],
  budget: number,
  events: Input,
): readonly number[] {
  if (!seeks.some((cost) => cost > budget)) return seeks;
  const checkDriver = manualDriver({ durationMs: module.durationMs });
  const checkPlayer = play(module.scene, checkDriver, { cues: mergeInput(module.cues, events) });
  return seeks.map((cost, index) => {
    if (cost <= budget) return cost;
    const at = order[index];
    if (at === undefined) return cost;
    const start = performance.now();
    if (elapsedOf(checkPlayer.time.clock) === at) checkPlayer.refresh();
    else checkDriver.seekMs(at);
    return Math.min(cost, performance.now() - start);
  });
}

function costFindingsFrom(
  module: SceneModule,
  events: Input,
  inOrder: readonly number[],
  ms: readonly number[],
  seeks: readonly number[],
  order: readonly number[],
  budget: number,
): readonly string[] {
  const verifiedSeeks = verifyOverBudgetSeeks(module, order, seeks, budget, events);
  return [
    ...growthFindings(inOrder, ms),
    ...budgetFindings(
      [
        ...ms.map((at, index) => ({ at, cost: inOrder[index] ?? 0, seek: false })),
        ...order.map((at, index) => ({
          at,
          cost: verifiedSeeks[index] ?? 0,
          seek: true,
        })),
      ],
      budget,
    ),
  ];
}

/** The module sampled every step over its whole run, as a review samples it. */
export function measureSamples(module: SceneModule): Samples {
  const ms: number[] = [];
  for (let at = 0; at <= module.durationMs; at += STEP_MS) ms.push(at);
  return timedScenePass(module, ms).samples;
}

export function reviewSceneModule(
  module: SceneModule,
  request: Pick<SceneReviewRequest, "to" | "events"> & Limits & { readonly budget?: number },
): SceneReviewResult {
  const end = request.to ?? module.durationMs;
  const extraEvents = request.events ?? NO_INPUT;
  const budget = request.budget ?? DEFAULT_BUDGET_MS;
  const ms: number[] = [];
  for (let at = 0; at <= end; at += STEP_MS) ms.push(at);
  const stage = module.stage;
  if (stage === undefined) {
    const pass1 = timedScenePass(module, ms, extraEvents);
    const pass2Costs = timedSteps(module, ms, extraEvents);
    const inOrder = ms.map((_, index) => Math.min(pass1.costs[index] ?? 0, pass2Costs[index] ?? 0));
    const order = soughtOrder(ms);
    const pass3 = timedScenePass(module, order, extraEvents);
    const findings = [
      ...reviewValues(
        pass1.samples,
        request,
        () => false,
        () => false,
        module.limits,
      ),
      ...seekFindingsFrom(pass1.samples, pass3.samples),
      ...lateCueFindings(module),
      ...costFindingsFrom(module, extraEvents, inOrder, ms, pass3.costs, order, budget),
    ];
    return { kind: "reviewed", findings };
  }

  const input = measuredInput(stage, module.measured);
  const { evaluated, costs: pass1Costs } = sampleStageFrames(stage, input, ms, extraEvents);
  const samples: Samples = evaluated.map(({ at, targets }) => ({ at, targets }));
  const byAt = new Map(evaluated.map((sample) => [sample.at, sample] as const));
  const byName = new Map(
    reviewedOf(stage, input.counts).map((reviewed) => [reviewed.name, reviewed] as const),
  );
  const beats = module.beats ?? [];
  const ownerOfPath = (path: string): Reviewed | undefined => {
    const dotted = path.replace(/\[(\d+)\]/g, ".$1");
    const whole = byName.get(dotted);
    if (whole !== undefined) return whole;
    for (let cut = dotted.lastIndexOf("."); cut > 0; cut = dotted.lastIndexOf(".", cut - 1)) {
      const found = byName.get(dotted.slice(0, cut));
      if (found !== undefined) return found;
    }
    return undefined;
  };
  const parents = module.measured?.parents;
  const hidden = (path: string, at: number): boolean => {
    const owner = ownerOfPath(path);
    const sample = byAt.get(at);
    return owner !== undefined && sample !== undefined && !shown(sample, owner, parents);
  };
  const ongoing = (name: string): boolean => {
    const reviewed = byName.get(name);
    if (reviewed === undefined) return false;
    switch (reviewed.member.expect) {
      case "settle":
        return false;
      case "ambient":
      case "static":
        return true;
      default:
        return unreachable(reviewed.member.expect);
    }
  };
  const allFramesOk = evaluated.every((sample) => sample.errors.length === 0);
  let seekAndCost: readonly string[] = [];
  if (allFramesOk) {
    const pass2Costs = timedSteps(module, ms, extraEvents);
    const inOrder = ms.map((_, index) => Math.min(pass1Costs[index] ?? 0, pass2Costs[index] ?? 0));
    const order = soughtOrder(ms);
    const pass3 = timedScenePass(module, order, extraEvents);
    seekAndCost = [
      ...seekFindingsFrom(samples, pass3.samples),
      ...costFindingsFrom(module, extraEvents, inOrder, ms, pass3.costs, order, budget),
    ];
  }
  const valueFindings = [
    ...reviewValues(samples, request, hidden, ongoing, stage.limits),
    ...lateCueFindings(module),
    ...seekAndCost,
  ];
  const rest = input.rest ?? NO_REST;

  return {
    kind: "reviewed",
    findings: [
      ...frameEvaluationFindings(evaluated),
      ...valueFindings.map((finding) => labelled(stage, finding)),
      ...stageMemberFindings(stage, beats, evaluated, input, module.measured?.frame, parents),
      ...stagePathFindings(stage, rest),
    ],
  };
}

/** Loads a scene file as `gerak sample` does and reviews its values, with no page. */
export async function reviewSceneFile(
  request: SceneReviewRequest,
): Promise<SceneReviewResult | { readonly kind: "usage"; readonly message: string }> {
  const file = resolve(request.file);
  const module = await loadSceneFile(
    file,
    request.measure === true ? { measure: true } : undefined,
  );
  if ("reason" in module) return { kind: "usage", message: module.reason };
  return reviewSceneModule(module, request);
}
