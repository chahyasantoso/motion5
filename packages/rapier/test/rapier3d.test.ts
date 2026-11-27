import { describe, expect, it } from "vitest";
import { liveAt, type Input, type InputEntry } from "@gerak/core";
import { simulate, type PhysicsWorld3d, type Spawner3d } from "@gerak/physics";
import { rapierEngine, rapierEngine3d } from "@gerak/rapier";
import { matrixFromEuler3d, matrixFromQuaternion, quaternionFromEuler3d } from "@gerak/core";
import { bodyPose3d } from "@gerak/rig";

/** How far a contact point may lie from the surfaces it names, in scene units. */
const POINT_TOLERANCE = 0.05;
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
      spawn: (event: InputEntry, world: Spawner3d) => {
        if (event.name === "drop") {
          world.addBody({
            id: `ball@${event.at}`,
            shape: { kind: "sphere", radius: 0.3 },
            x: event.point?.x ?? 0,
            y: 3,
            z: event.point?.y ?? 0,
            restitution: 0.3,
          });
        }
      },
    };
    const build = (world: PhysicsWorld3d) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
    };
    const drops: Input = [
      { kind: "trigger", name: "drop", at: 400, value: 1, point: { x: -0.5, y: 0.2 } },
      { kind: "trigger", name: "drop", at: 900, value: 1, point: { x: 0.8, y: -0.4 } },
    ];
    const sim = simulate(create(), build, options);
    expect(sim.bodies(liveAt(300), drops)).toEqual([]);
    expect(sim.bodies(liveAt(800), drops)).toEqual(["ball@400"]);
    const settled = sim.at(liveAt(2400), drops);
    expect(Object.keys(settled)).toEqual(["ball@400", "ball@900"]);
    expect(settled["ball@400"]?.y ?? 0).toBeCloseTo(0.3, 1);

    const earlier: Input = [
      { kind: "trigger", name: "drop", at: 200, value: 1, point: { x: 0, y: 0 } },
      ...drops,
    ];
    const fresh = simulate(create(), build, options);
    expect(sim.at(liveAt(2400), earlier)).toEqual(fresh.at(liveAt(2400), earlier));
  });

  it("answers a spawned body's pose from where the engine put it, exactly 0 when spawned, across seeks", () => {
    const options = {
      spawn: (event: InputEntry, world: Spawner3d) => {
        world.addBody({
          id: `box@${event.at}`,
          shape: { kind: "box", width: 0.2, height: 0.2, depth: 0.2 },
          x: 0.95,
          y: 2.1,
          z: 0.35,
        });
      },
    };
    const build = (world: PhysicsWorld3d) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
    };
    const drops: Input = [{ kind: "trigger", name: "drop", at: 400, value: 1 }];
    const sim = simulate(create(), build, options);
    const spawned = sim.pose("box@400", liveAt(420), drops);
    expect([spawned.x, spawned.z]).toEqual([0, 0]);
    expect(Object.keys(bodyPose3d(spawned))).toEqual(["y"]);

    const fell = sim.pose("box@400", liveAt(1500), drops);
    const earlier: Input = [{ kind: "trigger", name: "drop", at: 100, value: 1 }, ...drops];
    sim.pose("box@100", liveAt(2000), earlier);
    expect(sim.pose("box@400", liveAt(1500), drops)).toEqual(fell);
    const fresh = simulate(create(), build, options);
    expect(sim.pose("box@400", liveAt(1500), earlier)).toEqual(
      fresh.pose("box@400", liveAt(1500), earlier),
    );
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

  it("gives a contact its point, the other body, and a replay that matches after a seek", () => {
    const sim = simulate(create(), (world) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
      world.addBody({ id: "ball", shape: { kind: "sphere", radius: 0.5 }, x: 3, y: 2, z: -2 });
      world.addBody({
        id: "left",
        shape: { kind: "sphere", radius: 0.5 },
        x: -4,
        y: 5,
        z: 1,
        vx: 2,
      });
      world.addBody({
        id: "right",
        shape: { kind: "sphere", radius: 0.7 },
        x: -2,
        y: 5,
        z: 1,
        vx: -2,
      });
    });
    const events = sim.events(liveAt(800));
    const landing = events.find(({ target, other }) => target === "ball" && other === "floor");
    expect(landing).toBeDefined();
    expect(Math.abs((landing?.point?.x ?? 0) - 3)).toBeLessThan(POINT_TOLERANCE);
    expect(Math.abs(landing?.point?.y ?? 1)).toBeLessThan(POINT_TOLERANCE);
    expect(Math.abs((landing?.point?.z ?? 0) + 2)).toBeLessThan(POINT_TOLERANCE);

    const met = events.find(({ target }) => target === "left");
    expect(met?.other).toBe("right");
    expect(events.find(({ target }) => target === "right")?.other).toBe("left");
    const bodies = sim.at(liveAt(met?.at ?? 0));
    for (const [ball, radius] of [
      [bodies.left, 0.5],
      [bodies.right, 0.7],
    ] as const) {
      const distance = Math.hypot(
        (met?.point?.x ?? 0) - (ball?.x ?? 0),
        (met?.point?.y ?? 0) - (ball?.y ?? 0),
        (met?.point?.z ?? 0) - (ball?.z ?? 0),
      );
      expect(Math.abs(distance - radius)).toBeLessThan(POINT_TOLERANCE);
    }

    sim.events(liveAt(0));
    expect(sim.events(liveAt(800))).toEqual(events);
  });

  it("fast-forwards a late 3D spawn at 120 s to match a 0 ms spawn and rewinds cleanly", () => {
    const options = {
      spawn: (event: InputEntry, world: Spawner3d) => {
        if (event.name === "drop") {
          world.addBody({
            id: `ball@${event.at}`,
            shape: { kind: "sphere", radius: 0.4 },
            x: event.point?.x ?? 0,
            y: 2,
            z: 0,
            restitution: 0.4,
          });
        }
      },
    };
    const build = (world: PhysicsWorld3d) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
    };
    const late: Input = [
      { kind: "value", name: "scroll", at: 10_000, value: 200 },
      { kind: "value", name: "scroll", at: 50_000, value: 600 },
      { kind: "trigger", name: "drop", at: 120_000, value: 1, point: { x: 0.5, y: 0 } },
    ];
    const zero: Input = [
      { kind: "trigger", name: "drop", at: 0, value: 1, point: { x: 0.5, y: 0 } },
    ];
    const sim = simulate(create(), build, options);
    const zeroSim = simulate(create(), build, options);

    const began = performance.now();
    const at500 = sim.at(liveAt(120_500), late);
    const took = performance.now() - began;
    expect(took).toBeLessThan(50);
    expect(at500["ball@120000"]).toEqual(zeroSim.at(liveAt(500), zero)["ball@0"]);

    const at1500 = sim.at(liveAt(121_500), late);
    expect(at1500["ball@120000"]).toEqual(zeroSim.at(liveAt(1500), zero)["ball@0"]);

    const lateContacts = sim.events(liveAt(121_500), late);
    const zeroContacts = zeroSim.events(liveAt(1500), zero);
    expect(lateContacts.length).toBeGreaterThan(0);
    expect(lateContacts).toHaveLength(zeroContacts.length);
    lateContacts.forEach((contact, index) => {
      const expected = zeroContacts[index]!;
      expect(contact.at - expected.at).toBeCloseTo(120_000, 6);
      expect(contact.other).toBe(expected.other);
    });

    expect(sim.at(liveAt(120_100), late)["ball@120000"]).toEqual(
      zeroSim.at(liveAt(100), zero)["ball@0"],
    );
    expect(sim.at(liveAt(121_500), late)).toEqual(at1500);
    const earlier: Input = [
      { kind: "trigger", name: "drop", at: 60_000, value: 1, point: { x: -0.5, y: 0 } },
      ...late,
    ];
    const fresh = simulate(create(), build, options);
    expect(sim.at(liveAt(121_500), earlier)).toEqual(fresh.at(liveAt(121_500), earlier));
    expect(sim.events(liveAt(121_500), earlier)).toEqual(fresh.events(liveAt(121_500), earlier));
  });
});

