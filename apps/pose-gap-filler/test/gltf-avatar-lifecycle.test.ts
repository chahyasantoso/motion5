import { describe, expect, it } from "vitest";
import { Vector3 } from "three";
import { syntheticHumanoid } from "../../../packages/three/test/support/synthetic-skeleton";
import { createAvatarScene } from "../src/view/avatar";
import { createGapPipeline } from "../src/filler/pipeline";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { WORLD_SPACE } from "../src/filler/space";
import { LIMBS, jointRecord } from "../src/filler/landmarks";
import { scale } from "../src/filler/vec";
import { syntheticWorldPose } from "../src/replay/synthetic";
import { createWorldRigSolver } from "../src/rig/solver";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import { fakePorts } from "./engine";
import { frameOf } from "./frames";

const pipeline = () =>
  createGapPipeline({
    filler: { kind: "chain-kalman", noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
  });
const pose = (time = 400) =>
  jointRecord((joint) => scale(syntheticWorldPose({ kind: "exercise" }, time)[joint], 1000));
const bytes = () => new ArrayBuffer(0);

describe("GLB presentation isolation and ownership", () => {
  it("A3 aims all limbs parallel to the accepted solve through the real calibrated parent", async () => {
    const avatar = createAvatarScene(),
      run = pipeline(),
      solver = createWorldRigSolver(fakePorts());
    try {
      await avatar.loadAvatar(bytes(), async () => syntheticHumanoid());
      const step = run.step(frameOf(pose(), 0, WORLD_SPACE));
      avatar.update(step, solver.solve(step, run.lengths), run.lengths, solver.readPatch);
      const body = avatar.body;
      if (body.kind !== "gltf") throw new Error("Expected GLB body");
      for (const limb of LIMBS) {
        const side = limb.id.startsWith("left") ? "left" : "right";
        const member = limb.id.endsWith("arm") ? "arm" : "leg";
        const upper = body.avatar.binding.boneOf(`${side}-upper-${member}`);
        const lower = body.avatar.binding.boneOf(`${side}-lower-${member}`);
        const endpoint = body.avatar.binding.boneOf(
          `${side}-${member === "arm" ? "hand" : "foot"}`,
        );
        const ids = limbTracks(limb.id);
        for (const [bone, child, from, to] of [
          [upper, lower, ids.root, ids.upper],
          [lower, endpoint, ids.upper, ids.lower],
        ] as const) {
          const a = solver.readPatch!(poseNodeId(from)),
            b = solver.readPatch!(poseNodeId(to));
          if (a?.status !== "ready" || b?.status !== "ready")
            throw new Error("Expected source frames");
          const point = (values: Readonly<Record<string, unknown>>) =>
            new Vector3(Number(values.x), Number(values.y), Number(values.z));
          const expected = point(b.values)
            .sub(point(a.values))
            .transformDirection(avatar.parent.matrixWorld);
          const actual = child
            .getWorldPosition(new Vector3())
            .sub(bone.getWorldPosition(new Vector3()))
            .normalize();
          expect(actual.angleTo(expected)).toBeLessThan(1e-6);
        }
      }
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });

  it("A4 holds stale transforms, reacquires, and clear restores the exact rest pose", async () => {
    const avatar = createAvatarScene(),
      run = pipeline(),
      solver = createWorldRigSolver(fakePorts());
    try {
      await avatar.loadAvatar(bytes(), async () => syntheticHumanoid());
      const update = (time: number, missing = false) => {
        const step = run.step(frameOf(missing ? {} : pose(), time, WORLD_SPACE));
        return avatar.update(step, solver.solve(step, run.lengths), run.lengths, solver.readPatch);
      };
      update(0);
      const body = avatar.body;
      if (body.kind !== "gltf") throw new Error("Expected GLB body");
      const transforms = () =>
        body.avatar.binding.skeleton.bones.map((bone) => [
          bone.position.toArray(),
          bone.quaternion.toArray(),
        ]);
      const saved = transforms();
      update(501, true);
      expect(transforms()).toEqual(saved);
      expect(body.avatar.binding.boneOf("left-upper-arm").userData.freshness).toEqual({
        kind: "stale",
        lastCurrentMs: 0,
      });
      expect(body.avatar.scene.visible).toBe(true);
      update(600);
      expect(body.avatar.binding.boneOf("left-upper-arm").userData.freshness.kind).toBe("current");
      avatar.clear();
      expect(body.avatar.scene.visible).toBe(false);
      for (const captured of body.avatar.binding.bones) {
        const bone = body.avatar.binding.skeleton.bones[captured.index]!;
        expect(bone.position.equals(captured.restPosition)).toBe(true);
        expect(bone.quaternion.equals(captured.restQuaternion)).toBe(true);
      }
      update(1200, true);
      expect(body.avatar.scene.visible).toBe(false);
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });

  it("A5 toggling GLB cannot alter trust, filters, lengths, bends or residual metrics over 900 seeded frames", async () => {
    const avatar = createAvatarScene(),
      controlAvatar = createAvatarScene();
    const shown = pipeline(),
      control = pipeline();
    const a = createWorldRigSolver(fakePorts(), { diagnostics: true });
    const b = createWorldRigSolver(fakePorts(), { diagnostics: true });
    let state = 0x53410;
    try {
      for (let frame = 0; frame < 900; frame += 1) {
        if (frame % 150 === 0) {
          if (frame % 300 === 0) await avatar.loadAvatar(bytes(), async () => syntheticHumanoid());
          else avatar.usePrimitives();
        }
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        const input = frameOf(state % 29 === 0 ? {} : pose(frame * 33), frame * 33, WORLD_SPACE);
        const stepA = shown.step(input),
          stepB = control.step(input);
        const solvedA = a.solve(stepA, shown.lengths),
          solvedB = b.solve(stepB, control.lengths);
        const metricsA = avatar.update(stepA, solvedA, shown.lengths, a.readPatch);
        const metricsB = controlAvatar.update(stepB, solvedB, control.lengths, b.readPatch);
        expect(stepA).toEqual(stepB);
        expect(solvedA).toEqual(solvedB);
        expect(metricsA).toEqual(metricsB);
        expect(a.readDiagnostics!()).toEqual(b.readDiagnostics!());
        for (const limb of LIMBS)
          for (const bone of [limb.upper, limb.lower])
            expect(shown.lengths.length(bone)).toBe(control.lengths.length(bone));
      }
    } finally {
      avatar.dispose();
      controlAvatar.dispose();
      a.dispose();
      b.dispose();
    }
  });

  it("A6 newer requests win and late loads after disposal release resources exactly once", async () => {
    const avatar = createAvatarScene();
    const old = syntheticHumanoid(),
      latest = syntheticHumanoid();
    let resolve!: (value: typeof old) => void;
    let disposed = 0;
    old.mesh.geometry.addEventListener("dispose", () => {
      disposed += 1;
    });
    const pending = avatar.loadAvatar(
      bytes(),
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    await Promise.resolve();
    const current = await avatar.loadAvatar(bytes(), async () => latest);
    expect(current.kind).toBe("installed");
    resolve(old);
    expect((await pending).kind).toBe("discarded");
    expect(disposed).toBe(1);
    expect(latest.scene.parent).toBe(avatar.parent);
    const late = syntheticHumanoid();
    const pendingLate = avatar.loadAvatar(
      bytes(),
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    await Promise.resolve();
    avatar.dispose();
    resolve(late);
    expect((await pendingLate).kind).toBe("discarded");
    expect(late.scene.parent).toBe(null);
    avatar.dispose();
    expect(disposed).toBe(1);
  });
});
