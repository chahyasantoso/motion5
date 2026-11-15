import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";

/** Fades in, opacity from 0 to 1. */
export const fade = defineMove({
  id: "fade",
  role: "enter",
  description: "Fades in from clear to opaque.",
  options: {},
  example: { options: {} },
  run(_options, { progress }): Pose2d {
    return { opacity: progress };
  },
  moments: () => ({}),
});
