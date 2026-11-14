import {
  NO_EVENTS,
  isMotionEvent,
  mergeEvents,
  type Events,
  type MotionEvent,
  type Time,
} from "@gerak/moves";
import { manualDriver, play } from "@gerak/player";
import {
  NO_LAYOUTS,
  NO_REST,
  castNames,
  readStageModule,
  type CastName,
  type Layouts,
  type Rest,
} from "@gerak/stage";
import { parseNumbers } from "../page/args";
import { unreachable } from "../page/unreachable";
import { STEP_MS, changeRows, type TimelineResult } from "../timeline/timeline";

/** One named beat of a stage module's story, in ms. */
export interface Beat {
  readonly name: string;
  readonly from: number;
  readonly to: number;
}

/** A target's own review limits, in the units its fields use; a field left out takes the command's flag. */
export interface TargetLimits {
  readonly jump?: number;
  readonly turn?: number;
  readonly ratio?: number;
}

const LIMIT_FIELDS = ["jump", "turn", "ratio"] as const;

/** Target name to its review limits, or why a module's `limits` is malformed. */
function readLimits(
  value: unknown,
): { readonly limits: Readonly<Record<string, TargetLimits>> } | { readonly reason: string } {
  if (value === undefined) return { limits: {} };
  if (typeof value !== "object" || value === null || Array.isArray(value))
    return { reason: "The module's `limits` must be a record of target name to limits." };
  const read: Record<string, TargetLimits> = {};
  for (const [target, entry] of Object.entries(value)) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry))
      return {
        reason: `The module's \`limits.${target}\` must be { jump?, turn?, ratio? }.`,
      };
    const own: { jump?: number; turn?: number; ratio?: number } = {};
    for (const [field, limit] of Object.entries(entry)) {
      const known = LIMIT_FIELDS.find((name) => name === field);
      if (known === undefined)
        return {
          reason: `The module's \`limits.${target}.${field}\` is not a limit; use jump, turn or ratio.`,
        };
      if (typeof limit !== "number" || !Number.isFinite(limit) || limit < 0)
        return {
          reason: `The module's \`limits.${target}.${field}\` must be a finite number at or above 0.`,
        };
      own[known] = limit;
    }
    read[target] = own;
  }
  return { limits: read };
}

/** What a scene module exports for the tools: its scene, how long it runs in ms, and its own cues;
 * a stage module also carries its beats and the names its cast makes. */
export interface SceneModule {
  readonly scene: (time: Time, events: Events) => object;
  readonly durationMs: number;
  readonly cues: Events;
  /** Review limits by target name, the first segment of a path; empty when the module gives none. */
  readonly limits: Readonly<Record<string, TargetLimits>>;
  readonly beats?: readonly Beat[];
  readonly cast?: readonly CastName[];
  /** A stage module's `skins.dom.css`, which the review reads for the members it names. */
  readonly skinCss?: string;
  /** Where things rest for a stage module at the start, its own `rest` or the first layout's; a path function is called with it. */
  readonly rest?: Rest;
  /** A stage module whose layouts no renderer measured: it names `layouts` and gives no `rests`. */
  readonly unmeasured?: boolean;
}

/** The latest-started beat that `ms` falls in, or `undefined` in a gap between beats. */
export function beatAt(beats: readonly Beat[], ms: number): string | undefined {
  let found: Beat | undefined;
  for (const beat of beats)
    if (beat.from <= ms && ms <= beat.to && (found === undefined || beat.from >= found.from))
      found = beat;
  return found?.name;
}

