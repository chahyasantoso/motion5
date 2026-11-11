import { defineMove, type Pose2d } from "@gerak/moves";

export const bump = defineMove({
  id: "bump",
  role: "emphasis",
  description:
    "Eases out by an offset and a turn and eases back, once, in either direction; a camera tilting after something, a dip, a roll.",
  options: {
    dx: {
      kind: "number",
      default: 0,
      description: "Furthest right it goes, in px (negative: left); default 0.",
    },
    dy: {
      kind: "number",
      default: 0,
      description: "Furthest down it goes, in px (negative: up); default 0.",
    },
    turn: { kind: "number", default: 0, description: "Furthest it turns, in degrees; default 0." },
  },
  example: { options: { dy: -40, turn: 1 } },
  moments: () => ({ peak: 0.5 }),
  run: ({ dx, dy, turn }, { progress }): Pose2d => {
    const s = Math.sin(Math.PI * progress) ** 2;
    return { x: dx * s, y: dy * s, rotation: turn * s };
  },
});
