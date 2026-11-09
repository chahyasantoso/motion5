import { NO_EVENTS, mergeEvents, type Events, type MotionEvent, type Time } from "@motion5/moves";
import { manualDriver, play } from "@motion5/player";
import { unreachable } from "../page/unreachable";
import { STEP_MS, changeRows, type TimelineResult } from "../timeline/timeline";

/** What a scene module exports for the tools: its scene, how long it runs in ms, and its own cues. */
export interface SceneModule {
  readonly scene: (time: Time, events: Events) => object;
  readonly durationMs: number;
  readonly cues: Events;
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

export interface SceneSample {
  readonly at: number;
  readonly targets: Readonly<Record<string, unknown>>;
}

/** The scene and duration a module exports, or why it has none. */
export function readSceneModule(value: unknown): SceneModule | { readonly reason: string } {
  const scene: unknown = Reflect.get(Object(value), "scene");
  const durationMs: unknown = Reflect.get(Object(value), "durationMs");
  if (typeof scene !== "function")
    return { reason: "The module exports no `scene`, a function from time to targets." };
  if (typeof durationMs !== "number" || !Number.isFinite(durationMs) || durationMs <= 0)
    return { reason: "The module exports no `durationMs`, a positive number." };
  const cues: unknown = Reflect.get(Object(value), "cues");
  if (cues !== undefined && !(Array.isArray(cues) && cues.every(isEvent)))
    return { reason: "The module's `cues` must be a list of { name, at, target } events." };
  return {
    cues: cues === undefined ? NO_EVENTS : mergeEvents(cues),
    scene: (time, events) => {
      const values: unknown = Reflect.apply(scene, undefined, [time, events]);
      if (typeof values !== "object" || values === null)
        throw new TypeError("The scene returned no targets.");
      return values;
    },
    durationMs,
  };
}

function pick(value: unknown, fields: readonly string[] | undefined): unknown {
  if (fields === undefined || typeof value !== "object" || value === null || Array.isArray(value))
    return value;
  return Object.fromEntries(
    fields.filter((field) => field in value).map((field) => [field, Reflect.get(value, field)]),
  );
}

/** Each target's value at each requested point, with no browser and no engine. */
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
