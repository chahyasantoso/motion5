import type { Events } from "../events/event-list";
import type { Pose2d } from "../fields/pose";
import type { Time } from "./time";

/** A value from progress 0 to 1, built once from its settings. */
export type Curve<T = number> = (progress: number) => T;

/** A value at the scene's `time` and the `events` so far; a signal of `time` alone may ignore `events`. */
export type Signal<T = Pose2d> = (time: Time, events: Events) => T;
