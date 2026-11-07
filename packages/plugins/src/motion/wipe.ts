import { Spec, definePlugin } from "@motion5/core/plugin-api";
import { Clip2d } from "../models/index";
import { FROM, TO, moveProgress, numberParam } from "./param";

/** Grows a circular `clipPath` from `(x, y)` to `radius`, easing in and out; the target shows through it. */
export const wipePlugin = definePlugin({
  id: "wipe",
  inputs: {
    param: Spec.record({
      radius: Spec.number({
        min: 0,
        description: "Final circle radius, in px; cover the stage's far corner.",
      }),
      x: Spec.number({ description: "Circle centre from the target's left edge, in px." }),
      y: Spec.number({ description: "Circle centre from the target's top edge, in px." }),
      from: Spec.number({ optional: true, min: 0, max: 1, description: FROM }),
      to: Spec.number({ optional: true, min: 0, max: 1, description: TO }),
    }),
  },
  outputs: { values: Clip2d },
  transform({ param }, { progress }) {
    const local = moveProgress(param, progress);
    const radius = numberParam(param, "radius", 0) * local * local * (3 - 2 * local);
    const x = numberParam(param, "x", 0);
    const y = numberParam(param, "y", 0);
    return { values: { clipPath: `circle(${radius}px at ${x}px ${y}px)` } };
  },
});
