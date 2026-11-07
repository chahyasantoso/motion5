import { Spec, definePlugin } from "@motion5/core/plugin-api";
import { Stroke2d } from "../models/index";
import { CubicPath2d } from "../models/path";
import { pathArcLength } from "../path/arc-fraction";
import { FROM, TO, moveProgress } from "./param";

/** Draws a stroked path on from its start, through a dash as long as the path. */
export const tracePlugin = definePlugin({
  id: "trace",
  inputs: {
    param: Spec.record(
      {
        from: Spec.number({ optional: true, min: 0, max: 1, description: FROM }),
        to: Spec.number({ optional: true, min: 0, max: 1, description: TO }),
      },
      { optional: true },
    ),
    requires: { path: CubicPath2d },
  },
  outputs: { values: Stroke2d },
  transform({ param, requires: { path } }, { progress }) {
    const length = pathArcLength(path);
    return {
      values: {
        strokeDasharray: `${length} ${length}`,
        strokeDashoffset: length * (1 - moveProgress(param, progress)),
      },
    };
  },
});
