import { describe, expect, it } from "vitest";
import { liveAt } from "@motion5/moves";
import { builtinWorld, simulate, type PhysicsWorld } from "@motion5/physics";
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
