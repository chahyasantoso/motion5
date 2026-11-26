import type { Events, Pose2d, Pose3d, Span, Time } from "@gerak/core";
import type { ScrollBeat, TriggerBeat } from "./beat";
import type { Carry, RestReader } from "./layout";

/** A list's pose in the scene: the pose of item `index` of `count`. */
export type ListPose = (index: number, count: number) => Pose2d;

/** A 3D list's pose in the scene: the 3D pose of item `index` of `count`. */
export type ListPose3d = (index: number, count: number) => Pose3d;

/** Beats by name, each a `Span`: `beats.enter.of(time)` is time inside it. */
export type Beats<B extends string = string> = Readonly<Record<B, Span>>;

/** Which dynamic input streams an element or frame depends on. */
export interface InputNeed {
  readonly scroll: boolean;
  readonly pointer: boolean;
  readonly events: boolean;
}

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
  /** Filled as elements run: which dynamic input channels each element read. */
  readonly inputs?: Map<string, InputNeed> | undefined;
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

/** One shot of a scene made with `shot`: its name, place in order, and its ms on the scene's clock. */
export interface ShotSummary {
  readonly name: string;
  readonly index: number;
  readonly from: number;
  readonly to: number;
  readonly overlap: number;
}
