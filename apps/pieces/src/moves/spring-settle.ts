import { defineMove, type Pose2d } from "@gerak/moves";

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

export const springSettle = defineMove({
  id: "spring-settle",
  role: "enter",
  description:
    "Springs in from an offset, a turn, a size and a squash to rest, overshooting and ringing a few times before it settles.",
  options: {
    dx: {
      kind: "number",
      default: 0,
      description: "Start this far right of rest, in px; default 0.",
    },
    dy: { kind: "number", default: 0, description: "Start this far below rest, in px; default 0." },
    lift: {
      kind: "number",
      default: 0,
      description: "How far the path bows upward on the way, in px; default 0.",
    },
    turn: {
      kind: "number",
      default: 0,
      description: "Start turned this far, in degrees; default 0.",
    },
    scale: {
      kind: "number",
      min: 0,
      max: 4,
      default: 1,
      description: "Start at this size, 1 being full size; default 1.",
    },
    squash: {
      kind: "number",
      min: -0.9,
      max: 0.9,
      default: 0,
      description:
        "Start squashed by this share of its height and widened to match; negative stretches; default 0.",
    },
    rings: {
      kind: "number",
      min: 0,
      max: 8,
      default: 2,
      description:
        "Swings past rest and back over the span; 0 eases in with no overshoot; default 2.",
    },
    damping: {
      kind: "number",
      min: 0.5,
      max: 12,
      default: 4,
      description:
        "How fast the ringing dies away; low rings to the end, high settles early; default 4.",
    },
  },
  example: { options: { dx: -200, dy: 80, lift: 60, turn: 40, scale: 0.2, rings: 2, damping: 4 } },
  moments: () => ({}),
  run: ({ dx, dy, lift, turn, scale, squash, rings, damping }, { progress: p }): Pose2d => {
    const wave = (q: number) => Math.exp(-damping * q) * Math.cos(2 * Math.PI * rings * q);
    const r = 1 - (wave(p) - p * wave(1));
    const left = 1 - r;
    const s = scale + (1 - scale) * r;
    return {
      x: dx * left,
      y: dy * left - lift * Math.sin(Math.PI * clamp01(r)),
      rotation: turn * left,
      scaleX: s * (1 + squash * 0.8 * left),
      scaleY: s * (1 - squash * left),
    };
  },
});
