import { pathToFileURL } from "node:url";
import { mergeEvents } from "@gerak/moves";
import { manualDriver, play } from "@gerak/player";
import { quaternionFromEuler3d } from "@gerak/rig";
import { resolve } from "node:path";
import { DEFAULT_LIMITS, describeFinding, restFindings } from "../page/check";
import {
  NO_REST,
  boundsOf,
  describeLoop,
  drawInPasses,
  presentAt,
  restOfBounds,
  type CastName,
  type Rest,
} from "@gerak/stage";
import { unreachable } from "../page/unreachable";
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
  "usage: motion:review <scene.ts> [--to ms] [--hold ms] [--jump units] [--turn degrees] [--ratio n] [--budget ms]";

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
  if (/(^|\.)rotation[XYZ]?$/.test(path)) return "turn";
  if (/(^|\.)(scale\w*|opacity)$/.test(path)) return "ratio";
  return "position";
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

type Samples = Parameters<typeof reviewValues>[0];

/** A name's value in a sample: a target's own, or one item of a `many` target, as `dust.3`. */
function valueOf(targets: Readonly<Record<string, unknown>>, name: CastName): unknown {
  switch (name.kind) {
    case "actor":
    case "many":
    case "group":
      return targets[name.name];
    case "item": {
      const dot = name.name.lastIndexOf(".");
      const list = targets[name.name.slice(0, dot)];
      if (!Array.isArray(list)) return undefined;
      const item: unknown = list[Number(name.name.slice(dot + 1))];
      return item;
    }
    default:
      return unreachable(name.kind);
  }
}

/** A name that must be moved to be of use: a lone actor or a list, not a group, an item, or a
 * watched member, which may move only on a person's events. */
function mustMove(name: CastName): boolean {
  switch (name.kind) {
    case "actor":
    case "many":
      return !name.still && !name.watch;
    case "group":
    case "item":
      return false;
    default:
      return unreachable(name.kind);
  }
}

/** What a stage module's scene does against its cast and beats: a member never moved, a target not
 * cast, a value changing outside its presence; unmeasured layouts say so once instead. */
