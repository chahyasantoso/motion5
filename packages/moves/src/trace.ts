import { defineMove } from "./declare";
import type { Drawn } from "./shapes";

/** Draws a path on from its start; a renderer turns the share into its own stroke. */
export const trace = defineMove({
  id: "trace",
  role: "reveal",
  description: "Draws a stroked path on from its start.",
  options: {},
  example: { options: {} },
  moments: () => ({}),
  run(_options, { progress }): Drawn {
    return { drawn: progress };
  },
});
