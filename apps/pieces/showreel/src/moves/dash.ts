import { defineMove, type Pose2d } from "@gerak/moves";

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

export const dash = defineMove({
  id: "dash",
  role: "follow",
  description:
    "A straight box drawn as a moving stretch of itself: the head runs out from one end, the tail follows and catches it, leaving nothing; a trail behind something shot straight, on a plain box with no stroke to draw.",
  options: {
    length: {
      kind: "number",
      min: 0,
      description: "The box's full length along its axis, in px; the tail travels it.",
    },
    from: {
      kind: "string",
      enum: ["bottom", "top", "left", "right"],
      default: "bottom",
      description: "The end the head runs out from; default bottom, a trail going up.",
    },
    arrive: {
      kind: "number",
      min: 0.05,
      max: 1,
      default: 0.5,
      description: "Share of the span at which the head reaches the far end; default 0.5.",
    },
    lag: {
      kind: "number",
      min: 0,
      max: 0.95,
      default: 0.2,
      description: "Share of the span before the tail starts to follow; default 0.2.",
    },
  },
  example: { options: { length: 500, from: "bottom", arrive: 0.5, lag: 0.2 } },
  moments: ({ arrive, lag }) => ({ headArrives: arrive, tailStarts: lag }),
  run: ({ length, from, arrive, lag }, { progress }): Pose2d => {
    const head = 1 - (1 - clamp01(progress / arrive)) ** 2;
    const tail = inOut(clamp01((progress - lag) / (1 - lag)));
    const shown = Math.max(0, head - tail);
    switch (from) {
      case "bottom":
        return { scaleY: shown, y: -length * tail, anchor: "bottom" };
      case "top":
        return { scaleY: shown, y: length * tail, anchor: "top" };
      case "left":
        return { scaleX: shown, x: length * tail, anchor: "left" };
      case "right":
        return { scaleX: shown, x: -length * tail, anchor: "right" };
      default: {
        const none: never = from;
        return none;
      }
    }
  },
});
