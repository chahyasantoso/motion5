import {
  eulerFromMatrix3d,
  matrixFromQuaternion,
  quaternionFromEuler3d,
  type Quaternion,
  type Vec3,
} from "@motion5/rig";
import type { Events } from "./events";
import type { Pose3d } from "./pose3d";
import { elapsedOf, type Time } from "./time";
import { timeAt } from "./time-at";
import { trailSettings, trailStart, type TrailOptions } from "./trail";

const DEGREES = 180 / Math.PI;

function product(a: Quaternion, b: Quaternion): Quaternion {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  };
}

/** The rotation vector, in radians, that turns `from` onto `to` the short way. */
function errorOf(from: Quaternion, to: Quaternion): Vec3 {
  const e = product(to, { w: from.w, x: -from.x, y: -from.y, z: -from.z });
  const sign = e.w < 0 ? -1 : 1;
  const size = Math.hypot(e.x, e.y, e.z);
  if (size < 1e-12) return [0, 0, 0];
  const scale = (sign * 2 * Math.atan2(size, sign * e.w)) / size;
  return [e.x * scale, e.y * scale, e.z * scale];
}

/** `q` turned in world space by the rotation vector `v`, in radians. */
function turned(q: Quaternion, v: Vec3): Quaternion {
  const angle = Math.hypot(v[0], v[1], v[2]);
  if (angle < 1e-12) return q;
  const s = Math.sin(angle / 2) / angle;
  const r = product({ w: Math.cos(angle / 2), x: v[0] * s, y: v[1] * s, z: v[2] * s }, q);
  const length = Math.hypot(r.w, r.x, r.y, r.z);
  return { w: r.w / length, x: r.x / length, y: r.y / length, z: r.z / length };
}

function quaternionOf(pose: Pose3d): Quaternion {
  return quaternionFromEuler3d({
    rotation: pose.rotation ?? 0,
    rotationX: pose.rotationX ?? 0,
    rotationY: pose.rotationY ?? 0,
  });
}

/** Only the turn fields `pose` names. */
function turnFields(pose: Pose3d): Pose3d {
  const out: { rotation?: number; rotationX?: number; rotationY?: number } = {};
  if (pose.rotation !== undefined) out.rotation = pose.rotation;
  if (pose.rotationX !== undefined) out.rotationX = pose.rotationX;
  if (pose.rotationY !== undefined) out.rotationY = pose.rotationY;
  return out;
}

/** A turn chasing `signal`'s turn on a spring the short way round, resting exactly on it; pass the scene's time. */
export function trailTurn(
  signal: (time: Time, events: Events) => Pose3d,
  options: TrailOptions,
): (time: Time, events: Events) => Pose3d {
  const settings = trailSettings(options, "trailTurn");
  const { stiffness, damping } = settings.spring;
  return (time, events) => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return turnFields(signal(time, events));
    let at = trailStart(now, settings);
    let goal = signal(timeAt(time, at), events);
    let turn = quaternionOf(goal);
    let spin: Vec3 = [0, 0, 0];
    while (at < now) {
      goal = signal(timeAt(time, at), events);
      const stepMs = Math.min(settings.stepMs, now - at);
      const dt = stepMs / 1000;
      const [ex, ey, ez] = errorOf(turn, quaternionOf(goal));
      spin = [
        spin[0] + (stiffness * ex - damping * spin[0]) * dt,
        spin[1] + (stiffness * ey - damping * spin[1]) * dt,
        spin[2] + (stiffness * ez - damping * spin[2]) * dt,
      ];
      turn = turned(turn, [spin[0] * dt, spin[1] * dt, spin[2] * dt]);
      at += stepMs;
    }
    const [ex, ey, ez] = errorOf(turn, quaternionOf(goal));
    const off = Math.hypot(ex, ey, ez) * DEGREES;
    const speed = Math.hypot(spin[0], spin[1], spin[2]) * DEGREES;
    if (off < settings.rest && speed < 10 * settings.rest) return turnFields(goal);
    return eulerFromMatrix3d(matrixFromQuaternion(turn));
  };
}
