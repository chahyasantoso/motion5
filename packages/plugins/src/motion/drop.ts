import { Spec, definePlugin } from "@motion5/core/plugin-api";
import { Sprite2d } from "../models/index";
import { FROM, TO, moveProgress, numberParam, squashPose } from "./param";

const FALL_SHARE = 0.75;

/** Falls from `distance` above its rest pose, accelerating, then lands and recovers from `squash`. */
export const dropPlugin = definePlugin({
  id: "drop",
  inputs: {
    param: Spec.record({
      distance: Spec.number({ min: 0, description: "Start this far above rest, in px." }),
      squash: Spec.number({
        optional: true,
        min: 0,
        max: 1,
        description: "Height lost on landing, as a share; default 0.",
      }),
      from: Spec.number({ optional: true, min: 0, max: 1, description: FROM }),
      to: Spec.number({ optional: true, min: 0, max: 1, description: TO }),
    }),
  },
  outputs: { values: Sprite2d },
  transform({ param }, { progress }) {
    const distance = numberParam(param, "distance", 0);
    const squash = numberParam(param, "squash", 0);
    const local = moveProgress(param, progress);
    const fall = Math.min(1, local / FALL_SHARE);
    const settled = Math.max(0, (local - FALL_SHARE) / (1 - FALL_SHARE));
    const weight = local < FALL_SHARE ? 0 : (1 - settled) ** 2;
    return {
      values: {
        y: 0 - distance * (1 - fall * fall),
        ...squashPose(squash, weight),
      },
    };
  },
});
