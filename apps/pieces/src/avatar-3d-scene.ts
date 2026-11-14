import { clockDriver } from "@gerak/dom";
import {
  aim,
  combine3d,
  ease,
  follow,
  mix,
  orbit,
  span,
  type Events,
  type MotionEvent,
  type Pose3d,
  type Time,
} from "@gerak/moves";
import { simulate, type BodySpec3d } from "@gerak/physics";
import { rapierEngine3d } from "@gerak/rapier";
import { bodyPose3d, bonesOf3d, chainThrough3d, ik3d, jointOf } from "@gerak/rig";
import rig from "../references/dragonling.joints.json" with { type: "json" };
import talk from "../references/talk.json" with { type: "json" };

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 15000;

const TALK_FROM = 5600;

/** The speech samples, moved to start once the greeting and the nod are done. */
export const cues: readonly MotionEvent[] = talk.map((sample) => ({
  ...sample,
  at: sample.at + TALK_FROM,
}));

const look = span(0, 1400);
const face = span(1300, 2300);
const raise = span(2200, 2750);
const wave = span(2750, 4050);
const lower = span(4050, 4650);
const greet = span(2200, 4650);
const nod = span(4600, 5700);
const settle = span(13700, 14300);
const pan = span(0, 2600);

const mouth = follow({ start: 0, on: { mouthOpen: "value" }, stiffness: 320, damping: 30 });

const arm = chainThrough3d([
  jointOf(rig.joints, "LeftFrontUpLeg"),
  jointOf(rig.joints, "LeftFrontElbow"),
  jointOf(rig.joints, "LeftFrontLeg"),
  jointOf(rig.joints, "LeftFrontFoot"),
]);
const paw = jointOf(rig.joints, "LeftFrontFoot");
const PAW_UP = { x: 0.15, y: 0.33, z: 0.17 };
const ELBOW_POLE: readonly [number, number, number] = [0.2, 0.08, -0.3];

export interface Prop {
  readonly id: string;
  readonly spec: BodySpec3d;
}

/** The props, each spawned above the stage and clear of where the dragonling stands. */
export const props: readonly Prop[] = [
  {
    id: "block",
    spec: {
      id: "block",
      shape: { kind: "box", width: 0.08, height: 0.08, depth: 0.08 },
      x: -0.27,
      y: 0.95,
      z: 0.13,
      wx: 140,
      wz: -90,
    },
  },
  {
    id: "ball",
    spec: { id: "ball", shape: { kind: "sphere", radius: 0.042 }, x: 0.31, y: 1.15, z: -0.04 },
  },
  {
    id: "cube",
    spec: {
      id: "cube",
      shape: { kind: "box", width: 0.06, height: 0.06, depth: 0.06 },
      x: -0.23,
      y: 1.1,
      z: -0.2,
      wx: -40,
      wy: 70,
    },
  },
  {
    id: "marble",
    spec: { id: "marble", shape: { kind: "sphere", radius: 0.03 }, x: -0.37, y: 1.05, z: -0.03 },
  },
  {
    id: "tile",
    spec: {
      id: "tile",
      shape: { kind: "box", width: 0.09, height: 0.035, depth: 0.09 },
      x: 0.28,
      y: 1.2,
      z: -0.26,
      wz: 50,
      wy: 60,
    },
  },
];

const rapier3d = await rapierEngine3d();
const sim = simulate(
  rapier3d(),
  (world) => {
    world.setGravity(0, -9.81, 0);
    world.addCollider("stage", { kind: "floor", y: 0 }, { friction: 0.9, restitution: 0.25 });
    // The dragonling has no body of its own: these boxes stand where its body, head and tail are.
    world.addCollider("dragonBody", {
      kind: "box",
      x: 0,
      y: 0.22,
      z: -0.02,
      width: 0.3,
      height: 0.44,
      depth: 0.6,
    });
    world.addCollider("dragonPaw", {
      kind: "box",
      x: 0.17,
      y: 0.25,
      z: 0.18,
      width: 0.16,
      height: 0.5,
      depth: 0.16,
    });
    for (const side of ["min", "max"] as const) {
      world.addCollider(`edgeX${side}`, {
        kind: "wall",
        axis: "x",
        at: side === "min" ? -0.48 : 0.48,
        side,
      });
      world.addCollider(`edgeZ${side}`, {
        kind: "wall",
        axis: "z",
        at: side === "min" ? -0.48 : 0.48,
        side,
      });
    }
    for (const prop of props)
      world.addBody({ restitution: 0.15, friction: 0.9, drag: 1.5, ...prop.spec });
  },
  { durationMs },
);

