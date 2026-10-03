import { describe, expect, it } from "vitest";
import { LANDMARKS, partnerIndex } from "../src/body/attachments";
import { DEFAULT_PROPORTIONS as BODY, DOFS, DOF_BY_ID } from "../src/body/skeleton";
import { hasPose, parsePoseResult, writePoseResult } from "../src/filler/adapter";
import { createGapPipeline } from "../src/filler/pipeline";
import { COMPARED_FILLERS } from "../src/replay/compare";
import { createIngestGate, type Admission } from "../src/live/ingest";
import { JOINTS, MEDIAPIPE_INDEX } from "../src/filler/landmarks";
import { IMAGE_SPACE, WORLD_SPACE } from "../src/filler/space";
import { distance } from "../src/filler/vec";
import { createSimulatorSource } from "../src/live/sources";
import { SIMULATOR_FPS } from "../src/synthetic/simulator";
import type { SourceSample } from "../src/live/source";
import { actorFrame, actorPose, hipMidpoint, standingRoot } from "../src/synthetic/actor";
import { createCamera, defaultCameraSpec, orbitCameraSpec } from "../src/synthetic/camera";
import { HANDLES, REACHED_M, dragHandle } from "../src/synthetic/handles";
import { EDIT_ORDER, observe, rawPoses, type ObservationEdit } from "../src/synthetic/observation";
import { SCENARIOS, SCENARIO_IDS, scenarioLoss, scenarioPose } from "../src/synthetic/scenarios";
import { describeHandle, editOf, landmarkInfo } from "../src/synthetic/inspect";
import { pickHandle } from "../src/view/pose-drag";
import { projector } from "../src/view/scene-view";
import { createSimulator, reportResult, type SimulatorState } from "../src/synthetic/simulator";
import type { Vec3 } from "../src/synthetic/rotation";
import { manualFrames } from "./frame-ports";

const STAGE = { width: 640, height: 480 } as const;
const at = (name: string) => LANDMARKS.findIndex((landmark) => landmark.name === name);
const near = (actual: readonly number[], expected: readonly number[], digits = 9) =>
  expected.forEach((value, axis) => expect(actual[axis]).toBeCloseTo(value, digits));
const standing = () => actorFrame(actorPose());
const defaultCamera = () => createCamera(defaultCameraSpec(STAGE, hipMidpoint(standing())));

