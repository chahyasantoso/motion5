import { definePlugin, diagnostic, ok, prepareRefused } from "@motion5/core/plugin-api";
import { Points2d, type Anchor2dCells } from "../models";
import { Anchors2d, LocalAnchors2d } from "./models";
import { nonEmptyDiagnostics } from "../prepare-diagnostics";

function turnVector(
  vx: number,
  vy: number,
  rad: number,
): { readonly x: number; readonly y: number } {
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: vx * cos - vy * sin,
    y: vx * sin + vy * cos,
  };
}

function turnHandle(
  hx: number | undefined,
  hy: number | undefined,
  rad: number,
  prefix: "in" | "out",
): {
  readonly inX?: number;
  readonly inY?: number;
  readonly outX?: number;
  readonly outY?: number;
} {
  if (hx === undefined && hy === undefined) return {};
  const vec = turnVector(hx ?? 0, hy ?? 0, rad);
  const x = Math.abs(vec.x) < 1e-12 ? 0 : vec.x;
  const y = Math.abs(vec.y) < 1e-12 ? 0 : vec.y;
  const includeX = hx !== undefined || Math.abs(vec.x) >= 1e-9;
  const includeY = hy !== undefined || Math.abs(vec.y) >= 1e-9;
  if (prefix === "in") {
    return {
      ...(includeX ? { inX: x } : {}),
      ...(includeY ? { inY: y } : {}),
    };
  }
  return {
    ...(includeX ? { outX: x } : {}),
    ...(includeY ? { outY: y } : {}),
  };
}

export const skinAnchorsPlugin = definePlugin({
  id: "skinAnchors",
  inputs: {
    values: LocalAnchors2d,
    requires: {
      frames: Points2d,
    },
  },
  outputs: {
    values: Anchors2d,
  },
  prepare({ values, structures: { frames } }) {
    if (!Array.isArray(values)) return ok(undefined);
    const missing = values.filter((row) => !frames.indexById.has(row.id));
    const refused = nonEmptyDiagnostics(
      missing.map((row) =>
        diagnostic(
          "plugin-validation-failed",
          "values",
          `Anchor '${row.id}' names no bone in frames.`,
        ),
      ),
    );
    return refused === undefined ? ok(undefined) : prepareRefused(refused);
  },
  transform({ values: local, requires: { frames }, structures: { frames: frameStruct } }) {
    const anchors: { readonly id: string; readonly cells: Anchor2dCells }[] = [];
    for (const row of local) {
      const frameIndex = frameStruct.indexById.get(row.id);
      if (frameIndex === undefined) {
        throw new TypeError(`Anchor '${row.id}' names no bone in frames.`);
      }
      const frame = frames[frameIndex]!.cells;
      const rad = (frame.rotation * Math.PI) / 180;
      const pos = turnVector(row.cells.x ?? 0, row.cells.y ?? 0, rad);
      const x = frame.x + pos.x;
      const y = frame.y + pos.y;

      const inHandles = turnHandle(row.cells.inX, row.cells.inY, rad, "in");
      const outHandles = turnHandle(row.cells.outX, row.cells.outY, rad, "out");

      anchors.push({
        id: row.id,
        cells: {
          x,
          y,
          ...inHandles,
          ...outHandles,
        },
      });
    }
    return { values: anchors };
  },
});