const wave3 = (progress: number) => Math.sin(Math.PI * 2 * 3 * progress);
const pulse = (progress: number, count: number) =>
  (1 - Math.cos(Math.PI * 2 * count * progress)) / 2;

function pawBones(time: Time) {
  const up = raise.of(time, ease.cubicOut).progress * (1 - lower.of(time, ease.sineInOut).progress);
  if (up <= 0) return {};
  const swing = wave3(wave.of(time).progress) * 0.045;
  const goal = {
    x: mix(paw.x, PAW_UP.x, up) + swing * 0.4,
    y: mix(paw.y, PAW_UP.y, up) + Math.abs(swing) * 0.3,
    z: mix(paw.z, PAW_UP.z, up) + swing,
  };
  const solved = ik3d(arm.chain, { LeftFrontLeg: goal }, { pole: ELBOW_POLE });
  return bonesOf3d(arm.chain, solved);
}

function headPose(time: Time, open: number): Pose3d {
  const up = look.of(time, ease.sineInOut).progress;
  const back = face.of(time, ease.sineInOut).progress;
  const watch = Math.sin(Math.PI * up) * (1 - back);
  const greeting = greet.of(time).progress;
  const tilt = Math.sin(Math.PI * greeting);
  return combine3d([
    { rotationX: -26 * watch, rotationY: -30 * up * (1 - back) },
    { rotation: -12 * tilt },
    { rotationX: 20 * pulse(nod.of(time, ease.sineInOut).progress, 2) },
    { rotationX: -6 * open },
  ]);
}

function wingPose(time: Time, side: 1 | -1): Pose3d {
  const lift = Math.sin(Math.PI * greet.of(time, ease.sineInOut).progress);
  const flutter = Math.sin(Math.PI * 2 * 4 * greet.of(time).progress) * lift;
  return { rotation: side * (18 * lift + 6 * flutter) };
}

/** Every target's 3D pose at `time` (y up, turns in degrees); `motion:sample` reads it. */
export const scene = (time: Time, events: Events) => {
  const open = Math.max(0, Math.min(1, mouth(time, events))) * (1 - settle.of(time).progress);
  const eye = orbit({
    target: { x: 0, y: 0.21, z: 0 },
    radius: 1.6,
    azimuth: mix(42, 26, pan.of(time, ease.sineInOut).progress),
    elevation: mix(20, 12, pan.of(time, ease.sineInOut).progress),
  });
  const turn = face.of(time, ease.sineInOut).progress;
  const duck = Math.sin(Math.PI * span(450, 950).of(time, ease.sineOut).progress);
  const bodies = Object.fromEntries(
    props.map((prop) => [prop.id, bodyPose3d(sim.pose(prop.id, time, events))]),
  );
  return {
    camera: { ...eye, ...aim(eye, { x: 0, y: 0.21, z: 0 }) } satisfies Pose3d,
    dragon: { rotationY: 12 * turn, y: -0.012 * duck } satisfies Pose3d,
    bones: {
      ...pawBones(time),
      Neck: { rotationX: 10 * duck } satisfies Pose3d,
      Head: headPose(time, open),
      Jaw: { rotationX: 26 * open } satisfies Pose3d,
      LeftWing: wingPose(time, 1),
      RightWing: wingPose(time, -1),
    },
    block: bodies["block"] ?? {},
    ball: bodies["ball"] ?? {},
    cube: bodies["cube"] ?? {},
    marble: bodies["marble"] ?? {},
    tile: bodies["tile"] ?? {},
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
