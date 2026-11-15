import { definePart } from "../contract";

/** How far along a sine swing is: the sine of `count` full cycles over progress 0 to 1, shifted by `phase` in turns. */
export function wave(progress: number, count: number, phase = 0): number {
  return Math.sin(2 * Math.PI * (count * progress + phase));
}
definePart(
  {
    kind: "oscillation",
    samples: [
      { run: (progress) => wave(progress, 1), bound: 1 },
      { run: (progress) => wave(progress, 3.5, 0.25), bound: 1 },
    ],
  },
  wave,
);
