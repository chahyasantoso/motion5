import { describe, expect, it } from "vitest";
import { liveAt } from "@motion5/moves";
import { simulate, type PhysicsWorld } from "@motion5/physics";

const G = 2000;
const FLOOR = 600;

/** A ball of radius 20 dropped from 200 px above the floor, with walls either side. */
function dropBall(world: PhysicsWorld, restitution = 0): void {
  world.setGravity(0, G);
  world.addCollider("floor", { kind: "floor", y: FLOOR });
  world.addCollider("left", { kind: "wall", x: 0, side: "left" });
  world.addCollider("right", { kind: "wall", x: 1280, side: "right" });
  world.addBody({ id: "ball", shape: { kind: "circle", radius: 20 }, x: 640, y: 380, restitution });
}

/** What every engine behind `PhysicsWorld` must do; each engine is held to itself, never to another. */
export function conformance(engine: string, create: () => PhysicsWorld): void {
  describe(`${engine} behind PhysicsWorld`, () => {
    it("drops a ball onto the floor, where it rests, with one contact at the landing", () => {
      const sim = simulate(create(), (world) => dropBall(world));
      const rest = sim.at(liveAt(2000)).ball;
      expect(Math.abs((rest?.y ?? 0) - (FLOOR - 20))).toBeLessThan(1);
      expect(Math.abs(rest?.vy ?? 1)).toBeLessThan(1);
      const landing = Math.sqrt((2 * 200) / G) * 1000;
      const contacts = sim.events(liveAt(2000));
      expect(contacts).toHaveLength(1);
      expect(contacts[0]?.target).toBe("ball");
      expect(Math.abs((contacts[0]?.at ?? 0) - landing)).toBeLessThan(25);
    });

    it("bounces lower each time with restitution, and stays between its walls", () => {
      const sim = simulate(create(), (world) => {
        dropBall(world, 0.7);
        world.addBody({
          id: "rolling",
          shape: { kind: "box", width: 30, height: 30 },
          x: 100,
          y: 585,
          vx: -900,
        });
      });
      const ys = Array.from(
        { length: 361 },
        (_, step) => sim.at(liveAt((step * 1000) / 120)).ball?.y ?? 0,
      );
      const peaks = ys.filter(
        (y, index) => index > 0 && y < (ys[index - 1] ?? y) && y < (ys[index + 1] ?? y),
      );
      expect(peaks.length).toBeGreaterThanOrEqual(2);
      const heights = peaks
        .map((y) => FLOOR - 20 - y)
        .filter((height) => height > 2)
        .slice(0, 3);
      expect(heights[0]).toBeGreaterThan(10);
      for (let i = 1; i < heights.length; i += 1)
        expect(heights[i] ?? 0).toBeLessThan(heights[i - 1] ?? 0);
      expect(
        sim.events(liveAt(3000)).filter(({ target }) => target === "ball").length,
      ).toBeGreaterThanOrEqual(2);
      expect(sim.at(liveAt(3000)).rolling?.x).toBeGreaterThanOrEqual(15 - 1);
    });

    it("gives the same next step after a snapshot is restored", () => {
      const world = create();
      dropBall(world, 0.5);
      for (let i = 0; i < 40; i += 1) world.step(1 / 120);
      const saved = world.snapshot();
      world.step(1 / 120);
      const once = world.body("ball");
      for (let i = 0; i < 30; i += 1) world.step(1 / 120);
      world.restore(saved);
      world.step(1 / 120);
      expect(world.body("ball")).toEqual(once);
    });

    it("gives the same state at a time whatever order the times are asked in", () => {
      const build = (world: PhysicsWorld) => {
        dropBall(world, 0.6);
        for (let i = 0; i < 12; i += 1)
          world.addBody({
            id: `box${i}`,
            shape: { kind: "box", width: 24, height: 24 },
            x: 300 + i * 40,
            y: 100 + (i % 3) * 30,
            vx: (i % 5) * 60 - 120,
            restitution: 0.3,
          });
      };
      const straight = simulate(create(), build);
      const jumping = simulate(create(), build);
      const times = [1700, 300, 1250, 0, 990, 1700, 40];
      for (const ms of times) jumping.at(liveAt(ms));
      for (const ms of times) expect(jumping.at(liveAt(ms))).toEqual(straight.at(liveAt(ms)));
      expect(jumping.events(liveAt(1700))).toEqual(straight.events(liveAt(1700)));
    });
  });
}
