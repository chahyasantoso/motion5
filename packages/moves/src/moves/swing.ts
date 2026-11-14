import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";

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
    const turn = Math.cos(Math.PI * (swings + 0.5) * progress);
    return { rotation: angle * (1 - progress) * turn, anchor };
  },
  moments: () => ({}),
});
