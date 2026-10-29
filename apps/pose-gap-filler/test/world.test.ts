import { describe, expect, it } from "vitest";
import {
  basis,
  createDirectionFilter,
  rotate,
  segmentBasis,
  continuedSegmentBasis,
  toLocal,
  toWorld,
} from "../src/filler/direction";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { DEFAULT_KALMAN_NOISE } from "../src/filler/chain-kalman";
import { createGapFiller } from "../src/filler/gap-filler";
import { presentedPosition } from "../src/filler/frame";
import { JOINTS, LIMBS, jointRecord, type JointId } from "../src/filler/landmarks";
import { createGapPipeline } from "../src/filler/pipeline";
import { IMAGE_SPACE, WORLD_SPACE } from "../src/filler/space";
import { add, distance, dot, norm, scale, unit, type Vec } from "../src/filler/vec";
import { comparedFillers, compareFillers, DEFAULT_MASKS } from "../src/replay/compare";
import { createSyntheticRecording, syntheticWorldPose } from "../src/replay/synthetic";
import { loadWorldRig, readSolvedLimb, readWrittenLimbs } from "../src/rig/rig";
import { createWorldWriter } from "../src/rig/writer";
import { createWorldRigSolver } from "../src/rig/solver";
import { countingProject, fakePorts } from "./engine";
import { frameOf, trustedOf } from "./frames";

const CHAIN = { kind: "chain-kalman" as const, noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 };
const pose = () => {
  const meters = syntheticWorldPose({ kind: "exercise" }, 400);
  return jointRecord((joint) => scale(meters[joint], 1000));
};
const pipeline = () =>
  createGapPipeline({
    filler: CHAIN,
    detector: { threshold: 0.5, gate: Infinity, innovation: false },
  });
const rotating = (tMs: number) => {
  const points = pose();
  const root = points["left-shoulder"];
  const a = 0.5 + tMs / 1000;
  const dir: Vec = [Math.sin(a) * Math.cos(0.3), Math.cos(a) * Math.cos(0.3), Math.sin(0.3)];
  const parent = segmentBasis(basis([1, 0, 0], [0, 1, 0])!, dir);
  const middle = add(root, scale(dir, 300));
  points["left-elbow"] = middle;
  points["left-wrist"] = add(middle, scale(toWorld(parent, [0, 1, 0]), 270));
  // Keep torso unrotated so the exact relative direction below is constant.
  points["left-shoulder"] = [190, -500, 0];
  points["right-shoulder"] = [-190, -500, 0];
  points["left-hip"] = [140, 0, 0];
  points["right-hip"] = [-140, 0, 0];
  const shift = [190 - root[0]!, -500 - root[1]!, -root[2]!];
  points["left-elbow"] = add(points["left-elbow"], shift);
  points["left-wrist"] = add(points["left-wrist"], shift);
  return points;
};

