import { describe, expect, it } from "vitest";
import { createBoneLengthEstimator } from "../src/filler/bone-length";
import { createGapFiller } from "../src/filler/gap-filler";
import { LIMBS } from "../src/filler/landmarks";
import { createGapPipeline } from "../src/filler/pipeline";
import { WORLD_SPACE } from "../src/filler/space";
import { distance } from "../src/filler/vec";
import {
  imageRigProject,
  loadImageRig,
  loadWorldRig,
  readSolvedLimb,
  readWrittenLimbs,
  worldRigProject,
} from "../src/rig/rig";
import { createWorldRigSolver } from "../src/rig/solver";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import { createImageWriter, createWorldWriter } from "../src/rig/writer";
import { createAvatarScene } from "../src/view/avatar";
import { countingProject, fakePorts } from "./engine";
import { STANDING, frameOf, trustedOf, without } from "./frames";

describe("pose-gap-filler aggregate migration (AN-1 through AN-10)", () => {
  it("AN-1 image rig project mounts 5 aggregate tracks per limb without member-source tracks", () => {
    const project = imageRigProject();
    expect(project.motions).toHaveLength(1);
    const tracks = project.motions[0]!.tracks;
    expect(tracks).toHaveLength(20);
    const trackIds = new Set(tracks.map((track) => track.id));
    for (const limb of LIMBS) {
      const ids = limbTracks(limb.id);
      expect(trackIds.has(ids.root)).toBe(true);
      expect(trackIds.has(ids.body)).toBe(true);
      expect(trackIds.has(ids.goal)).toBe(true);
      expect(trackIds.has(ids.solve)).toBe(true);
      expect(trackIds.has(ids.pose)).toBe(true);
      expect(trackIds.has(`${ids.upper}-member`)).toBe(false);
      expect(trackIds.has(`${ids.lower}-member`)).toBe(false);
    }
  });

  it("AN-2 world rig project mounts 6 aggregate 3D tracks per limb with root-first body tables", () => {
    const project = worldRigProject();
    expect(project.motions).toHaveLength(1);
    const tracks = project.motions[0]!.tracks;
    expect(tracks).toHaveLength(24);
    for (const limb of LIMBS) {
      const ids = limbTracks(limb.id);
      const bodyTrack = tracks.find((track) => track.id === ids.body);
      expect(bodyTrack).toBeDefined();
      const rows = bodyTrack?.input?.values as readonly {
        readonly id: string;
        readonly cells: Readonly<Record<string, unknown>>;
      }[];
      expect(rows).toHaveLength(2);
      expect(rows[0]?.id).toBe(ids.upper);
      expect("parentId" in (rows[0]?.cells ?? {})).toBe(false);
      expect(rows[1]?.id).toBe(ids.lower);
      expect(rows[1]?.cells.parentId).toBe(ids.upper);
    }
  });

  it("AN-3 goal table tracks address every limb leaf with memberId", () => {
    const project = imageRigProject();
    const tracks = project.motions[0]!.tracks;
    for (const limb of LIMBS) {
      const ids = limbTracks(limb.id);
      const goalTrack = tracks.find((track) => track.id === ids.goal);
      const rows = goalTrack?.input?.values as readonly {
        readonly id: string;
        readonly cells: Readonly<Record<string, unknown>>;
      }[];
      expect(rows).toHaveLength(1);
      expect(rows[0]?.id).toBe(ids.goal);
      expect(rows[0]?.cells.memberId).toBe(ids.lower);
    }
  });

  it("AN-4 camera landmark update commits whole-table writes in a single value batch", () => {
    const loaded = loadImageRig(fakePorts());
    const { project, batches } = countingProject(loaded);
    const writer = createImageWriter(project);
    const estimator = createBoneLengthEstimator();
    const first = trustedOf(frameOf(STANDING, 0));
    estimator.observe(first);
    const outcome = writer.write(createGapFiller({ kind: "raw" }).fill(first), first, estimator);
    expect(batches()).toBe(1);
    for (const limb of LIMBS) {
      expect(outcome[limb.id]?.kind).toBe("written");
    }
    loaded.dispose();
  });

  it("AN-5 readSolvedLimb selects upper and lower rows by member ID regardless of table row order", () => {
    const handle = loadImageRig(fakePorts());
    const estimator = createBoneLengthEstimator();
    const first = trustedOf(frameOf(STANDING, 0));
    estimator.observe(first);
    createImageWriter(handle).write(createGapFiller({ kind: "raw" }).fill(first), first, estimator);
    const forward = readSolvedLimb(handle, "left-arm")!;
    expect(forward).toBeDefined();
    expect(distance(forward.tip, STANDING["left-wrist"])).toBeLessThan(1e-6);

    const ids = limbTracks("left-arm");
    const bodyPatch = handle.get(poseNodeId(ids.body))!;
    if (bodyPatch.status !== "ready" || !Array.isArray(bodyPatch.outputs.values))
      throw new Error("Expected ready body table");
    const rows = [...bodyPatch.outputs.values].reverse();
    handle.values((transaction) => {
      transaction.track(poseNodeId(ids.body)).input.values.set(rows);
    });
    const reversed = readSolvedLimb(handle, "left-arm")!;
    expect(distance(reversed.middle, forward.middle)).toBeLessThan(1e-6);
    expect(distance(reversed.tip, forward.tip)).toBeLessThan(1e-6);
    handle.dispose();
  });

  it("AN-6 skipped limb retains previous valid rows in project while readWrittenLimbs filters it", () => {
    const handle = loadImageRig(fakePorts());
    const writer = createImageWriter(handle);
    const estimator = createBoneLengthEstimator();
    const first = trustedOf(frameOf(STANDING, 0));
    estimator.observe(first);
    writer.write(createGapFiller({ kind: "raw" }).fill(first), first, estimator);
    const before = readSolvedLimb(handle, "left-arm");
    expect(before).toBeDefined();

    const dropped = trustedOf(frameOf(without(STANDING, "left-wrist"), 33));
    const writes = writer.write(createGapFiller({ kind: "raw" }).fill(dropped), dropped, estimator);
    expect(writes["left-arm"]).toEqual({ kind: "skipped", reason: "goal-lost" });
    expect(readSolvedLimb(handle, "left-arm")).toEqual(before);
    expect(readWrittenLimbs(handle, writes).has("left-arm")).toBe(false);
    handle.dispose();
  });

  it("AN-7 world-space 3D rig evaluates ik3d and fk3d aggregate tables", () => {
    const handle = loadWorldRig(fakePorts());
    const writer = createWorldWriter(handle);
    const estimator = createBoneLengthEstimator();
    const points = Object.fromEntries(
      Object.entries(STANDING).map(([key, value]) => [key, [...value, 25]]),
    );
    const first = trustedOf(frameOf(points, 0, WORLD_SPACE));
    estimator.observe(first);
    const outcome = writer.write(createGapFiller({ kind: "raw" }).fill(first), first, estimator);
    for (const limb of LIMBS) {
      expect(outcome[limb.id]?.kind).toBe("written");
      const solved = readSolvedLimb(handle, limb.id, ["x", "y", "z"]);
      expect(solved).toBeDefined();
      expect(distance(solved!.tip, points[limb.tip]!)).toBeLessThan(1e-5);
    }
    handle.dispose();
  });

  it("AN-8 avatar scene binds limb meshes directly to aggregate pose table rows", () => {
    const avatar = createAvatarScene();
    const solver = createWorldRigSolver(fakePorts());
    const pipeline = createGapPipeline({ filler: { kind: "raw" } });
    try {
      const points = Object.fromEntries(
        Object.entries(STANDING).map(([key, value]) => [key, [...value, 0]]),
      );
      const step = pipeline.step(frameOf(points, 0, WORLD_SPACE));
      const solved = solver.solve(step, pipeline.lengths);
      const residuals = avatar.update(step, solved, pipeline.lengths, solver.readPatch);
      expect(residuals.size).toBe(4);
      for (const limb of LIMBS) {
        const ids = limbTracks(limb.id);
        expect(avatar.objects.get(poseNodeId(ids.upper))?.visible).toBe(true);
        expect(avatar.objects.get(poseNodeId(ids.lower))?.visible).toBe(true);
      }
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });

  it("AN-9 clearing and re-updating avatar scene preserves aggregate pose synchronization", () => {
    const avatar = createAvatarScene();
    const solver = createWorldRigSolver(fakePorts());
    const pipeline = createGapPipeline({ filler: { kind: "raw" } });
    try {
      const points = Object.fromEntries(
        Object.entries(STANDING).map(([key, value]) => [key, [...value, 0]]),
      );
      const step = pipeline.step(frameOf(points, 0, WORLD_SPACE));
      const solved = solver.solve(step, pipeline.lengths);
      avatar.update(step, solved, pipeline.lengths, solver.readPatch);
      avatar.clear();
      for (const limb of LIMBS) {
        const ids = limbTracks(limb.id);
        expect(avatar.objects.get(poseNodeId(ids.upper))?.visible).toBe(false);
      }
      avatar.update(step, solved, pipeline.lengths, solver.readPatch);
      for (const limb of LIMBS) {
        const ids = limbTracks(limb.id);
        expect(avatar.objects.get(poseNodeId(ids.upper))?.visible).toBe(true);
      }
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });

  it("AN-10 replaying identical landmark frames through two independent rigs produces identical pose rows", () => {
    const run = () => {
      const solver = createWorldRigSolver(fakePorts());
      const pipeline = createGapPipeline({ filler: { kind: "raw" } });
      try {
        const points = Object.fromEntries(
          Object.entries(STANDING).map(([key, value]) => [key, [...value, 10]]),
        );
        const step = pipeline.step(frameOf(points, 0, WORLD_SPACE));
        return solver.solve(step, pipeline.lengths);
      } finally {
        solver.dispose();
      }
    };
    expect(run()).toEqual(run());
  });
});
