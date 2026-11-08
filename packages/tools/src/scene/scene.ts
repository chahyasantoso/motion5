import type { Time } from "@motion5/moves";
import { manualDriver, play } from "@motion5/player";
import { unreachable } from "../page/unreachable";
import { STEP_MS, changeRows, type TimelineResult } from "../timeline/timeline";

/** What a scene module exports for the tools: its scene and how long it runs, in ms. */
export interface SceneModule {
  readonly scene: (time: Time) => object;
  readonly durationMs: number;
}

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
  return {
    scene: (time) => {
      const values: unknown = Reflect.apply(scene, undefined, [time]);
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
): readonly SceneSample[] {
  const driver = manualDriver({ durationMs: module.durationMs });
  const player = play(module.scene, driver);
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
    driver.seek(progress);
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
export function sceneTimeline(module: SceneModule): TimelineResult {
  const ms: number[] = [];
  for (let at = 0; at <= module.durationMs + 2 * STEP_MS; at += STEP_MS) ms.push(at);
  const rows = changeRows(
    sampleScene(module, { kind: "time", ms }).map(({ at, targets }) => ({
      at,
      fingerprints: Object.fromEntries(
        Object.entries(targets).map(([target, value]) => [target, JSON.stringify(value)]),
      ),
    })),
  );
  return { kind: "timeline", step: STEP_MS, end: module.durationMs, rows };
}
