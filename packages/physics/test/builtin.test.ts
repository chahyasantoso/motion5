import { describe, expect, it } from "vitest";
import { liveAt, seeded, type InputEntry } from "@gerak/core";
import { builtinWorld, simulate, type PhysicsWorld } from "@gerak/physics";
import { conformance } from "./conformance";

conformance("the built-in engine", builtinWorld);

describe("simulate's checkpoints", () => {
  it("thin out on a long run, and seeking still gives the same state", () => {
    const build = (world: PhysicsWorld) => {
      world.setGravity(0, 1500);
      world.addCollider("floor", { kind: "floor", y: 600 });
      world.addBody({
        id: "ball",
        shape: { kind: "circle", radius: 10 },
        x: 100,
        y: 0,
        vx: 50,
        restitution: 0.8,
      });
    };
    let saved = 0;
    const world = builtinWorld();
    const counting: PhysicsWorld = {
      addBody: (body) => world.addBody(body),
      addCollider: (id, collider, surface) => world.addCollider(id, collider, surface),
      setGravity: (x, y) => world.setGravity(x, y),
      step: (seconds) => world.step(seconds),
      body: (id) => world.body(id),
      drainContacts: () => world.drainContacts(),
      snapshot: () => {
        saved += 1;
        return world.snapshot();
      },
      restore: (snapshot) => world.restore(snapshot),
    };
    const capped = simulate(counting, build, { checkpointMs: 50, maxCheckpoints: 4 });
    const plain = simulate(builtinWorld(), build);
    capped.at(liveAt(3000));
    expect(saved).toBeGreaterThan(4);
    for (const ms of [2900, 120, 1777, 3000])
      expect(capped.at(liveAt(ms))).toEqual(plain.at(liveAt(ms)));
  });

  it("rewinds when a past event's value changes", () => {
    const sim = simulate(
      builtinWorld(),
      (world) => {
        world.setGravity(0, 0);
      },
      {
        spawn(event, world) {
          if (event.name === "drop") {
            world.addBody({
              id: "ball",
              shape: { kind: "circle", radius: 10 },
              x: event.value,
              y: 0,
            });
          }
        },
      },
    );
    expect(sim.at(liveAt(100), [{ kind: "trigger", name: "drop", at: 0, value: 10 }]).ball?.x).toBe(
      10,
    );
    expect(sim.at(liveAt(100), [{ kind: "trigger", name: "drop", at: 0, value: 40 }]).ball?.x).toBe(
      40,
    );
  });

  it("fast-forwards idle pre-spawn steps without stepping or checkpointing an empty world", () => {
    const build = (world: PhysicsWorld) => {
      world.setGravity(0, 1500);
      world.addCollider("floor", { kind: "floor", y: 600 });
    };
    const spawn = (event: InputEntry, world: { addBody: PhysicsWorld["addBody"] }) => {
      if (event.name !== "drop") return;
      world.addBody({
        id: "ball",
        shape: { kind: "circle", radius: 15 },
        x: 300,
        y: 100,
        restitution: 0.4,
      });
    };
    let steps = 0;
    let snapshots = 0;
    const raw = builtinWorld();
    const counted: PhysicsWorld = {
      addBody: (body) => raw.addBody(body),
      addCollider: (id, collider, surface) => raw.addCollider(id, collider, surface),
      setGravity: (x, y) => raw.setGravity(x, y),
      step: (seconds) => {
        steps += 1;
        raw.step(seconds);
      },
      body: (id) => raw.body(id),
      drainContacts: () => raw.drainContacts(),
      snapshot: () => {
        snapshots += 1;
        return raw.snapshot();
      },
      restore: (snapshot) => raw.restore(snapshot),
    };
    const sim = simulate(counted, build, { dt: 1 / 120, spawn });
    const zeroSim = simulate(builtinWorld(), build, { dt: 1 / 120, spawn });
    const events: InputEntry[] = [
      { kind: "value", name: "scroll", at: 10_000, value: 100 },
      { kind: "value", name: "scroll", at: 50_000, value: 400 },
      { kind: "value", name: "scroll", at: 90_000, value: 800 },
      { kind: "trigger", name: "drop", at: 120_000, value: 1 },
    ];
    const began = performance.now();
    const state = sim.at(liveAt(120_500), events);
    const took = performance.now() - began;
    expect(steps).toBe(60);
    expect(snapshots).toBeLessThanOrEqual(4);
    expect(state).toEqual(
      zeroSim.at(liveAt(500), [{ kind: "trigger", name: "drop", at: 0, value: 1 }]),
    );
    expect(took).toBeLessThan(50);
  });
});

describe("a confetti heap on the built-in engine", () => {
  it("falls fully asleep, thin pieces rocking on corners included", () => {
    const random = seeded(3);
    const sim = simulate(builtinWorld(), (world) => {
      world.setGravity(0, 1500);
      world.addCollider("floor", { kind: "floor", y: 400 }, { restitution: 0.45, friction: 0.9 });
      world.addCollider("left", { kind: "wall", x: -640, side: "left" });
      world.addCollider("right", { kind: "wall", x: 640, side: "right" });
      for (let i = 0; i < 120; i += 1) {
        const a = random() * Math.PI * 2;
        const speed = 300 + random() * 700;
        world.addBody({
          id: `bit${i}`,
          shape: { kind: "box", width: 14 + random() * 10, height: 5 + random() * 4 },
          x: (random() - 0.5) * 40,
          y: 0,
          angle: random() * 360,
          spin: (random() - 0.5) * 1400,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 380,
          restitution: 0.4,
          friction: 0.9,
          drag: 1.6 + random() * 2.2,
        });
      }
    });
    const awake = Object.entries(sim.at(liveAt(6000))).filter(
      ([, body]) => body.vx !== 0 || body.vy !== 0 || body.spin !== 0,
    );
    expect(awake.map(([id]) => id)).toEqual([]);
  });
});
