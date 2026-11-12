import { defineMove, type Pose2d } from "@gerak/moves";

export const shockwave = defineMove({
  id: "shockwave",
  role: "exit",
  description:
    "A ring that bursts outward from an impact, fast then slowing, and fades as it grows.",
  options: {
    grow: {
      kind: "number",
      min: 1,
      max: 40,
      description: "Its size at the end, as a multiple of its size at rest.",
    },
  },
  example: { options: { grow: 10 } },
  moments: () => ({}),
  run: ({ grow }, { progress: p }): Pose2d => ({
    scale: 1 + (grow - 1) * (1 - (1 - p) ** 3),
    opacity: 1 - p,
  }),
});
