# @gerak/stage: render

Outlines for renderers, from `@gerak/stage/render`: drawing strokes in order, blending morphs, matching outlines.

- **`drawStrokes`** `(stage: Stage, rest: RestReader): { readonly ok: true; readonly strokes: Strokes; } | { readonly ok: false; readonly error: Extract<StageError, { kind: "stroke_loop"; }>; }`: Draws every stroke and morph base against `rest`, each once the boxes it reads are drawn, or the loop of paths that read each other.
- **`morphAt`** `(content: Extract<Content, { readonly kind: "morph"; }>, pose: { readonly shape?: number | undefined; } | undefined): readonly Cubic2d[]`: The outline a morph shows at a pose's `shape`: 0 its base, 1 its first target, 1.5 halfway on.
- **`restOfBounds`** `(bounds: Box): Box`: A top-left box as a centre-origin rest box.
- **`strokeBox`** `(cubics: readonly Cubic2d[]): Box`: The SVG view box of an outline: its bounds, thickened, top-left origin.
- **`Strokes`** `type Strokes = { cubics: ReadonlyMap<string, readonly Cubic2d[]>; rest: RestReader; failures: readonly { readonly name: string; readonly error: unknown; }[]; selfReads: readonly string[] }`: Every stroke and morph drawn in order, the rest with their boxes added, and what failed to draw.
