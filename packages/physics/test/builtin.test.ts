import { describe, expect, it } from "vitest";
import { liveAt, seeded } from "@gerak/moves";
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