/** A seeded uniform generator, so the random poses are the same every run. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}
const randomPose = (random: () => number) =>
  actorPose(
    Object.fromEntries(DOFS.map((dof) => [dof.id, dof.min + (dof.max - dof.min) * random()])),
    [random() - 0.5, 0.8 + random() * 0.4, random() - 0.5],
  );

const LIMB_BONES: ReadonlyArray<readonly [string, string, number]> = (
  ["left", "right"] as const
).flatMap((side) => [
  [`${side}-shoulder`, `${side}-elbow`, BODY.upperArm] as const,
  [`${side}-elbow`, `${side}-wrist`, BODY.forearm] as const,
  [`${side}-hip`, `${side}-knee`, BODY.thigh] as const,
  [`${side}-knee`, `${side}-ankle`, BODY.shin] as const,
]);

describe("synthetic human, the truth actor", () => {
  it("GF-92 forward kinematics keeps every bone's length and bends the way anatomy does", () => {
    const frame = standing();
    // Standing: feet flat on the floor, the pelvis at leg height, the left side at +x.
    expect(frame.landmarks[at("left-foot-index")]![1]).toBeCloseTo(0, 12);
    expect(frame.landmarks[at("left-ankle")]![1]).toBeCloseTo(BODY.ankleHeight, 12);
    near(hipMidpoint(frame), standingRoot());
    expect(frame.landmarks[at("left-shoulder")]![0]).toBeCloseTo(BODY.shoulderWidth / 2, 12);
    expect(frame.landmarks[at("right-hip")]![0]).toBeCloseTo(-BODY.hipWidth / 2, 12);
    // Independent fixtures: flexion raises forward (+z), abduction outward, the knee bends back.
    const shoulder = frame.landmarks[at("left-shoulder")]!;
    const forward = actorFrame(actorPose({ "left-shoulder-flex": 90 }));
    near(forward.landmarks[at("left-elbow")]!, [shoulder[0], shoulder[1], BODY.upperArm]);
    const out = actorFrame(actorPose({ "right-shoulder-abduct": 90 }));
    const right = out.landmarks[at("right-shoulder")]!;
    near(out.landmarks[at("right-elbow")]!, [right[0] - BODY.upperArm, right[1], 0]);
    const knee = actorFrame(actorPose({ "left-knee-flex": 90 }));
    const kneePoint = knee.landmarks[at("left-knee")]!;
    near(knee.landmarks[at("left-ankle")]!, [kneePoint[0], kneePoint[1], -BODY.shin]);
    const turned = actorFrame(actorPose({ "root-yaw": 180 }));
    expect(turned.landmarks[at("left-shoulder")]![0]).toBeCloseTo(-BODY.shoulderWidth / 2, 12);
    // Any legal pose keeps the twelve limb joints at the legacy subject's bone lengths.
    const random = seeded(92);
    for (let sample = 0; sample < 50; sample += 1) {
      const posed = actorFrame(randomPose(random));
      for (const [from, to, length] of LIMB_BONES)
        expect(distance(posed.landmarks[at(from)]!, posed.landmarks[at(to)]!)).toBeCloseTo(
          length,
          9,
        );
    }
    // The truth is frozen, and a pose holds every angle to its range and refuses unknown ones.
    expect(Object.isFrozen(frame.landmarks) && Object.isFrozen(frame.landmarks[0])).toBe(true);
    expect(actorPose({ "left-elbow-flex": 400 }).angles["left-elbow-flex"]).toBe(150);
    expect(() => actorPose({ "left-elbow-bend": 10 })).toThrow(/Unknown degree of freedom/);
    expect(() => actorPose({}, [0, Number.NaN, 0])).toThrow(/finite/);
  });

  it("GF-93 attaches the 33 landmarks in MediaPipe's order, joints at joint centres", () => {
    expect(LANDMARKS.map((landmark) => landmark.index)).toEqual([...Array(33).keys()]);
    for (const joint of JOINTS) {
      const landmark = LANDMARKS[MEDIAPIPE_INDEX[joint]]!;
      expect(landmark.name).toBe(joint);
      expect(landmark.attachment.kind).toBe("joint");
    }
    const jointCount = LANDMARKS.filter((landmark) => landmark.attachment.kind === "joint").length;
    expect(jointCount).toBe(JOINTS.length);
    // A swap exchanges anatomical partners, is its own inverse, and leaves the nose alone.
    expect(partnerIndex(at("nose"))).toBeUndefined();
    expect(partnerIndex(at("left-wrist"))).toBe(at("right-wrist"));
    expect(partnerIndex(at("mouth-right"))).toBe(at("mouth-left"));
    for (let index = 1; index < 33; index += 1)
      expect(partnerIndex(partnerIndex(index)!)).toBe(index);
  });
});

describe("synthetic human, camera and observation", () => {
  it("GF-94 projects through a pinhole in MediaPipe's camera axes and unprojects back", () => {
    const camera = defaultCamera();
    near(camera.right, [1, 0, 0]);
    near(camera.down, [0, -1, 0]);
    near(camera.forward, [0, 0, -1]);
    const frame = standing();
    // A camera-facing actor's left is on the image's right, and the whole body is in frame.
    const left = camera.pixel(camera.toCamera(frame.landmarks[at("left-wrist")]!))!;
    const right = camera.pixel(camera.toCamera(frame.landmarks[at("right-wrist")]!))!;
    expect(left[0]).toBeGreaterThan(right[0]);
    for (const point of frame.landmarks) {
      const [u, v] = camera.pixel(camera.toCamera(point))!;
      expect(u > 0 && u < STAGE.width && v > 0 && v < STAGE.height).toBe(true);
    }
    // Round trip: the scene point seen at a pixel and depth is the point that was projected.
    const random = seeded(94);
    const orbit = createCamera(orbitCameraSpec(hipMidpoint(frame), 40, 25, 3, STAGE));
    for (let sample = 0; sample < 20; sample += 1) {
      const point: Vec3 = [random() - 0.5, random() * 1.8, random() - 0.5];
      const inCamera = orbit.toCamera(point);
      const [u, v] = orbit.pixel(inCamera)!;
      near(orbit.unproject(u, v, inCamera[2]), point);
    }
    expect(camera.pixel([0, 0, -1])).toBeUndefined();
    const above = { ...camera.spec, position: [0, 3, 0] as Vec3, target: [0, 0, 0] as Vec3 };
    expect(() => createCamera(above)).toThrow(/straight up or down/);
  });

  it("GF-95 observes hip-centred world landmarks of the truth's shape, read by the adapter", () => {
    const frame = actorFrame(scenarioPose("squat", 700));
    const camera = defaultCamera();
    const observed = observe(frame, camera);
    const hips = observed[at("left-hip")]!.world!.map(
      (value, axis) => (value + observed[at("right-hip")]!.world![axis]!) / 2,
    );
    near(hips, [0, 0, 0]);
    // World is a rigid change of axes: every distance between landmarks is the truth's distance.
    for (const [a, b] of [
      [11, 27],
      [15, 24],
      [0, 32],
    ] as const)
      expect(distance(observed[a]!.world!, observed[b]!.world!)).toBeCloseTo(
        distance(frame.landmarks[a]!, frame.landmarks[b]!),
        9,
      );
    // Up in the scene is -y in MediaPipe's world, as it is in its image.
    expect(observed[at("nose")]!.world![1]).toBeLessThan(0);
    const { image, world } = rawPoses(observed);
    const result = writePoseResult(image, world);
    const inImage = parsePoseResult(result, 0, IMAGE_SPACE, STAGE);
    const inWorld = parsePoseResult(result, 0, WORLD_SPACE, STAGE);
    for (const joint of JOINTS) {
      const pixel = camera.pixel(camera.toCamera(frame.landmarks[MEDIAPIPE_INDEX[joint]]!))!;
      const imageJoint = inImage.joints[joint];
      const worldJoint = inWorld.joints[joint];
      if (imageJoint.kind !== "measured" || worldJoint.kind !== "measured")
        throw new Error(`${joint} was not measured`);
      near(imageJoint.position.slice(0, 2), pixel, 6);
      near(
        worldJoint.position,
        observed[MEDIAPIPE_INDEX[joint]]!.world!.map((m) => m * 1000),
        6,
      );
    }
  });

  it("GF-96 edits change only what the detector reports, in one order, never the truth", () => {
    const frame = standing();
    const before = JSON.stringify(frame);
    const camera = defaultCamera();
    const wrist = at("left-wrist");
    const partner = at("right-wrist");
    const clean = observe(frame, camera);
    const displace: ObservationEdit = { kind: "displace", landmark: wrist, delta: [0.1, 0, 0] };
    const swap: ObservationEdit = { kind: "swap", landmark: wrist };
    const score: ObservationEdit = {
      kind: "score",
      landmark: wrist,
      visibility: 0.1,
      presence: 0.2,
    };
    const drop: ObservationEdit = { kind: "drop", landmark: at("left-knee") };
    const edited = observe(frame, camera, { edits: [drop, score, swap, displace] });
    expect(EDIT_ORDER).toEqual(["displace", "swap", "score", "drop"]);
    // Displaced, then swapped: the right wrist slot reports the left wrist moved 10 cm outward.
    near(edited[partner]!.scene!, [
      frame.landmarks[wrist]![0] + 0.1,
      ...frame.landmarks[wrist]!.slice(1),
    ]);
    near(edited[partner]!.world!, [
      clean[wrist]!.world![0] + 0.1,
      ...clean[wrist]!.world!.slice(1),
    ]);
    near(edited[wrist]!.image!, clean[partner]!.image!);
    // The score lands on the slot named, after the swap; a drop removes both positions.
    expect([edited[wrist]!.visibility, edited[wrist]!.presence]).toEqual([0.1, 0.2]);
    expect(edited[at("left-knee")]!.image).toBeUndefined();
    expect(edited[at("left-knee")]!.world).toBeUndefined();
    const reordered = observe(frame, camera, { edits: [displace, swap, score, drop] });
    expect(reordered).toEqual(edited);
    expect(JSON.stringify(frame)).toBe(before);
    // A dropped landmark reaches the pipeline as MediaPipe's missing landmark, absent.
    const { image, world } = rawPoses(edited);
    expect(
      parsePoseResult(writePoseResult(image, world), 0, IMAGE_SPACE, STAGE).joints["left-knee"],
    ).toEqual({ kind: "absent" });
    expect(() => observe(frame, camera, { edits: [{ kind: "swap", landmark: 40 }] })).toThrow(/40/);
  });
});

describe("synthetic human, motion and handles", () => {
  it("GF-97 scenarios are deterministic, periodic, legal and loop without a seam", () => {
    for (const id of SCENARIO_IDS) {
      const { periodMs } = SCENARIOS[id];
      for (const tMs of [0, 133, periodMs / 3, periodMs * 0.77]) {
        expect(scenarioPose(id, tMs)).toEqual(scenarioPose(id, tMs));
        const later = scenarioPose(id, tMs + 3 * periodMs);
        for (const dof of DOFS)
          expect(later.angles[dof.id]).toBeCloseTo(scenarioPose(id, tMs).angles[dof.id]!, 9);
      }
      // No angle jumps between consecutive 30 fps frames, across the loop's end included.
      let previous = scenarioPose(id, -1000 / SIMULATOR_FPS);
      for (let frame = 0; frame <= (periodMs * SIMULATOR_FPS) / 1000; frame += 1) {
        const pose = scenarioPose(id, (frame * 1000) / SIMULATOR_FPS);
        for (const dof of DOFS) {
          expect(pose.angles[dof.id]!).toBeGreaterThanOrEqual(dof.min);
          expect(pose.angles[dof.id]!).toBeLessThanOrEqual(dof.max);
          expect(Math.abs(pose.angles[dof.id]! - previous.angles[dof.id]!)).toBeLessThan(25);
        }
        expect(distance(pose.root, previous.root)).toBeLessThan(0.1);
        previous = pose;
      }
    }
    // The occlusion scenario puts the left wrist on the lower back: behind the torso, near its
    // midline, between the hips and the shoulders.
    const peak = actorFrame(
      scenarioPose("wrist-behind-torso", SCENARIOS["wrist-behind-torso"].periodMs / 2),
    );
    const torso = peak.segments.torso.origin;
    const wrist = peak.landmarks[at("left-wrist")]!;
    expect(wrist[2]).toBeLessThan(torso[2] - 0.12);
    expect(Math.abs(wrist[0] - torso[0])).toBeLessThan(0.05);
    expect(wrist[1] > torso[1] && wrist[1] < torso[1] + BODY.hipToShoulder).toBe(true);
  });

  it("GF-98 a handle drag reaches what it can, clamps what it cannot, never stretches", () => {
    const pose = actorPose();
    const random = seeded(98);
    for (const handle of Object.keys(HANDLES) as (keyof typeof HANDLES)[]) {
      const chain = HANDLES[handle];
      const [upper, lower] = chain.lengths(BODY);
      const root = actorFrame(pose).segments[chain.root].origin;
      const [outer, inner, hinge] = [...chain.swing, chain.hinge].map((id) => DOF_BY_ID.get(id)!);
      // Every target a legal pose of this limb puts its effector at is reached: a grid over both
      // swing ranges, ends included, at three bends.
      for (let i = 0; i <= 3; i += 1)
        for (let j = 0; j <= 3; j += 1)
          for (const bend of [10, 45, 90]) {
            const goal = actorFrame(
              actorPose({
                [outer!.id]: outer!.min + ((outer!.max - outer!.min) * i) / 3,
                [inner!.id]: inner!.min + ((inner!.max - inner!.min) * j) / 3,
                [hinge!.id]: bend,
              }),
            ).segments[chain.effector].origin;
            expect(dragHandle(pose, handle, goal).kind).toBe("reached");
          }
      const goal = actorFrame(
        actorPose({ [outer!.id]: 20 + 40 * random(), [inner!.id]: 15, [hinge!.id]: 40 }),
      ).segments[chain.effector].origin;
      const reached = dragHandle(pose, handle, goal);
      expect(reached.kind).toBe("reached");
      expect(reached.errorM).toBeLessThanOrEqual(REACHED_M);
      const after = actorFrame(reached.pose);
      expect(distance(after.segments[chain.effector].origin, goal)).toBeLessThanOrEqual(REACHED_M);
      // Only this limb's swing and hinge moved; everything else is the pose it started from.
      const moved = DOFS.filter((dof) => reached.pose.angles[dof.id] !== pose.angles[dof.id]);
      for (const dof of moved) expect([...chain.swing, chain.hinge]).toContain(dof.id);
      expect(dragHandle(pose, handle, goal)).toEqual(reached);
      // Twice the reach away: clamped, at full length, every bone its own length.
      const far: Vec3 = [root[0], root[1] - 2 * (upper + lower), root[2] + 0.2];
      const clamped = dragHandle(pose, handle, far);
      expect(clamped.kind === "clamped" && clamped.reason).toBe("out-of-reach");
      const stretched = actorFrame(clamped.pose);
      expect(
        distance(stretched.segments[chain.root].origin, stretched.segments[chain.effector].origin),
      ).toBeLessThanOrEqual(upper + lower + 1e-9);
      for (const [from, to, length] of LIMB_BONES)
        expect(distance(stretched.landmarks[at(from)]!, stretched.landmarks[at(to)]!)).toBeCloseTo(
          length,
          9,
        );
      for (const id of [...chain.swing, chain.hinge]) {
        const dof = DOF_BY_ID.get(id)!;
        expect(clamped.pose.angles[id]! >= dof.min && clamped.pose.angles[id]! <= dof.max).toBe(
          true,
        );
      }
    }
    // A target inside the reach that the elbow's range forbids is a joint limit, not out of reach.
    const shoulder = actorFrame(pose).segments["left-upper-arm"].origin;
    const behindShoulder: Vec3 = [shoulder[0], shoulder[1], shoulder[2] + 0.01];
    const limited = dragHandle(pose, "left-hand", behindShoulder);
    expect(limited.kind === "clamped" && limited.reason).toBe("joint-limit");
  });

  it("GF-99 a simulator frame is pure in state and time, paced as a 30 fps source", async () => {
    const hips = hipMidpoint(standing());
    const state: SimulatorState = {
      drive: { kind: "scenario", scenario: "arm-reversal" },
      camera: defaultCameraSpec(STAGE, hips),
      edits: [],
    };
    const one = createSimulator(state);
    const two = createSimulator(state);
    expect(one.frame(500).report).toEqual(two.frame(500).report);
    expect(one.frame(500).report).toEqual(one.frame(500).report);
    expect(one.last?.tMs).toBe(500);
    // An edit of the same kind on the same landmark replaces the earlier one.
    one.edit({ kind: "displace", landmark: 15, delta: [0.1, 0, 0] });
    one.edit({ kind: "displace", landmark: 15, delta: [0.2, 0, 0] });
    one.edit({ kind: "drop", landmark: 15 });
    expect(one.state.edits).toHaveLength(2);
    one.clearEdits();
    expect(one.frame(500).report).toEqual(two.frame(500).report);
    // A manual drive holds still whatever the time.
    one.drive({ kind: "manual", pose: one.poseAt(800) });
    expect(one.frame(0).report).toEqual(one.frame(5000).report);
    // As a source: frame k is measured at k / 30 s and enters through MediaPipe's shape.
    const frames = manualFrames();
    const source = createSimulatorSource(two, frames.ports);
    const samples: SourceSample[] = [];
    void source.start((sample) => samples.push(sample));
    for (let step = 0; step < 4; step += 1) {
      frames.advance(1000 / SIMULATOR_FPS);
      frames.frame();
    }
    source.stop();
    expect(samples.length).toBeGreaterThan(1);
    samples.forEach((sample, index) => {
      expect(sample.tMs).toBeCloseTo((index * 1000) / SIMULATOR_FPS, 9);
      expect(sample.result).toEqual(reportResult(two.frame(sample.tMs).report));
    });
  });
});

describe("synthetic human, scripted losses and the page's helpers", () => {
  const simulatorFor = (scenario: keyof typeof SCENARIOS) =>
    createSimulator({
      drive: { kind: "scenario", scenario },
      camera: defaultCameraSpec(STAGE, hipMidpoint(standing())),
      edits: [],
    });
  const timeAt = (scenario: keyof typeof SCENARIOS, phase: number) =>
    SCENARIOS[scenario].periodMs * phase;

  it("GF-100 scripted losses drop joints together, lose the pose, reacquire after 2 s", () => {
    const missing = simulatorFor("missing-joints");
    const lost = ["left-elbow", "left-wrist", "right-knee"] as const;
    const during = parsePoseResult(
      reportResult(missing.frame(timeAt("missing-joints", 0.45)).report),
      0,
      IMAGE_SPACE,
      STAGE,
    );
    for (const joint of JOINTS)
      expect(during.joints[joint].kind).toBe(
        (lost as readonly string[]).includes(joint) ? "absent" : "measured",
      );
    // The script drops what the detector reports, never the person's own edits list.
    expect(missing.state.edits).toEqual([]);
    const after = parsePoseResult(
      reportResult(missing.frame(timeAt("missing-joints", 0.7)).report),
      0,
      IMAGE_SPACE,
      STAGE,
    );
    for (const joint of JOINTS) expect(after.joints[joint].kind).toBe("measured");
    // A whole-pose loss is MediaPipe's empty result; the truth keeps moving through it.
    const short = simulatorFor("full-loss").frame(timeAt("full-loss", 0.5));
    expect(short.report).toEqual({ kind: "none" });
    expect(hasPose(reportResult(short.report))).toBe(false);
    expect(short.truth.pose).toEqual(scenarioPose("full-loss", timeAt("full-loss", 0.5)));
    expect(scenarioLoss("standing", 1234)).toEqual({ kind: "none" });
    // Through the ingest gate at 30 fps: a 0.8 s loss continues the subject, a 2.5 s loss is
    // reacquired as a new one exactly once, and nothing else restarts it.
    const restarts = (scenario: keyof typeof SCENARIOS) => {
      const simulator = simulatorFor(scenario);
      const gate = createIngestGate();
      const kinds: string[] = [];
      const frames = (SCENARIOS[scenario].periodMs * SIMULATOR_FPS) / 1000;
      for (let k = 0; k < frames; k += 1) {
        const tMs = (k * 1000) / SIMULATOR_FPS;
        const result = reportResult(simulator.frame(tMs).report);
        const admission: Admission = gate.admit(
          { result, tMs, detectMs: 0, session: 1, sequence: k },
          hasPose(result),
        );
        if (admission.kind === "restart") kinds.push(admission.reason);
      }
      return kinds;
    };
    expect(restarts("full-loss")).toEqual(["new-session"]);
    expect(restarts("reacquisition")).toEqual(["new-session", "reacquired"]);
    // A manual pose is never lost by a script.
    const manual = simulatorFor("full-loss");
    manual.drive({ kind: "manual", pose: manual.poseAt(timeAt("full-loss", 0.5)) });
    expect(manual.frame(timeAt("full-loss", 0.5)).report.kind).toBe("pose");
  });

  it("GF-101 panel helpers: form edits, handle picks, info, and an inert estimate", () => {
    const wrist = at("left-wrist");
    const form = { landmark: wrist, deltaCm: [10, -5, 0] as Vec3, visibility: 3, presence: -1 };
    expect(editOf({ ...form, kind: "displace" })).toEqual({
      kind: "displace",
      landmark: wrist,
      delta: [0.1, -0.05, 0],
    });
    expect(editOf({ ...form, kind: "score" })).toEqual({
      kind: "score",
      landmark: wrist,
      visibility: 1,
      presence: 0,
    });
    expect(editOf({ ...form, kind: "swap" })).toEqual({ kind: "swap", landmark: wrist });
    expect(editOf({ ...form, kind: "drop" })).toEqual({ kind: "drop", landmark: wrist });
    expect(() => editOf({ ...form, kind: "drop", landmark: 33 })).toThrow(/33/);
    expect(() => editOf({ ...form, kind: "displace", deltaCm: [Number.NaN, 0, 0] })).toThrow(
      /finite/,
    );
    // Handles are picked where they are drawn, nearest first, and only within the radius.
    const frame = standing();
    const camera = defaultCamera();
    const project = projector(camera);
    const [u, v] = project(frame.segments["left-hand"].origin)!;
    expect(pickHandle(frame, project, [u! + 3, v!])).toBe("left-hand");
    expect(pickHandle(frame, project, [u! + 40, v! - 200])).toBeUndefined();
    expect(describeHandle(dragHandle(actorPose(), "left-hand", [5, 5, 5]))).toMatch(
      /clamped, out-of-reach .* no bone stretched/,
    );
    // The info panel labels surface landmarks as approximations and a lost pose as lost.
    const simulator = simulatorFor("full-loss");
    const seen = simulator.frame(0);
    expect(landmarkInfo(seen, at("left-index"))[0]).toMatch(/synthetic approximation/);
    expect(landmarkInfo(seen, wrist)[0]).toMatch(/joint centre of left-hand/);
    expect(landmarkInfo(seen, wrist).join("\n")).toMatch(/visibility 0\.99/);
    const gone = simulator.frame(timeAt("full-loss", 0.5));
    expect(landmarkInfo(gone, wrist).at(-1)).toMatch(/no pose/);
    // Running the estimate on every frame changes nothing the simulator measures.
    const watched = simulatorFor("arm-reversal");
    const control = simulatorFor("arm-reversal");
    const pipeline = createGapPipeline({ filler: COMPARED_FILLERS.at(-1)! });
    for (let k = 0; k < 60; k += 1) {
      const tMs = (k * 1000) / SIMULATOR_FPS;
      const result = reportResult(watched.frame(tMs).report);
      pipeline.step(parsePoseResult(result, tMs, WORLD_SPACE, STAGE));
      expect(result).toEqual(reportResult(control.frame(tMs).report));
    }
  });
});
