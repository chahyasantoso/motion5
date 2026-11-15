import { ballistic as thrown, defineMove, type Pose2d } from "@gerak/moves";

/** The parabola's true peak above the higher end, for a curve whose control point sits `apex` above it. */
function peakAbove(dy: number, apex: number): number {
  const higher = Math.min(dy, 0);
  const control = higher - apex;
  const span = dy - 2 * control;
  return span > 0 ? Math.max(0, higher - (dy - (control - dy) ** 2 / span)) : 0;
}

export const ballistic = defineMove({
  id: "ballistic",
  role: "travel",
  description:
    "Thrown from an offset to rest along a parabola at even time steps, rising, hanging at the top and falling like a ball.",
  options: {
    dx: { kind: "number", description: "Start this far right of rest, in px (negative: left)." },
    dy: { kind: "number", description: "Start this far below rest, in px (negative: above)." },
    apex: {
      kind: "number",
      min: 0,
      default: 200,
      description: "How far the control point sits above the higher end, in px; default 200.",
    },
  },
  example: { options: { dx: -300, dy: 10, apex: 300 } },
  moments: () => ({ top: 0.5 }),
  run: ({ dx, dy, apex }, { progress }): Pose2d =>
    thrown(progress, { dx, dy, apex: peakAbove(dy, apex) }),
});
