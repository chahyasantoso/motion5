import { describe, expect, expectTypeOf, it } from "vitest";
import {
  NO_EVENTS,
  along,
  along3d,
  arch,
  attack,
  ballistic,
  decay,
  taper,
  velocity,
  velocity3d,
  wave,
  type Cubic2d,
  type Cubic3d,
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

  it("builds every curve with settings from its settings and matches pre-change samples", () => {
    const ps = [0, 0.25, 0.5, 0.75, 1];
    const c2: Cubic2d[] = [
      { id: "a", x0: 0, y0: 0, x1: 0, y1: 100, x2: 100, y2: 100, x3: 100, y3: 200 },
    ];
    const c3: Cubic3d[] = [
      {
        id: "a",
        x0: 0,
        y0: 0,
        z0: 0,
        x1: 0,
        y1: 100,
        z1: 50,
        x2: 100,
        y2: 100,
        z2: 150,
        x3: 100,
        y3: 200,
        z3: 200,
      },
    ];

    const waveCurve: Curve = wave({ count: 2, phase: 0.25 });
    const attackCurve: Curve = attack({ rate: 3 });
    const decayCurve: Curve = decay({ rate: 3 });
    const taperCurve: Curve = taper({ power: 2 });
    const ballisticCurve: Curve<{ x: number; y: number }> = ballistic({
      dx: 80,
      dy: -40,
      apex: 50,
    });
    const alongCurve: Curve<Pose2d> = along(c2, { turn: true });
    const along3dCurve: Curve<Pose3d> = along3d(c3, { face: true });

    const waveExpected = [1, -1, 1, -1, 1];
    const attackExpected = [
      0, 0.5276334472589853, 0.7768698398515702, 0.8946007754381357, 0.950212931632136,
    ];
    const decayExpected = [
      1, 0.4723665527410147, 0.22313016014842982, 0.10539922456186433, 0.049787068367863944,
    ];
    const taperExpected = [1, 0.5625, 0.25, 0.0625, 0];
    const ballisticExpected = [
      { x: 80, y: -40 },
      { x: 60, y: -81.40576474687263 },
      { x: 40, y: -88.54101966249685 },
      { x: 20, y: -61.40576474687265 },
      { x: 0, y: 0 },
    ];
    const alongExpected = [
      { x: 0, y: 0, rotation: 90 },
      { x: 13.43622759025766, y: 55.56272099322002, rotation: 61.25708414384479 },
      { x: 50.00000000000001, y: 100, rotation: 45.00000000000001 },
      { x: 86.56377240974234, y: 144.43727900678, rotation: 61.25708414384479 },
      { x: 100, y: 200, rotation: 90 },
    ];
    const along3dExpected = [
      {
        x: 0,
        y: 0,
        z: 0,
        rotation: 77.39561735162083,
        rotationX: -23.57817847820183,
        rotationY: -29.205932247399414,
      },
      {
        x: 15.474096260930985,
        y: 59.122770177773305,
        z: 45.03548134981763,
        rotation: 41.1548464016724,
        rotationX: -18.191094137193446,
        rotationY: -46.19011642942002,
      },
      {
        x: 50.00000000000001,
        y: 100,
        z: 100.00000000000001,
        rotation: 29.958936016502705,
        rotationX: -13.748438682744712,
        rotationY: -48.509777405670775,
      },
      {
        x: 84.52590373906902,
        y: 140.8772298222267,
        z: 154.96451865018236,
        rotation: 41.15484640167241,
        rotationX: -18.19109413719345,
        rotationY: -46.19011642942001,
      },
      {
        x: 100,
        y: 200,
        z: 200,
        rotation: 77.39561735162083,
        rotationX: -23.57817847820183,
        rotationY: -29.205932247399414,
      },
    ];

    ps.forEach((p, i) => {
      expect(waveCurve(p)).toBeCloseTo(waveExpected[i]!, 12);
      expect(attackCurve(p)).toBeCloseTo(attackExpected[i]!, 12);
      expect(decayCurve(p)).toBeCloseTo(decayExpected[i]!, 12);
      expect(taperCurve(p)).toBeCloseTo(taperExpected[i]!, 12);
      expect(ballisticCurve(p).x).toBeCloseTo(ballisticExpected[i]!.x, 12);
      expect(ballisticCurve(p).y).toBeCloseTo(ballisticExpected[i]!.y, 12);
      expect(alongCurve(p).x).toBeCloseTo(alongExpected[i]!.x, 12);
      expect(alongCurve(p).y).toBeCloseTo(alongExpected[i]!.y, 12);
      expect(alongCurve(p).rotation).toBeCloseTo(alongExpected[i]!.rotation, 12);
      expect(along3dCurve(p).x).toBeCloseTo(along3dExpected[i]!.x, 12);
      expect(along3dCurve(p).y).toBeCloseTo(along3dExpected[i]!.y, 12);
      expect(along3dCurve(p).z).toBeCloseTo(along3dExpected[i]!.z, 12);
      expect(along3dCurve(p).rotation).toBeCloseTo(along3dExpected[i]!.rotation, 12);
      expect(along3dCurve(p).rotationX).toBeCloseTo(along3dExpected[i]!.rotationX, 12);
      expect(along3dCurve(p).rotationY).toBeCloseTo(along3dExpected[i]!.rotationY, 12);
    });
  });
});
