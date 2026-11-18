# @gerak/stage: layout

Stage frame defaults, measured `RestReader` lookup, multi-layout specs, and cross-layout `carry` transitions.

- **`DEFAULT_FRAME`** `const DEFAULT_FRAME: Frame`: Default stage dimensions (1280 by 720 px) when none are given.
- **`NO_LAYOUTS`** `const NO_LAYOUTS: Readonly<Record<never, Readonly<Record<string, Box>>>>`: Empty `Layouts` record when a stage uses a single layout.
- **`NO_LAYOUT_READERS`** `const NO_LAYOUT_READERS: Readonly<Record<never, RestReader>>`: Empty `RestReader` map for single-layout stages.
- **`NO_REST`** `const NO_REST: Readonly<Record<string, Box>>`: Empty `Rest` record for headless or unmeasured stages.
- **`NO_REST_READER`** `const NO_REST_READER: RestReader`: Headless `RestReader` returning `ZERO_BOX` for every name.
- **`ZERO_BOX`** `const ZERO_BOX: Box`: Zero-sized fallback box returned when a member was not measured.
- **`restReader`** `(rest?: Rest): RestReader`: Builds a `RestReader` over a `Rest` record, returning `ZERO_BOX` for missing names.
- **`Box`** `type Box = { x: number; y: number; width: number; height: number }`: Where a member rests once laid out: its centre and size in frame px.
- **`CarryFn`** `type CarryFn = (member: string, options: CarryOptions) => Pose2d`: Scene helper carrying `member` across layout changes with mid-flight interruption handling.
- **`CarryMode`** `type CarryMode = "scale" | "clip" | "keep"`: How a carried member takes its target box size: `"scale"`, `"clip"`, or `"keep"`.
- **`CarryOptions`** `type CarryOptions = { ms: number; ease?: Ease | undefined; mode?: CarryMode | undefined; target?: ((events: Events, layout: RestReader) => Box) | undefined }`: Options for `carry(member, options)` inside a scene.
- **`Frame`** `type Frame = { width: number; height: number }`: Stage viewport dimensions in px.
- **`LayoutSpec`** `type LayoutSpec<L> = { readonly kind: "single"; readonly rest?: Rest | undefined; } | { readonly kind: "multi"; readonly names: readonly [L, ...L[]]; readonly pick: (events: Events) => L; readonly rests?: Readonly<Record<L, Rest>> | undefined; }`: Closed union for stage layout configuration: `"single"` or `"multi"`.
- **`Layouts`** `type Layouts<L> = { readonly [P in keyof Record<L, Readonly<Record<string, Box>>>]: Record<L, Readonly<Record<string, Box>>>[P]; }`: Measured `Rest` records keyed by declared layout name.
- **`LayoutsInput`** `type LayoutsInput<L> = { names: readonly [L, ...L[]]; pick?: ((events: Events) => L) | undefined; rests?: Readonly<Record<L, Readonly<Record<string, Box>>>> | undefined }`: Authoring input for multi-layout stages in `defineStage`.
- **`Rest`** `type Rest = { readonly [x: string]: Box; }`: Measured member rest boxes keyed by cast member name.
- **`RestReader`** `type RestReader = { get: (name: string) => Box; has: (name: string) => boolean; keys: () => readonly string[] }`: Uniform box lookup shared by single-layout, multi-layout, and headless runs.
