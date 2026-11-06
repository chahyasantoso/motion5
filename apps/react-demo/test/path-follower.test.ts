import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type Value } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { builtinModels, type CubicPath2dCells } from "@motion5/plugins/models";
import { anchorsToCubicPlugin } from "@motion5/plugins/path/anchors-to-cubic";
import { bezierPlugin } from "@motion5/plugins/path/bezier";
import { cubicPathToSvg } from "@motion5/plugins/path/draw";
import { pathFollowerProject } from "../src/path-follower-project";

function load() {
  const engine = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({
      models: [...builtinModels],
      plugins: [anchorsToCubicPlugin, bezierPlugin],
    }),
  });
  const handle = engine.load(pathFollowerProject);
  for (const track of pathFollowerProject.motions?.[0]?.tracks ?? [])
    handle.mount(`follow/${track.id}`);
  return handle;
}

function numbersOf(value: Value): Readonly<Record<string, number>> {
  if (Array.isArray(value)) throw new Error("expected a record");
  const numbers: Record<string, number> = {};
  for (const [key, cell] of Object.entries(value))
    if (typeof cell === "number") numbers[key] = cell;
  return numbers;
}

function field(numbers: Readonly<Record<string, number>>, key: string): number {
  const value = numbers[key];
  if (value === undefined) throw new Error(`missing cell ${key}`);
  return value;
}

function segmentsOf(value: Value): readonly { readonly cells: CubicPath2dCells }[] {
  if (!Array.isArray(value)) throw new Error("expected a table");
  return value.map((row) => {
    const n = numbersOf(row.cells);
    return {
      cells: {
        x0: field(n, "x0"),
        y0: field(n, "y0"),
        x1: field(n, "x1"),
        y1: field(n, "y1"),
        x2: field(n, "x2"),
        y2: field(n, "y2"),
        x3: field(n, "x3"),
        y3: field(n, "y3"),
      },
    };
  });
}

function publishedValues(handle: ReturnType<typeof load>, node: string) {
  const patch = handle.get(node);
  if (patch?.status !== "ready") throw new Error(`Node ${node} is not ready`);
  const values = patch.outputs.values;
  if (values === undefined) throw new Error(`Node ${node} publishes no values`);
  return values;
}

describe("react-demo path follower", () => {
  it("publishes the outline as a cubic path a host can draw", () => {
    const handle = load();
    try {
      handle.seek("follow/path", 0);
      const segments = segmentsOf(publishedValues(handle, "follow/path"));
      expect(cubicPathToSvg(segments)).toBe("M 0 0 C 10 0, 90 0, 100 0");
    } finally {
      handle.dispose();
    }
  });

  it("publishes a finite point on the path for the card", () => {
    const handle = load();
    try {
      handle.seek("follow/card", 0.5);
      const point = numbersOf(publishedValues(handle, "follow/card"));
      expect(Number.isFinite(point.x)).toBe(true);
      expect(Number.isFinite(point.y)).toBe(true);
      expect(Number.isFinite(point.rotation)).toBe(true);
      expect(point.x).toBeCloseTo(50, 5);
    } finally {
      handle.dispose();
    }
  });
});
