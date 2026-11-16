# @gerak/moves: style

- **`defineStyle`** `(card: StyleCard): StyleCard`: A frozen copy of the card, or an error naming its first problem.
- **`isStyleCard`** `(value: unknown): value is StyleCard`: Whether `value` is a card `defineStyle` returned itself.
- **`StyleCard`** `type StyleCard`: A brief's style: the qualities it names, the share of lively motion each field holds, and its tokens and habits.
- **`DESCRIPTOR_KEYS`** `const DESCRIPTOR_KEYS: readonly ["peak", "overshoot", "rings", "windup", "settle"]`: The descriptors a quality may range over, in the order every report lists them.
- **`QUALITIES`** `const QUALITIES: Readonly<Record<string, DescriptorRanges>>`: The words `--like` understands, each as the ranges of descriptors a move with that quality sits in; `drop` measures heavy, `fade` calm, `pop` playful and `jolt` loose.
- **`isLively`** `(shape: Descriptors): boolean`: Whether a shape is lively: it overshoots, rings or winds up.
- **`outsideRanges`** `(descriptors: Descriptors, ranges: DescriptorRanges): readonly { readonly key: "overshoot" | "peak" | "settle" | "rings" | "windup"; readon…`: The descriptors a quality names that lie outside its range, each with its value and range; none means the shape has the quality.
- **`qualityOf`** `(name: string): DescriptorRanges | undefined`: A quality's ranges by name, or none for a name `QUALITIES` does not hold itself (`toString` included).
- **`DescriptorRanges`** `type DescriptorRanges`: The qualities `--like` knows, as a range per descriptor: `rings` counts, the others are shares or ratios.
- **`Descriptors`** `type Descriptors`: How one field's offset from rest moves over a move's progress.
