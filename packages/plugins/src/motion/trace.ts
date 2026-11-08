import { Spec, definePlugin } from "@motion5/core/plugin-api";
import { cssDash } from "@motion5/dom";
import { trace, window } from "@motion5/moves";
import { Stroke2d } from "../models/index";
import { CubicPath2d } from "../models/path";
import { pathArcLength } from "../path/arc-fraction";
import { FROM, TO, numberParam } from "./param";

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
  transform({ param, requires: { path } }, { progress, clock }) {
    const time = window(
      { progress, clock },
      numberParam(param, "from", 0),
      numberParam(param, "to", 1),
    );
    return { values: cssDash(trace.run({}, time, {}), pathArcLength(path)) };
  },
});
