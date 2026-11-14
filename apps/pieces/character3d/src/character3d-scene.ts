import { clockDriver } from "@gerak/dom";
import { ease, mix, mixPoint3d, orbit, aim, span, type Pose3d, type Time } from "@gerak/moves";
import { simulate } from "@gerak/physics";
import { rapierEngine3d } from "@gerak/rapier";
import { bodyPose3d, bonesOf3d, childBase3d, chainThrough3d, ik3d } from "@gerak/rig";

/** How long the scene runs, in ms; `motion:sample` and `motion:review` read it. */
export const durationMs = 4200;

/** Rest joints of the character hierarchy in world units. */
export const SKELETON_JOINTS = {
  hips: { id: "hips", x: 0, y: 0.9, z: 0 },
  spine: { id: "spine", x: 0, y: 1.35, z: 0 },
  shoulder: { id: "shoulder", x: 0.25, y: 1.5, z: 0 },
  elbow: { id: "elbow", x: 0.7, y: 1.3, z: 0.1 },
  hand: { id: "hand", x: 1.15, y: 1.15, z: 0.15 },
} as const;

/** Static pedestal box beside the character. */
export const PEDESTAL = {
  x: 0.95,
  y: 0.5,
  z: 0.35,
  width: 0.9,
  height: 1.0,
  depth: 0.9,
} as const;

/** Radius of the physics ball dropped onto the pedestal. */
export const BALL_RADIUS = 0.18;

/** Where the ball is spawned; its mesh is placed here, and the scene answers its movement from here. */
export const BALL_SPAWN = { x: 0.95, y: 2.1, z: 0.35 } as const;

/** World point the character's right hand reaches toward. */
export const REACH_TARGET = { x: 0.85, y: 1.32, z: 0.3 } as const;

/** Point the camera orbits around and aims at. */
export const CHARACTER_FOCUS = { x: 0.35, y: 1.4, z: 0.1 } as const;

const HAND_REST = {
  x: SKELETON_JOINTS.hand.x,
  y: SKELETON_JOINTS.hand.y,
  z: SKELETON_JOINTS.hand.z,
} as const;

// Lies in the rest (shoulder, elbow, hand) half-plane so the elbow never flips mid-reach.
const ELBOW_POLE = [0.535, 1.014, 0.422] as const;

// The shoulder joint after the torso leans about 6 degrees forward and 10 degrees round.
const LEAN_GOAL = { x: 0.2462, y: 1.4947, z: 0.0589 } as const;

const torso = chainThrough3d([SKELETON_JOINTS.spine, SKELETON_JOINTS.shoulder]);
const arm = chainThrough3d([SKELETON_JOINTS.shoulder, SKELETON_JOINTS.elbow, SKELETON_JOINTS.hand]);

const rapier3d = await rapierEngine3d();

const ballSim = simulate(rapier3d(), (world) => {
  world.setGravity(0, -9.81, 0);
  world.addCollider("floor", { kind: "floor", y: 0 }, { restitution: 0.25, friction: 0.9 });
  world.addCollider("pedestal", { kind: "box", ...PEDESTAL }, { restitution: 0.25, friction: 0.9 });
  world.addBody({
    id: "ball",
    shape: { kind: "sphere", radius: BALL_RADIUS },
    ...BALL_SPAWN,
    wx: 90,
    wy: 120,
    wz: 45,
    restitution: 0.25,
    friction: 0.9,
    drag: 3.2,
  });
});

const reach = span(400, 2000);
const torsoLean = span(250, 1900);
const blinkWindow = span(1150, 1550);
const smileWindow = span(1500, 2600);
const cameraPan = span(0, 3400);

/** Character morphs, skeleton bone turns, physics ball pose, and orbiting camera at `time`. */
export const scene = (time: Time) => {
  const leanProgress = torsoLean.of(time, ease.sineInOut).progress;
  const torsoNow = ik3d(torso.chain, {
    spine: mixPoint3d(SKELETON_JOINTS.shoulder, LEAN_GOAL, leanProgress),
  });
  const armBase = childBase3d(torso.chain, torsoNow, "spine");

  const reachProgress = reach.of(time, ease.cubicInOut).progress;
  const armNow =
    reachProgress === 0 && leanProgress === 0
      ? arm.rest
      : ik3d(
          arm.chain,
          { elbow: mixPoint3d(HAND_REST, REACH_TARGET, reachProgress) },
          { base: armBase, pole: ELBOW_POLE },
        );
  const poses = { ...bonesOf3d(torso.chain, torsoNow), ...bonesOf3d(arm.chain, armNow) };

  const blinkPhase = blinkWindow.of(time).progress;
  const blink = blinkPhase > 0 && blinkPhase < 1 ? Math.sin(Math.PI * blinkPhase) : 0;
  const smile = mix(0, 0.85, smileWindow.of(time, ease.cubicOut).progress);

  const eye = orbit({
    target: CHARACTER_FOCUS,
    radius: 3.1,
    azimuth: mix(-24, 18, cameraPan.of(time, ease.sineInOut).progress),
    elevation: 14,
  });

  const bones: Record<"spine" | "shoulder" | "elbow", Pose3d> = {
    spine: poses.spine,
    shoulder: poses.shoulder,
    elbow: poses.elbow,
  };
  const character: Pose3d = { custom: { smile, blink } };

  return {
    character,
    bones,
    ball: bodyPose3d(ballSim.pose("ball", time)) satisfies Pose3d,
    camera: { ...eye, ...aim(eye, CHARACTER_FOCUS) } satisfies Pose3d,
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
