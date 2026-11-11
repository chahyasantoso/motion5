import { defineMove, type Pose2d } from "@gerak/moves";

const cubicInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const cubicOut = (p: number) => 1 - (1 - p) ** 3;
const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

export const launch = defineMove({
  id: "launch",
  role: "exit",
  description:
    "Crouches against the floor, shivering if asked, then snaps from squash to stretch and shoots straight up out of sight.",
  options: {
    height: { kind: "number", min: 0, description: "How far up it travels by the end, in px." },
    squash: {
      kind: "number",
      min: 0,
      max: 0.9,
      default: 0.3,
      description: "Height lost at the deepest crouch, as a share; default 0.3.",
    },
    bulge: {
      kind: "number",
      min: 0,
      max: 1.5,
      default: 0.8,
      description: "How much the crouch widens, as a share of the squash; default 0.8.",
    },
    stretch: {
      kind: "number",
      min: 0,
      max: 2,
      default: 0.6,
      description: "Extra height at the snap off the floor, as a share; default 0.6.",
    },
    crouch: {
      kind: "number",
      min: 0.05,
      max: 0.9,
      default: 0.5,
      description: "Share of the span spent crouching and holding before lift-off; default 0.5.",
    },
    tremble: {
      kind: "number",
      min: 0,
      default: 0,
      description: "Side-to-side shiver at full crouch, in px; default 0.",
    },
    flight: {
      kind: "string",
      enum: ["decelerate", "accelerate"],
      default: "decelerate",
      description:
        "Whether the leap slows as it rises, like a throw, or speeds up, like a rocket; default decelerate.",
    },
  },
  example: { options: { height: 600, squash: 0.4, crouch: 0.5, tremble: 2 } },
  moments: ({ crouch }) => ({ liftOff: crouch }),
  run: ({ height, squash, bulge, stretch, crouch, tremble, flight }, { progress }): Pose2d => {
    if (progress < crouch) {
      const q = progress / crouch;
      const k = cubicInOut(clamp01(q / 0.65));
      return {
        x: tremble * k * k * Math.sin(2 * Math.PI * 6 * crouch * q),
        scaleY: 1 - squash * k,
        scaleX: 1 + squash * bulge * k,
        anchor: "bottom",
      };
    }
    const f = (progress - crouch) / (1 - crouch);
    const snap = clamp01(f / 0.12);
    const scaleY =
      f < 0.12
        ? 1 - squash + (squash + stretch) * cubicOut(snap)
        : 1 + stretch - stretch * 0.6 * ((f - 0.12) / 0.88);
    const travel = flight === "accelerate" ? 0.55 * f + 0.45 * f * f : 1 - (1 - f) ** 2;
    return { y: -height * travel, scaleY, scaleX: 1 / Math.sqrt(scaleY), anchor: "bottom" };
  },
});
