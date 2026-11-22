import type { Events, Pose2d, Pose3d, Span, Time } from "@gerak/core";
import type { CastBuilder, Members } from "./cast";
import type { ScrollBeat, TriggerBeat } from "./beat";
import type { Carry, RestReader } from "./layout";

/** A list's pose in the scene: the pose of item `index` of `count`. */
export type ListPose = (index: number, count: number) => Pose2d;

/** What the scene returns: a pose per actor, a `ListPose` per list, a `Pose3d` per object. */
export type Targets<M> = string extends keyof M
  ? Readonly<Record<string, Pose2d | Pose3d | ListPose | undefined>>
  : {
      readonly [K in keyof M & string]?: M[K] extends { readonly kind: "list" }
        ? ListPose
        : M[K] extends { readonly kind: "object" }
          ? Pose3d
          : Pose2d;
    };

/** A list pose from per-item data: item `index` takes `pose(items[index], index)`, one past the data none. */
export function each<T>(items: readonly T[], pose: (item: T, index: number) => Pose2d): ListPose {
  return (index) => {
    const item = items[index];
    return item === undefined ? {} : pose(item, index);
  };
}

/** Beats by name, each a `Span`: `beats.enter.of(time)` is time inside it. */
export type Beats<B extends string = string> = Readonly<Record<B, Span>>;

/** What the scene reads each frame. */
export interface SceneContext<B extends string = string> {
  readonly time: Time;
  readonly beats: Beats<B>;
  readonly events: Events;
  /** Measured rest boxes. */
  readonly rest: RestReader;
  readonly carry: Carry;
  /** Part count per list element, from the mount's binding or the cache's `<name>.<index>` boxes. */
  readonly counts?: Readonly<Record<string, number>> | undefined;
  /** Visual line index per list item, measured from layout on a page mount. */
  readonly lines?: Readonly<Record<string, readonly number[]>> | undefined;
  /** Only these elements run; the rest are left out of the answer. */
  readonly only?: ReadonlySet<string> | undefined;
  /** Filled as elements run: which can change with the clock alone, with no new input. */
  readonly moves?: Map<string, Moves> | undefined;
  /** Filled as elements run: what drives each, besides its windows' time and the measured boxes. */
  readonly drives?: Map<string, Drive> | undefined;
}

/** What drives an element: only scroll, through scroll beats without `smooth`; only one trigger
 * beat's progress; or more, such as the clock, a spring, events or another element. */
export type Drive =
  | { readonly kind: "scroll"; readonly beats: readonly ScrollBeat[] }
  | { readonly kind: "trigger"; readonly beat: TriggerBeat }
  | { readonly kind: "more" };

/** How an element can change with no new input: `time` while a beat, trigger or spring is still running;
 * `maybe` when a motion read the clock or another element, or has no window. */
export type Moves = "time" | "maybe";

/** Review limits of one target, overriding the command's defaults. */
export interface Limits {
  readonly jump?: number | undefined;
  readonly turn?: number | undefined;
  readonly ratio?: number | undefined;
}

/** A piece as written: beats in ms, a cast, and a scene from time to poses. */
export interface StageOptions<B extends string, M extends Members<B>> {
  readonly beats: Readonly<Record<B, readonly [number, number]>>;
  /** Defaults to the last beat's end; longer holds the end. */
  readonly durationMs?: number | undefined;
  readonly cast: (m: CastBuilder<NoInfer<B>>) => M;
  readonly cues?: Events | undefined;
  readonly limits?: Readonly<Record<string, Limits>> | undefined;
  /** Minimum ms a page clock stays alive after an input event for triggers and springs to settle. */
  readonly settleMs?: number | undefined;
  readonly scene: (context: SceneContext<NoInfer<B>>) => Targets<NoInfer<M>>;
}

/** A piece as `defineStage` returns it, before `compileStage` checks it. */
export interface StageDefinition<B extends string = string, M extends Members<B> = Members<B>>
  extends StageOptions<B, M> {
  readonly kind: "stage-definition";
}

/** Declares a piece; its beat names type the cast's `on` and the scene's context. */
export function defineStage<const B extends string, M extends Members<B>>(
  options: StageOptions<B, M>,
): StageDefinition<B, M> {
  return Object.freeze({ ...options, kind: "stage-definition" });
}

/** Whether `value` reads as what `defineStage` returns: `kind` only, so a second copy of the package passes. */
export function isStageDefinition(value: unknown): value is StageDefinition {
  return (
    typeof value === "object" && value !== null && Reflect.get(value, "kind") === "stage-definition"
  );
}
