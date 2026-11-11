import { defineMove } from "./declare";
import type { Pose2d } from "./pose";

/** Grows a circle from `(x, y)` to `radius`, easing in and out; the target shows through it. */
export const wipe = defineMove({
  id: "wipe",
  role: "reveal",
  description: "Reveals the target through a circle that grows from a point, easing in and out.",
  options: {
    radius: {
      kind: "number",
      min: 0,
      description: "Final circle radius, in px; cover the stage's far corner.",
    },
    x: { kind: "number", description: "Circle centre from the target's left edge, in px." },
    y: { kind: "number", description: "Circle centre from the target's top edge, in px." },
  },
  example: { options: { radius: 900, x: 400, y: 300 } },
  moments: () => ({}),
  run({ radius, x, y }, { progress }): Required<Pick<Pose2d, "clipX" | "clipY" | "clipRadius">> {
    return { clipX: x, clipY: y, clipRadius: radius * progress * progress * (3 - 2 * progress) };
  },
});
