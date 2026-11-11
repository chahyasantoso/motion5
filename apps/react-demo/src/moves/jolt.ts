import { defineMove, type Pose2d } from "@gerak/moves";

export const jolt = defineMove({
  id: "jolt",
  role: "emphasis",
  description:
    "Jolts up and down from an impact, with a smaller side-to-side shudder, dying away; for a camera or a floor that takes a hit.",
  options: {
    distance: { kind: "number", min: 0, description: "The most it moves up or down, in px." },
    count: {
      kind: "number",
      min: 1,
      max: 6,
      default: 4,
      description: "Up-and-down cycles over the span; default 4.",
    },
    sideways: {
      kind: "number",
      min: 0,
      max: 1,
      default: 0.35,
      description: "Side-to-side shudder as a share of the distance; default 0.35.",
    },
  },
  example: { options: { distance: 10, count: 5, sideways: 0.35 } },
  moments: () => ({}),
  run: ({ distance, count, sideways }, { progress: p }): Pose2d => {
    const envelope = (1 - p) ** 2 * Math.exp(-3 * p) * (1 - Math.exp(-p * 25));
    return {
      y: distance * envelope * Math.sin(2 * Math.PI * count * p),
      x: distance * sideways * envelope * Math.sin(2 * Math.PI * count * 0.64 * p),
    };
  },
});
