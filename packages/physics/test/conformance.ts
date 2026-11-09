import { describe, expect, it } from "vitest";
import { liveAt, type Events, type MotionEvent } from "@motion5/moves";
import { simulate, type PhysicsWorld, type Spawner } from "@motion5/physics";

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

    it("slows a sliding box with friction, and never lifts it off the floor", () => {
      const sim = simulate(create(), (world) => {
        world.setGravity(0, G);
        world.addCollider("floor", { kind: "floor", y: FLOOR }, { friction: 0.8 });
        world.addBody({
          id: "box",
          shape: { kind: "box", width: 40, height: 40 },
          x: 200,
          y: FLOOR - 20,
          vx: 600,
          friction: 0.8,
        });
      });
      const path = Array.from(
        { length: 241 },
        (_, step) => sim.at(liveAt((step * 1000) / 120)).box,
      );
      for (const box of path) expect(box?.y ?? 0).toBeGreaterThan(FLOOR - 20 - 2);
      const end = path.at(-1);
      expect(Math.abs(end?.vx ?? 1)).toBeLessThan(2);
      expect(end?.x ?? 0).toBeLessThan(200 + (600 * 600) / (2 * 0.8 * G) + 20);
      expect(Math.abs(end?.rotation ?? 99)).toBeLessThan(5);
    });

    it("settles a heap of sticky bodies with nothing thrown above where it started", () => {
      const sim = simulate(create(), (world) => {
        world.setGravity(0, G);
        world.addCollider("floor", { kind: "floor", y: FLOOR }, { friction: 0.9 });
        world.addCollider("left", { kind: "wall", x: 500, side: "left" });
        world.addCollider("right", { kind: "wall", x: 780, side: "right" });
        for (let i = 0; i < 40; i += 1)
          world.addBody({
            id: `bit${i}`,
            shape:
              i % 3 === 0 ? { kind: "circle", radius: 10 } : { kind: "box", width: 28, height: 12 },
            x: 520 + ((i * 37) % 240),
            y: 100 + i * 9,
            angle: (i * 47) % 180,
            friction: 0.9,
            restitution: 0.2,
          });
      });
      for (let ms = 0; ms <= 6000; ms += 50)
        for (const [id, body] of Object.entries(sim.at(liveAt(ms)))) {
          const start = 100 + Number(id.slice(3)) * 9;
          expect(body.y, `${id} at ${ms} ms`).toBeGreaterThan(start - 40);
        }
      for (const body of Object.values(sim.at(liveAt(6000)))) {
        expect(Math.hypot(body.vx, body.vy)).toBeLessThan(5);
        expect(body.y).toBeLessThan(FLOOR);
      }
      const later = sim.at(liveAt(6500));
      for (const [id, body] of Object.entries(sim.at(liveAt(6000)))) {
        expect(Math.abs((later[id]?.x ?? 0) - body.x), `${id} creeps`).toBeLessThan(0.5);
        expect(Math.abs((later[id]?.y ?? 0) - body.y), `${id} creeps`).toBeLessThan(0.5);
      }
    });

    it("tips a box that lands on its corner flat onto a face, and lets it rest", () => {
      const sim = simulate(create(), (world) => {
        world.setGravity(0, G);
        world.addCollider("floor", { kind: "floor", y: FLOOR });
        world.addBody({
          id: "box",
          shape: { kind: "box", width: 60, height: 60 },
          x: 640,
          y: 450,
          angle: 30,
        });
      });
      const end = sim.at(liveAt(3000)).box;
      const off = (((end?.rotation ?? 45) % 90) + 90) % 90;
      expect(Math.min(off, 90 - off)).toBeLessThan(2);
      expect(Math.abs((end?.y ?? 0) - (FLOOR - 30))).toBeLessThan(1.5);
    });

    it("rolls a ball along the floor, turning clockwise as it goes right", () => {
      const sim = simulate(create(), (world) => {
        world.setGravity(0, G);
        world.addCollider("floor", { kind: "floor", y: FLOOR });
        world.addBody({
          id: "ball",
          shape: { kind: "circle", radius: 20 },
          x: 200,
          y: FLOOR - 20,
          vx: 400,
        });
      });
      const ball = sim.at(liveAt(500)).ball;
      expect(ball?.spin ?? 0).toBeGreaterThan(0);
      const rolling = ((ball?.spin ?? 0) * Math.PI * 20) / 180;
      expect(Math.abs(rolling - (ball?.vx ?? 0))).toBeLessThan(0.15 * Math.abs(ball?.vx ?? 1));
    });

    it("keeps a stack of three boxes standing, and never turns a fixed body", () => {
      const sim = simulate(create(), (world) => {
        world.setGravity(0, G);
        world.addCollider("floor", { kind: "floor", y: FLOOR });
        for (let i = 0; i < 3; i += 1)
          world.addBody({
            id: `stack${i}`,
            shape: { kind: "box", width: 50, height: 50 },
            x: 400,
            y: FLOOR - 25 - i * 50,
          });
        world.addBody({
          id: "fixed",
          shape: { kind: "box", width: 60, height: 60 },
          x: 900,
          y: 450,
          angle: 30,
          fixedRotation: true,
        });
      });
      const end = sim.at(liveAt(3000));
      for (let i = 0; i < 3; i += 1) {
        expect(Math.abs((end[`stack${i}`]?.x ?? 0) - 400)).toBeLessThan(3);
        expect(Math.abs(end[`stack${i}`]?.rotation ?? 99)).toBeLessThan(3);
      }
      expect(end.fixed?.rotation).toBeCloseTo(30, 3);
    });

    it("spawns bodies on events, the same however time and events arrive", () => {
      const options = {
        spawn: (event: MotionEvent, world: Spawner) => {
          if (event.name === "drop")
            world.addBody({
              id: `ball@${event.at}`,
              shape: { kind: "circle", radius: 15 },
              x: event.x ?? 0,
              y: event.y ?? 0,
              restitution: 0.3,
            });
        },
      };
      const build = (world: PhysicsWorld) => {
        world.setGravity(0, G);
        world.addCollider("floor", { kind: "floor", y: FLOOR });
      };
      const drops: Events = [
        { name: "drop", at: 500, x: 300, y: 100 },
        { name: "drop", at: 900, x: 700, y: 100 },
      ];
      const sim = simulate(create(), build, options);
      expect(sim.bodies(liveAt(400), drops)).toEqual([]);
      expect(sim.place("ball@500", liveAt(400), drops).opacity).toBe(0);
      expect(sim.bodies(liveAt(600), drops)).toEqual(["ball@500"]);
      const settled = sim.at(liveAt(2500), drops);
      expect(Object.keys(settled)).toEqual(["ball@500", "ball@900"]);
      for (const ball of Object.values(settled))
        expect(Math.abs(ball.y - (FLOOR - 15))).toBeLessThan(1);
      expect(sim.place("ball@900", liveAt(2500), drops)).toMatchObject({ x: 700, opacity: 1 });
      expect([...new Set(sim.events(liveAt(2500), drops).map(({ target }) => target))]).toEqual([
        "ball@500",
        "ball@900",
      ]);
      sim.at(liveAt(700), drops);
      expect(sim.at(liveAt(2500), drops)).toEqual(settled);
      const earlier: Events = [{ name: "drop", at: 300, x: 500, y: 100 }, ...drops];
      const fresh = simulate(create(), build, options);
      expect(sim.at(liveAt(2500), earlier)).toEqual(fresh.at(liveAt(2500), earlier));
      expect(sim.events(liveAt(2500), earlier)).toEqual(fresh.events(liveAt(2500), earlier));
    });
  });
}
