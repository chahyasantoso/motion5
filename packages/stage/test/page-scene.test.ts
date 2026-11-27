import { INPUT_EVENTS, circlePath, motion, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  listPose,
  scene,
  scrollPoint,
  shape,
  stagger,
  text,
  type Scene,
  type Stage,
} from "../src";
import { boxInViewport, withPlacement } from "../src/render";

const at = (ms: number, length = 1000): Time => ({
  progress: length <= 0 ? 0 : ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const slideX = (distance: number) =>
  motion((time: Time): Pose2d => ({ x: distance * time.progress }));

describe("page scene compilation", () => {
  it("binds every element to its [data-cast] nodes and compiles split kinds onto lists", () => {
    const card = box("card");
    const title = text("title", { split: "words" });
    const line = shape("line", circlePath({ cx: 0, cy: 0, r: 5 }));
    const items = box("items", { parts: true });
    const stage = compiled(
      scene(
        box("wrap"),
        card,
        title,
        line,
        items.moves(slideX(10).in(beat("sb", { scroll: [scrollPoint(0), scrollPoint(500)] }))),
      ),
    );
    expect(stage.members.map((member) => [member.name, member.node])).toEqual([
      ["wrap", '[data-cast="wrap"]'],
      ["card", '[data-cast="card"]'],
      ["title", '[data-cast="title"]'],
      ["line", '[data-cast="line"]'],
      ["items", '[data-cast="items"]'],
    ]);
    const titleMember = stage.members.find((member) => member.name === "title");
    expect(titleMember?.kind === "list" ? titleMember.split : undefined).toBe("words");
  });

  it("compiles a page scene with only scroll or trigger beats and no length", () => {
    const scrollBeat = beat("s", { scroll: [scrollPoint(0), scrollPoint(400)] });
    const hero = box("hero");
    const stage = compiled(scene(hero.moves(slideX(50).in(scrollBeat))));
    expect(stage.durationMs).toBeGreaterThan(0);
    const out = frame(stage, {
      time: at(100, stage.durationMs),
      events: [{ kind: "value", name: INPUT_EVENTS.scroll, at: 50, value: 200 }],
    }).targets["hero"];
    expect(out).toEqual({ x: 25 });
  });
});

describe("lines and stagger by line", () => {
  it("gives line 0 headless on list parts and undefined on non-parts", () => {
    const headline = text("headline", {
      split: "words",
    });
    const card = box("card");
    let actorLine: number | undefined = -1;
    const partLines: (number | undefined)[] = [];
    const stage = compiled(
      scene(
        { length: 1000 },
        card.moves((_time, context) => {
          actorLine = context.line;
          return {};
        }),
        headline.moves((_time, context) => {
          if (context.index !== undefined) partLines[context.index] = context.line;
          return { x: (context.line ?? 0) * 10 };
        }),
      ),
    );
    const out = frame(stage, { time: at(0) }).targets;
    [0, 1, 2, 3].forEach((index) => listPose(out["headline"], index, 4));
    expect(actorLine).toBeUndefined();
    expect(partLines).toEqual([0, 0, 0, 0]);
  });

  it("staggers parts on the same line together when by is 'line', and reacts to resize lines", () => {
    const headline = text("headline", {
      split: "words",
    });
    const enter = beat("enter", 1000);
    const stage = compiled(
      scene(headline.moves(stagger(slideX(100), { spread: 1, by: "line" }).in(enter))),
    );

    const xs = (ms: number, lines?: Readonly<Record<string, readonly number[]>>): number[] => {
      const out = frame(stage, { time: at(ms, 1000), ...(lines === undefined ? {} : { lines }) })
        .targets["headline"];
      return [0, 1, 2, 3].map((index) => listPose(out, index, 4)?.x ?? -1);
    };

    // Headless with no measured lines: every word is on line 0, so all move together.
    expect(xs(500)).toEqual([50, 50, 50, 50]);

    // Narrow layout: two words on line 0, two words on line 1.
    // Span length = 1 + spread * 1 = 2; at t = 0.5 (pos * span = 1): line 0 is done (100), line 1 is starting (0).
    expect(xs(500, { headline: [0, 0, 1, 1] })).toEqual([100, 100, 0, 0]);
    expect(xs(750, { headline: [0, 0, 1, 1] })).toEqual([100, 100, 50, 50]);
    expect(xs(1000, { headline: [0, 0, 1, 1] })).toEqual([100, 100, 100, 100]);

    // After resize onto one line without changing part count: all share line 0 again.
    expect(xs(500, { headline: [0, 0, 0, 0] })).toEqual([50, 50, 50, 50]);
  });

  it("supports from: 'end' | 'center' | 'edges' when staggering by line", () => {
    const enter = beat("enter", 1000);
    const lines = { words: [0, 1, 1, 2] };

    const sample = (from: "start" | "end" | "center" | "edges"): number[] => {
      const words = text("words", { split: "words" });
      const stage = compiled(
        scene(words.moves(stagger(slideX(100), { spread: 1, from, by: "line" }).in(enter))),
      );
      const out = frame(stage, { time: at(500, 1000), lines }).targets["words"];
      return [0, 1, 2, 3].map((index) => listPose(out, index, 4)?.x ?? -1);
    };

    // Distinct lines: 0, 1, 2 (3 line groups, spread = 1 -> span = 3).
    // At t = 0.5, pos * span = 1.5 -> first rank is 100, middle rank is 50, last rank is 0.
    expect(sample("end")).toEqual([0, 50, 50, 100]);
    expect(sample("center")).toEqual([0, 100, 100, 0]);
    expect(sample("edges")).toEqual([100, 0, 0, 100]);
  });
});

describe("boxInViewport placements", () => {
  it("converts flow, fixed, and sticky boxes into viewport coordinates", () => {
    const flow = withPlacement({ x: 100, y: 800, width: 40, height: 40 }, { kind: "flow" });
    expect(boxInViewport(flow, 300)).toEqual({ x: 100, y: 500, width: 40, height: 40 });

    const fixed = withPlacement({ x: 100, y: 200, width: 40, height: 40 }, { kind: "fixed" });
    expect(boxInViewport(fixed, 900)).toEqual({ x: 100, y: 200, width: 40, height: 40 });

    const sticky = withPlacement(
      { x: 100, y: 1200, width: 40, height: 40 },
      { kind: "sticky", minY: 1000, maxY: 2000, pinY: 200 },
    );
    expect(boxInViewport(sticky, 500).y).toBe(700);
    expect(boxInViewport(sticky, 1000).y).toBe(200);
    expect(boxInViewport(sticky, 1500).y).toBe(200);
    expect(boxInViewport(sticky, 2200).y).toBe(0);
  });
});
