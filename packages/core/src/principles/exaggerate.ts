import { POSE_2D_NUMBERS, VALUE_FIELDS, type Pose2d } from "../fields/pose";
import { NUMBERS, TURNS, type Mutable3d, type Pose3d } from "../fields/pose3d";
import type { Signal } from "../time/shapes";

/** `amount`: the share added to each field's distance from its rest; 0 changes nothing. */
export interface ExaggerateOptions {
  readonly amount: number;
}

function check(options: ExaggerateOptions, name: string): void {
  if (!(options.amount >= 0 && Number.isFinite(options.amount)))
    throw new RangeError(`${name}: amount must be 0 or more.`);
}

function pushed(rest: number | undefined, value: number, amount: number): number {
  return rest === undefined ? value : rest + (value - rest) * (1 + amount);
}

/** Each of the signal's fields pushed `amount` further from its rest. */
export function exaggerate(options: ExaggerateOptions): (signal: Signal<Pose2d>) => Signal<Pose2d> {
  check(options, "exaggerate");
  return (signal) => (time, events) => {
    const pose = signal(time, events);
    const out: { -readonly [K in (typeof POSE_2D_NUMBERS)[number]]?: number } = {};
    for (const key of POSE_2D_NUMBERS) {
      const value = pose[key];
      if (value !== undefined) out[key] = pushed(VALUE_FIELDS[key].rest, value, options.amount);
    }
    return { ...pose, ...out };
  };
}

/** Each of the 3D signal's fields pushed `amount` further from its rest. */
export function exaggerate3d(
  options: ExaggerateOptions,
): (signal: Signal<Pose3d>) => Signal<Pose3d> {
  check(options, "exaggerate3d");
  return (signal) => (time, events) => {
    const pose = signal(time, events);
    const out: Mutable3d = {};
    for (const key of [...TURNS, ...NUMBERS]) {
      const value = pose[key];
      if (value !== undefined) out[key] = pushed(VALUE_FIELDS[key].rest, value, options.amount);
    }
    return { ...pose, ...out };
  };
}
