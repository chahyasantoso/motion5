import { describe, expect, it } from "vitest";
import { Group, Vector3 } from "three";
import { createAvatarScene, extremityOrientation, requireUniformScale } from "../src/view/avatar";
import { createGapPipeline } from "../src/filler/pipeline";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { WORLD_SPACE } from "../src/filler/space";
import { LIMBS, jointRecord, type JointId } from "../src/filler/landmarks";
import { scale } from "../src/filler/vec";
import { syntheticWorldPose } from "../src/replay/synthetic";
import { createWorldRigSolver } from "../src/rig/solver";
import { loadWorldRig } from "../src/rig/rig";
import { createWorldWriter } from "../src/rig/writer";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import type { RawLandmark } from "../src/filler/adapter";
import { presentedPosition } from "../src/filler/frame";
import { countingProject, fakePorts } from "./engine";
import { frameOf } from "./frames";

const pose = () =>
  jointRecord((joint) => scale(syntheticWorldPose({ kind: "exercise" }, 400)[joint], 1000));
const pipeline = () =>
  createGapPipeline({
    filler: { kind: "chain-kalman", noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
    detector: { threshold: 0.5, gate: Infinity },
  });
const fixture = () => {
  const avatar = createAvatarScene(),
    solver = createWorldRigSolver(fakePorts()),
    run = pipeline();
  const update = (t: number, gaps: ReadonlySet<JointId> = new Set()) => {
    const step = run.step(frameOf(pose(), t, WORLD_SPACE), gaps);
    const solved = solver.solve(step, run.lengths);
    return { step, solved, residuals: avatar.update(step, solved, run.lengths, solver.readPatch) };
  };
  return {
    avatar,
    solver,
    run,
    update,
    dispose() {
      avatar.dispose();
      solver.dispose();
    },
  };
};

describe("flat reconstructed avatar", () => {
  it("GF-134 uses one existing project batch and exact measured middle/tip residuals", () => {
    const loaded = loadWorldRig(fakePorts()),
      { project, batches } = countingProject(loaded);
    try {
      const run = pipeline(),
        step = run.step(frameOf(pose(), 0, WORLD_SPACE));
      createWorldWriter(project).write(step.filled, step.trusted, run.lengths);
      expect(batches()).toBe(1);
    } finally {
      loaded.dispose();
    }
    const f = fixture();
    try {
      const { residuals } = f.update(0);
      expect(residuals.size).toBe(4);
      for (const residual of residuals.values()) {
        expect(residual.middleMm!).toBeLessThan(1e-5);
        expect(residual.tipMm!).toBeLessThan(1e-5);
        expect(residual.provenance).toBe("measured");
        expect(residual.orientation).toBe("neutral");
      }
    } finally {
      f.dispose();
    }
  });

  it("GF-135 keeps every frame-bound object flat and draws limb boxes backward from distal tips", () => {
    const f = fixture();
    try {
      const { step } = f.update(0);
      for (const object of f.avatar.objects.values()) expect(object.parent).toBe(f.avatar.parent);
      const limb = LIMBS[0]!,
        group = f.avatar.objects.get(poseNodeId(limbTracks(limb.id).upper))!;
      const mesh = group.children[0]!;
      const root = new Vector3().fromArray(presentedPosition(step.filled.joints[limb.root])!);
      // Undo only the explicitly calibrated display parent, leaving adapter-local millimetres.
      const proximal = mesh.localToWorld(new Vector3(-0.5, 0, 0));
      f.avatar.parent.worldToLocal(proximal);
      expect(proximal.distanceTo(root)).toBeLessThan(1e-5);
    } finally {
      f.dispose();
    }
  });

  it("GF-136 maps x/right y/down z/away once and composes parent rotation plus uniform scale", () => {
    const avatar = createAvatarScene(),
      outer = new Group();
    try {
      outer.rotation.set(0.2, -0.4, 0.6);
      outer.scale.setScalar(2);
      outer.add(avatar.parent);
      const actual = avatar.parent.localToWorld(new Vector3(100, 200, 300));
      const expected = outer.localToWorld(new Vector3(0.1, -0.2, -0.3));
      expect(actual.distanceTo(expected)).toBeLessThan(1e-12);
      expect(avatar.parent.scale.x).toBe(0.001);
    } finally {
      avatar.dispose();
    }
  });

  it("GF-137 rejects nonuniform, negative and non-finite parent scale", () => {
    const f = fixture(),
      outer = new Group();
    try {
      outer.add(f.avatar.parent);
      for (const value of [
        [1, 2, 1],
        [-1, -1, -1],
        [NaN, NaN, NaN],
        [0, 0, 0],
      ]) {
        outer.scale.fromArray(value);
        expect(() => requireUniformScale(f.avatar.parent)).toThrow(/uniform/);
      }
    } finally {
      f.dispose();
    }
  });

  it("GF-138 shows a connected coarse body, with neutral head and fixed topology", () => {
    const f = fixture();
    try {
      const topology = [...f.avatar.objects.values()];
      f.update(0);
      for (const id of ["pelvis", "trunk", "shoulders", "neck", "head"])
        expect(f.avatar.objects.get(id)!.visible).toBe(true);
      expect(f.avatar.objects.get("head")!.userData.provenance).toBe("neutral");
      f.update(100);
      expect([...f.avatar.objects.values()]).toEqual(topology);
    } finally {
      f.dispose();
    }
  });

  it("GF-139 hides skipped limbs even when their project retains a ready patch", () => {
    const f = fixture();
    try {
      f.update(0);
      const id = poseNodeId(limbTracks("left-arm").upper);
      const after = f.update(501, new Set(["left-wrist"]));
      // First gap sample is already past observation age, so the writer skips the lost goal.
      expect(after.solved.has("left-arm")).toBe(false);
      expect(f.solver.readPatch!(id)?.status).toBe("ready");
      expect(f.avatar.objects.get(id)!.visible).toBe(false);
      expect(f.avatar.objects.get("left-arm-extremity")!.visible).toBe(false);
      expect(f.update(600).solved.has("left-arm")).toBe(true);
      expect(f.avatar.objects.get(id)!.visible).toBe(true);
    } finally {
      f.dispose();
    }
  });

  it("GF-140 labels filled limbs inferred and does not manufacture observed residuals", () => {
    const f = fixture();
    try {
      f.update(0);
      const { residuals } = f.update(100, new Set(["left-elbow"]));
      const residual = residuals.get("left-arm")!;
      expect(residual.provenance).toBe("inferred");
      expect(residual.middleMm).toBeUndefined();
      expect(
        f.avatar.objects.get(poseNodeId(limbTracks("left-arm").upper))!.userData.provenance,
      ).toBe("inferred");
    } finally {
      f.dispose();
    }
  });

  it("GF-141 re-arms adapter revisions when the live solver/project is replaced", () => {
    const f = fixture();
    let fresh: ReturnType<typeof createWorldRigSolver> | undefined;
    try {
      f.update(0);
      f.update(100);
      fresh = createWorldRigSolver(fakePorts());
      const run = pipeline(),
        points = pose();
      points["left-wrist"] = [350, -200, 100];
      const step = run.step(frameOf(points, 0, WORLD_SPACE));
      const solved = fresh.solve(step, run.lengths);
      f.avatar.update(step, solved, run.lengths, fresh.readPatch);
      const lower = f.avatar.objects.get(poseNodeId(limbTracks("left-arm").lower))!;
      expect(lower.position.distanceTo(new Vector3(...points["left-wrist"]))).toBeLessThan(1e-5);
    } finally {
      fresh?.dispose();
      f.dispose();
    }
  });

  it("GF-142 accepts only finite confident nondegenerate coarse hand/foot evidence", () => {
    for (const limb of LIMBS) {
      const left = limb.id.startsWith("left"),
        arm = limb.id.endsWith("arm");
      const ids = arm
        ? [left ? 15 : 16, left ? 19 : 20, left ? 17 : 18]
        : [left ? 27 : 28, left ? 31 : 32, left ? 29 : 30];
      const raw: RawLandmark[] = Array.from({ length: 33 }, () => [NaN, NaN, NaN, 0, NaN]);
      raw[ids[0]!] = [0, 0, 0, 1, NaN];
      raw[ids[1]!] = [0.1, 0, 0, 1, NaN];
      raw[ids[2]!] = [0, 0.1, 0, 1, NaN];
      expect(extremityOrientation(limb.id, raw, 0.5).kind).toBe("observed");
      raw[ids[2]!] = [0, 0.1, 0, 1, 0.1];
      expect(extremityOrientation(limb.id, raw, 0.5).kind).toBe("neutral");
      raw[ids[2]!] = [0.2, 0, 0, 1, 1];
      expect(extremityOrientation(limb.id, raw, 0.5).kind).toBe("neutral");
      expect(extremityOrientation(limb.id, undefined, 0.5).kind).toBe("neutral");
    }
  });

  it("GF-143 disposes owned geometry once and rejects post-disposal updates", () => {
    const f = fixture();
    const { step, solved } = f.update(0);
    f.avatar.dispose();
    f.avatar.dispose();
    expect(f.avatar.parent.children.length).toBe(0);
    expect(() => f.avatar.update(step, solved, f.run.lengths, f.solver.readPatch)).toThrow(
      /disposed/,
    );
    f.solver.dispose();
  });
});
