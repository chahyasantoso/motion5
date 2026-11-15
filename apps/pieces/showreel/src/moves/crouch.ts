import { defineMove, type Pose2d } from "@gerak/moves";

const CURVES = {
  out: (p: number) => 1 - (1 - p) ** 3,
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2),
} as const;

export const crouch = defineMove({
  id: "crouch",
  role: "exit",
  description:
    "Sinks into a squash against the floor and holds it, gathering itself before a jump, a pop or a burst; the next move starts from the squash.",
  options: {
    squash: {
      kind: "number",
      min: 0,
      max: 0.9,
      description: "Height lost at the deepest, as a share of its height.",
    },
    bulge: {
      kind: "number",
      min: 0,
      max: 1.5,
      default: 0.8,
      description: "Width gained for each share of height lost; default 0.8.",
    },
    curve: {
      kind: "string",
      enum: ["out", "inOut"],
      default: "inOut",
      description:
        "How it sinks: out drops fast and slows, inOut eases at both ends; default inOut.",
    },
  },
  example: { options: { squash: 0.4, bulge: 0.75, curve: "inOut" } },
  moments: () => ({}),
  run: ({ squash, bulge, curve }, { progress }): Pose2d => {
    const k = CURVES[curve](progress);
    return { scaleY: 1 - squash * k, scaleX: 1 + squash * bulge * k, anchor: "bottom" };
  },
});
