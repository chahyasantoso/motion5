import { POSE_2D_NUMBERS, VALUE_FIELDS, type Pose2d } from "../fields/pose";
import { NUMBERS, TURNS, type Mutable3d, type Pose3d } from "../fields/pose3d";
import type { Signal } from "../time/shapes";
import { trail, trailSettings } from "./trail";
import { trailTurn } from "./trail-turn";

/** `stiffness`: the spring's pull per second squared, above 0; `damping`: its drag per second, 0 or more. */
export interface FollowThroughOptions {
  readonly stiffness: number;
  readonly damping: number;
}

type Number2d = (typeof POSE_2D_NUMBERS)[number];
type Number3d = (typeof NUMBERS)[number];

function check(options: FollowThroughOptions, name: string): void {
  if (!(options.stiffness > 0)) throw new RangeError(`${name}: stiffness must be above 0.`);
  if (!(options.damping >= 0)) throw new RangeError(`${name}: damping must be 0 or more.`);
  trailSettings(options, name);
}

/** Each field of the signal chasing it on a spring, the turn the short way, resting exactly on the signal. */
export function followThrough(
  options: FollowThroughOptions,
): (signal: Signal<Pose2d>) => Signal<Pose2d> {
  check(options, "followThrough");
  return (signal) => {
    const chasers = new Map<Number2d, Signal<number>>();
    for (const field of POSE_2D_NUMBERS)
      if (field !== "rotation")
        chasers.set(
          field,
          trail(
            (time, events) => signal(time, events)[field] ?? VALUE_FIELDS[field].rest ?? 0,
            options,
          ),
        );
    const turning = trailTurn(
      (time, events) => ({ rotation: signal(time, events).rotation ?? 0 }),
      options,
    );
    return (time, events) => {
      const pose = signal(time, events);
      const out: { -readonly [K in Number2d]?: number } = {};
      for (const [field, chase] of chasers)
        if (pose[field] !== undefined) out[field] = chase(time, events);
      const turned = pose.rotation === undefined ? undefined : turning(time, events).rotation;
      if (turned !== undefined) out.rotation = turned;
      return { ...pose, ...out };
    };
  };
}

/** Each position and scale of the 3D signal chasing it on a spring, the turn the short way. */
export function followThrough3d(
  options: FollowThroughOptions,
): (signal: Signal<Pose3d>) => Signal<Pose3d> {
  check(options, "followThrough3d");
  return (signal) => {
    const chasers = new Map<Number3d, Signal<number>>();
    for (const field of NUMBERS)
      chasers.set(
        field,
        trail(
          (time, events) => signal(time, events)[field] ?? VALUE_FIELDS[field].rest ?? 0,
          options,
        ),
      );
    const turning = trailTurn(signal, options);
    return (time, events) => {
      const pose = signal(time, events);
      const out: Mutable3d = {};
      for (const [field, chase] of chasers)
        if (pose[field] !== undefined) out[field] = chase(time, events);
      const turned: Pose3d = TURNS.some((field) => pose[field] !== undefined)
        ? turning(time, events)
        : {};
      for (const field of TURNS) {
        const value = turned[field];
        if (value !== undefined && pose[field] !== undefined) out[field] = value;
      }
      return { ...pose, ...out };
    };
  };
}
