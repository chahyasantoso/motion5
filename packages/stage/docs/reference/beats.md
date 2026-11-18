# @gerak/stage: beats

Compiled timeline spans (`compileBeats`) and stretch visibility (`presentAt`). Reach for this group when mapping named story intervals.

- **`compileBeats`** `<B extends string>(input: unknown, durationMs?: unknown): BeatsCompileResult<B>`: Validates and freezes a `BeatsInput` record into `CompiledBeats`.
- **`presentAt`** `(on: readonly (readonly [string, string])[], spanOf: (beat: string) => { readonly from: number; readonly to: number; } | undefined, durationMs: number, ms: number): boolean`: Whether a member on `on` stretches shows at `ms`; a stretch reaching `durationMs` holds past it.
- **`BeatSpan`** `type BeatSpan = readonly [number, number]`: Inclusive start and end times in ms for one beat.
- **`BeatsCompileResult`** `type BeatsCompileResult<B> = { readonly ok: true; readonly beats: CompiledBeats<B>; } | { readonly ok: false; readonly field: "beats" | "durationMs"; readonly reason: string; }`: Validation outcome for compiling a beat table.
- **`BeatsInput`** `type BeatsInput<B> = { readonly [P in keyof Record<B, BeatSpan>]: Record<B, BeatSpan>[P]; }`: Named beat spans mapping beat names to `[fromMs, toMs]` pairs.
- **`CompiledBeats`** `type CompiledBeats<B> = Readonly<Record<B, Span>> & { readonly durationMs: number; readonly order: readonly B[]; }`: Compiled beats by name, total `durationMs`, and declaration `order`.
- **`CompiledStretch`** `type CompiledStretch<B> = readonly [B, B]`: A normalized visibility stretch `[fromBeat, toBeat]`.
- **`Stretch`** `type Stretch<B> = B | readonly [B, B]`: A visibility stretch: one beat name or a `[fromBeat, toBeat]` pair.