describe("world direction filter and chain", () => {
  it("GF-59 carries the trusted parent gauge continuously across an antipodal upper segment", () => {
    const torso = basis([1, 0, 0], [0, 1, 0])!;
    let previous = segmentBasis(torso, unit([0.1, -1, 0])!);
    for (const epsilon of [1e-6, 1e-10, 0, -1e-10, -1e-6]) {
      const local = {
        x: toLocal(torso, previous.x),
        y: toLocal(torso, previous.y),
        z: toLocal(torso, previous.z),
      };
      const next = continuedSegmentBasis(torso, unit([epsilon, -1, 0])!, local);
      expect(dot(previous.x, next.x)).toBeGreaterThan(0.99);
      expect(dot(previous.z, next.z)).toBeGreaterThan(0.99);
      expect(dot(next.x, next.y)).toBeCloseTo(0, 10);
      previous = next;
    }
  });

  it("GF-60 rejects malformed visibility before consuming time or advancing any world filter", () => {
    const filler = createGapFiller(CHAIN);
    const first = trustedOf(frameOf(pose(), 0, WORLD_SPACE));
    const bad = {
      ...first,
      trust: {
        ...first.trust,
        "left-wrist": {
          kind: "trusted" as const,
          position: pose()["left-wrist"],
          visibility: NaN,
        },
      },
    };
    const lengths = { length: () => 300 };
    expect(() => filler.fill(bad, lengths)).toThrow(/visibility/);
    expect(filler.fill(first, lengths).joints["left-wrist"].kind).toBe("measured");
  });
  it("GF-43 tracks spherical angular velocity through poles and the antipodal limit", () => {
    const filter = createDirectionFilter(DEFAULT_WORLD_KALMAN_NOISE.angle);
    for (let tMs = 0; tMs <= 6000; tMs += 20) {
      const a = tMs / 1000;
      const state = filter.step(tMs, { direction: [Math.sin(a), Math.cos(a), 0], visibility: 1 })!;
      expect(norm(state.direction)).toBeCloseTo(1, 10);
      expect(dot(state.direction, state.velocity)).toBeCloseTo(0, 10);
      expect(state.p00 * state.p11 - state.p01 ** 2).toBeGreaterThanOrEqual(-1e-10);
    }
    const coast = filter.step(6200)!;
    expect(distance(coast.direction, [Math.sin(6.2), Math.cos(6.2), 0])).toBeLessThan(0.01);
    expect(norm(coast.velocity)).toBeCloseTo(1, 2);
    const flip = createDirectionFilter(DEFAULT_WORLD_KALMAN_NOISE.angle);
    flip.step(0, { direction: [0, 1, 0], visibility: 1 });
    expect(
      flip.step(100, { direction: [0, -1, 0], visibility: 1 })!.direction.every(Number.isFinite),
    ).toBe(true);
  });

  it("GF-44 rejects invalid direction/time/noise without publishing overflow state", () => {
    const options = { ...DEFAULT_WORLD_KALMAN_NOISE.angle };
    const filter = createDirectionFilter(options);
    options.measurementVariance = NaN;
    expect(filter.step(0)).toBeUndefined();
    expect(() => filter.step(1, { direction: [0, 0, 0], visibility: 1 })).toThrow(/measurement/);
    expect(() => filter.step(1, { direction: [1, 0], visibility: 1 })).toThrow(/measurement/);
    expect(() => filter.step(1, { direction: [1, 0, 0], visibility: 2 })).toThrow(/measurement/);
    filter.step(10, { direction: [1, 0, 0], visibility: 1 });
    expect(() => filter.step(9)).toThrow(/timestamps/);
    const old = filter.state;
    expect(() => filter.step(Number.MAX_VALUE)).toThrow(/overflow/);
    expect(filter.state).toEqual(old);
    filter.reset();
    expect(filter.step(0)).toBeUndefined();
  });

  it("GF-45 reconstructs a missing wrist in its CURRENT three-dimensional parent frame", () => {
    const run = pipeline();
    for (let tMs = 0; tMs <= 900; tMs += 30) run.step(frameOf(rotating(tMs), tMs, WORLD_SPACE));
    const points = rotating(1000);
    const step = run.step(
      frameOf({ ...points, "left-wrist": [1e8, -1e8, 1e8] }, 1000, WORLD_SPACE),
      new Set(["left-wrist"]),
    );
    expect(step.filled.joints["left-wrist"].kind).toBe("inferred");
    const wrist = presentedPosition(step.filled.joints["left-wrist"])!;
    expect(distance(wrist, points["left-wrist"])).toBeLessThan(0.01);
    expect(distance(wrist, points["left-elbow"])).toBeCloseTo(270, 8);
    expect(wrist[2]).not.toBe(0);
    const twin = pipeline();
    for (let tMs = 0; tMs <= 900; tMs += 30) twin.step(frameOf(rotating(tMs), tMs, WORLD_SPACE));
    expect(twin.step(frameOf(points, 1000, WORLD_SPACE), new Set(["left-wrist"])).filled).toEqual(
      step.filled,
    );
  });

  it("GF-46 coasts full chains then loses them, resets, and never invents unknown lengths", () => {
    const run = pipeline();
    for (let tMs = 0; tMs <= 900; tMs += 30) run.step(frameOf(rotating(tMs), tMs, WORLD_SPACE));
    const gaps = new Set<JointId>(["left-elbow", "left-wrist"]);
    expect(
      run.step(frameOf(rotating(1000), 1000, WORLD_SPACE), gaps).filled.joints["left-wrist"].kind,
    ).toBe("inferred");
    expect(
      run.step(frameOf(rotating(1400), 1400, WORLD_SPACE), gaps).filled.joints["left-wrist"].kind,
    ).toBe("inferred");
    expect(
      run.step(frameOf(rotating(1401), 1401, WORLD_SPACE), gaps).filled.joints["left-wrist"],
    ).toEqual({ kind: "lost" });
    expect(
      run.step(frameOf(rotating(1500), 1500, WORLD_SPACE)).filled.joints["left-wrist"].kind,
    ).toBe("measured");
    run.reset();
    const blank = run.step(frameOf(pose(), 0, WORLD_SPACE), new Set(JOINTS)).filled;
    for (const joint of JOINTS) expect(blank.joints[joint]).toEqual({ kind: "lost" });
  });

  it("GF-47 reconstructs either root and coasts all three fallback coordinates without recursive anchors", () => {
    for (const limb of LIMBS) {
      const run = pipeline();
      const points = pose();
      run.step(frameOf(points, 0, WORLD_SPACE));
      const filled = run.step(frameOf(points, 100, WORLD_SPACE), new Set([limb.root])).filled;
      expect(
        distance(presentedPosition(filled.joints[limb.root])!, points[limb.root]),
      ).toBeLessThan(1e-6);
    }
    const roots = LIMBS.map((limb) => limb.root);
    const run = pipeline();
    const moving = (t: number) =>
      jointRecord((joint) => add(pose()[joint], [t / 10, -t / 20, t / 5]));
    for (let t = 0; t <= 900; t += 30) run.step(frameOf(moving(t), t, WORLD_SPACE));
    const step = run.step(frameOf(moving(1000), 1000, WORLD_SPACE), new Set(roots));
    for (const root of roots)
      expect(
        distance(presentedPosition(step.filled.joints[root])!, moving(1000)[root]),
      ).toBeLessThan(1);
  });

  it("GF-48 holds rigid-rotation equivariance and prevents mixing space state without reset", () => {
    const plain = pipeline();
    const turned = pipeline();
    const rotation: Vec = [0.5, -0.7, 0.2];
    for (let t = 0; t <= 900; t += 30) {
      plain.step(frameOf(rotating(t), t, WORLD_SPACE));
      turned.step(
        frameOf(
          jointRecord((joint) => rotate(rotating(t)[joint], rotation)),
          t,
          WORLD_SPACE,
        ),
      );
    }
    const gaps = new Set<JointId>(["left-elbow", "left-wrist"]);
    const a = plain.step(frameOf(rotating(1000), 1000, WORLD_SPACE), gaps);
    const b = turned.step(
      frameOf(
        jointRecord((joint) => rotate(rotating(1000)[joint], rotation)),
        1000,
        WORLD_SPACE,
      ),
      gaps,
    );
    for (const joint of gaps)
      expect(
        distance(
          presentedPosition(b.filled.joints[joint])!,
          rotate(presentedPosition(a.filled.joints[joint])!, rotation),
        ),
      ).toBeLessThan(1e-6);
    const filler = createGapFiller({ ...CHAIN, noise: DEFAULT_KALMAN_NOISE });
    filler.fill(trustedOf(frameOf({})), { length: () => undefined });
    expect(() =>
      filler.fill(trustedOf(frameOf({}, 1, WORLD_SPACE)), { length: () => undefined }),
    ).toThrow(/Reset/);
    filler.reset();
    expect(
      filler.fill(trustedOf(frameOf({}, 0, WORLD_SPACE)), { length: () => undefined }).space,
    ).toEqual(WORLD_SPACE);
    expect(comparedFillers(IMAGE_SPACE)[2]).not.toEqual(comparedFillers(WORLD_SPACE)[2]);
  });
});

