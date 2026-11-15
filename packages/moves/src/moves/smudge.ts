import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";

/** Blurs from sharp to `amount` as speed builds; reversed, it sharpens as it slows. */
export const smudge = defineMove({
  id: "smudge",
  role: "exit",
  description:
    "Blurs from sharp to a given blur as speed builds, for motion blur on something leaping, falling or thrown away; reversed, it sharpens as it slows.",
  options: {
    amount: { kind: "number", min: 0, description: "The blur it ends at, in px." },
    build: {
      kind: "number",
      min: 0.05,
      max: 1,
      default: 1,
      description: "Share of the span the blur takes to build, then holds; default 1.",
    },
  },
  example: { options: { amount: 5, build: 0.5 } },
  moments: ({ build }) => ({ full: build }),
  run: ({ amount, build }, { progress }): Pose2d => {
    const q = Math.min(1, progress / build);
    return { blur: amount * q * q };
  },
});
