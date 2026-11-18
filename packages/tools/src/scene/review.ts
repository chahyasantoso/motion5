import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  NO_EVENTS,
  mergeEvents,
  pathBounds,
  quaternionFromEuler3d,
  unreachable,
  valueField,
} from "@gerak/core";
import { manualDriver, play } from "@gerak/player";
import {
  formatStageError,
  evaluateFrame,
  presentAt,
  resolveStaticStrokes,
  restReader,
  type CompiledStage,
  type DomSkinCss,
  type FrameEvaluation,
  type PoseMode,
  type RestReader,
  type ReviewMemberSpec,
} from "@gerak/stage";
import { DEFAULT_LIMITS, describeFinding, restFindings } from "../page/check";
import { installedPackages } from "./installed";
import { SCENE_LIMITS } from "./limits";
import { beatAt, readSceneModule, sampleScene, type Beat, type SceneModule } from "./scene";
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
  "usage: gerak review <scene.ts> [--to ms] [--hold ms] [--jump units] [--turn degrees] [--ratio n] [--budget ms]";

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
    if (
      flag === undefined ||
      !["--to", "--hold", "--jump", "--turn", "--ratio", "--budget"].includes(flag)
    )
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
  const budget = number("--budget", DEFAULT_BUDGET_MS);
  if (budget === undefined || budget === 0) return usage("--budget needs a positive number of ms.");
  if (flags.has("--to") && to === undefined) return usage("--to needs the run's end, in ms.");
  if (hold === undefined || jump === undefined || turn === undefined || ratio === undefined)
    return usage("--hold, --jump, --turn and --ratio need non-negative numbers.");
  return { kind: "ok", file, hold, jump, turn, ratio, budget, ...(to === undefined ? {} : { to }) };
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
  if (/(^|\.)custom(\.|\[|$)/.test(path)) return "ratio";
  return valueField(path.slice(path.lastIndexOf(".") + 1))?.judged ?? "position";
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
  numbers.forEach((now, index) => {
    const before = numbers[index - 1];
    if (before === undefined) return;
    const turned3d = new Set(
      [...now.keys(), ...before.keys()]
        .filter((path) => /(^|.)rotation[XY]$/.test(path) && kindOf(path) === "turn")
        .map(ownerOf),
    );
    for (const owner of turned3d) {
      const step = turnBetween(before, now, owner);
      if (step > limitsFor(limits, perTarget, targetOf(owner)).turn)
        jumps.push(
          `${owner} turns ${Math.round(step * 100) / 100} at ${samples[index]?.at ?? 0} ms`,
        );
    }
    for (const [path, value] of now) {
      const earlier = before.get(path);
      if (earlier === undefined) continue;
      if (kindOf(path) === "turn" && turned3d.has(ownerOf(path))) continue;
      const [step, limit] = stepAndLimit(
        path,
        earlier,
        value,
        limitsFor(limits, perTarget, targetOf(path)),
      );
      const from = samples[index - 1]?.at ?? 0;
      const at = samples[index]?.at ?? 0;
      if (step > limit && !hidden(path, from) && !hidden(path, at))
        jumps.push(
          `${path} jumps ${Math.round(step * 100) / 100} at ${samples[index]?.at ?? 0} ms`,
        );
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

/** What an installed package's review finder reads: the module and its sampled values. */
export interface ReviewInput {
  readonly module: SceneModule;
  readonly samples: Samples;
}

/** Findings, one line each, an installed package gives a scene module; none means clean. */
export type ReviewFinder = (input: ReviewInput) => readonly string[];

/** What a package's declared review module returns, for the pieces root a scene file sits under. */
export type ReviewPreparation =
  | { readonly kind: "ready"; readonly find: ReviewFinder }
  | { readonly kind: "refused"; readonly message: string };

interface EvaluatedSample {
  readonly at: number;
  readonly targets: Readonly<Record<string, unknown>>;
  readonly evaluation: FrameEvaluation<PoseMode>;
}

/** Evaluates a compiled stage at each requested ms using `evaluateFrame`. */
function sampleStageFrames(
  stage: CompiledStage<PoseMode>,
  ms: readonly number[],
): readonly EvaluatedSample[] {
  let latest: FrameEvaluation<PoseMode> | undefined;
  const driver = manualDriver({ durationMs: stage.beats.durationMs });
  play(
    (time, events) => {
      latest = evaluateFrame(stage, { time, events });
      return latest.ok ? latest.poses : {};
    },
    driver,
    { cues: stage.cues },
  );
  return ms.map((at, index) => {
    if (!(index === 0 && at === 0 && latest !== undefined)) {
      driver.seekMs(at);
    }
    const evaluation: FrameEvaluation<PoseMode> =
      latest ?? evaluateFrame(stage, { time: driver.now(), events: NO_EVENTS });
    return {
      at,
      targets: evaluation.ok ? evaluation.poses : {},
      evaluation,
    };
  });
}

/** A member's value in evaluated poses: its own target, or one item of a list. */
function valueOfReview(
  targets: Readonly<Record<string, unknown>>,
  member: ReviewMemberSpec,
): unknown {
  switch (member.kind) {
    case "actor":
    case "list":
    case "group":
      return targets[member.name];
    case "item": {
      const dot = member.name.lastIndexOf(".");
      const list = targets[member.name.slice(0, dot)];
      if (!Array.isArray(list)) return undefined;
      const item: unknown = list[Number(member.name.slice(dot + 1))];
      return item;
    }
    default:
      return unreachable(member.kind);
  }
}

/** Emits deduplicated findings for frame-level shape mismatches, readout errors, and extra targets. */
function frameEvaluationFindings(evaluated: readonly EvaluatedSample[]): readonly string[] {
  const found: string[] = [];
  const seenShapes = new Set<string>();
  const seenReadouts = new Set<string>();
  const seenExtra = new Set<string>();
  for (const { at, evaluation } of evaluated) {
    if (!evaluation.ok) {
      for (const error of evaluation.errors) {
        const key = `${error.member}:${error.reason}`;
        if (seenShapes.has(key)) continue;
        seenShapes.add(key);
        found.push(formatStageError(error));
      }
      continue;
    }
    for (const target of evaluation.extraTargets) {
      if (seenExtra.has(target)) continue;
      seenExtra.add(target);
      found.push(`the scene answers "${target}", which is not in the cast.`);
    }
    for (const { member, error } of evaluation.readoutErrors) {
      if (seenReadouts.has(member)) continue;
      seenReadouts.add(member);
      const raw = error instanceof Error ? error.message : String(error);
      const prefix = `The text of "${member}" `;
      const detail = raw.startsWith(prefix)
        ? raw.slice(prefix.length).replace(/\.$/, "")
        : `fails: ${raw}`;
      found.push(`text of "${member}" ${detail} at ${at} ms`);
    }
  }
  return found;
}

/** Checks ambient member bounds against the stage frame at visible frames. */
function ambientBoundsFindings(
  stage: CompiledStage<PoseMode>,
  member: ReviewMemberSpec,
  evaluated: readonly EvaluatedSample[],
  rest: RestReader,
): readonly string[] {
  if (member.kind !== "actor" && member.kind !== "item") return [];
  const box = rest.get(member.name);
  for (const { at, evaluation } of evaluated) {
    if (!evaluation.ok || evaluation.visibility[member.name] === false) continue;
    const pose = valueOfReview(evaluation.poses, member);
    if (typeof pose !== "object" || pose === null || Array.isArray(pose)) continue;
    const x: unknown = Reflect.get(pose, "x");
    const y: unknown = Reflect.get(pose, "y");
    if (typeof x === "number" && Number.isFinite(x)) {
      const px = box.x + x;
      if (px < 0 || px > stage.frame.width) {
        return [
          `ambient member "${member.name}" leaves stage bounds at ${at} ms (x=${Math.round(px * 100) / 100}, frame width ${stage.frame.width}).`,
        ];
      }
    }
    if (typeof y === "number" && Number.isFinite(y)) {
      const py = box.y + y;
      if (py < 0 || py > stage.frame.height) {
        return [
          `ambient member "${member.name}" leaves stage bounds at ${at} ms (y=${Math.round(py * 100) / 100}, frame height ${stage.frame.height}).`,
        ];
      }
    }
  }
  return [];
}

/** Checks cast expectations (`"settle"`, `"ambient"`, `"static"`), morph usage, and stretch bounds. */
function stageMemberFindings(
  stage: CompiledStage<PoseMode>,
  beats: readonly Beat[],
  evaluated: readonly EvaluatedSample[],
  rest: RestReader,
  unmeasured: boolean,
): readonly string[] {
  const found: string[] = [];
  if (unmeasured)
    found.push(
      'its layouts are not measured without a browser, so "never moved" is not checked here for any member; review it in the browser, `gerak review "stage.html?piece=<name>" --watch <member>`, or export `rests`.',
    );
  const beatNamed = (name: string) => beats.find((beat) => beat.name === name);
  const durationMs = stage.beats.durationMs;

  for (const member of stage.review.members) {
    const prints = evaluated.map(({ targets }) => fingerprint(valueOfReview(targets, member)));
    const unmoved = prints.every((print) => print === prints[0]);

    switch (member.expectation) {
      case "settle": {
        if (
          (member.kind === "actor" || member.kind === "list") &&
          !member.watch &&
          unmoved &&
          !unmeasured
        )
          found.push(
            `cast member "${member.name}" is never moved by the scene; move it or mark it still.`,
          );
        break;
      }
      case "ambient": {
        found.push(...ambientBoundsFindings(stage, member, evaluated, rest));
        break;
      }
      case "static": {
        const parentStatic =
          member.kind === "item" &&
          stage.review.byName.get(member.name.slice(0, member.name.lastIndexOf(".")))
            ?.expectation === "static";
        if (parentStatic) break;
        const hasAnyPose = evaluated.some(
          ({ evaluation }) =>
            evaluation.ok && valueOfReview(evaluation.poses, member) !== undefined,
        );
        if (!hasAnyPose) break;
        if (!unmoved) {
          found.push(`cast member "${member.name}" is static, but the scene moves it.`);
        } else {
          found.push(`cast member "${member.name}" is static, but the scene gives it a pose.`);
        }
        break;
      }
      default:
        return unreachable(member.expectation);
    }

    const givenShape = evaluated.some(({ targets }) => {
      const value = valueOfReview(targets, member);
      return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Reflect.get(value, "shape") !== undefined
      );
    });
    if (givenShape && !member.hasMorph)
      found.push(`cast member "${member.name}" is given shape, but has no shapes.`);

    if (member.on === undefined) continue;
    const changes = prints.flatMap((print, index) => {
      const before = evaluated[index - 1];
      const now = evaluated[index];
      return before === undefined || now === undefined || print === prints[index - 1]
        ? []
        : [{ from: before.at, at: now.at }];
    });
    const stretches = member.on
      .flatMap(([first, last]) => {
        const start = beatNamed(first);
        const end = beatNamed(last);
        return start === undefined || end === undefined ? [] : [{ start, end }];
      })
      .sort((a, b) => a.start.from - b.start.from);
    for (const outside of outsides(stretches, durationMs)) {
      const change = changes.find(({ from, at }) => at < outside.until && from >= outside.after);
      if (change !== undefined)
        found.push(
          `${member.name} changes at ${change.at} ms${labelAt(beats, change.at)}, ${outside.where}.`,
        );
    }
  }
  return found;
}

const SKIN_NAME = /\[data-(cast|path)\s*=\s*(?:"([^"]*)"|'([^']*)'|([\w.-]+))\s*\]/g;

function readDomSkin(dom: DomSkinCss | undefined): {
  readonly css?: string;
  readonly errors: readonly string[];
} {
  if (dom === undefined) return { errors: [] };
  switch (dom.kind) {
    case "inline":
      return { css: dom.css, errors: [] };
    case "url": {
      const errors: string[] = [];
      let css: string | undefined;
      if (dom.css.protocol === "file:") {
        try {
          css = readFileSync(fileURLToPath(dom.css), "utf8");
        } catch (error) {
          errors.push(
            `skin css "${dom.css.href}" could not be read: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
      if (dom.defs !== undefined && dom.defs.protocol === "file:") {
        try {
          readFileSync(fileURLToPath(dom.defs), "utf8");
        } catch (error) {
          errors.push(
            `skin defs "${dom.defs.href}" could not be read: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
      return { ...(css === undefined ? {} : { css }), errors };
    }
    default:
      return unreachable(dom);
  }
}

/** Checks DOM skin `[data-cast]` and `[data-path]` rules against compiled cast members. */
function stageSkinFindings(stage: CompiledStage<PoseMode>): readonly string[] {
  const { css, errors } = readDomSkin(stage.skins.dom);
  const found = new Set<string>(errors);
  const plain = (css ?? "").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, kind, double, single, bare] of plain.matchAll(SKIN_NAME)) {
    const named = double ?? single ?? bare;
    if (named === undefined) continue;
    const member = stage.review.byName.get(named);
    if (member === undefined) found.add(`skin rule names "${named}", which is not in the cast.`);
    else if (kind === "path" && !member.hasPath)
      found.add(`skin rule styles "${named}" as a stroke, but it has no path.`);
  }
  return [...found];
}

/** Resolves stroke paths in passes against rest boxes and emits cycle, self-read, and error findings. */
function stagePathFindings(stage: CompiledStage<PoseMode>, rest: RestReader): readonly string[] {
  const found: string[] = [];
  // With no measured boxes, a path may divide by zero; only non-cubic errors fail then.
  const measured = rest.keys().length > 0;
  const resolution = resolveStaticStrokes(stage, rest);
  if (!resolution.ok) {
    found.push(formatStageError(resolution.error).replace(/\.$/, ""));
    return found;
  }
  for (const name of resolution.selfReads) {
    found.push(`path "${name}" reads its own rest box`);
  }
  for (const { name, error } of resolution.failures) {
    if (measured || !(error instanceof TypeError && /cubic/i.test(error.message))) {
      found.push(`path "${name}" fails: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return found;
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

function labelAt(beats: readonly Beat[], ms: number): string {
  const name = beatAt(beats, ms);
  return name === undefined ? "" : ` (beat "${name}")`;
}

/** A finding that names a time, `at 480 ms`, also names the beat it falls in. */
function labelled(beats: readonly Beat[], finding: string): string {
  return finding.replace(
    /\bat (\d+(?:\.\d+)?) ms\b/,
    (time, ms: string) => `${time}${labelAt(beats, Number(ms))}`,
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

/** One finding per target whose value at some ms differs when sought out of order from when played to in
 * order: the scene keeps state between frames, so scrubbing shows what playing never did. */
function seekFindings(module: SceneModule, played: Samples): readonly string[] {
  const byMs = new Map(played.map((sample) => [sample.at, sample.targets] as const));
  const sought = sampleScene(module, { kind: "time", ms: soughtOrder(played.map(({ at }) => at)) });
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

/** The ms each of `ms` costs: a seek, which runs the scene once, on one fresh player, in the order given. */
function timedSteps(module: SceneModule, ms: readonly number[]): readonly number[] {
  const driver = manualDriver({ durationMs: module.durationMs });
  play(module.scene, driver, { cues: mergeEvents(module.cues) });
  return ms.map((at) => {
    const start = performance.now();
    driver.seekMs(at);
    return performance.now() - start;
  });
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
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

/** Times the scene: each in-order step as the median of three runs on fresh players, each seek of the
 * shuffled pass once. */
function costFindings(
  module: SceneModule,
  ms: readonly number[],
  budget: number,
): readonly string[] {
  const runs = [0, 1, 2].map(() => timedSteps(module, ms));
  const inOrder = ms.map((_, index) => median(runs.map((run) => run[index] ?? 0)));
  const order = soughtOrder(ms);
  const seeks = timedSteps(module, order);
  return [
    ...growthFindings(inOrder, ms),
    ...budgetFindings(
      [
        ...ms.map((at, index) => ({ at, cost: inOrder[index] ?? 0, seek: false })),
        ...order.map((at, index) => ({ at, cost: seeks[index] ?? 0, seek: true })),
      ],
      budget,
    ),
  ];
}

/** The module sampled every step over its whole run, as a review samples it. */
export function measureSamples(module: SceneModule): Samples {
  const ms: number[] = [];
  for (let at = 0; at <= module.durationMs; at += STEP_MS) ms.push(at);
  return sampleScene(module, { kind: "time", ms });
}

function stageRestOf(stage: CompiledStage<PoseMode>): RestReader {
  switch (stage.layout.kind) {
    case "single":
      return restReader(stage.layout.rest);
    case "multi": {
      const initial = stage.layout.pick(NO_EVENTS);
      return restReader(stage.layout.rests?.[initial]);
    }
    default:
      return unreachable(stage.layout);
  }
}

export function reviewSceneModule(
  module: SceneModule,
  request: Pick<SceneReviewRequest, "to"> &
    Limits & {
      readonly budget?: number;
      readonly finders?: readonly ReviewFinder[];
    },
): SceneReviewResult {
  const end = request.to ?? module.durationMs;
  const ms: number[] = [];
  for (let at = 0; at <= end; at += STEP_MS) ms.push(at);
  const stage = module.stage;
  if (stage === undefined) {
    const samples = sampleScene(module, { kind: "time", ms });
    const findings = [
      ...reviewValues(
        samples,
        request,
        () => false,
        () => false,
        module.limits,
      ),
      ...seekFindings(module, samples),
      ...lateCueFindings(module),
      ...costFindings(module, ms, request.budget ?? DEFAULT_BUDGET_MS),
      ...(request.finders ?? []).flatMap((find) => find({ module, samples })),
    ];
    return { kind: "reviewed", findings };
  }

  const evaluated = sampleStageFrames(stage, ms);
  const samples: Samples = evaluated.map(({ at, targets }) => ({ at, targets }));
  const evalByAt = new Map(evaluated.map((entry) => [entry.at, entry.evaluation] as const));
  const beats = module.beats ?? [];
  const ownerOfPath = (path: string): ReviewMemberSpec | undefined => {
    const dotted = path.replace(/\[(\d+)\]/g, ".$1");
    const whole = stage.review.byName.get(dotted);
    if (whole !== undefined) return whole;
    for (let cut = dotted.lastIndexOf("."); cut > 0; cut = dotted.lastIndexOf(".", cut - 1)) {
      const found = stage.review.byName.get(dotted.slice(0, cut));
      if (found !== undefined) return found;
    }
    return undefined;
  };
  const spanOf = (name: string) => beats.find((beat) => beat.name === name);
  const hidden = (path: string, at: number): boolean => {
    const owner = ownerOfPath(path);
    if (owner === undefined) return false;
    const ev = evalByAt.get(at);
    if (ev !== undefined && ev.ok) return ev.visibility[owner.name] === false;
    const list = owner.kind === "item" ? [owner.name.slice(0, owner.name.lastIndexOf("."))] : [];
    return [owner.name, ...list, ...owner.groups].some((name) => {
      const on = stage.review.byName.get(name)?.on;
      return on !== undefined && !presentAt(on, spanOf, stage.beats.durationMs, at);
    });
  };
  const ongoing = (name: string): boolean => {
    const spec = stage.review.byName.get(name);
    if (spec === undefined) return false;
    switch (spec.expectation) {
      case "settle":
        return false;
      case "ambient":
      case "static":
        return true;
      default:
        return unreachable(spec.expectation);
    }
  };
  const allFramesOk = evaluated.every((entry) => entry.evaluation.ok);
  const valueFindings = [
    ...reviewValues(samples, request, hidden, ongoing, stage.review.limits),
    ...(allFramesOk ? seekFindings(module, samples) : []),
    ...lateCueFindings(module),
    ...(allFramesOk ? costFindings(module, ms, request.budget ?? DEFAULT_BUDGET_MS) : []),
    ...(request.finders ?? []).flatMap((find) => find({ module, samples })),
  ];
  const rest = stageRestOf(stage);
  const unmeasured =
    stage.layout.kind === "multi" &&
    Object.values(stage.layout.rests ?? {}).every((r) => Object.keys(r).length === 0);

  return {
    kind: "reviewed",
    findings: [
      ...frameEvaluationFindings(evaluated),
      ...valueFindings.map((finding) => labelled(beats, finding)),
      ...stageMemberFindings(stage, beats, evaluated, rest, unmeasured),
      ...stageSkinFindings(stage),
      ...stagePathFindings(stage, rest),
    ],
  };
}

/** Loads a scene file as `gerak sample` does and reviews its values, with no page. */
export async function reviewSceneFile(
  request: SceneReviewRequest,
): Promise<SceneReviewResult | { readonly kind: "usage"; readonly message: string }> {
  const file = resolve(request.file);
  const module = readSceneModule(await import(pathToFileURL(file).href));
  if ("reason" in module) return { kind: "usage", message: module.reason };
  const prepared = await prepareFinders(resolve(dirname(file), "..", ".."), module);
  if (prepared.kind === "refused") return { kind: "usage", message: prepared.message };
  return reviewSceneModule(module, { ...request, finders: prepared.finders });
}

function isPreparation(value: unknown): value is ReviewPreparation {
  const kind: unknown = Reflect.get(Object(value), "kind");
  if (kind === "ready") return typeof Reflect.get(Object(value), "find") === "function";
  return kind === "refused" && typeof Reflect.get(Object(value), "message") === "string";
}

/** The finders of each installed package that declares a review module, ready for the scene under `root`,
 * or the first refusal. */
async function prepareFinders(
  root: string,
  module: SceneModule,
): Promise<
  | { readonly kind: "ready"; readonly finders: readonly ReviewFinder[] }
  | { readonly kind: "refused"; readonly message: string }
> {
  const finders: ReviewFinder[] = [];
  for (const { name, folder, review } of installedPackages()) {
    if (review === undefined) continue;
    const loaded: unknown = await import(pathToFileURL(resolve(folder, review)).href);
    const prepare: unknown = Reflect.get(Object(loaded), "prepare");
    if (typeof prepare !== "function")
      return { kind: "refused", message: `${name}: its review module exports no \`prepare\`.` };
    const made: unknown = await Reflect.apply(prepare, undefined, [root, module]);
    if (!isPreparation(made))
      return {
        kind: "refused",
        message: `${name}: \`prepare\` returned neither ready nor refused.`,
      };
    if (made.kind === "refused") return made;
    finders.push(made.find);
  }
  return { kind: "ready", finders };
}
