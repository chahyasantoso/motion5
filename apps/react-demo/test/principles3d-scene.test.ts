import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@gerak/player";
import { NO_EVENTS, liveAt } from "@gerak/moves";
import { applyPose3d } from "@gerak/three";
import {
  BITS_MS,
  CAMERA_END_MS,
  CROUCH_MS,
  LAND_MS,
  LEAP_MS,
  START,
  drag,
  durationMs,
  scene,
  subject,
} from "../src/principles3d-scene";

function at(ms: number) {
  const driver = manualDriver({ durationMs });
  const player = play(scene, driver);
  driver.seek(ms / durationMs);
  return player.values;
}

function flat(values: ReturnType<typeof at>): Map<string, number> {
  const out = new Map<string, number>();
  for (const [name, pose] of Object.entries(values))
    for (const [key, value] of Object.entries(pose))
      if (typeof value === "number") out.set(`${name}.${key}`, value);
  return out;
}

const MID_FLIGHT_MS = LAND_MS - 130;

describe("the 3D principles scene", () => {
  it("crouches before it goes, squashed and still", () => {
    const crouched = at(LEAP_MS - 20);
    expect(crouched.body.scaleY ?? 1).toBeLessThan(0.7);
    expect(crouched.body.scaleX ?? 1).toBeGreaterThan(1.2);
    expect(crouched.body.x ?? 0).toBeCloseTo(START.x, 6);
    expect(crouched.body.y ?? 0).toBeCloseTo(0, 6);
    expect(at(CROUCH_MS - 20).body.scaleY ?? 1).toBeCloseTo(1, 6);
  });

  it("flies above the ground, off the xy plane, stretched along its arc", () => {
    const flying = at(MID_FLIGHT_MS);
    expect(flying.body.y ?? 0).toBeGreaterThan(1);
    expect(Math.abs(flying.body.z ?? 0)).toBeGreaterThan(0.3);
    expect(flying.stretch.scaleX ?? 1).toBeGreaterThan(1.1);
    expect(flying.stretch.scaleY ?? 1).toBeLessThan(1);
  });

  it("lands at rest with its scale back to 1", () => {
    const end = at(durationMs);
    expect(end.body.x ?? 0).toBeCloseTo(0, 6);
    expect(end.body.y ?? 0).toBeCloseTo(0, 6);
    expect(end.body.z ?? 0).toBeCloseTo(0, 6);
    for (const key of ["scaleX", "scaleY", "scaleZ"] as const)
      expect(end.body[key] ?? 1).toBeCloseTo(1, 6);
  });

  it("lags the antenna behind the body and lets it catch up", () => {
    const flying = at(MID_FLIGHT_MS);
    const pushed = drag(liveAt(MID_FLIGHT_MS), NO_EVENTS);
    expect(Math.abs(pushed.rotation ?? 0)).toBeGreaterThan(5);
    expect(Math.abs((flying.antenna.rotation ?? 0) - (pushed.rotation ?? 0))).toBeGreaterThan(3);
    expect(at(durationMs).antenna.rotation ?? 0).toBeCloseTo(0, 1);
    expect(at(durationMs).antenna.rotationX ?? 0).toBeCloseTo(0, 1);
  });

  it("moves the camera and ends it aimed at the subject", () => {
    const start = at(0).camera;
    const middle = at(CAMERA_END_MS / 2).camera;
    expect(
      Math.hypot((middle.x ?? 0) - (start.x ?? 0), (middle.z ?? 0) - (start.z ?? 0)),
    ).toBeGreaterThan(1);
    const end = at(durationMs).camera;
    const object = new PerspectiveCamera();
    applyPose3d(object, end);
    object.updateMatrixWorld(true);
    const forward = object.getWorldDirection(new Vector3());
    const goal = subject(liveAt(durationMs));
    const wanted = new Vector3(
      goal.x - (end.x ?? 0),
      goal.y - (end.y ?? 0),
      goal.z - (end.z ?? 0),
    ).normalize();
    expect(forward.distanceTo(wanted)).toBeLessThan(1e-6);
  });

  it("starts the small objects from the centre one", () => {
    const early = at(BITS_MS + 150);
    expect(early.bit2.opacity ?? 0).toBeGreaterThan(0);
    expect(early.bit0.opacity ?? 0).toBeCloseTo(0, 6);
    expect(early.bit4.opacity ?? 0).toBeCloseTo(0, 6);
  });

  it("holds everything still for the last 600 ms", () => {
    const held = flat(at(durationMs - 600));
    for (const [key, value] of flat(at(durationMs)))
      expect(held.get(key), key).toBeCloseTo(value, 3);
  });
});
