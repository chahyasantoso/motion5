import { defineMove, type Pose2d } from "@gerak/moves";

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
  run: ({ dx, dy, apex }, { progress: s }): Pose2d => {
    const cx = dx / 2;
    const cy = Math.min(dy, 0) - apex;
    const u = 1 - s;
    return { x: u * u * dx + 2 * u * s * cx, y: u * u * dy + 2 * u * s * cy };
  },
});
