import { defineMove, type Pose2d } from "@gerak/moves";

const CURVES = {
  out: (p: number) => 1 - (1 - p) ** 3,
  in: (p: number) => p * p * p,
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2),
} as const;

export const push = defineMove({
  id: "push",
  role: "exit",
  description:
    "Scales from full size to a given size about its centre, as a camera pushing in or pulling out; reversed, a camera that starts pushed in eases back to rest.",
  options: {
    to: {
      kind: "number",
      min: 0.1,
      max: 4,
      description: "The size it ends at, 1 being rest; above 1 pushes in, below pulls out.",
    },
    curve: {
      kind: "string",
      enum: ["out", "in", "inOut"],
      default: "inOut",
      description: "How the change is spread over the span; default inOut, a slow push.",
    },
  },
  example: { options: { to: 1.05, curve: "inOut" } },
  moments: () => ({}),
  run: ({ to, curve }, { progress }): Pose2d => ({
    scale: 1 + (to - 1) * CURVES[curve](progress),
  }),
});
