# @gerak/core: events

An event is something that happened at a moment, such as a hover, a press or a landing, carried beside the scene's time. Reach for it to react to the page or to mark moments for other moves.

- **`NO_INPUT`** `const NO_INPUT: Input`: The empty input list; share it rather than allocating one.
- **`isInputEntry`** `(value: unknown): value is InputEntry`: Whether `value` is an `InputEntry`: `kind`, `name`, `at`, `value` and optional `target`, `point` and `other`.
- **`mergeInput`** `(...lists: readonly Input[]): Input`: Several input lists as one, oldest first; a scene's own cues joined with the page's input.
- **`EventPoint`** `type EventPoint = { x: number; y: number; z?: number }`: A point an entry happened at, in the scene's units; `z` only in 3D.
- **`Input`** `type Input = readonly InputEntry[]`: Every input entry so far, oldest first; a scene reads it beside its time.
- **`InputEntry`** `type InputEntry = { kind: "value" | "trigger"; name: string; at: number; value: number; target?: string; other?: string; point?: EventPoint }`: Something sampled or triggered at `at` ms on the scene's clock: a continuous `"value"` or discrete `"trigger"`.
- **`inputs`** `<const V extends Record<string, InputSpec>>(spec: { readonly values: V; }): Contract<V, {}> (+3 overloads)`: Builds a typed input `Contract` declaring `values` and `triggers`.
- **`pageInputs`** `const pageInputs: Contract<{ scroll: {}; "pointer-x": {}; "pointer-y": {}; hovered: {}; pressed: {}; focused: {}; }, {}>`: Built-in contract for page-level scroll, pointer and interaction values (`scroll`, `pointer-x`, `pointer-y`, `hovered`, `pressed`, `focused`).
- **`Contract`** `type Contract<V, T> = { values: V; triggers: T }`: Declared contract of named value and trigger inputs.
- **`InputSpec`** `type InputSpec = { targets?: readonly string[] }`: Input slot specification: `targets` restricts allowed target names; empty allows any target or none.
- **`TargetOf`** `type TargetOf<S> = S extends { targets: readonly (infer U extends string)[]; } ? U : string`: Allowed target string type for an `InputSpec`: the declared union when `targets` is listed, else `string`.
- **`derivedInput`** `(): DerivedInput`: Creates a cached `Input` merger/filter that avoids rebuilding unchanged windows across frames.
- **`generationOf`** `(input: Input): number`: An `inputLog` list's count of changes other than adding at its end, or 0 for a plain array.
- **`inputLog`** `(options?: { readonly windowMs?: number; }): InputLog`: A log of input entries; when given `windowMs`, older entries drop in batches past twice the window except each name-and-target's latest.
- **`inputSerialsOf`** `(input: Input): readonly number[] | undefined`: Monotonic insertion serials aligned with `input` when backed by an `inputLog`.
- **`sourceStreamOf`** `(input: Input): object | undefined`: Stream identity token preserved across `derivedInput` time-window slicing of a single log.
- **`versionOf`** `(input: Input): number`: An `inputLog` list's count of every change, adding included, or 0 for a plain array.
- **`DerivedInput`** `type DerivedInput = { resolve: (cues: Input, page: Input, maxAt: number | undefined) => Input }`: Cached derived view over input lists filtered by elapsed ms while keeping monotonic metadata.
- **`InputLog`** `type InputLog = { input: Input; set: <V extends Record<string, InputSpec>, T extends Record<string, InputSpec>, K extends keyof V & string>(at: number, contract: Contract<V, T>, name: K, value: number, target?: TargetOf<V[K]> | undefined) => void; trigger: <V extends Record<string, InputSpec>, T extends Record<string, InputSpec>, K extends keyof T & string>(at: number, contract: Contract<V, T>, name: K, value?: number, target?: TargetOf<T[K]> | undefined) => void; add: (entry: InputEntry) => void; clear: () => void }`: A log that grows as values change or triggers fire: typed writes go through a `Contract`.
