import { defineMove } from "./declare";
import type { Pose2d } from "@gerak/core";
import { taper } from "@gerak/core";
import { wave } from "@gerak/core";

const fade = taper({ power: 1 });

/** Hangs in from a turn of `angle` degrees and swings to rest like a sign on a hinge. */
export const swing = defineMove({
  id: "swing",
  role: "enter",
  description: "Hangs in from a turn and swings to rest, each swing smaller than the last.",
  options: {
    angle: { kind: "number", description: "Start turned this far, in degrees." },
    swings: {
      kind: "number",
      default: 2,
      min: 0,
      max: 8,
      description: "Half-swings before it settles; default 2.",
    },
    anchor: {
      kind: "string",
      enum: ["center", "bottom", "top", "left", "right"],
      default: "top",
      description: "The hinge, the point that stays put; default top.",
    },
  },
  example: { options: { angle: 35, swings: 2, anchor: "top" } },
  run({ angle, swings, anchor }, { progress }): Pose2d {
    const turn = wave({ count: (swings + 0.5) / 2, phase: 0.25 })(progress);
    return { rotation: angle * fade(progress) * turn, anchor };
  },
  moments: () => ({}),
});
