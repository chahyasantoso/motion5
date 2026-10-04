import { describe, expect, it } from "vitest";
import { LANDMARKS } from "../src/body/attachments";
import { parsePoseResult } from "../src/filler/adapter";
import { createGapDetector, NO_FORCED } from "../src/filler/gap-detector";
import { LANDMARK_SPACES } from "../src/filler/space";
import {
  actorFrame,
  actorPose,
  hipMidpoint,
  standingRoot,
  type ActorFrame,
} from "../src/synthetic/actor";
import {
  createCamera,
  defaultCameraSpec,
  orbitCameraSpec,
  type Camera,
} from "../src/synthetic/camera";
import {
  bodyOccluders,
  classifyVisibility,
  PROPS,
  type Occluder,
} from "../src/synthetic/occlusion";
import {
  GEOMETRIC_SCORES,
  IDEAL_SCORES,
  observe,
  rawPoses,
  SCORE_PROFILE,
} from "../src/synthetic/observation";
import { scenarioPose, SCENARIOS } from "../src/synthetic/scenarios";
import { reportResult } from "../src/synthetic/simulator";
import { add3, scale3, sub3, type Vec3 } from "../src/synthetic/rotation";

const STAGE = { width: 640, height: 480 };
const index = (name: string) => LANDMARKS.findIndex((landmark) => landmark.name === name);
const standing = actorFrame(actorPose());
const front = createCamera(defaultCameraSpec(STAGE, hipMidpoint(standing)));
const orbit = (truth: ActorFrame, yaw: number) =>
  createCamera(orbitCameraSpec(hipMidpoint(truth), yaw, 0, 2.6, STAGE));
const visibility = (truth: ActorFrame, camera: Camera, props: readonly Occluder[] = []) =>
  classifyVisibility(truth, camera, [...bodyOccluders(truth), ...props]);
const sphere = (id: string, centre: Vec3, radius: number): Occluder => ({
  kind: "capsule",
  id,
  a: centre,
  b: centre,
  radius,
  attached: new Set(),
});
const backWrist = () =>
  actorFrame(scenarioPose("wrist-behind-torso", SCENARIOS["wrist-behind-torso"].periodMs / 2));

