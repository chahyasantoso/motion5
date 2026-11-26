import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  nextPreviewId,
  parseLayout,
  prunedLayout,
  readLayout,
  resolvedSource,
  writeLayout,
  type StudioGraph,
} from "../src";

const graph: StudioGraph = {
  piece: "p",
  cards: [
    { id: "scene:root", kind: "scene", name: "root" },
    { id: "scene:hero", kind: "scene", name: "hero", parent: "scene:root" },
    { id: "shot:a", kind: "shot", name: "a", parent: "scene:root" },
    { id: "move:x", kind: "motion", name: "x" },
  ],
  wires: [],
};

describe("the previews of the sidecar", () => {
  it("parses entries and drops a malformed extra id", () => {
    const layout = parseLayout({
      previews: [
        { id: "output:preview", source: "shot:a", preset: "tiktok", safeZone: "tiktok" },
        { id: "preview:2", source: "scene:hero" },
        { id: "preview:x", source: "shot:a" },
        { id: "other", source: "shot:a" },
        { id: "preview:2", source: "shot:a" },
      ],
    });
    expect(layout.previews).toEqual([
      { id: "output:preview", source: "shot:a", preset: "tiktok", safeZone: "tiktok" },
      { id: "preview:2", source: "scene:hero" },
    ]);
  });

  it("reads the old single preview as the graph's preview", () => {
    expect(parseLayout({ preview: { preset: "tiktok", safeZone: "x" } }).previews).toEqual([
      { id: "output:preview", source: "", preset: "tiktok", safeZone: "x" },
    ]);
  });

  it("falls back to the root scene for a source the graph does not list", () => {
    expect(resolvedSource(graph, "shot:gone")).toBe("scene:root");
    expect(resolvedSource(graph, "move:x")).toBe("scene:root");
    expect(resolvedSource(graph, "shot:a")).toBe("shot:a");
    const pruned = prunedLayout(
      {
        cards: { "preview:2": { x: 1, y: 2 }, "shot:gone": { x: 3, y: 4 } },
        previews: [
          { id: "output:preview", source: "" },
          { id: "preview:2", source: "shot:gone" },
        ],
      },
      graph,
    );
    expect(pruned.cards).toEqual({ "preview:2": { x: 1, y: 2 } });
    expect(pruned.previews?.map((entry) => entry.source)).toEqual(["scene:root", "scene:root"]);
  });

  it("writes only the new shape", () => {
    const dir = mkdtempSync(join(tmpdir(), "layout-"));
    try {
      const path = join(dir, "p.json");
      writeLayout(path, parseLayout({ preview: { preset: "tiktok" } }), graph);
      const written: unknown = JSON.parse(readFileSync(path, "utf8"));
      expect(written).toEqual({
        cards: {},
        previews: [{ id: "output:preview", source: "scene:root", preset: "tiktok" }],
      });
      expect(readLayout(path).previews?.[0]?.source).toBe("scene:root");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("numbers extra previews from 2", () => {
    expect(nextPreviewId([{ id: "output:preview", source: "" }])).toBe("preview:2");
    expect(nextPreviewId([{ id: "preview:2", source: "" }])).toBe("preview:3");
  });
});
