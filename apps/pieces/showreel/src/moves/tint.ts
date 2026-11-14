import { defineMove, type Pose2d } from "@gerak/moves";

const CURVES = {
  linear: (p: number) => p,
  in: (p: number) => p * p * p,
  out: (p: number) => 1 - (1 - p) ** 3,
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2),
} as const;

export const tint = defineMove({
  id: "tint",
  role: "exit",
  description:
    "Turns a named custom number from 0 to an amount, for a colour charging, flipping or flashing that the page's CSS reads as --<name>; reversed, it turns back.",
  options: {
    name: {
      kind: "string",
      description: "The custom number's name; the page reads it as --<name>.",
    },
    amount: {
      kind: "number",
      default: 1,
      description: "Where the number ends; default 1, a full change of colour.",
    },
    curve: {
      kind: "string",
      enum: ["linear", "in", "out", "inOut"],
      default: "linear",
      description: "How the change is spread over the span; default linear.",
    },
  },
  example: { options: { name: "charge", amount: 1, curve: "inOut" } },
  moments: () => ({}),
  run: ({ name, amount, curve }, { progress }): Pose2d => ({
    custom: { [name]: amount * CURVES[curve](progress) },
  }),
});
