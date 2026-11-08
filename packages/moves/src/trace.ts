import { defineMove } from "./declare";

/** Draws a path on from its start; a renderer turns the share into its own stroke. */
export const trace = defineMove({
  id: "trace",
  description: "Draws a stroked path on from its start.",
  options: {},
  inputs: {},
  output: "drawn",
  extras: {},
  run(_options, { progress }) {
    return { drawn: progress };
  },
});
