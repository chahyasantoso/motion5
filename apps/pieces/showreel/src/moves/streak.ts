import { defineMove, type Pose2d } from "@gerak/moves";

export const streak = defineMove({
  id: "streak",
  role: "follow",
  description:
    "Runs a drawn window along a stroke: the head draws on, the tail follows behind and catches it at the end, leaving nothing; a trail behind something thrown.",
  options: {
    arrive: {
      kind: "number",
      min: 0.05,
      max: 1,
      default: 0.65,
      description: "Share of the span at which the head reaches the stroke's end; default 0.65.",
    },
    lag: {
      kind: "number",
      min: 0,
      max: 0.95,
      default: 0.35,
      description: "Share of the span before the tail starts to follow; default 0.35.",
    },
  },
  example: { options: { arrive: 0.65, lag: 0.35 } },
  moments: ({ arrive, lag }) => ({ headArrives: arrive, tailStarts: lag }),
  run: ({ arrive, lag }, { progress }): Pose2d => ({
    drawn: Math.min(1, progress / arrive),
    drawnFrom: Math.max(0, (progress - lag) / (1 - lag)),
  }),
});