/** `land:ball@2234,click:stage@300(640,360)` or `go@500` in time order, or why it is not one. */
export function parseEvents(text: string): Events | { readonly reason: string } {
  const events: MotionEvent[] = [];
  for (const part of text.split(/,(?![^(]*\))/).map((piece) => piece.trim())) {
    const match =
      /^([\w-]+)(?::([\w-]+))?(?:=(-?\d+(?:\.\d+)?))?@(\d+(?:\.\d+)?)(?:\((-?[\d.]+),(-?[\d.]+)\))?$/.exec(
        part,
      );
    if (match === null || match[1] === undefined)
      return {
        reason: `Event "${part}" needs name@ms or name:target@ms, with (x,y) after it for a point, like click:stage@300(640,360), or =value before @ for a sample, like mouthOpen=0.6@1234.`,
      };
    const at = Number(match[4]);
    if (events.length > 0 && at < (events.at(-1)?.at ?? 0))
      return {
        reason: `Event "${part}" comes before the one ahead of it; list events in time order.`,
      };
    events.push({
      name: match[1],
      at,
      ...(match[2] === undefined ? {} : { target: match[2] }),
      ...(match[3] === undefined ? {} : { value: Number(match[3]) }),
      ...(match[5] === undefined || match[6] === undefined
        ? {}
        : { x: Number(match[5]), y: Number(match[6]) }),
    });
  }
  return events;
}

/** How long a timeline runs past the last event, for its answer to settle. */
const SETTLE_MS = 2000;

/** When to sample: times in ms, or progress from 0 to 1. */
export type SceneRequest =
  | { readonly kind: "time"; readonly ms: readonly number[] }
  | { readonly kind: "progress"; readonly progress: readonly number[] };

/** One sample of a scene: `at` ms and each target's value then. */
export interface SceneSample {
  readonly at: number;
  readonly targets: Readonly<Record<string, unknown>>;
}

/** The scene and duration a module exports, or why it has none. A stage module is read by
 * `readStageModule`; its length is its story's and its scene gets the module's `rest`. */
export function readSceneModule(value: unknown): SceneModule | { readonly reason: string } {
  const cues: unknown = Reflect.get(Object(value), "cues");
  if (cues !== undefined && !(Array.isArray(cues) && cues.every(isMotionEvent)))
    return { reason: "The module's `cues` must be a list of { name, at, target } events." };
  const readLimit = readLimits(Reflect.get(Object(value), "limits"));
  if ("reason" in readLimit) return readLimit;
  const { limits } = readLimit;
  const given: unknown = Reflect.get(Object(value), "durationMs");
  const ownCues = cues === undefined ? NO_EVENTS : mergeEvents(cues);
  if (Reflect.get(Object(value), "beats") !== undefined) {
    const stage = readStageModule(value);
    if ("reason" in stage) return stage;
    const { beats, cast, scene } = stage;
    if (given !== undefined && given !== beats.durationMs)
      return {
        reason: `The module's \`durationMs\` ${String(given)} differs from its story's ${beats.durationMs}; export only \`beats\`.`,
      };
    const layouts = stage.rests ?? NO_LAYOUTS;
    const named: Layouts = layouts;
    const first = stage.layouts?.[0];
    const restFor = (events: Events): Rest => {
      if (stage.layouts === undefined) return stage.rest ?? NO_REST;
      const current = stage.layout?.(events) ?? first;
      return (current === undefined ? undefined : named[current]) ?? NO_REST;
    };
    const rest = restFor(NO_EVENTS);
    const unmeasured =
      stage.layouts !== undefined && Reflect.get(Object(value), "rests") === undefined;
    return {
      ...(unmeasured ? { unmeasured } : {}),
      cues: ownCues,
      limits,
      scene: (time, events) => scene(time, events, restFor(events), layouts),
      durationMs: beats.durationMs,
      beats: beats.order.flatMap((name) => {
        const span = beats[name];
        return span === undefined ? [] : [{ name, from: span.from, to: span.to }];
      }),
      cast: castNames(cast, beats.order),
      ...(stage.skins.dom?.css === undefined ? {} : { skinCss: stage.skins.dom.css }),
      rest,
    };
  }
  const scene: unknown = Reflect.get(Object(value), "scene");
  if (typeof scene !== "function")
    return { reason: "The module exports no `scene`, a function from time to targets." };
  if (typeof given !== "number" || !Number.isFinite(given) || given <= 0)
    return { reason: "The module exports no `durationMs`, a positive number." };
  return {
    cues: ownCues,
    limits,
    scene: (time, events) => {
      const values: unknown = Reflect.apply(scene, undefined, [time, events, NO_REST]);
      if (typeof values !== "object" || values === null)
        throw new TypeError("The scene returned no targets.");
      return values;
    },
    durationMs: given,
  };
}

