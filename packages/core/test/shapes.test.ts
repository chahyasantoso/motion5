import { describe, expect, expectTypeOf, it } from "vitest";
import {
  NO_EVENTS,
  arch,
  velocity,
  velocity3d,
  type Curve,
  type Pose2d,
  type Pose3d,
  type Signal,
  type Time,
} from "@gerak/core";

const timed: Time = { progress: 0.5, clock: { kind: "timed", elapsed: 500, length: 1000 } };

describe("core shapes", () => {
  it("accepts arch as a Curve, a time-only function as a Signal, and passes Signal to velocity and velocity3d", () => {
    const curve: Curve = arch;
    expectTypeOf(arch).toMatchTypeOf<Curve>();
    expect(curve(0.5)).toBe(1);

    const timeOnly = (time: Time): Pose2d => ({ x: time.progress * 100 });
    const signal: Signal = timeOnly;
    expectTypeOf(timeOnly).toMatchTypeOf<Signal>();
    expect(signal(timed, NO_EVENTS)).toEqual({ x: 50 });
    expect(velocity(signal, timed, NO_EVENTS).vx).toBeCloseTo(100, 9);

    const signal3d: Signal<Pose3d> = (time) => ({ z: time.progress * 10 });
    expect(velocity3d(signal3d, timed, NO_EVENTS).vz).toBeCloseTo(10, 9);
  });
});
