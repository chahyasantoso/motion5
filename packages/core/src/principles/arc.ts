import { arch } from "../envelope/envelopes";
import type { Pose2d } from "../fields/pose";
import type { Pose3d } from "../fields/pose3d";
import type { Signal } from "../time/shapes";
import { withProgress } from "../time/time";

/** `bend`: px the path bows by at its middle, to the right of its travel on screen when above 0. */
export interface ArcBendOptions {
  readonly bend: number;
}

/** `bend`: the world-unit offset the path bows by at its middle. */
export interface Arc3dOptions {
  readonly bend: { readonly x: number; readonly y: number; readonly z: number };
}

/** The signal with a bow added at right angles to its straight travel from progress 0 to 1: 0 at both ends. */
export function arc(options: ArcBendOptions): (signal: Signal<Pose2d>) => Signal<Pose2d> {
  const { bend } = options;
  if (!Number.isFinite(bend)) throw new RangeError("arc: bend must be a number.");
  return (signal) => (time, events) => {
    const pose = signal(time, events);
    const first = signal(withProgress(time, 0), events);
    const last = signal(withProgress(time, 1), events);
    const dx = (last.x ?? 0) - (first.x ?? 0);
    const dy = (last.y ?? 0) - (first.y ?? 0);
    const length = Math.hypot(dx, dy);
    if (length === 0) return pose;
    const push = bend * arch(time.progress);
    return {
      ...pose,
      x: (pose.x ?? 0) - (dy / length) * push,
      y: (pose.y ?? 0) + (dx / length) * push,
    };
  };
}

/** The 3D signal with `bend` added, scaled by the arch of its progress: 0 at both ends. */
export function arc3d(options: Arc3dOptions): (signal: Signal<Pose3d>) => Signal<Pose3d> {
  const { x, y, z } = options.bend;
  if (![x, y, z].every(Number.isFinite)) throw new RangeError("arc3d: bend must be three numbers.");
  return (signal) => (time, events) => {
    const pose = signal(time, events);
    const push = arch(time.progress);
    return {
      ...pose,
      x: (pose.x ?? 0) + x * push,
      y: (pose.y ?? 0) + y * push,
      z: (pose.z ?? 0) + z * push,
    };
  };
}
