import { backEase, defineMove, type Pose2d } from "@gerak/moves";

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

export const implode = defineMove({
  id: "implode",
  role: "exit",
  description:
    "Leans back away from a point, then is sucked into it, speeding up, shrinking and turning as it goes, and winks out on arrival; letters swallowed by a dot, a scene collapsing into a hole.",
  options: {
    dx: {
      kind: "number",
      description: "The point it is sucked into, this far right of rest, in px.",
    },
    dy: { kind: "number", description: "The point it is sucked into, this far below rest, in px." },
    lean: {
      kind: "number",
      min: 0,
      max: 4,
      default: 2,
      description:
        "How far it leans back before it goes, as a back-ease amount; 0 goes at once; default 2.",
    },
    scale: {
      kind: "number",
      min: 0,
      max: 1,
      default: 0.05,
      description: "Its size on arrival; default 0.05, nearly a point.",
    },
    turn: {
      kind: "number",
      default: 0,
      description: "Degrees it turns by on the way in; default 0.",
    },
    vanish: {
      kind: "number",
      min: 0,
      max: 1,
      default: 0.15,
      description: "Last share of the span over which it fades out as it arrives; default 0.15.",
    },
  },
  example: { options: { dx: -200, dy: 120, lean: 2.2, scale: 0.05, turn: -24, vanish: 0.15 } },
  recipe: ["backEase"],
  moments: () => ({}),
  run: ({ dx, dy, lean, scale, turn, vanish }, { progress: p }): Pose2d => {
    const q = backEase({ amount: lean, direction: "in" })(p);
    const shrink = p * p * p;
    const fade = vanish > 0 ? clamp01((p - (1 - vanish)) / vanish) : 0;
    return {
      x: dx * q,
      y: dy * q,
      rotation: turn * q,
      scale: 1 + (scale - 1) * shrink,
      opacity: 1 - fade,
    };
  },
});
