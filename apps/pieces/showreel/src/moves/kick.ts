import { defineMove, type Pose2d } from "@gerak/moves";

export const kick = defineMove({
  id: "kick",
  role: "exit",
  description:
    "A speck kicked up from a contact: flies out sideways and up, slowing, sinks again, and shrinks and fades away; dust at a landing.",
  options: {
    dx: { kind: "number", description: "How far sideways it flies, in px (negative: left)." },
    rise: {
      kind: "number",
      min: 0,
      default: 20,
      description: "How high it is thrown, in px; default 20.",
    },
    fall: {
      kind: "number",
      min: 0,
      default: 10,
      description: "How far it sinks back by the end, in px; default 10.",
    },
    shrink: {
      kind: "number",
      min: 0,
      max: 1,
      default: 0.75,
      description: "Share of its size lost by the end; default 0.75.",
    },
  },
  example: { options: { dx: 60, rise: 30, fall: 10, shrink: 0.75 } },
  moments: () => ({}),
  run: ({ dx, rise, fall, shrink }, { progress: p }): Pose2d => {
    const out = 1 - (1 - p) ** 3;
    return { x: dx * out, y: -rise * out + fall * p * p, scale: 1 - shrink * p, opacity: 1 - p };
  },
});
