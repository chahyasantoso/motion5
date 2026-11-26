import { describe, expect, it } from "vitest";
import { parseLayout, prunedLayout, type StudioGraph } from "../src";

describe("the layout sidecar", () => {
  const graph: StudioGraph = {
    piece: "p",
    cards: [{ id: "shot:a", kind: "shot", name: "a" }],
    wires: [],
  };

  it("keeps only well-formed places, viewport and preview", () => {
    expect(
      parseLayout({
        cards: { "shot:a": { x: 1, y: 2, collapsed: true }, bad: { x: "1", y: 2 } },
        viewport: { x: 0, y: 0, zoom: 0 },
        preview: { preset: "tiktok", safeZone: 3 },
        extra: true,
      }),
    ).toEqual({
      cards: { "shot:a": { x: 1, y: 2, collapsed: true } },
      previews: [{ id: "output:preview", source: "", preset: "tiktok" }],
    });
    expect(parseLayout("nope")).toEqual({ cards: {} });
  });

  it("drops the places of cards the graph no longer lists", () => {
    const layout = { cards: { "shot:a": { x: 1, y: 2 }, "shot:gone": { x: 3, y: 4 } } };
    expect(prunedLayout(layout, graph).cards).toEqual({ "shot:a": { x: 1, y: 2 } });
  });
});
