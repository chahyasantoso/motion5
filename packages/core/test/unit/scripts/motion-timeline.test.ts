import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateV5, type ProjectDefinition } from "@motion5/core";
import { loadBuiltinCatalog } from "../../../../../scripts/motion-tools/catalog";
import { DEFAULT_SOURCE } from "../../../../../scripts/motion-tools/page";
import { parseProbeArgs } from "../../../../../scripts/motion-tools/probe";
import { sampleProject } from "../../../../../scripts/motion-tools/sample";
import { renderTimeline, timelineOf } from "../../../../../scripts/motion-tools/timeline";

async function beat(): Promise<ProjectDefinition> {
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "apps/react-demo/src/timing-beat.json"), "utf8"),
  );
  const validated = validateV5(raw, await loadBuiltinCatalog());
  if (validated.kind === "refused") throw new Error(JSON.stringify(validated.diagnostics));
  return validated.value;
}

describe("motion:timeline", () => {
  it("finds each node's start and rest within one step of what sampling publishes", async () => {
    const catalog = await loadBuiltinCatalog();
    const project = await beat();
    const timeline = timelineOf(project, catalog);
    if (timeline.kind !== "timeline") throw new Error(JSON.stringify(timeline));
    const dot = timeline.rows.find(({ node }) => node === "period/dot");
    if (dot?.kind !== "moves") throw new Error("The dot should move.");
    // The dot holds through its 880 ms delay and settles by delay plus duration.
    expect(Math.abs(dot.start - 880)).toBeLessThanOrEqual(timeline.step);
    expect(Math.abs(dot.rest - 1870)).toBeLessThanOrEqual(timeline.step);
    const sampled = sampleProject(project, catalog, { kind: "time", ms: [dot.rest, 2300] });
    if (sampled.kind !== "accepted") throw new Error(sampled.kind);
    expect(sampled.samples[0]?.nodes["period/dot"]).toEqual(
      sampled.samples[1]?.nodes["period/dot"],
    );
  });

  it("draws one bar per node with its times", async () => {
    const text = renderTimeline(timelineOf(await beat(), await loadBuiltinCatalog()));
    const dotLine = text.split("\n").find((line) => line.startsWith("period/dot"));
    expect(dotLine).toMatch(/^period\/dot +\.+#+\.+ {2}\d+-\d+ ms$/);
  });

  it("reports a still node and refuses a project with no times", async () => {
    const catalog = await loadBuiltinCatalog();
    const still = timelineOf(
      {
        schemaVersion: 5,
        motions: [
          {
            id: "m",
            trigger: { type: "time", duration: 100 },
            tracks: [
              {
                id: "p",
                output: { model: "Point2d" },
                input: { values: { x: 1, y: 2, rotation: 0 } },
              },
            ],
          },
        ],
      },
      catalog,
    );
    expect(still).toMatchObject({ kind: "timeline", rows: [{ kind: "still", node: "m/p" }] });
    const manual = timelineOf(
      { schemaVersion: 5, motions: [{ id: "m", trigger: { type: "manual" }, tracks: [] }] },
      catalog,
    );
    expect(manual.kind).toBe("not-timed");
  });
});

describe("motion:probe arguments", () => {
  it("reads a page, times and a selector", () => {
    expect(parseProbeArgs(["timing.html", "--at", "0,100", "--select", ".beat-dot"])).toEqual({
      kind: "ok",
      page: "timing.html",
      width: 1280,
      height: 720,
      at: [0, 100],
      select: ".beat-dot",
      source: DEFAULT_SOURCE,
    });
  });

  it.each([
    ["no selector", ["timing.html", "--at", "0"]],
    ["no times", ["timing.html", "--select", ".x"]],
    ["an unknown flag", ["timing.html", "--at", "0", "--select", ".x", "--zoom", "2"]],
  ])("refuses %s", (_name, argv) => {
    expect(parseProbeArgs(argv).kind).toBe("usage");
  });
});
