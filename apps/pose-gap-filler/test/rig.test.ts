import { describe, expect, it } from "vitest";
import { createBoneLengthEstimator } from "../src/filler/bone-length";
import type { TrustedFrame } from "../src/filler/frame";
import { createGapFiller } from "../src/filler/gap-filler";
import { LIMBS } from "../src/filler/landmarks";
import { createGapPipeline } from "../src/filler/pipeline";
import { distance } from "../src/filler/vec";
import { loadImageRig, readSolvedLimb, readWrittenLimbs } from "../src/rig/rig";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import { createImageWriter, imageBendFlip } from "../src/rig/writer";
import { countingProject, fakePorts } from "./engine";
import { STANDING, frameOf, trustedOf, without } from "./frames";

describe("image rig and writer", () => {
  it("GF-6 pins the 2D bend side the writer derives to the side the solver bends", () => {
    const project = loadImageRig(fakePorts());
    const ids = limbTracks("left-arm");
    for (const flip of [false, true]) {
      project.values((transaction) => {
        transaction.setValues(poseNodeId(ids.root), { x: 100, y: 100 });
        transaction.setValues(poseNodeId(ids.goal), { x: 130, y: 250 });
        transaction.setValues(poseNodeId(ids.upper), { length: 90 });
        transaction.setValues(poseNodeId(ids.lower), { length: 80 });
        transaction.track(poseNodeId(ids.solve)).setKeyframe("ik", "flip", flip);
      });
      const solved = readSolvedLimb(project, "left-arm")!;
      expect(imageBendFlip([100, 100], [130, 250], solved.middle)).toBe(flip);
    }
    expect(imageBendFlip([0, 0], [0, 10], [0, 5])).toBeUndefined();
    project.dispose();
  });

  it("GF-7 solves every elbow and knee to the measured lengths, bend side and goal in one batch", () => {
    const loaded = loadImageRig(fakePorts());
    const { project, batches } = countingProject(loaded);
    const writer = createImageWriter(project);
    const pipeline = createGapPipeline({ filler: { kind: "raw" } });
    const { trusted, filled } = pipeline.step(frameOf(STANDING, 0));
    const writes = writer.write(filled, trusted, pipeline.lengths);
    expect(batches()).toBe(1);
    for (const limb of LIMBS) {
      expect(writes[limb.id]).toEqual({ kind: "written" });
      const solved = readSolvedLimb(loaded, limb.id)!;
      const root = STANDING[limb.root];
      const middle = STANDING[limb.middle];
      const tip = STANDING[limb.tip];
      expect(distance(solved.tip, tip)).toBeLessThan(1e-6);
      expect(distance(root, solved.middle)).toBeCloseTo(distance(root, middle), 6);
      expect(distance(solved.middle, solved.tip)).toBeCloseTo(distance(middle, tip), 6);
      // Measured lengths and a measured bend side reproduce the measured middle joint exactly.
      expect(distance(solved.middle, middle)).toBeLessThan(1e-6);
    }
    loaded.dispose();
  });

  it("GF-8 skips a limb it cannot place, holds its bend side, and writes lengths only on change", () => {
    const loaded = loadImageRig(fakePorts());
    const { project, batches } = countingProject(loaded);
    const writer = createImageWriter(project);
    const lengths = createBoneLengthEstimator();
    const first = trustedOf(frameOf(STANDING, 0));
    lengths.observe(first);
    expect(writer.write(fillOf(first), first, lengths)["left-arm"]).toEqual({ kind: "written" });
    const noWrist = trustedOf(frameOf(without(STANDING, "left-wrist"), 33));
    const outcome = writer.write(fillOf(noWrist), noWrist, lengths);
    expect(outcome["left-arm"]).toEqual({ kind: "skipped", reason: "goal-lost" });
    expect(outcome["right-arm"]).toEqual({ kind: "written" });
    const noHip = trustedOf(frameOf(without(STANDING, "left-hip"), 66));
    expect(writer.write(fillOf(noHip), noHip, lengths)["left-leg"]).toEqual({
      kind: "skipped",
      reason: "root-lost",
    });
    const unknown = createBoneLengthEstimator();
    for (const write of Object.values(writer.write(fillOf(first), first, unknown)))
      expect(write).toEqual({ kind: "skipped", reason: "length-unknown" });
    // Every frame that placed any limb cost exactly one batch; the all-skipped frame cost none.
    expect(batches()).toBe(3);
    // An elbow that is not trusted does not decide the bend: the measured side is held.
    const crossed = { ...STANDING, "left-elbow": [320, 210] };
    const untrusted = trustedOf(frameOf(crossed, 99), ["left-elbow"]);
    writer.write(fillOf(untrusted), untrusted, lengths);
    const held = readSolvedLimb(loaded, "left-arm")!;
    expect(distance(held.middle, STANDING["left-elbow"])).toBeLessThan(1e-6);
    // The same elbow once trusted moves the bend to its side.
    const measured = trustedOf(frameOf(crossed, 132));
    writer.write(fillOf(measured), measured, lengths);
    const moved = readSolvedLimb(loaded, "left-arm")!;
    expect(imageBendFlip(STANDING["left-shoulder"], STANDING["left-wrist"], moved.middle)).toBe(
      imageBendFlip(STANDING["left-shoulder"], STANDING["left-wrist"], crossed["left-elbow"]),
    );
    loaded.dispose();
  });

  it("GF-11 draws only the chains written this frame, never a skipped limb's stale solve", () => {
    const project = loadImageRig(fakePorts());
    const writer = createImageWriter(project);
    const lengths = createBoneLengthEstimator();
    const first = trustedOf(frameOf(STANDING, 0));
    lengths.observe(first);
    const all = readWrittenLimbs(project, writer.write(fillOf(first), first, lengths));
    expect([...all.keys()].sort()).toEqual(LIMBS.map((limb) => limb.id).sort());
    const noWrist = trustedOf(frameOf(without(STANDING, "left-wrist"), 33));
    const writes = writer.write(fillOf(noWrist), noWrist, lengths);
    // The project still holds the left arm's last solve; it is not this frame's pose.
    expect(readSolvedLimb(project, "left-arm")).toBeDefined();
    const current = readWrittenLimbs(project, writes);
    expect(current.has("left-arm")).toBe(false);
    expect(current.size).toBe(LIMBS.length - 1);
    project.dispose();
  });
});

function fillOf(frame: TrustedFrame) {
  return createGapFiller({ kind: "raw" }).fill(frame);
}