describe("#540 geometric visibility", () => {
  it("GF-102 hides an in-frame lower-back wrist from the front, not from behind or in front", () => {
    const truth = backWrist();
    expect(visibility(truth, orbit(truth, 0))[index("left-wrist")]).toMatchObject({
      kind: "occluded",
    });
    expect(visibility(truth, orbit(truth, 180))[index("left-wrist")]).toEqual({ kind: "visible" });
    const forward = actorFrame(actorPose({ "left-shoulder-flex": 90 }));
    expect(visibility(forward, orbit(forward, 0))[index("left-wrist")]).toEqual({
      kind: "visible",
    });
    const point = orbit(truth, 0).pixel(
      orbit(truth, 0).toCamera(truth.landmarks[index("left-wrist")]!),
    )!;
    expect(point[0]).toBeGreaterThan(0);
    expect(point[0]).toBeLessThan(STAGE.width);
    expect(point[1]).toBeGreaterThan(0);
    expect(point[1]).toBeLessThan(STAGE.height);
  });

  it("GF-103 hides the face with the head when viewed from behind and changes the far ear on a head turn", () => {
    const rear = visibility(
      standing,
      createCamera(orbitCameraSpec(standing.landmarks[0]!, 180, 0, 2.6, STAGE)),
    );
    for (const name of ["nose", "left-eye", "right-eye", "mouth-left", "mouth-right"])
      expect(rear[index(name)]).toEqual({ kind: "occluded", occluderId: "head" });
    for (const [angle, hidden, shown] of [
      [-70, "right-ear", "left-ear"],
      [70, "left-ear", "right-ear"],
    ] as const) {
      const truth = actorFrame(actorPose({ "neck-twist": angle }));
      const seen = visibility(truth, orbit(truth, 0));
      expect(seen[index(hidden)]).toEqual({ kind: "occluded", occluderId: "head" });
      expect(seen[index(shown)]).toEqual({ kind: "visible" });
    }
  });

  it("GF-104 lets body parts and props hide other landmarks, never their attached joints", () => {
    const truth = actorFrame(
      actorPose({
        "left-shoulder-flex": 90,
        "right-shoulder-flex": 90,
        "left-elbow-flex": 90,
        "right-elbow-flex": 90,
      }),
    );
    const rear = visibility(truth, orbit(truth, 180));
    expect(rear[index("left-elbow")]).toMatchObject({ kind: "occluded" });
    expect(rear[index("right-elbow")]).toMatchObject({ kind: "occluded" });
    for (const part of bodyOccluders(truth)) {
      const classified = classifyVisibility(truth, orbit(truth, 0), [part]);
      for (const joint of part.attached) expect(classified[joint]).toEqual({ kind: "visible" });
    }
    const table = visibility(standing, front, PROPS.table);
    for (const name of ["left-knee", "right-knee", "left-ankle", "right-ankle"])
      expect(table[index(name)]).toEqual({ kind: "occluded", occluderId: "table" });
    expect(table[index("nose")]).toEqual({ kind: "visible" });
    expect(visibility(standing, front, PROPS.pillar)[index("left-wrist")]).toEqual({
      kind: "occluded",
      occluderId: "pillar",
    });
  });

  it("GF-105 prioritises behind-camera then out-of-frame over blockers and responds to camera orbit", () => {
    const behind = actorFrame(actorPose({}, [0, standingRoot()[1], 5]));
    expect(new Set(visibility(behind, front, PROPS.table).map((state) => state.kind))).toEqual(
      new Set(["behind-camera"]),
    );
    const outside = actorFrame(actorPose({}, [2.4, standingRoot()[1], 0]));
    expect(new Set(visibility(outside, front, PROPS.table).map((state) => state.kind))).toEqual(
      new Set(["out-of-frame"]),
    );
    expect(visibility(standing, orbit(standing, 0))[0]).toEqual({ kind: "visible" });
    expect(visibility(standing, orbit(standing, 180))[0]).toEqual({
      kind: "occluded",
      occluderId: "head",
    });
  });

  it("GF-106 selects actual first capsule contact, independent of centre order and enumeration", () => {
    const nose = standing.landmarks[0]!;
    const ray = sub3(nose, front.spec.position);
    const at = (fraction: number) => add3(front.spec.position, scale3(ray, fraction));
    const small = sphere("small", at(0.4), 0.01);
    const large = sphere("large", at(0.408), 0.04);
    for (const parts of [
      [small, large],
      [large, small],
    ])
      expect(classifyVisibility(standing, front, parts)[0]).toEqual({
        kind: "occluded",
        occluderId: "large",
      });
    expect(classifyVisibility(standing, front, [sphere("past-target", at(1.1), 0.01)])[0]).toEqual({
      kind: "visible",
    });
    expect(
      classifyVisibility(standing, front, [sphere("camera-inside", front.spec.position, 0.1)])[0],
    ).toEqual({ kind: "occluded", occluderId: "camera-inside" });
  });

  it("GF-107 intersects capsule cylinders, parallel end caps, tangent spheres and box slabs", () => {
    const nose = standing.landmarks[0]!;
    const eye = front.spec.position;
    const ray = sub3(nose, eye);
    const mid = add3(eye, scale3(ray, 0.5));
    const blockers: Occluder[] = [
      {
        kind: "capsule",
        id: "cylinder",
        a: add3(mid, [0, -0.5, 0]),
        b: add3(mid, [0, 0.5, 0]),
        radius: 0.02,
        attached: new Set(),
      },
      {
        kind: "capsule",
        id: "parallel",
        a: add3(eye, scale3(ray, 0.4)),
        b: add3(eye, scale3(ray, 0.6)),
        radius: 0.02,
        attached: new Set(),
      },
      sphere("tangent", add3(mid, [0.1, 0, 0]), 0.1),
      { kind: "box", id: "box", centre: mid, half: [0.1, 0.1, 0.1], attached: new Set() },
    ];
    for (const blocker of blockers)
      expect(classifyVisibility(standing, front, [blocker])[0]).toEqual({
        kind: "occluded",
        occluderId: blocker.id,
      });
    expect(
      classifyVisibility(standing, front, [sphere("miss", add3(mid, [1, 0, 0]), 0.1)])[0],
    ).toEqual({ kind: "visible" });
    expect(classifyVisibility(standing, front, [sphere("surface", nose, 0.01)])[0]).toEqual({
      kind: "visible",
    });
  });

  it("GF-108 maps geometric scores through both adapters to the one gap detector, presence separate", () => {
    const truth = backWrist();
    const observed = observe(truth, orbit(truth, 0), { scores: GEOMETRIC_SCORES });
    for (const landmark of observed) {
      expect(landmark.visibility).toBe(SCORE_PROFILE[landmark.geometry.kind].visibility);
      expect(landmark.presence).toBe(SCORE_PROFILE[landmark.geometry.kind].presence);
    }
    const result = reportResult({ kind: "pose", ...rawPoses(observed) });
    for (const space of LANDMARK_SPACES) {
      const frame = parsePoseResult(result, 0, space, STAGE);
      expect(frame.joints["left-wrist"]).toMatchObject({
        kind: "measured",
        visibility: 0.3,
        presence: { kind: "reported", value: 0.9 },
      });
      const trust = createGapDetector().detect(frame, NO_FORCED, { length: () => undefined }).trust;
      expect(trust["left-wrist"]).toEqual({ kind: "gap", reason: "low-visibility" });
    }
    expect(
      observe(truth, orbit(truth, 0), { scores: IDEAL_SCORES })[index("left-wrist")]!.visibility,
    ).toBe(0.99);
    expect(GEOMETRIC_SCORES.score([{ kind: "behind-camera" }, { kind: "out-of-frame" }])).toEqual([
      SCORE_PROFILE["behind-camera"],
      SCORE_PROFILE["out-of-frame"],
    ]);
  });

  it("GF-109 keeps geometric truth per anatomical slot through edits and freezes every segment transform", () => {
    const truth = actorFrame(scenarioPose("arm-reversal", 1000));
    const camera = orbit(truth, 90);
    const clean = observe(truth, camera, { scores: GEOMETRIC_SCORES });
    const left = index("left-wrist");
    const right = index("right-wrist");
    const edited = observe(truth, camera, {
      scores: GEOMETRIC_SCORES,
      edits: [
        { kind: "swap", landmark: left },
        { kind: "score", landmark: left, visibility: 1, presence: 0 },
        { kind: "drop", landmark: right },
      ],
    });
    expect(clean[left]!.geometry).not.toEqual(clean[right]!.geometry);
    expect(edited[left]!.geometry).toEqual(clean[left]!.geometry);
    expect(edited[right]!.geometry).toEqual(clean[right]!.geometry);
    expect(edited[left]!.image).toEqual(clean[right]!.image);
    expect(edited[left]!.visibility).toBe(1);
    expect(edited[right]!.image).toBeUndefined();
    for (const segment of Object.values(truth.segments)) {
      expect(Object.isFrozen(segment.origin)).toBe(true);
      expect(Object.isFrozen(segment.rotation)).toBe(true);
    }
    expect(() => {
      (truth.segments.head.rotation as unknown as number[])[0] = 99;
    }).toThrow();
  });

  it("GF-124 covers finite-cylinder containment and tangency, parallel misses, tiny axes and immutable props", () => {
    const nose = standing.landmarks[0]!;
    // Horizontal, axis-aligned viewing ray makes exact tangency independent of camera pitch.
    const camera = createCamera({ ...front.spec, position: [0, nose[1], 2.6], target: nose });
    const pointAt = (fraction: number) =>
      add3(camera.spec.position, scale3(sub3(nose, camera.spec.position), fraction));
    const mid = pointAt(0.5);
    const parts: Occluder[] = [
      {
        kind: "capsule",
        id: "inside-cylinder",
        a: add3(camera.spec.position, [0, -0.5, 0]),
        b: add3(camera.spec.position, [0, 0.5, 0]),
        radius: 0.1,
        attached: new Set(),
      },
      {
        kind: "capsule",
        id: "tangent-cylinder",
        a: add3(mid, [0.1, -0.5, 0]),
        b: add3(mid, [0.1, 0.5, 0]),
        radius: 0.1,
        attached: new Set(),
      },
      {
        kind: "capsule",
        id: "tiny-axis",
        a: mid,
        b: add3(mid, [0, 1e-8, 0]),
        radius: 0.1,
        attached: new Set(),
      },
    ];
    for (const part of parts)
      expect(classifyVisibility(standing, camera, [part])[0]).toEqual({
        kind: "occluded",
        occluderId: part.id,
      });
    const miss: Occluder = {
      kind: "capsule",
      id: "parallel-miss",
      a: add3(pointAt(0.3), [0.2, 0, 0]),
      b: add3(pointAt(0.7), [0.2, 0, 0]),
      radius: 0.1,
      attached: new Set(),
    };
    expect(classifyVisibility(standing, camera, [miss])[0]).toEqual({ kind: "visible" });
    for (const props of [PROPS.table, PROPS.pillar])
      for (const prop of props) {
        expect(Object.isFrozen(prop)).toBe(true);
        expect(Object.isFrozen(prop.kind === "box" ? prop.centre : prop.a)).toBe(true);
        expect(Object.isFrozen(prop.kind === "box" ? prop.half : prop.b)).toBe(true);
      }
  });
});
