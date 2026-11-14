import { clockDriver } from "@gerak/dom";
import { elapsedOf, follow, mixPose3d, type Events, type Pose3d, type Time } from "@gerak/moves";
import { simulate } from "@gerak/physics";
import { rapierEngine3d } from "@gerak/rapier";
import { bodyPose3d, chainThrough3d, ik3d, bonesOf3d } from "@gerak/rig";
import talk from "../references/talk.json" with { type: "json" };

declare global {
  interface Window {
    __motionReady?: Promise<void>;
  }
}

let resolveReady: (() => void) | undefined;
if (typeof window !== "undefined" && !window.__motionReady) {
  window.__motionReady = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });
}

/** Tells headless tools the 3D scene and assets have drawn the first frame. */
export function signalMotionReady(): void {
  resolveReady?.();
}

/** Speech and expression samples from the recorded talk session. */
export const cues = talk;

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 9200;

const rapier3d = await rapierEngine3d();

const sim = simulate(rapier3d(), (world) => {
  world.setGravity(0, -9.81, 0);
  world.addCollider("floor", { kind: "floor", y: 0 });
  world.addBody({
    id: "prop1",
    shape: { kind: "box", width: 0.6, height: 0.6, depth: 0.6 },
    x: -1.8,
    y: 3.5,
    z: 0.6,
    restitution: 0.2,
    friction: 0.9,
    drag: 1.5,
  });
  world.addBody({
    id: "prop2",
    shape: { kind: "box", width: 0.5, height: 0.5, depth: 0.5 },
    x: -1.3,
    y: 4.5,
    z: 0.9,
    restitution: 0.2,
    friction: 0.9,
    drag: 1.5,
  });
  world.addBody({
    id: "prop3",
    shape: { kind: "sphere", radius: 0.3 },
    x: -1.5,
    y: 5.5,
    z: 0.4,
    restitution: 0.3,
    friction: 0.9,
    drag: 1.5,
  });
});

const arm = chainThrough3d([
  { id: "UpperArmL", x: 0.617, y: 2.295, z: -0.017 },
  { id: "LowerArmL", x: 0.898, y: 1.711, z: -0.131 },
  { id: "Palm2L", x: 1.359, y: 0.902, z: 0.871 },
]);

const pole = { kind: "point" as const, point: [1.8, 2.2, -0.5] as const };

const mouthFollow = follow({ start: 0, on: { mouthOpen: "value" } });
const blinkFollow = follow({ start: 0, on: { blink: "value" } });

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/** Every target's 3D pose at `time` (y up, turns in degrees); `motion:sample` reads it. */
export const scene = (time: Time, events: Events) => {
  const phys = sim.at(time);
  const ms = elapsedOf(time.clock) ?? 0;
  const mouth = mouthFollow(time, events);
  const blink = blinkFollow(time, events);

  let upperArm: Pose3d = {};
  let lowerArm: Pose3d = {};
  let palm: Pose3d = {};

  if (ms >= 800 && ms <= 2800) {
    let share = 1;
    let waveProgress = 0;
    if (ms < 1300) {
      share = smoothstep(800, 1300, ms);
    } else if (ms <= 2300) {
      waveProgress = (ms - 1300) / 1000;
    } else {
      share = 1 - smoothstep(2300, 2800, ms);
    }

    const waveAngle = waveProgress * Math.PI * 4;
    const waveX = 1.45 + 0.25 * Math.sin(waveAngle);
    const waveY = 2.95 + 0.08 * Math.cos(waveAngle);
    const waveZ = 0.55 + 0.12 * Math.cos(waveAngle);

    const solved = ik3d(arm.chain, { LowerArmL: { x: waveX, y: waveY, z: waveZ } }, { pole });
    const solvedBones = bonesOf3d(arm.chain, solved);

    upperArm = mixPose3d({}, solvedBones.UpperArmL ?? {}, share);
    lowerArm = mixPose3d({}, solvedBones.LowerArmL ?? {}, share);

    const handTilt = Math.round(20 * Math.sin(waveAngle) * share * 100) / 100;
    palm = handTilt !== 0 ? { rotation: handTilt } : {};
  }

  let nodAngle = 0;
  if (ms >= 2800 && ms <= 3800) {
    const nodProgress = (ms - 2800) / 1000;
    nodAngle = -14 * Math.sin(nodProgress * Math.PI * 4) * Math.sin(nodProgress * Math.PI);
  }

  const speechPitch = -5 * mouth;
  const headRotationX = Math.round((nodAngle + speechPitch) * 100) / 100;
  const head: Pose3d = headRotationX !== 0 ? { rotationX: headRotationX } : {};

  const clampedMouth = Math.max(0, Math.min(1, Math.round(mouth * 100) / 100));
  const clampedSad = Math.max(0, Math.min(1, Math.round(blink * 0.4 * 100) / 100));

  return {
    character: {
      custom: {
        Surprised: clampedMouth,
        Sad: clampedSad,
      },
    } satisfies Pose3d,
    bones: {
      UpperArmL: upperArm,
      LowerArmL: lowerArm,
      Palm2L: palm,
      Head: head,
    } satisfies Readonly<Record<string, Pose3d>>,
    prop1: bodyPose3d(phys.prop1) satisfies Pose3d,
    prop2: bodyPose3d(phys.prop2) satisfies Pose3d,
    prop3: bodyPose3d(phys.prop3) satisfies Pose3d,
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
