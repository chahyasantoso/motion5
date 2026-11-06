import { definePlugin } from "@motion5/core/plugin-api";
import { Anchors2d, CubicPath2d, type CubicPath2dCells } from "../models/path";

export const anchorsToCubicPlugin = definePlugin({
  id: "anchorsToCubic",
  inputs: {
    requires: {
      anchors: Anchors2d,
    },
  },
  outputs: {
    values: CubicPath2d,
  },
  transform({ requires: { anchors } }) {
    const segments: { readonly id: string; readonly cells: CubicPath2dCells }[] = [];
    for (let i = 0; i < anchors.length - 1; i++) {
      const p = anchors[i]!;
      const q = anchors[i + 1]!;
      segments.push({
        id: p.id,
        cells: {
          x0: p.cells.x,
          y0: p.cells.y,
          x1: p.cells.x + (p.cells.outX ?? 0),
          y1: p.cells.y + (p.cells.outY ?? 0),
          x2: q.cells.x + (q.cells.inX ?? 0),
          y2: q.cells.y + (q.cells.inY ?? 0),
          x3: q.cells.x,
          y3: q.cells.y,
        },
      });
    }
    return { values: segments };
  },
});