function pick(value: unknown, fields: readonly string[] | undefined): unknown {
  if (fields === undefined || typeof value !== "object" || value === null || Array.isArray(value))
    return value;
  return Object.fromEntries(
    fields.filter((field) => field in value).map((field) => [field, Reflect.get(value, field)]),
  );
}

/** Each target's value at each requested point, with no browser. */
export function sampleScene(
  module: SceneModule,
  request: SceneRequest,
  targets?: readonly string[],
  fields?: readonly string[],
  events: Events = NO_EVENTS,
): readonly SceneSample[] {
  const driver = manualDriver({ durationMs: module.durationMs });
  const player = play(module.scene, driver, { cues: mergeEvents(module.cues, events) });
  const points = (): readonly { readonly at: number; readonly progress: number }[] => {
    switch (request.kind) {
      case "time":
        return request.ms.map((at) => ({ at, progress: Math.min(1, at / module.durationMs) }));
      case "progress":
        return request.progress.map((progress) => ({ at: progress, progress }));
      default:
        return unreachable(request);
    }
  };
  return points().map(({ at, progress }) => {
    if (request.kind === "time") driver.seekMs(at);
    else driver.seek(progress);
    const values = Object.entries(player.values).filter(
      ([target]) => targets === undefined || targets.includes(target),
    );
    return {
      at,
      targets: Object.fromEntries(values.map(([target, value]) => [target, pick(value, fields)])),
    };
  });
}

/** Each target's first and last change over the scene's run, sampled every 16 ms. */
export function sceneTimeline(module: SceneModule, events: Events = NO_EVENTS): TimelineResult {
  const ms: number[] = [];
  const lastEvent = Math.max(0, ...[...module.cues, ...events].map(({ at }) => at));
  const end = Math.max(module.durationMs, lastEvent > 0 ? lastEvent + SETTLE_MS : 0);
  for (let at = 0; at <= end + 2 * STEP_MS; at += STEP_MS) ms.push(at);
  const rows = changeRows(
    sampleScene(module, { kind: "time", ms }, undefined, undefined, events).map(
      ({ at, targets }) => ({
        at,
        fingerprints: Object.fromEntries(
          Object.entries(targets).map(([target, value]) => [target, JSON.stringify(value)]),
        ),
      }),
    ),
  );
  return { kind: "timeline", step: STEP_MS, end, rows };
}

/** What `--watch` asks: one value by `path`, from `from` to `to` ms (the scene's end when absent) every `every` ms. */
export interface WatchRequest {
  readonly path: string;
  readonly from: number;
  readonly to?: number;
  readonly every: number;
}

/** Parsed `motion:sample` arguments: the scene file, `--at` ms or `--progress` shares, `--nodes`,
 * `--fields` and `--events`, or a `--watch` of one path; or the usage text. */
export type SampleArgs =
  | ({
      readonly kind: "watch";
      readonly file: string;
      readonly events?: Events;
    } & WatchRequest)
  | {
      readonly kind: "ok";
      readonly file: string;
      readonly request: SceneRequest;
      readonly nodes?: readonly string[];
      readonly fields?: readonly string[];
      readonly events?: Events;
    }
  | { readonly kind: "usage"; readonly message: string };

const SAMPLE_USAGE =
  "usage: motion:sample <scene.ts> (--at ms,ms | --progress p,p | --watch path [--from ms] [--to ms] [--every ms]) [--nodes id,id] [--fields a,b] [--events name:target@ms,name=value@ms,...]";