describe("Engine-backed world rig", () => {
  it("GF-49 solves every measured 3D middle, tip and median length in one values batch", () => {
    const loaded = loadWorldRig(fakePorts());
    const { project, batches } = countingProject(loaded);
    try {
      const run = pipeline();
      const points = pose();
      const step = run.step(frameOf(points, 0, WORLD_SPACE));
      const writer = createWorldWriter(project);
      const writes = writer.write(step.filled, step.trusted, run.lengths);
      expect(batches()).toBe(1);
      for (const limb of LIMBS) {
        expect(writes[limb.id].kind).toBe("written");
        const solved = readSolvedLimb(loaded, limb.id, ["x", "y", "z"])!;
        expect(distance(solved.middle, points[limb.middle])).toBeLessThan(1e-5);
        expect(distance(solved.tip, points[limb.tip])).toBeLessThan(1e-5);
        expect(distance(points[limb.root], solved.middle)).toBeCloseTo(
          run.lengths.length(limb.upper)!,
          6,
        );
      }
    } finally {
      loaded.dispose();
    }
  });

  it("GF-50 holds measured pole direction during an inferred middle and translates it with the root", () => {
    const loaded = loadWorldRig(fakePorts());
    try {
      const writer = createWorldWriter(loaded);
      const run = createGapPipeline({
        filler: { kind: "hold" },
        detector: { gate: Infinity, threshold: 0.5 },
      });
      const points = pose();
      const first = run.step(frameOf(points, 0, WORLD_SPACE));
      writer.write(first.filled, first.trusted, run.lengths);
      const shift: Vec = [50, -30, 90];
      const moved = jointRecord((joint) => add(points[joint], shift));
      moved["left-elbow"] = [1e6, -1e6, 1e6];
      const next = run.step(frameOf(moved, 100, WORLD_SPACE), new Set(["left-elbow"]));
      writer.write(next.filled, next.trusted, run.lengths);
      const solved = readSolvedLimb(loaded, "left-arm", ["x", "y", "z"])!;
      expect(distance(solved.middle, add(points["left-elbow"], shift))).toBeLessThan(1e-5);
      const missing = run.step(frameOf({}, 700, WORLD_SPACE));
      const raw = createGapFiller({ kind: "raw" }).fill(missing.trusted);
      const writes = writer.write(raw, missing.trusted, run.lengths);
      expect(readWrittenLimbs(loaded, writes, ["x", "y", "z"]).size).toBe(0);
    } finally {
      loaded.dispose();
    }
  });

  it("GF-51 compares all three fillers with fresh world rigs deterministically in mm", () => {
    const recording = createSyntheticRecording({
      motion: { kind: "exercise" },
      seed: 11,
      durationMs: 6000,
      fps: 30,
    });
    let created = 0;
    let disposed = 0;
    const options = {
      recording,
      space: WORLD_SPACE,
      fillers: comparedFillers(WORLD_SPACE),
      masks: DEFAULT_MASKS,
      createSolver: () => {
        created += 1;
        const solver = createWorldRigSolver(fakePorts());
        return {
          solve: solver.solve,
          dispose() {
            disposed += 1;
            solver.dispose();
          },
        };
      },
    };
    const rows = compareFillers(options);
    expect(rows.map((row) => row.filler)).toEqual(["raw", "hold", "chain-kalman"]);
    expect(created).toBe(3);
    expect(disposed).toBe(3);
    expect(compareFillers(options)).toEqual(rows);
    for (const row of rows) {
      expect(row.metrics.positionError.count).toBeGreaterThan(0);
      expect(Number.isFinite(row.metrics.positionError.mean)).toBe(true);
      expect(Number.isFinite(row.metrics.jitter.mean)).toBe(true);
    }
  });
});
