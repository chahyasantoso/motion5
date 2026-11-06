import { Spec, definePlugin } from "@motion5/core/plugin-api";
import { Point2d } from "../models";
import { CubicPath2d } from "./models";
import { pointAtArcFraction } from "./arc-fraction";

export const bezierPlugin = definePlugin({
  id: "bezier",
  inputs: {
    param: Spec.record({ t: Spec.number({ optional: true }) }),
    requires: {
      path: CubicPath2d,
    },
  },
  outputs: {
    values: Point2d,
  },
  transform({ param, requires: { path } }, { progress }) {
    const s = typeof param?.t === "number" ? param.t : progress;
    return {
      values: pointAtArcFraction(path, s),
    };
  },
});
