import { describe, expect, it } from "vitest";
import { liveAt, type Events, type MotionEvent } from "@gerak/moves";
import { simulate, type PhysicsWorld3d, type Spawner3d } from "@gerak/physics";
import { rapierEngine, rapierEngine3d } from "@gerak/rapier";
import { bodyPose3d, matrixFromEuler3d, matrixFromQuaternion } from "@gerak/rig";

const create = await rapierEngine3d();
const create2d = await rapierEngine();

describe("Rapier 3D behind PhysicsWorld3d", () => {
  it("drops a sphere onto a 3D floor with bounce decay and collides in 3D", () => {
    const sim = simulate(create(), (world) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 }, { restitution: 0.7 });
      world.addBody({
        id: "ball",
        shape: { kind: "sphere", radius: 0.5 },
        x: 3,
        y: 2.5,
        z: -2,
        restitution: 0.7,
      });
      world.addBody({
        id: "striker",
        shape: { kind: "sphere", radius: 0.5 },
        x: -2,
        y: 0.5,
        z: -0.25,
        vx: 6,
        restitution: 0.8,
        friction: 0,
      });
      world.addBody({
        id: "target",
        shape: { kind: "sphere", radius: 0.5 },
        x: 0.2,
        y: 0.5,
        z: 0.1,
        restitution: 0.8,
        friction: 0,
      });
    });

    const resting = sim.at(liveAt(4000)).ball;
    expect(Math.abs((resting?.y ?? 0) - 0.5)).toBeLessThan(0.05);

    const ys = Array.from({ length: 241 }, (_, i) => sim.at(liveAt((i * 1000) / 120)).ball?.y ?? 0);
    const peaks = ys.filter((y, i) => i > 0 && y > (ys[i - 1] ?? y) && y > (ys[i + 1] ?? y));
    expect(peaks.length).toBeGreaterThanOrEqual(2);
    expect(peaks[1] ?? 0).toBeLessThan(peaks[0] ?? 0);

    const hitTarget = sim.at(liveAt(1200)).target;
    expect(Math.abs(hitTarget?.x ?? 0.2)).toBeGreaterThan(0.25);
    expect(Math.abs(hitTarget?.z ?? 0.1)).toBeGreaterThan(0.12);
    expect(sim.events(liveAt(2000)).some(({ target }) => target === "ball")).toBe(true);
    expect(sim.events(liveAt(2000)).some(({ target }) => target === "target")).toBe(true);
  });

  it("keeps bodies inside x/z walls and on top of static box colliders", () => {
    const sim = simulate(create(), (world) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
      world.addCollider("minX", { kind: "wall", axis: "x", at: -2, side: "min" });
      world.addCollider("maxZ", { kind: "wall", axis: "z", at: 2, side: "max" });
      world.addCollider("pedestal", {
        kind: "box",
        x: 0,
        y: 0.5,
        z: 0,
        width: 2,
        height: 1,
        depth: 2,
      });
      world.addBody({
        id: "leftBall",
        shape: { kind: "sphere", radius: 0.4 },
        x: -1,
        y: 0.4,
        z: 0,
        vx: -8,
      });
      world.addBody({
        id: "backBall",
        shape: { kind: "sphere", radius: 0.4 },
        x: 1.5,
        y: 0.4,
        z: 1,
        vz: 8,
      });
      world.addBody({
        id: "perched",
        shape: { kind: "box", width: 0.8, height: 0.8, depth: 0.8 },
        x: 0,
        y: 2,
        z: 0,
      });
    });

    const end = sim.at(liveAt(2000));
    expect(end.leftBall?.x ?? -99).toBeGreaterThanOrEqual(-1.65);
    expect(end.backBall?.z ?? 99).toBeLessThanOrEqual(1.65);
    expect(end.perched?.y ?? 0).toBeCloseTo(1.4, 1);
  });

  it("produces bit-identical states and events regardless of seek order", () => {
    const build = (world: PhysicsWorld3d) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 }, { restitution: 0.5 });
      for (let i = 0; i < 6; i += 1) {
        world.addBody({
          id: `crate${i}`,
          shape: { kind: "box", width: 0.6, height: 0.6, depth: 0.6 },
          x: (i - 2.5) * 0.5,
          y: 1.5 + i * 0.7,
          z: ((i % 3) - 1) * 0.4,
          vx: (i % 2 === 0 ? 1 : -1) * 1.2,
          vz: (i - 2) * 0.4,
          wx: 90,
          wy: -60,
          wz: 45,
          restitution: 0.4,
        });
      }
    };

    const straight = simulate(create(), build);
    const jumping = simulate(create(), build);
    const times = [1600, 250, 1100, 0, 800, 1600, 50];
    for (const ms of times) jumping.at(liveAt(ms));
    for (const ms of times) expect(jumping.at(liveAt(ms))).toEqual(straight.at(liveAt(ms)));
    expect(jumping.events(liveAt(1600))).toEqual(straight.events(liveAt(1600)));
  });

  it("converts BodyState3d into a Pose3d with matching orientation via bodyPose3d", () => {
    const sim = simulate(create(), (world) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
      world.addBody({
        id: "crate",
        shape: { kind: "box", width: 1, height: 0.6, depth: 0.8 },
        x: 0.3,
        y: 4,
        z: -0.5,
        wx: 140,
        wy: 190,
        wz: -80,
      });
    });

    const state = sim.at(liveAt(600)).crate!;
    const pose = bodyPose3d(state);
    expect(pose.x).toBeCloseTo(state.x, 6);
    expect(pose.y).toBeCloseTo(state.y, 6);
    expect(pose.z).toBeCloseTo(state.z, 6);

    const fromEuler = matrixFromEuler3d({
      rotation: pose.rotation ?? 0,
      rotationX: pose.rotationX ?? 0,
      rotationY: pose.rotationY ?? 0,
    });
    const fromQuat = matrixFromQuaternion(state.rotation);
    for (let i = 0; i < 9; i += 1) {
      expect(fromEuler[i]).toBeCloseTo(fromQuat[i]!, 5);
    }
  });

  it("spawns 3D bodies on cue events and rewinds cleanly when earlier events arrive", () => {
    const options = {
      spawn: (event: MotionEvent, world: Spawner3d) => {
        if (event.name === "drop") {
          world.addBody({
            id: `ball@${event.at}`,
            shape: { kind: "sphere", radius: 0.3 },
            x: event.x ?? 0,
            y: 3,
            z: event.y ?? 0,
            restitution: 0.3,
          });
        }
      },
    };
    const build = (world: PhysicsWorld3d) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
    };
    const drops: Events = [
      { name: "drop", at: 400, x: -0.5, y: 0.2 },
      { name: "drop", at: 900, x: 0.8, y: -0.4 },
    ];
    const sim = simulate(create(), build, options);
    expect(sim.bodies(liveAt(300), drops)).toEqual([]);
    expect(sim.bodies(liveAt(500), drops)).toEqual(["ball@400"]);
    const settled = sim.at(liveAt(2400), drops);
    expect(Object.keys(settled)).toEqual(["ball@400", "ball@900"]);
    expect(settled["ball@400"]?.y ?? 0).toBeCloseTo(0.3, 1);

    const earlier: Events = [{ name: "drop", at: 200, x: 0, y: 0 }, ...drops];
    const fresh = simulate(create(), build, options);
    expect(sim.at(liveAt(2400), earlier)).toEqual(fresh.at(liveAt(2400), earlier));
  });

  it("throws RangeError on duplicate or unknown body ids", () => {
    const world = create();
    world.addBody({
      id: "one",
      shape: { kind: "sphere", radius: 0.5 },
      x: 0,
      y: 1,
      z: 0,
    });
    expect(() =>
      world.addBody({
        id: "one",
        shape: { kind: "sphere", radius: 0.5 },
        x: 1,
        y: 1,
        z: 0,
      }),
    ).toThrow(RangeError);
    expect(() => world.body("missing")).toThrow(RangeError);
    expect(() => world.rigidBody("missing")).toThrow(RangeError);
  });
});

