/** How one field's offset from rest moves over a move's progress. */
export interface Descriptors {
  /** Whether the offset is away from rest at progress 0 or at 1. */
  readonly travelling: boolean;
  /** The progress of its greatest step between samples. */
  readonly peak: number;
  /** The most it goes past where it is heading, over how far it had to go. */
  readonly overshoot: number;
  /** Crossings of rest after the first, or every crossing when it does not travel. */
  readonly rings: number;
  /** The most it pulls away from where it is heading before it first heads there, over how far it had to go. */
  readonly windup: number;
  /** The share of progress from its first arrival (or its greatest offset) until it stays near its end. */
  readonly settle: number;
}

/** The descriptors a quality may range over, in the order every report lists them. */
export const DESCRIPTOR_KEYS = ["peak", "overshoot", "rings", "windup", "settle"] as const;

/** The qualities `--like` knows, as a range per descriptor: `rings` counts, the others are shares or ratios. */
export interface DescriptorRanges {
  readonly peak?: readonly [number, number];
  readonly overshoot?: readonly [number, number];
  readonly rings?: readonly [number, number];
  readonly windup?: readonly [number, number];
  readonly settle?: readonly [number, number];
}

/** The words `--like` understands, each as the ranges of descriptors a move with that quality sits in;
 * `drop` measures heavy, `fade` calm, `pop` playful and `jolt` loose. */
export const QUALITIES: Readonly<Record<string, DescriptorRanges>> = Object.freeze({
  heavy: { peak: [0.6, 1], overshoot: [0, 0.1], rings: [0, 1] },
  light: { peak: [0, 0.35], settle: [0, 0.3] },
  quick: { peak: [0, 0.35], overshoot: [0, 0.1], rings: [0, 0] },
  calm: { peak: [0.35, 0.65], overshoot: [0, 0.05], rings: [0, 0] },
  playful: { overshoot: [0.1, 1] },
  stiff: { overshoot: [0, 0.02], rings: [0, 0], settle: [0, 0.05] },
  loose: { rings: [2, 30] },
});

/** A quality's ranges by name, or none for a name `QUALITIES` does not hold itself (`toString` included). */
export function qualityOf(name: string): DescriptorRanges | undefined {
  return Object.hasOwn(QUALITIES, name) ? QUALITIES[name] : undefined;
}

/** The descriptors a quality names that lie outside its range, each with its value and range; none means
 * the shape has the quality. */
export function outsideRanges(
  descriptors: Descriptors,
  ranges: DescriptorRanges,
): readonly {
  readonly key: (typeof DESCRIPTOR_KEYS)[number];
  readonly value: number;
  readonly range: readonly [number, number];
}[] {
  return DESCRIPTOR_KEYS.flatMap((key) => {
    const range = ranges[key];
    const value = descriptors[key];
    return range === undefined || (value >= range[0] && value <= range[1])
      ? []
      : [{ key, value, range }];
  });
}
