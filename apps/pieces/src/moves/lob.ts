import { defineMove, squashed, type Pose2d } from "@gerak/moves";

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));
const TAPER = 0.1;

export const lob = defineMove({
  id: "lob",
  role: "travel",
  description:
    "Thrown from an offset to rest along a parabola at even time steps, stretched along its flight in proportion to its speed and round again at both ends; a ball leaping, a letter falling under gravity.",
  options: {
    dx: { kind: "number", description: "Start this far right of rest, in px (negative: left)." },
    dy: { kind: "number", description: "Start this far below rest, in px (negative: above)." },
    apex: {
      kind: "number",
      min: 0,
      default: 200,
      description:
        "How far the curve's control point rises above the higher end, in px; 0 is a straight fall or throw; default 200.",
    },
    stretch: {
      kind: "number",
      min: 0,
      max: 0.8,
      default: 0.4,
      description: "Squash across the travel at its fastest, as a share of size; default 0.4.",
    },
    facing: {
      kind: "string",
      enum: ["heading", "upright"],
      default: "heading",
      description:
        "heading turns the body to its travel, for a round thing; upright stretches only up and down and never turns, for a letter; default heading.",
    },
  },
  example: { options: { dx: -300, dy: 10, apex: 300, stretch: 0.4, facing: "heading" } },
  recipe: ["squashed"],
  moments: () => ({ top: 0.5 }),
  run: ({ dx, dy, apex, stretch, facing }, { progress: s }): Pose2d => {
    const cx = dx / 2;
    const cy = Math.min(dy, 0) - apex;
    const u = 1 - s;
    const x = u * u * dx + 2 * u * s * cx;
    const y = u * u * dy + 2 * u * s * cy;
    const vx = -2 * u * dx + 2 * (1 - 2 * s) * cx;
    const vy = -2 * u * dy + 2 * (1 - 2 * s) * cy;
    const most = Math.max(
      Math.hypot(2 * cx - 2 * dx, 2 * cy - 2 * dy),
      Math.hypot(cx, cy) * 2,
      1e-9,
    );
    const taper = clamp01(Math.min(s, 1 - s) / TAPER);
    switch (facing) {
      case "heading": {
        const k = (stretch * taper * Math.hypot(vx, vy)) / most;
        const travel = (Math.atan2(vy, vx) * 180) / Math.PI;
        const turn = travel > 90 ? travel - 180 : travel <= -90 ? travel + 180 : travel;
        return { x, y, ...squashed(k, 1, "center"), rotation: turn * taper };
      }
      case "upright": {
        const k = (stretch * taper * Math.abs(vy)) / most;
        return { x, y, scaleX: 1 - 0.5 * k, scaleY: 1 + 0.9 * k };
      }
      default: {
        const none: never = facing;
        return none;
      }
    }
  },
});