function stageFindings(
  cast: readonly CastName[],
  beats: readonly Beat[],
  samples: Samples,
  durationMs: number,
  unmeasured: boolean,
): readonly string[] {
  const known = new Set(cast.map(({ name }) => name));
  const targets = [...new Set(samples.flatMap(({ targets: found }) => Object.keys(found)))];
  const found: string[] = targets
    .filter((target) => !known.has(target))
    .map((target) => `the scene answers "${target}", which is not in the cast.`);
  if (unmeasured)
    found.push(
      'its layouts are not measured without a browser, so "never moved" is not checked here for any member; review it in the browser, `motion:review "stage.html?piece=<name>" --watch <member>`, or export `rests`.',
    );
  const beatNamed = (name: string) => beats.find((beat) => beat.name === name);
  for (const member of cast) {
    const prints = samples.map(({ targets: values }) => fingerprint(valueOf(values, member)));
    const unmoved = prints.every((print) => print === prints[0]);
    if (mustMove(member) && unmoved && !unmeasured)
      found.push(
        `cast member "${member.name}" is never moved by the scene; move it or mark it still.`,
      );
    const given = samples.some(({ targets: values }) => {
      const value = valueOf(values, member);
      return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Reflect.get(value, "shape") !== undefined
      );
    });
    if (given && member.shapes === undefined)
      found.push(`cast member "${member.name}" is given shape, but has no shapes.`);
    if (member.still && !unmoved)
      found.push(`cast member "${member.name}" is marked still, but the scene moves it.`);
    if (member.on === undefined) continue;
    const changes = prints.flatMap((print, index) => {
      const before = samples[index - 1];
      const now = samples[index];
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

/** One finding for each name an exact `[data-cast=x]` or `[data-path=x]` rule of the skin gives that no
 * member has, or that names as a stroke a member with no path; comments are skipped. */
function skinFindings(cast: readonly CastName[], css: string | undefined): readonly string[] {
  const byName = new Map(cast.map((member) => [member.name, member]));
  const found = new Set<string>();
  const plain = (css ?? "").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, kind, double, single, bare] of plain.matchAll(SKIN_NAME)) {
    const named = double ?? single ?? bare;
    if (named === undefined) continue;
    const member = byName.get(named);
    if (member === undefined) found.add(`skin rule names "${named}", which is not in the cast.`);
    else if (kind === "path" && member.path === undefined)
      found.add(`skin rule styles "${named}" as a stroke, but it has no path.`);
  }
  return [...found];
}

/** The path functions drawn in passes where the module's things rest, as the stage draws them: one
 * that fails, one that reads its own box, and paths that read each other in a loop. */
function pathFindings(cast: readonly CastName[], rest: Rest): readonly string[] {
  const found: string[] = [];
  const paths = cast.flatMap(({ name, path }) =>
    path === undefined ? [] : [[name, path] as const],
  );
  // With no measured boxes, a path may divide by a zero size; only a throw counts as failing then.
  const measured = Object.keys(rest).length > 0;
  const loop = drawInPasses(paths, rest, (name, answer, read) => {
    if (read.has(name)) found.push(`path "${name}" reads its own rest box`);
    switch (answer.kind) {
      case "drawn":
        return restOfBounds(boundsOf(answer.cubics));
      case "failed": {
        const { error } = answer;
        if (measured || !(error instanceof TypeError && /cubic/i.test(error.message)))
          found.push(
            `path "${name}" fails: ${error instanceof Error ? error.message : String(error)}`,
          );
        return undefined;
      }
      default:
        return unreachable(answer);
    }
  });
  if (loop !== undefined) found.push(describeLoop(loop));
  return found;
}

/** Each text function called at each sampled ms: one that throws or answers a non-string, once each. */
function textFindings(
  cast: readonly CastName[],
  ms: readonly number[],
  durationMs: number,
): readonly string[] {
  const found: string[] = [];
  const driver = manualDriver({ durationMs });
  const readouts = cast.flatMap(({ name, text }) =>
    typeof text === "function" ? [[name, text] as const] : [],
  );
  const wrong = new Set<string>();
  for (const at of ms) {
    driver.seekMs(at);
    for (const [name, text] of readouts) {
      if (wrong.has(name)) continue;
      let why: string | undefined;
      try {
        const said: unknown = text(driver.now());
        if (typeof said !== "string") why = `answers ${typeof said}, not a string`;
      } catch (error) {
        why = `fails: ${error instanceof Error ? error.message : String(error)}`;
      }
      if (why === undefined) continue;
      wrong.add(name);
      found.push(`text of "${name}" ${why} at ${at} ms`);
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

/** The ms each of `ms` costs: a seek, which runs the scene once,, on one fresh player, in the order given. */
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

export function reviewSceneModule(
  module: SceneModule,
  request: Pick<SceneReviewRequest, "to"> & Limits & { readonly budget?: number },
): SceneReviewResult {
  const end = request.to ?? module.durationMs;
  const ms: number[] = [];
  for (let at = 0; at <= end; at += STEP_MS) ms.push(at);
  const samples = sampleScene(module, { kind: "time", ms });
  const { beats, cast } = module;
  const byName = new Map((cast ?? []).map((entry) => [entry.name, entry] as const));
  // A sampled path names its member first, an item as `dust[3]`; the member is the longest name it starts with.
  const ownerOfPath = (path: string): CastName | undefined => {
    const dotted = path.replace(/\[(\d+)\]/g, ".$1");
    const whole = byName.get(dotted);
    if (whole !== undefined) return whole;
    for (let cut = dotted.lastIndexOf("."); cut > 0; cut = dotted.lastIndexOf(".", cut - 1)) {
      const found = byName.get(dotted.slice(0, cut));
      if (found !== undefined) return found;
    }
    return undefined;
  };
  const spanOf = (name: string) => beats?.find((beat) => beat.name === name);
  const shown = (name: string, at: number): boolean => {
    const on = byName.get(name)?.on;
    return on === undefined || presentAt(on, spanOf, module.durationMs, at);
  };
  // A member shows only while it and every group around it, and an item's list, are shown.
  const hidden = (path: string, at: number): boolean => {
    const owner = ownerOfPath(path);
    if (owner === undefined) return false;
    const list = owner.kind === "item" ? [owner.name.slice(0, owner.name.lastIndexOf("."))] : [];
    return [owner.name, ...list, ...owner.groups].some((name) => !shown(name, at));
  };
  const ongoing = (name: string) => byName.get(name)?.ongoing === true;
  const findings = [
    ...reviewValues(samples, request, hidden, ongoing, module.limits),
    ...seekFindings(module, samples),
    ...lateCueFindings(module),
    ...costFindings(module, ms, request.budget ?? DEFAULT_BUDGET_MS),
  ];
  if (beats === undefined) return { kind: "reviewed", findings };
  return {
    kind: "reviewed",
    findings: [
      ...findings.map((finding) => labelled(beats, finding)),
      ...(cast === undefined
        ? []
        : stageFindings(cast, beats, samples, module.durationMs, module.unmeasured === true)),
      ...(cast === undefined ? [] : skinFindings(cast, module.skinCss)),
      ...(cast === undefined ? [] : pathFindings(cast, module.rest ?? NO_REST)),
      ...(cast === undefined ? [] : textFindings(cast, ms, module.durationMs)),
    ],
  };
}

/** Loads a scene file as `motion:sample` does and reviews its values, with no page. */
export async function reviewSceneFile(
  request: SceneReviewRequest,
): Promise<SceneReviewResult | { readonly kind: "usage"; readonly message: string }> {
  const module = readSceneModule(await import(pathToFileURL(resolve(request.file)).href));
  if ("reason" in module) return { kind: "usage", message: module.reason };
  return reviewSceneModule(module, request);
}
