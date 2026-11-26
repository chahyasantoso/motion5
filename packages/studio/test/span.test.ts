import { describe, expect, it } from "vitest";
import type { Card, StudioGraph } from "../src/graph";
import { castNamesOf, spanOf, type PageFacts } from "../src/canvas/span";

const cards: readonly Card[] = [
  { id: "scene:page", kind: "scene", name: "page", span: { from: 0, to: 8000 } },
  { id: "shot:a", kind: "shot", name: "a", parent: "scene:page", span: { from: 1000, to: 3000 } },
  { id: "scene:hero", kind: "scene", name: "hero", parent: "scene:page" },
  { id: "scene:empty", kind: "scene", name: "empty", parent: "scene:page" },
  { id: "beat:h1", kind: "beat", name: "h1", parent: "scene:hero", span: { from: 500, to: 900 } },
  { id: "beat:h2", kind: "beat", name: "h2", parent: "scene:hero", span: { from: 800, to: 2000 } },
  { id: "member:title", kind: "text", name: "title", parent: "scene:hero" },
  { id: "member:wash", kind: "box", name: "wash", parent: "scene:hero" },
  { id: "beat:o1", kind: "beat", name: "other", parent: "shot:a", span: { from: 1, to: 2 } },
];
const graph: StudioGraph = { piece: "page", cards, wires: [] };

const facts = (over: Partial<PageFacts>): PageFacts => ({
  driven: true,
  take: false,
  length: 10000,
  maxScroll: 5000,
  viewport: 800,
  bounds: [
    { top: 1500, bottom: 2200 },
    { top: 1800, bottom: 3000 },
  ],
  ...over,
});

describe("spanOf", () => {
  it("plays everything for the root scene", () => {
    expect(spanOf(graph, "scene:page", undefined)).toBeUndefined();
    expect(spanOf(graph, "scene:page", facts({}))).toBeUndefined();
  });

  it("takes a shot's span and a sub-scene's beats union on a timed page", () => {
    const timed = facts({ driven: false });
    expect(spanOf(graph, "shot:a", timed)).toEqual({ from: 1000, to: 3000 });
    expect(spanOf(graph, "scene:hero", timed)).toEqual({ from: 500, to: 2000 });
    expect(spanOf(graph, "scene:hero", undefined)).toEqual({ from: 500, to: 2000 });
    expect(spanOf(graph, "scene:empty", timed)).toBeUndefined();
  });

  it("maps the scroll range of the cast in view to ms on a driven page", () => {
    expect(spanOf(graph, "scene:hero", facts({}))).toEqual({ from: 1400, to: 6000 });
  });

  it("clamps to the page ends", () => {
    const near = facts({ bounds: [{ top: 300, bottom: 9000 }] });
    expect(spanOf(graph, "scene:hero", near)).toEqual({ from: 0, to: 10000 });
  });

  it("plays the whole piece when no cast is found or a take is wired", () => {
    expect(spanOf(graph, "scene:hero", facts({ bounds: [] }))).toBeUndefined();
    expect(spanOf(graph, "scene:hero", facts({ take: true }))).toBeUndefined();
    expect(spanOf(graph, "scene:hero", facts({ maxScroll: 0 }))).toBeUndefined();
  });
});

describe("castNamesOf", () => {
  it("lists the cast whose card parent is the row", () => {
    expect(castNamesOf(graph, "scene:hero")).toEqual(["title", "wash"]);
    expect(castNamesOf(graph, "scene:empty")).toEqual([]);
  });
});
