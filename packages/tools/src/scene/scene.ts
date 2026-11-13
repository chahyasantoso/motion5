import { NO_EVENTS, mergeEvents, type Events, type MotionEvent, type Time } from "@gerak/moves";
import { manualDriver, play } from "@gerak/player";
import { NO_REST, castNames, readStageModule, type CastName, type Rest } from "@gerak/stage";
import { parseNumbers } from "../page/args";
import { unreachable } from "../page/unreachable";
import { STEP_MS, changeRows, type TimelineResult } from "../timeline/timeline";

/** One named beat of a stage module's story, in ms. */
export interface Beat {
  readonly name: string;
  readonly from: number;
  readonly to: number;
}

/** What a scene module exports for the tools: its scene, how long it runs in ms, and its own cues;
 * a stage module also carries its beats and the names its cast makes. */
export interface SceneModule {
  readonly scene: (time: Time, events: Events) => object;
  readonly durationMs: number;
  readonly cues: Events;
  readonly beats?: readonly Beat[];
  readonly cast?: readonly CastName[];
  /** Where things rest for a stage module, its own `rest` or none; a path function is called with it. */
  readonly rest?: Rest;
}

/** The latest-started beat that `ms` falls in, or `undefined` in a gap between beats. */
export function beatAt(beats: readonly Beat[], ms: number): string | undefined {
  let found: Beat | undefined;
  for (const beat of beats)
    if (beat.from <= ms && ms <= beat.to && (found === undefined || beat.from >= found.from))
      found = beat;
  return found?.name;
}

function isEvent(value: unknown): value is MotionEvent {
  if (typeof value !== "object" || value === null) return false;
  const optional = (key: string, kind: "string" | "number") => {
    const field: unknown = Reflect.get(value, key);
    return field === undefined || typeof field === kind;
  };
  return (
    typeof Reflect.get(value, "name") === "string" &&
    typeof Reflect.get(value, "at") === "number" &&
    optional("target", "string") &&
    optional("x", "number") &&
    optional("y", "number")
  );
}

/** `land:ball@2234,click:stage@300(640,360)` or `go@500` in time order, or why it is not one. */
export function parseEvents(text: string): Events | { readonly reason: string } {
  const events: MotionEvent[] = [];
  for (const part of text.split(/,(?![^(]*\))/).map((piece) => piece.trim())) {
    const match = /^([\w-]+)(?::([\w-]+))?@(\d+(?:\.\d+)?)(?:\((-?[\d.]+),(-?[\d.]+)\))?$/.exec(
      part,
    );
    if (match === null || match[1] === undefined)
      return {
        reason: `Event "${part}" needs name@ms or name:target@ms, with (x,y) after it for a point, like click:stage@300(640,360).`,
      };
    const at = Number(match[3]);
    if (events.length > 0 && at < (events.at(-1)?.at ?? 0))
      return {
        reason: `Event "${part}" comes before the one ahead of it; list events in time order.`,
      };
    events.push({
      name: match[1],
      at,
      ...(match[2] === undefined ? {} : { target: match[2] }),
      ...(match[4] === undefined || match[5] === undefined
        ? {}
        : { x: Number(match[4]), y: Number(match[5]) }),
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
  if (cues !== undefined && !(Array.isArray(cues) && cues.every(isEvent)))
    return { reason: "The module's `cues` must be a list of { name, at, target } events." };
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
    const rest = stage.rest ?? NO_REST;
    return {
      cues: ownCues,
      scene: (time, events) => scene(time, events, rest),
      durationMs: beats.durationMs,
      beats: beats.order.flatMap((name) => {
        const span = beats[name];
        return span === undefined ? [] : [{ name, from: span.from, to: span.to }];
      }),
      cast: castNames(cast, beats.order),
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

/** Parsed `motion:sample` arguments: the scene file, `--at` ms or `--progress` shares, `--nodes`,
 * `--fields` and `--events`; or the usage text. */
export type SampleArgs =
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
  "usage: motion:sample <scene.ts> (--at ms,ms | --progress p,p) [--nodes id,id] [--fields a,b] [--events name:target@ms,...]";

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
    if (!["--at", "--progress", "--nodes", "--fields", "--events"].includes(arg))
      return usage(`Unknown flag ${arg}. ${SAMPLE_USAGE}`);
    if (flags.has(arg)) return usage(`Repeated flag ${arg}. ${SAMPLE_USAGE}`);
    flags.set(arg, argv[i + 1]);
    i += 1;
  }
  const file = files[0];
  if (file === undefined || files.length !== 1)
    return usage(`Expected one scene file. ${SAMPLE_USAGE}`);
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
