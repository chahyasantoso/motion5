# @gerak/stage: render

Outlines for renderers, from `@gerak/stage/render`: drawing strokes in order, blending morphs, matching outlines.

- **`drawInPasses`** `(paths: readonly (readonly [string, Path])[], rest: RestReader, settle: (name: string, answer: PathAnswer, read: ReadonlySet<string>) => Box | undefined): StrokeLoop | undefined`: Draws paths in passes, each once the boxes it reads are drawn; `settle` answers the box a drawn path adds.
- **`drawStrokes`** `(stage: Stage, rest: RestReader): { readonly ok: true; readonly strokes: Strokes; } | { readonly ok: false; readonly error: Extract<StageError, { kind: "stroke_loop"; }>; }`: Draws every stroke and morph base against `rest`, or the loop of paths that read each other.
- **`morphAt`** `(content: Extract<Content, { readonly kind: "morph"; }>, pose: { readonly shape?: number | undefined; } | undefined): readonly Cubic2d[]`: The outline a morph shows at a pose's `shape`: 0 its base, 1 its first target, 1.5 halfway on.
- **`pathOf`** `(path: Path, rest: RestReader): readonly Cubic2d[]`: A path's cubics, drawing a path function against `rest`; `compileStage` checked its answer.
- **`pathsOf`** `(stage: Stage): readonly (readonly [string, Path])[]`: The paths of a stage's strokes and morph bases, list items named `<list>.<index>`.
- **`restOfBounds`** `(bounds: Box): Box`: A top-left box as a centre-origin rest box.
- **`strokeBox`** `(cubics: readonly Cubic2d[]): Box`: The SVG view box of an outline: its bounds, thickened, top-left origin.
- **`thickened`** `(box: Box): Box`: Bounds grown to 1 px where thinner, centred on the edge, so straight lines stay visible.
- **`PathAnswer`** `type PathAnswer = { readonly kind: "drawn"; readonly cubics: readonly Cubic2d[]; } | { readonly kind: "failed"; readonly error: unknown; }`: A drawn path: its cubics, or what its function threw.
- **`StrokeLoop`** `type StrokeLoop = { loop: readonly string[]; behind: readonly string[] }`: Paths that read each other, and the paths waiting behind them.
- **`Strokes`** `type Strokes = { cubics: ReadonlyMap<string, readonly Cubic2d[]>; rest: RestReader; failures: readonly { readonly name: string; readonly error: unknown; }[]; selfReads: readonly string[] }`: Every stroke and morph drawn in order, the rest with their boxes added, and what failed to draw.
