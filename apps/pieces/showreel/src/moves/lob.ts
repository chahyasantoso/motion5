import { ballistic, type Pose2d, type Time } from "@gerak/core";
import { squashed } from "@gerak/moves";

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));
const TAPER = 0.1;

/** The parabola's true peak above the higher end, for a curve whose control point sits `apex` above it. */
function peakAbove(dy: number, apex: number): number {
  const higher = Math.min(dy, 0);
  const control = higher - apex;
  const span = dy - 2 * control;
  return span > 0 ? Math.max(0, higher - (dy - (control - dy) ** 2 / span)) : 0;
}

/** Options of `lob`. */
export interface LobOptions {
  /** Start this far right of rest, in px (negative: left). */
  readonly dx: number;
  /** Start this far below rest, in px (negative: above). */
  readonly dy: number;
  /** How far the curve's control point rises above the higher end, in px; 0 is a straight fall or throw; default 200. */
  readonly apex?: number;
  /** Squash across the travel at its fastest, as a share of size; default 0.4. */
  readonly stretch?: number;
  /** heading turns the body to its travel, for a round thing; upright stretches only up and down and never turns, for a letter; default heading. */
  readonly facing?: "heading" | "upright";
}

/** Thrown from an offset to rest along a parabola at even time steps, stretched along its flight in proportion to its speed and round again at both ends. */
export function lob(options: LobOptions): (time: Time) => Pose2d {
  const { dx, dy, apex = 200, stretch = 0.4, facing = "heading" } = options;
  return ({ progress: s }): Pose2d => {
    const cx = dx / 2;
    const cy = Math.min(dy, 0) - apex;
    const u = 1 - s;
    const { x, y } = ballistic({ dx, dy, apex: peakAbove(dy, apex) })(s);
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
        return { x, y, ...squashed({ squash: k, anchor: "center" })(1), rotation: turn * taper };
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
  };
}
