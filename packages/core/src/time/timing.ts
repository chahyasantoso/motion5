import type { Time } from "./time";

/** A time helper built once from its settings: `of` answers a move's time inside it. */
export interface Timing<A extends readonly unknown[] = []> {
  of(time: Time, ...args: A): Time;
}