describe("3D pose from spawn", () => {
  const falling = () =>
    simulate(create(), (world) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
      world.addBody({
        id: "box",
        shape: { kind: "box", width: 1, height: 1, depth: 1 },
        x: 2,
        y: 3,
        z: 1,
      });
    });

  it("is zero movement and the spawn quaternion at time 0", () => {
    const pose = falling().pose("box", liveAt(0));
    expect([pose.x, pose.y, pose.z]).toEqual([0, 0, 0]);
    expect(pose.rotation).toEqual({ w: 1, x: 0, y: 0, z: 0 });
    expect(bodyPose3d(pose)).toEqual({});
  });

  it("moves from the spawn once it has fallen and settled", () => {
    const sim = falling();
    const time = liveAt(2000);
    const pose = sim.pose("box", time);
    expect(Math.abs(pose.x)).toBeLessThan(0.05);
    expect(Math.abs(pose.z)).toBeLessThan(0.05);
    expect(Math.abs(pose.y - (sim.at(time).box!.y - 3))).toBeLessThan(1e-9);
    expect(pose.y).toBeLessThan(-2);
  });

  it("throws RangeError for an unknown id", () => {
    expect(() => falling().pose("nope", liveAt(0))).toThrow(RangeError);
  });

  it("answers the same whatever the seek order", () => {
    const fresh = falling().pose("box", liveAt(2000));
    const sim = falling();
    sim.pose("box", liveAt(5000));
    const back = sim.pose("box", liveAt(2000));
    sim.pose("box", liveAt(1000));
    const forward = sim.pose("box", liveAt(2000));
    for (const other of [back, forward]) {
      expect(Math.abs(other.x - fresh.x)).toBeLessThan(1e-9);
      expect(Math.abs(other.y - fresh.y)).toBeLessThan(1e-9);
      expect(Math.abs(other.z - fresh.z)).toBeLessThan(1e-9);
      expect(Math.abs(other.rotation.w - fresh.rotation.w)).toBeLessThan(1e-9);
      expect(Math.abs(other.rotation.x - fresh.rotation.x)).toBeLessThan(1e-9);
      expect(Math.abs(other.rotation.y - fresh.rotation.y)).toBeLessThan(1e-9);
      expect(Math.abs(other.rotation.z - fresh.rotation.z)).toBeLessThan(1e-9);
    }
  });
});

describe("one snapshot format", () => {
  it("refuses a snapshot of the other dimension", () => {
    const world3d = create();
    world3d.addBody({ id: "a", shape: { kind: "sphere", radius: 0.5 }, x: 0, y: 0, z: 0 });
    const world2d = create2d();
    world2d.addBody({ id: "a", shape: { kind: "circle", radius: 10 }, x: 0, y: 0 });
    expect(() => world2d.restore(world3d.snapshot())).toThrow(
      new TypeError("rapierWorld: the snapshot is not from this adapter."),
    );
    expect(() => world3d.restore(world2d.snapshot())).toThrow(
      new TypeError("rapierWorld3d: the snapshot is not from this adapter."),
    );
  });
});