/** The `--watch` request in `flags`, or the usage text when it is mixed with another way to sample or malformed. */
function parseWatch(file: string, flags: ReadonlyMap<string, string | undefined>): SampleArgs {
  const usage = (message: string): SampleArgs => ({
    kind: "usage",
    message: `${message} ${SAMPLE_USAGE}`,
  });
  for (const other of ["--at", "--progress", "--nodes", "--fields"])
    if (flags.has(other)) return usage(`--watch cannot go with ${other}.`);
  const path = flags.get("--watch");
  if (path === undefined || pathSegments(path) === undefined)
    return usage("--watch needs a path like ball.x or props[2].y.");
  const number = (flag: string, fallback: number | undefined): number | undefined | "bad" => {
    if (!flags.has(flag)) return fallback;
    const text = flags.get(flag);
    const value = Number(text);
    return text !== undefined && text !== "" && Number.isFinite(value) && value >= 0
      ? value
      : "bad";
  };
  const from = number("--from", 0);
  const to = number("--to", undefined);
  const every = number("--every", STEP_MS);
  if (from === "bad" || to === "bad" || every === "bad" || every === 0 || from === undefined)
    return usage("--from and --to need non-negative ms, and --every a positive number of ms.");
  if (every === undefined || (to !== undefined && to < from))
    return usage("--to cannot come before --from.");
  const eventText = flags.get("--events");
  const events = eventText === undefined ? undefined : parseEvents(eventText);
  if (events !== undefined && "reason" in events) return usage(events.reason);
  return {
    kind: "watch",
    file,
    path,
    from,
    every,
    ...(to === undefined ? {} : { to }),
    ...(events === undefined ? {} : { events }),
  };
}

/** A path's segments: `props[2].y` and `props.2.y` are both `props`, `2`, `y`; none when it has an empty one. */
function pathSegments(path: string): readonly string[] | undefined {
  const segments = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  return segments.every((segment) => segment !== "") ? segments : undefined;
}

function valueAtPath(value: unknown, segments: readonly string[]): unknown {
  let here = value;
  for (const segment of segments) {
    if (typeof here !== "object" || here === null) return undefined;
    here = Reflect.get(here, segment);
  }
  return here;
}

const LISTED_PATHS = 24;

/** Every path under `value`, as `a.b[2].c`, leaves only. */
function leafPaths(value: unknown, path: string, into: Set<string>): void {
  if (Array.isArray(value))
    value.forEach((item, index) => leafPaths(item, `${path}[${index}]`, into));
  else if (typeof value === "object" && value !== null)
    for (const [key, item] of Object.entries(value)) leafPaths(item, `${path}.${key}`, into);
  else into.add(path);
}

/** Result of `--watch`: one path's value at each step, or why it cannot be watched. */
export type WatchResult =
  | {
      readonly kind: "watched";
      readonly path: string;
      readonly samples: readonly { readonly at: number; readonly value: unknown }[];
    }
  | { readonly kind: "usage"; readonly message: string };

/** The most samples one `--watch` takes. */
const WATCH_MOST = 10000;

/** One path's value every `every` ms; a path the scene never returns is refused with the paths it does. */
export function watchScene(
  module: SceneModule,
  request: WatchRequest,
  events: Events = NO_EVENTS,
): WatchResult {
  const segments = pathSegments(request.path) ?? [];
  const end = request.to ?? module.durationMs;
  const count = Math.floor((end - request.from) / request.every + 1e-9) + 1;
  if (count > WATCH_MOST)
    return {
      kind: "usage",
      message: `--watch would take ${count} samples, over ${WATCH_MOST}; raise --every or narrow --from and --to.`,
    };
  const ms: number[] = [];
  for (let step = 0; request.from + step * request.every <= end + 1e-9; step += 1)
    ms.push(request.from + step * request.every);
  const sampled = sampleScene(module, { kind: "time", ms }, undefined, undefined, events);
  const samples = sampled.map(({ at, targets }) => ({
    at,
    value: valueAtPath(targets, segments) ?? null,
  }));
  if (samples.some(({ value }) => value !== null))
    return { kind: "watched", path: request.path, samples };
  const target = segments[0] ?? "";
  const names = new Set(sampled.flatMap(({ targets }) => Object.keys(targets)));
  const paths = new Set<string>();
  for (const { targets } of sampled) leafPaths(targets[target], target, paths);
  const listed = names.has(target) ? [...paths] : [...names];
  const shown = listed.slice(0, LISTED_PATHS).join(", ");
  const more = listed.length > LISTED_PATHS ? `, and ${listed.length - LISTED_PATHS} more` : "";
  return {
    kind: "usage",
    message: names.has(target)
      ? `--watch ${request.path} is never returned by the scene; under "${target}" it returns ${shown}${more}.`
      : `--watch ${request.path} names the target "${target}", which the scene never returns; its targets are ${shown}${more}.`,
  };
}

