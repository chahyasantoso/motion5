import { defineMove } from "./declare";
import type { Reveal } from "./shapes";

/** Grows a circle from `(x, y)` to `radius`, easing in and out; the target shows through it. */
export const wipe = defineMove({
  id: "wipe",
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
  moments: () => ({}),
  run({ radius, x, y }, { progress }): Reveal {
    return { x, y, radius: radius * progress * progress * (3 - 2 * progress) };
  },
});
