import { defineMove, type Pose2d } from "@gerak/moves";

export const spread = defineMove({
  id: "spread",
  role: "reveal",
  description:
    "Draws a stroke outward from a point on it both ways at once, for a floor or an underline that opens from where something touched it; reversed, it closes into that point.",
  options: {
    from: {
      kind: "number",
      min: 0,
      max: 1,
      default: 0.5,
      description:
        "Where on the stroke it opens from, as a share of its length; default 0.5, the middle.",
    },
  },
  example: { options: { from: 0.5 } },
  moments: () => ({}),
  run: ({ from }, { progress }): Pose2d => ({
    drawnFrom: from * (1 - progress),
    drawn: from + (1 - from) * progress,
  }),
});
