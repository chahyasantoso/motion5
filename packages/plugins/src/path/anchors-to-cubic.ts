import { definePlugin } from "@motion5/core/plugin-api";
import { toCubics } from "@motion5/moves";
import { Anchors2d, CubicPath2d } from "../models/path";

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
    const cubics = toCubics(
      anchors.map(({ id, cells }) => ({
        id,
        x: cells.x,
        y: cells.y,
        inX: cells.inX ?? 0,
        inY: cells.inY ?? 0,
        outX: cells.outX ?? 0,
        outY: cells.outY ?? 0,
      })),
    );
    return { values: cubics.map(({ id, ...cells }) => ({ id, cells })) };
  },
});
