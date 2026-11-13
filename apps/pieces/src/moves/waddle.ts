import { defineMove, type Pose2d } from "@gerak/moves";

const easeSine = (u: number): number => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, u)));

export const waddle = defineMove({
  id: "waddle",
  role: "emphasis",
  description:
    "Rocks side to side from foot to foot, lingering on each side and sinking as it passes upright, then comes to rest; a heavy body walking in place.",
  options: {
    angle: {
      kind: "number",
      min: 0,
      max: 45,
      description: "Widest lean to each side, in degrees.",
    },
    count: {
      kind: "number",
      min: 1,
      max: 16,
      default: 2,
      description: "Rocks left and right, each one both sides; default 2.",
    },
    sink: {
      kind: "number",
      min: 0,
      default: 0,
      description: "How far it drops as it passes upright between feet, in px; default 0.",
    },
    linger: {
      kind: "number",
      min: 0,
      max: 0.8,
      default: 0.35,
      description:
        "How long it hangs on each foot before the weight crosses over, 0 to 0.8; default 0.35.",
    },
  },
  example: { options: { angle: 6, count: 2, sink: 4 } },
  moments: () => ({}),
  run: ({ angle, count, sink, linger }, { progress }): Pose2d => {
    const cycles = progress * count;
    const ramp = easeSine(Math.min(cycles * 2, (count - cycles) * 2));
    const wave = Math.sin(2 * Math.PI * cycles);
    const lean = Math.sign(wave) * Math.abs(wave) ** (1 - linger);
    return { rotation: -angle * lean * ramp, y: sink * ramp * (1 - wave * wave) ** 3 };
  },
});
