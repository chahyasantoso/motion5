import type { Pose2d } from "../fields/pose";
import { velocity } from "../measure/velocity";
import { velocity3d } from "../measure/velocity3d";
import type { Pose3d } from "../fields/pose3d";
import type { Signal } from "../time/shapes";

function check(respond: unknown, name: string): void {
  if (typeof respond !== "function") throw new RangeError(`${name}: respond must be a function.`);
}

/** A signal that answers the primary's velocity in px a second through `respond`. */
export function secondary<T>(
  respond: (velocity: { readonly vx: number; readonly vy: number }) => T,
): (primary: Signal<Pose2d>) => Signal<T> {
  check(respond, "secondary");
  return (primary) => (time, events) => respond(velocity(primary, time, events));
}

/** A signal that answers the primary's velocity in units a second through `respond`. */
export function secondary3d<T>(
  respond: (velocity: { readonly vx: number; readonly vy: number; readonly vz: number }) => T,
): (primary: Signal<Pose3d>) => Signal<T> {
  check(respond, "secondary3d");
  return (primary) => (time, events) => respond(velocity3d(primary, time, events));
}
