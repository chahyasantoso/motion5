import { definePlugin, isFlatRecord } from "@motion5/core/plugin-api";
import { Sprite2d } from "../models/index";

const ADDED = ["x", "y", "rotation"] as const;
const MULTIPLIED = ["scale", "scaleX", "scaleY", "opacity"] as const;

// Combines `Sprite2d` moves on one target: offsets and rotations add, scales and opacity multiply,
// the first pivot is kept, and a field no member publishes stays absent.
export const layerPlugin = definePlugin({
  id: "layer",
  inputs: {
    requires: { moves: { kind: "model", model: Sprite2d, binding: "map" } },
  },
  outputs: { values: Sprite2d },
  transform({ requires }) {
    const members: unknown[] = Object.values(Object(requires.moves));
    const out: Record<string, number | string> = {};
    for (const member of members) {
      if (!isFlatRecord(member)) continue;
      for (const key of ADDED) {
        const value = member[key];
        if (typeof value === "number") out[key] = Number(out[key] ?? 0) + value;
      }
      for (const key of MULTIPLIED) {
        const value = member[key];
        if (typeof value === "number") out[key] = Number(out[key] ?? 1) * value;
      }
      const origin = member.transformOrigin;
      if (typeof origin === "string" && out.transformOrigin === undefined)
        out.transformOrigin = origin;
    }
    return { values: out };
  },
});