/** The scene file, what to sample and which targets and fields to print, or the usage text. */
export function parseSampleArgs(argv: readonly string[]): SampleArgs {
  const usage = (message: string): SampleArgs => ({ kind: "usage", message });
  const files: string[] = [];
  const flags = new Map<string, string | undefined>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) break;
    if (!arg.startsWith("--")) {
      files.push(arg);
      continue;
    }
    if (
      ![
        "--at",
        "--progress",
        "--nodes",
        "--fields",
        "--events",
        "--watch",
        "--from",
        "--to",
        "--every",
      ].includes(arg)
    )
      return usage(`Unknown flag ${arg}. ${SAMPLE_USAGE}`);
    if (flags.has(arg)) return usage(`Repeated flag ${arg}. ${SAMPLE_USAGE}`);
    flags.set(arg, argv[i + 1]);
    i += 1;
  }
  const file = files[0];
  if (file === undefined || files.length !== 1)
    return usage(`Expected one scene file. ${SAMPLE_USAGE}`);
  if (flags.has("--watch")) return parseWatch(file, flags);
  for (const flag of ["--from", "--to", "--every"])
    if (flags.has(flag)) return usage(`${flag} goes with --watch. ${SAMPLE_USAGE}`);
  const hasAt = flags.has("--at");
  if (hasAt === flags.has("--progress"))
    return usage(`Pass exactly one of --at and --progress. ${SAMPLE_USAGE}`);

  let request: SceneRequest;
  if (hasAt) {
    const ms = parseNumbers(flags.get("--at"));
    if (ms === undefined)
      return usage(`--at needs ascending non-negative numbers, comma-separated. ${SAMPLE_USAGE}`);
    request = { kind: "time", ms };
  } else {
    const progress = parseNumbers(flags.get("--progress"));
    if (progress === undefined || progress.some((value) => value > 1))
      return usage(
        `--progress needs ascending numbers from 0 to 1, comma-separated. ${SAMPLE_USAGE}`,
      );
    request = { kind: "progress", progress };
  }
  const list = (flag: string): readonly string[] | "missing" | undefined => {
    if (!flags.has(flag)) return undefined;
    const text = flags.get(flag);
    return text === undefined || text === "" ? "missing" : text.split(",");
  };
  const nodes = list("--nodes");
  if (nodes === "missing") return usage(`--nodes needs ids. ${SAMPLE_USAGE}`);
  const fields = list("--fields");
  if (fields === "missing") return usage(`--fields needs names. ${SAMPLE_USAGE}`);
  const eventText = flags.get("--events");
  const events = eventText === undefined ? undefined : parseEvents(eventText);
  if (flags.has("--events") && (events === undefined || "reason" in events))
    return usage(
      `${events !== undefined && "reason" in events ? events.reason : "--events needs a list."} ${SAMPLE_USAGE}`,
    );
  return {
    kind: "ok",
    file,
    request,
    ...(events === undefined || "reason" in events ? {} : { events }),
    ...(nodes === undefined ? {} : { nodes }),
    ...(fields === undefined ? {} : { fields }),
  };
}
