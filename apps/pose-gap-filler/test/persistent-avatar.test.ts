import { describe, expect, it } from "vitest";
import { createAvatarScene } from "../src/view/avatar";
import { createGapPipeline } from "../src/filler/pipeline";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { WORLD_SPACE } from "../src/filler/space";
import { jointRecord, LIMBS } from "../src/filler/landmarks";
import { scale } from "../src/filler/vec";
import { syntheticWorldPose } from "../src/replay/synthetic";
import { createWorldRigSolver } from "../src/rig/solver";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import { fakePorts } from "./engine";
import { frameOf } from "./frames";

const pose = () =>
  jointRecord((joint) => scale(syntheticWorldPose({ kind: "exercise" }, 400)[joint], 1000));
const pipeline = () =>
  createGapPipeline({
    filler: { kind: "chain-kalman", noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
  });
const transforms = (avatar: ReturnType<typeof createAvatarScene>) =>
  [...avatar.objects].map(([id, object]) => ({
    id,
    position: object.position.toArray(),
    quaternion: object.quaternion.toArray(),
    scale: object.scale.toArray(),
    meshPosition: object.children[0]!.position.toArray(),
    meshScale: object.children[0]!.scale.toArray(),
  }));

describe("presentation-only persistent avatar", () => {
  it("keeps partial body evidence current without relabeling missing shoulders/head as current", () => {
    const avatar = createAvatarScene(),
      solver = createWorldRigSolver(fakePorts()),
      run = pipeline();
    try {
      const first = run.step(frameOf(pose(), 0, WORLD_SPACE));
      avatar.update(first, solver.solve(first, run.lengths), run.lengths, solver.readPatch);
      const points = pose();
      const { ["left-shoulder"]: _ls, ["right-shoulder"]: _rs, ...partial } = points;
      const next = run.step(frameOf(partial, 501, WORLD_SPACE));
      avatar.update(next, solver.solve(next, run.lengths), run.lengths, solver.readPatch);
      expect(avatar.objects.get("pelvis")!.userData.freshness.kind).toBe("current");
      for (const id of ["shoulders", "trunk", "neck", "head"]) {
        expect(avatar.objects.get(id)!.visible).toBe(true);
        expect(avatar.objects.get(id)!.userData.freshness.kind).toBe("stale");
      }
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });

  it("holds all 17 solved/body primitives exactly through complete evidence expiry without publishing them", () => {
    const avatar = createAvatarScene(),
      solver = createWorldRigSolver(fakePorts()),
      run = pipeline();
    try {
      const first = run.step(frameOf(pose(), 0, WORLD_SPACE));
      avatar.update(first, solver.solve(first, run.lengths), run.lengths, solver.readPatch);
      const saved = transforms(avatar);
      const lost = run.step(frameOf({}, 501, WORLD_SPACE));
      const solved = solver.solve(lost, run.lengths);
      expect(solved.size).toBe(0);
      const residuals = avatar.update(lost, solved, run.lengths, solver.readPatch);
      expect(transforms(avatar)).toEqual(saved);
      for (const object of avatar.objects.values()) {
        expect(object.visible).toBe(true);
        expect(object.userData.freshness).toEqual({ kind: "stale", lastCurrentMs: 0 });
      }
      for (const residual of residuals.values()) {
        expect(residual.middleMm).toBeUndefined();
        expect(residual.tipMm).toBeUndefined();
        expect(residual.freshness.kind).toBe("stale");
      }
      for (const limb of LIMBS) expect(lost.filled.joints[limb.tip].kind).toBe("lost");
      avatar.clear();
      avatar.update(lost, solved, run.lengths, solver.readPatch);
      for (const object of avatar.objects.values()) {
        expect(object.visible).toBe(false);
        expect(object.userData.freshness.kind).toBe("unavailable");
      }
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });

  it("never promotes retained ready project patches, missing lengths or first-frame gaps into current display", () => {
    const avatar = createAvatarScene(),
      solver = createWorldRigSolver(fakePorts()),
      run = pipeline();
    try {
      const first = run.step(frameOf({}, 0, WORLD_SPACE));
      avatar.update(first, new Map(), run.lengths, solver.readPatch);
      expect([...avatar.objects.values()].every((object) => !object.visible)).toBe(true);
      const valid = run.step(frameOf(pose(), 33, WORLD_SPACE));
      const solved = solver.solve(valid, run.lengths);
      avatar.update(valid, solved, run.lengths, solver.readPatch);
      const saved = transforms(avatar);
      avatar.update(valid, solved, { length: () => undefined }, solver.readPatch);
      expect(transforms(avatar)).toEqual(saved);
      for (const limb of LIMBS) {
        const object = avatar.objects.get(poseNodeId(limbTracks(limb.id).upper))!;
        expect(object.visible).toBe(true);
        expect(object.userData.freshness.kind).toBe("stale");
      }
      avatar.update(valid, solved, run.lengths, solver.readPatch);
      for (const limb of LIMBS)
        expect(
          avatar.objects.get(poseNodeId(limbTracks(limb.id).upper))!.userData.freshness.kind,
        ).toBe("current");
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });

  it("cannot alter later detector, filter, length, bend or solver state", () => {
    const avatar = createAvatarScene(),
      shown = pipeline(),
      control = pipeline();
    const a = createWorldRigSolver(fakePorts(), { diagnostics: true });
    const b = createWorldRigSolver(fakePorts(), { diagnostics: true });
    try {
      for (const t of [0, 33, 66, 600, 633, 666]) {
        const frame = frameOf(t === 600 ? {} : pose(), t, WORLD_SPACE);
        const stepA = shown.step(frame),
          stepB = control.step(frame);
        const solvedA = a.solve(stepA, shown.lengths),
          solvedB = b.solve(stepB, control.lengths);
        avatar.update(stepA, solvedA, shown.lengths, a.readPatch);
        expect(stepA).toEqual(stepB);
        expect(solvedA).toEqual(solvedB);
        expect(a.readDiagnostics!()).toEqual(b.readDiagnostics!());
        for (const limb of LIMBS)
          for (const bone of [limb.upper, limb.lower])
            expect(shown.lengths.length(bone)).toBe(control.lengths.length(bone));
      }
    } finally {
      avatar.dispose();
      a.dispose();
      b.dispose();
    }
  });

  it("invalidates display history when the publication reader/project changes", () => {
    const avatar = createAvatarScene(),
      run = pipeline(),
      solver = createWorldRigSolver(fakePorts());
    const fresh = createWorldRigSolver(fakePorts());
    try {
      const first = run.step(frameOf(pose(), 0, WORLD_SPACE));
      avatar.update(first, solver.solve(first, run.lengths), run.lengths, solver.readPatch);
      const lost = run.step(frameOf({}, 501, WORLD_SPACE));
      avatar.update(lost, new Map(), run.lengths, fresh.readPatch);
      expect([...avatar.objects.values()].every((object) => !object.visible)).toBe(true);
    } finally {
      avatar.dispose();
      solver.dispose();
      fresh.dispose();
    }
  });
});
