import { motion, type Pose2d, type Pose3d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  listPose,
  object,
  scene,
  sceneBuilder,
  stagger,
  text,
  type Scene,
  type Stage,
} from "../src";

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const clock = (ms: number, length = 1000): Time => ({
  progress: Math.min(1, ms / length),
  clock: { kind: "timed", elapsed: ms, length },
});
const slide = motion((t: Time): Pose2d => ({ x: 100 * t.progress }));
const lift = motion((t: Time): Pose2d => ({ y: -40 * t.progress }));
const fade = motion((t: Time): Pose2d => ({ opacity: t.progress }));
const spin = motion((t: Time): Pose3d => ({ rotationY: 90 * t.progress }));
const doubled = (signal: (time: Time, events: readonly never[]) => Pose2d) => signal;

function samples(stage: Stage): unknown[] {
  const out: unknown[] = [];
  for (const ms of [0, 150, 400, 650, 900, 1000]) {
    const { targets } = frame(stage, { time: clock(ms) });
    const row: Record<string, unknown> = {};
    for (const member of stage.members) {
      const value = targets[member.name];
      row[member.name] =
        member.kind === "list" ? [0, 1, 2].map((index) => listPose(value, index, 3)) : value;
    }
    out.push(row);
  }
  return out;
}

describe("scene", () => {
  const intro = beat("intro", 400);
  const outro = beat("outro", 500, { at: 500 });

  it("plays what the same calls on sceneBuilder play, at every sample", () => {
    const cast = () => ({
      card: box("card"),
      dots: box("dots", { parts: true }),
      title: text("title"),
      jar: object("jar"),
    });
    const { card, dots, title, jar } = cast();
    const again = cast();
    const written = scene(
      { name: "parity", length: 1000 },
      card
        .moves(slide.in(intro))
        .modifies((signal) => (time, events) => ({ ...signal(time, events), scale: 2 }))
        .moves(lift.in(outro))
        .shows({ until: outro })
        .limits({ jump: 300 }),
      dots.moves(stagger(fade.in(intro), { spread: 0.4 })),
      title,
      jar.moves(spin.in(outro)),
    );
    const chained = sceneBuilder({ name: "parity-chain", length: 1000 })
      .element(again.card)
      .motion(slide.in(intro))
      .modify((signal) => (time, events) => ({ ...signal(time, events), scale: 2 }))
      .motion(lift.in(outro))
      .show({ until: outro })
      .limits({ jump: 300 })
      .element(again.dots)
      .motion(stagger(fade.in(intro), { spread: 0.4 }))
      .element(again.title)
      .element(again.jar)
      .motion(spin.in(outro));
    const a = compiled(written);
    const b = compiled(chained);
    expect(a.signature).toBe(b.signature);
    expect(a.limits).toEqual(b.limits);
    expect(samples(a)).toEqual(samples(b));
  });

  it("never changes the element: each call returns a new binding", () => {
    const card = box("card");
    const first = card.moves(slide);
    const second = first.moves(lift);
    expect(first.steps).toHaveLength(1);
    expect(second.steps).toHaveLength(2);
    expect(Object.keys(card)).not.toContain("moves");
    const { targets } = frame(compiled(scene({ length: 1000 }, card)), { time: clock(500) });
    expect(targets["card"]).toBeUndefined();
  });

  it("keeps the binding methods out of an element's own enumerable keys", () => {
    for (const made of [box("card"), text("title"), object("jar")])
      for (const key of ["moves", "modifies", "shows", "limits"])
        expect(Object.keys(made)).not.toContain(key);
  });

  it("wraps only the motions written before a modifies", () => {
    const card = box("card");
    const stage = compiled(
      scene(
        { length: 1000 },
        card
          .moves(slide)
          .modifies((signal) => (time, events) => {
            const pose = signal(time, events);
            return { ...pose, x: (pose.x ?? 0) * 2 };
          })
          .moves(motion((t: Time): Pose2d => ({ x: t.progress }))),
      ),
    );
    expect(frame(stage, { time: clock(500) }).targets["card"]).toEqual({ x: 100.5 });
  });

  it("merges sub-scenes onto one clock with the elements around them", () => {
    const hero = scene({ name: "hero" }, box("a").moves(slide.in(intro)));
    const tail = scene({ name: "tail" }, box("b").moves(lift.in(outro)));
    const stage = compiled(scene({ name: "page", length: 1000 }, hero, tail, box("still")));
    expect(stage.members.map((member) => member.name)).toEqual(["a", "b", "still"]);
    const { targets } = frame(stage, { time: clock(750) });
    expect(targets["a"]).toEqual({ x: 100 });
    expect(targets["b"]).toEqual({ y: -20 });
  });

  it("refuses an element bound twice, directly or through a sub-scene", () => {
    const once = box("once");
    expect(() => scene({}, once.moves(slide), once.moves(lift))).toThrow(/twice/);
    const shared = box("shared");
    const sub = scene({ name: "sub" }, shared.moves(slide));
    expect(() => scene({}, sub, shared.moves(lift))).toThrow(/twice/);
    const late = box("late");
    const early = scene({ name: "early" }, late.moves(slide));
    expect(() => scene({}, late.moves(lift), early)).toThrow(/already belongs/);
  });

  it("refuses a limit set twice on one binding", () => {
    expect(() => scene({}, box("x").limits({ jump: 1 }).limits({ jump: 2 }))).toThrow(/twice/);
  });

  it("takes no options when the first item is an element", () => {
    const stage = compiled(scene(box("only").moves(slide.in(intro))));
    expect(frame(stage, { time: clock(200, 400) }).targets["only"]).toEqual({ x: 50 });
  });

  it("types a box's moves as 2D and an object's as 3D", () => {
    // @ts-expect-error a principle on a box wraps 2D poses, not 3D ones
    box("card").modifies((signal: (time: Time, events: readonly never[]) => Pose3d) => signal);
    // @ts-expect-error a box's motion cannot be a plain number
    box("card").moves(() => 1);
    object("jar").moves(spin);
    void doubled;
  });
});
