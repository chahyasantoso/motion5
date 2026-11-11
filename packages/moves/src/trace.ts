import { defineMove } from "./declare";
import type { Pose2d } from "./pose";

/** Draws a path on from its start, keeping `tail` of it drawn behind the head; a renderer dashes the stroke. */
export const trace = defineMove({
  id: "trace",
  role: "reveal",
  description:
    "Draws a stroked path on from its start, keeping a share of it drawn behind the head.",
  options: {
    tail: {
      kind: "number",
      default: 1,
      min: 0,
      max: 1,
      description: "Share of the path that stays drawn behind the head; default 1 keeps all of it.",
    },
  },
  example: { options: {} },
  moments: () => ({}),
  run({ tail }, { progress }): Required<Pick<Pose2d, "drawn" | "drawnFrom">> {
    return { drawn: progress, drawnFrom: Math.max(0, progress - tail) };
  },
});
