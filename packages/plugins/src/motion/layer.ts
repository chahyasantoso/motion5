import { definePlugin, isFlatRecord, type PrimitiveScalar } from "@motion5/core/plugin-api";
import { combine, type Pose2d } from "@motion5/moves";
import { Sprite2d } from "../models/index";
import { spriteCells } from "./move-plugin";

const NUMBERS = ["x", "y", "rotation", "scale", "scaleX", "scaleY", "opacity"] as const;

function poseOf(cells: Readonly<Record<string, unknown>>): Pose2d {
  const pose: { -readonly [K in (typeof NUMBERS)[number]]?: number } = {};
  for (const key of NUMBERS) {
    const value = cells[key];
    if (typeof value === "number") pose[key] = value;
  }
  return pose;
}

// Combines `Sprite2d` moves on one target: offsets and rotations add, scales and opacity multiply,
// the first pivot is kept, and a field no member publishes stays absent.
export const layerPlugin = definePlugin({
  id: "layer",
  inputs: {
    requires: { moves: { kind: "model", model: Sprite2d, binding: "map" } },
  },
  outputs: { values: Sprite2d },
  transform({ requires }) {
    const members = Object.values(Object(requires.moves)).filter(isFlatRecord);
    const out: Record<string, PrimitiveScalar> = { ...spriteCells(combine(members.map(poseOf))) };
    const origin = members
      .map((member) => member.transformOrigin)
      .find((o) => typeof o === "string");
    if (typeof origin === "string") out.transformOrigin = origin;
    return { values: out };
  },
});
