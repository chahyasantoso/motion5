import { arch } from "../envelope/envelopes";
import { POSE_2D_NUMBERS, VALUE_FIELDS, type Pose2d } from "../fields/pose";
import { NUMBERS, TURNS, type Mutable3d, type Pose3d } from "../fields/pose3d";
import type { Signal } from "../time/shapes";
import { withProgress } from "../time/time";

/** `share`: the share of the progress spent winding up, 0 to 0.9; `amount`: how far back it goes as a share of the
 * signal's whole travel, 0 to 1. */
export interface AnticipationOptions {
  readonly share: number;
  readonly amount: number;
}

type Number2d = (typeof POSE_2D_NUMBERS)[number];
type Number3d = (typeof TURNS)[number] | (typeof NUMBERS)[number];

const ADDED_2D: readonly Number2d[] = POSE_2D_NUMBERS.filter(
  (name) => VALUE_FIELDS[name].combines === "add",
);
const ADDED_3D: readonly Number3d[] = [...TURNS, ...NUMBERS].filter(
  (name) => VALUE_FIELDS[name].combines === "add",
);

function check(options: AnticipationOptions, name: string): void {
  if (!(options.share >= 0 && options.share <= 0.9))
    throw new RangeError(`${name}: share must be from 0 to 0.9.`);
  if (!(options.amount >= 0 && options.amount <= 1))
    throw new RangeError(`${name}: amount must be from 0 to 1.`);
}

type Custom = { readonly custom?: Readonly<Record<string, number>> };

function customNames(poses: readonly Custom[]): readonly string[] {
  return [...new Set(poses.flatMap((pose) => Object.keys(pose.custom ?? {})))];
}

/** A field's amount, stopped at the least its row allows. */
function held(field: Number2d | Number3d, value: number): number {
  const least = VALUE_FIELDS[field].least;
  return least === undefined ? value : Math.max(least, value);
}

/** The signal winds up the other way from its travel, then plays and ends where it ends. */
export function anticipation(
  options: AnticipationOptions,
): (signal: Signal<Pose2d>) => Signal<Pose2d> {
  check(options, "anticipation");
  const { share, amount } = options;
  return (signal) => (time, events) => {
    const at = (progress: number) => signal(withProgress(time, progress), events);
    const first = at(0);
    const last = at(1);
    const played = time.progress >= share ? at((time.progress - share) / (1 - share)) : undefined;
    const poses = played === undefined ? [first, last] : [first, last, played];
    const fields = ADDED_2D.filter((field) => poses.some((pose) => pose[field] !== undefined));
    const names = customNames(poses);
    const base = played ?? first;
    const wind = played === undefined ? amount * arch(time.progress / share) : 0;
    const value = (read: (pose: Pose2d) => number) =>
      played === undefined ? read(first) + wind * (read(first) - read(last)) : read(played);
    const out: { -readonly [K in Number2d]?: number } = {};
    for (const field of fields)
      out[field] = held(
        field,
        value((pose) => pose[field] ?? 0),
      );
    if (names.length === 0) return { ...base, ...out };
    const custom: Record<string, number> = {};
    for (const name of names) custom[name] = value((pose) => pose.custom?.[name] ?? 0);
    return { ...base, ...out, custom };
  };
}

/** The 3D signal winds up the other way from its travel, then plays and ends where it ends. */
export function anticipation3d(
  options: AnticipationOptions,
): (signal: Signal<Pose3d>) => Signal<Pose3d> {
  check(options, "anticipation3d");
  const { share, amount } = options;
  return (signal) => (time, events) => {
    const at = (progress: number) => signal(withProgress(time, progress), events);
    const first = at(0);
    const last = at(1);
    const played = time.progress >= share ? at((time.progress - share) / (1 - share)) : undefined;
    const poses = played === undefined ? [first, last] : [first, last, played];
    const fields = ADDED_3D.filter((field) => poses.some((pose) => pose[field] !== undefined));
    const names = customNames(poses);
    const base = played ?? first;
    const wind = played === undefined ? amount * arch(time.progress / share) : 0;
    const value = (read: (pose: Pose3d) => number) =>
      played === undefined ? read(first) + wind * (read(first) - read(last)) : read(played);
    const out: Mutable3d = {};
    for (const field of fields)
      out[field] = held(
        field,
        value((pose) => pose[field] ?? 0),
      );
    if (names.length === 0) return { ...base, ...out };
    const custom: Record<string, number> = {};
    for (const name of names) custom[name] = value((pose) => pose.custom?.[name] ?? 0);
    return { ...base, ...out, custom };
  };
}