describe("3D cylinder shapes and colliders", () => {
  it("drops an upright dynamic cylinder onto a floor with contact at y=0 and settles at height / 2", () => {
    const sim = simulate(create(), (world) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 }, { restitution: 0.2, friction: 0.6 });
      world.addBody({
        id: "puck",
        shape: { kind: "cylinder", radius: 0.4, height: 0.2 },
        x: 0.2,
        y: 2,
        z: -0.3,
        restitution: 0.2,
        friction: 0.6,
      });
    });

    const settled = sim.at(liveAt(2000)).puck;
    if (settled === undefined) throw new Error("expected puck state");
    expect(settled.y).toBeCloseTo(0.1, 2);
    const events = sim.events(liveAt(2000));
    const landing = events.find(({ target, other }) => target === "puck" && other === "floor");
    expect(landing).toBeDefined();
    expect(Math.abs(landing?.point?.y ?? 1)).toBeLessThan(POINT_TOLERANCE);
  });

  it("rolls a sideways cylinder across a floor while maintaining its radius height", () => {
    const sideways = quaternionFromEuler3d({ rotation: 0, rotationX: 90, rotationY: 0 });
    const sim = simulate(create(), (world) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 }, { friction: 0.8 });
      world.addBody({
        id: "wheel",
        shape: { kind: "cylinder", radius: 0.4, height: 0.2 },
        x: 0,
        y: 0.4,
        z: 0,
        vx: 3,
        rotation: sideways,
        friction: 0.8,
      });
    });

    const state = sim.at(liveAt(600)).wheel;
    if (state === undefined) throw new Error("expected wheel state");
    expect(state.x).toBeGreaterThan(0.8);
    expect(state.y).toBeCloseTo(0.4, 2);
    expect(Math.abs(state.wz)).toBeGreaterThan(10);
    expect(state.rotation).not.toEqual(sideways);
  });

  it("supports bodies and deflects strikers with a static cylinder collider", () => {
    const sim = simulate(create(), (world) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 });
      world.addCollider("post", {
        kind: "cylinder",
        x: 0,
        y: 0.5,
        z: 0,
        radius: 0.6,
        height: 1,
      });
      world.addBody({
        id: "perched",
        shape: { kind: "cylinder", radius: 0.25, height: 0.2 },
        x: 0,
        y: 2,
        z: 0,
      });
      world.addBody({
        id: "striker",
        shape: { kind: "sphere", radius: 0.3 },
        x: -2,
        y: 0.5,
        z: 0.1,
        vx: 6,
      });
    });

    const end = sim.at(liveAt(2000));
    expect(end.perched?.y ?? 0).toBeCloseTo(1.1, 2);
    expect(end.striker?.x ?? 0).toBeLessThan(-0.5);
  });

  it("produces bit-identical cylinder states and events across seek orders", () => {
    const build = (world: PhysicsWorld3d) => {
      world.setGravity(0, -9.81, 0);
      world.addCollider("floor", { kind: "floor", y: 0 }, { restitution: 0.4 });
      world.addCollider("pedestal", {
        kind: "cylinder",
        x: 0,
        y: 0.2,
        z: 0,
        radius: 0.5,
        height: 0.4,
      });
      world.addBody({
        id: "cylA",
        shape: { kind: "cylinder", radius: 0.3, height: 0.2 },
        x: 0,
        y: 1.5,
        z: 0,
        wx: 60,
        wz: 40,
        restitution: 0.4,
      });
    };

    const straight = simulate(create(), build);
    const jumping = simulate(create(), build);
    const times = [1600, 250, 1100, 0, 800, 1600];
    for (const ms of times) jumping.at(liveAt(ms));
    for (const ms of times) expect(jumping.at(liveAt(ms))).toEqual(straight.at(liveAt(ms)));
    expect(jumping.events(liveAt(1600))).toEqual(straight.events(liveAt(1600)));
  });

  it("throws RangeError on invalid cylinder radius or height", () => {
    const world = create();
    expect(() =>
      world.addBody({
        id: "bad-r",
        shape: { kind: "cylinder", radius: 0, height: 1 },
        x: 0,
        y: 1,
        z: 0,
      }),
    ).toThrow(RangeError);
    expect(() =>
      world.addBody({
        id: "bad-h",
        shape: { kind: "cylinder", radius: 0.5, height: -1 },
        x: 0,
        y: 1,
        z: 0,
      }),
    ).toThrow(RangeError);
    expect(() =>
      world.addCollider("bad-col-r", {
        kind: "cylinder",
        x: 0,
        y: 0,
        z: 0,
        radius: Number.NaN,
        height: 1,
      }),
    ).toThrow(RangeError);
    expect(() =>
      world.addCollider("bad-col-h", {
        kind: "cylinder",
        x: 0,
        y: 0,
        z: 0,
        radius: 0.5,
        height: 0,
      }),
    ).toThrow(RangeError);
  });
});
