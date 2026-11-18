# @gerak/stage

Read this page whole before making a piece. Export a stage definition with `defineStage` from `@gerak/stage`; tools compile it via `compileStage` and evaluate frames via `evaluateFrame`. Look signatures up by group below, motion primitives in [@gerak/core](../../core/docs/core.md), and topic guides in [README.md](./README.md) — never read package source for signatures. `<pieces>` is the `gerak.pieces` directory in `package.json`.

<!-- generated:reference:start -->
- [runtime](./reference/runtime.md) (6): `defineStage`, `evaluateFrame`, `validateSceneOutput`, `FrameEvaluation`, `FrameInput`, `ShapeMismatchError`
- [beats](./reference/beats.md) (8): `compileBeats`, `presentAt`, `BeatSpan`, `BeatsCompileResult`, `BeatsInput`, `CompiledBeats`, `CompiledStretch`, `Stretch`
- [cast](./reference/cast.md) (37): `blendShapes`, `compileCast`, `createCastBuilder`, `describeLoop`, `drawInPasses`, `isCubics`, `matchOutlines`, `pathOf`, `piecesOf`, `resolveStaticStrokes`, `restOfBounds`, `sameCast`, `strokeBox`, `thickened`, `ActorContent`, `ActorPath`, `CastBuilder`, `CastCompileError`, `CompiledContent`, `CompiledListItem`, `CompiledMember`, `CompiledMembers`, `GroupMemberBuilder`, `ListActor`, `ListActorBuilder`, `ListActorContent`, `ListMemberBuilder`, `Member`, `MemberEntry`, `MemberMeta`, `MemberModifiers`, `PathAnswer`, `Pivot`, `ReadoutActorBuilder`, `ResolvedStroke`, `StrokeLoop`, `StrokeResolution`
- [layout](./reference/layout.md) (17): `DEFAULT_FRAME`, `NO_LAYOUTS`, `NO_LAYOUT_READERS`, `NO_REST`, `NO_REST_READER`, `ZERO_BOX`, `restReader`, `Box`, `CarryFn`, `CarryMode`, `CarryOptions`, `Frame`, `LayoutSpec`, `Layouts`, `LayoutsInput`, `Rest`, `RestReader`
- [skins](./reference/skins.md) (6): `compileSkins`, `CompiledSkins`, `DomSkinCss`, `DomSkinInput`, `RendererSkins`, `StageSkinsInput`
- [review](./reference/review.md) (5): `buildReviewSpec`, `CompiledReviewSpec`, `MotionExpectation`, `ReviewMemberSpec`, `TargetLimits`
- [compile](./reference/compile.md) (15): `compileStage`, `formatStageError`, `isCompiledStage`, `isStage2d`, `isStageDefinition`, `CastKeys`, `CompileResult`, `CompiledStage`, `FlattenedTargets`, `PoseFor`, `PoseMode`, `SceneContext`, `StageDefinition`, `StageError`, `StageOptions`
- [dom](./reference/dom.md) (2): `cssVariables`, `isTokenName`
<!-- generated:reference:end -->

## The loop

1. **Find the idea first.** Name the obvious answer in one line, then write three non-obvious ideas differing in material and mechanics. Choose the strongest and keep three lines: what moves in what order, its character, and the one moment the eye must not miss.
2. `npx gerak new <name> [--in <brief>]` scaffolds `<pieces>/<brief>/src/<name>.ts`; preview at `stage.html?piece=<name>`.
3. **Choose primitives.** With `@gerak/core` alone, compose `span`, `chain`, `lanes`, `loop`, `sequence`, `mix`, `mixPose`, `keyframes`, `ease`, `wave`, `arch`, `attack`, `decay`, `taper`, `ballistic`, `along`, and `toCubics`. With `@gerak/moves` + `@gerak/moves-tools`, run `npx gerak moves --anatomy`, write `design` in `defineStage`, and query `npx gerak moves --design <file> --target <member> --in <brief>`.
4. **Build and check.** `npx gerak review <pieces>/<brief>/src/<name>.ts` checks compile errors, shapes, expectations, bounds, and `design` headlessly; `npx gerak review "stage.html?piece=<name>" --watch '[data-cast="<member>"]' --to <ms>` captures a contact `sheet.png`. Repeat until clean and `npx tsc --noEmit` passes.

Never open sibling `<pieces>/*/src` files; treat visual sheets as truth alongside numeric checks.

## Authoring with `defineStage`

```ts
import { defineStage } from "@gerak/stage";

export default defineStage({
  frame: { width: 1280, height: 720 },
  beats: { enter: [0, 600], hold: [600, 2400], leave: [2400, 3000] },
  cast: (m) => ({
    card: m.group({
      dot: m.box(),
      word: m.letters("HELLO").on(["enter", "leave"]),
      dust: m.many(6),
    }),
  }),
  skins: {
    dom: { css: new URL("./piece.css", import.meta.url) },
  },
  scene: ({ time, beats, rest }) => {
    const p = beats.enter.of(time).progress;
    const target = rest.get("dot");
    return {
      card: {},
      dot: { x: (p - 1) * (target.width + 40) },
      word: Array.from({ length: 5 }, () => ({})),
      dust: Array.from({ length: 6 }, () => ({})),
    };
  },
});
```

- **`beats` and `durationMs`:** `beats` declares named `[from, to]` intervals in ms. `durationMs` defaults to the maximum beat end; pass a larger `durationMs` for a silent trailing hold. `beats.<name>.of(time)` maps scene time to that beat's `[0, 1]` time.
- **`cast: (m) => ({ ... })`:** Every key is unique across top-level members and flattened `m.group(...)` children; `.` is reserved for list item selectors (`dust.0`, `dust.1`). `scene` returns one pose object for each actor or group (nested child keys sit flat at top level) and an exact-length pose array for each list.
- **`pose` mode:** Omit or set `pose: "2d"` for `Pose2d` (`@gerak/dom`, `@gerak/react`), or `pose: "3d"` for `Pose3d`.

## Cast builders, modifiers, and morphs

- `m.box()` / `m.text(value)` / `m.readout((time) => string)`: visual box, static label, or per-frame string readout (top-level or group child only; readouts inside lists are rejected).
- `m.stroke(cubics | ((rest) => cubics))`: cubic SVG path skinned with `[data-path="<name>"]`. Path functions read `rest.get("<other>")` including upstream strokes; dependency cycles fail compilation as `stroke_loop`.
- `m.morph(base, targets)`: pre-matches continuous pieces at compile time (`morph_mismatch` if counts differ) and blends by pose `shape` (`0` = `base`, `1` = `targets[0]`, ...).
- `m.many(count)` / `m.many(items, (item, i) => actor)` / `m.letters(text)` / `m.words(text)`: ordered lists animated by index array in `scene`.
- `m.group({ ... })`: wraps child members under one shared transform container (`members` flatten as top-level `scene` target keys).
- **Modifiers:**
  - `.on(...stretches)` restricts visibility to beat names or `[fromBeat, toBeat]` spans; stretches ending at `durationMs` hold past end. Children and list items inherit enclosing `.on(...)` unless overridden.
  - `.watch(enabled = true)` streams pointer events (`enter`, `leave`, `down`, `up`, `click`, `focus`, `blur`) for that member into `scene({ events })`.
  - `.pivot(point | x, y)` sets rotation/scale origin in frame px.
  - `.settle()` (default), `.ambient()`, `.static()`: declares `MotionExpectation` for `gerak review`. `.ambient()` propagates to group children and list items and skips rest settling checks while enforcing step limits; `.static()` forbids any scene pose or motion and applies only to the annotated container or leaf.

## Skins, layouts, and `cssVariables`

- **`skins.dom` (`DomSkinCss`):** Prefer external files via `{ css: new URL("./piece.css", import.meta.url), defs?: new URL("./defs.svg", import.meta.url) }` (linked in Shadow DOM; re-measures rest boxes once loaded). Reserve inline `{ css: string, defs?: string }` for tiny snippets or generated `cssVariables(...)`.
- **CSS variables (`@gerak/stage/dom`):** Import `cssVariables` and `isTokenName` from `@gerak/stage/dom` (not root `@gerak/stage`) to prepend `:host { --token: value; }` custom properties from style cards.
- **Layout & `carry`:** Use `rest.get("<name>")` for measured layout boxes (`{ x, y, width, height }`, defaulting to `ZERO_BOX`). Multi-layout scenes declare `layouts: { names, pick: (events) => name, rests? }` and animate layout transitions cleanly with `carry(member, { ms, ease?, mode?, target? })` (`mode: "scale" | "clip" | "keep"`).
- **Stage layout rules:** Frame (`1280x720` default) and `group`/`many` wrap children centred cleanly (`position: relative`); explicit placement uses `position: absolute` with `left`/`top` inside a pinned container (`position: absolute; inset: 0`). Never `position: static` or `display: contents`.
- **Colour & shadow fields:** Skins read `--gerak-hue`, `--gerak-lightness`, `--gerak-tint`, `--gerak-tint-to`, `--gerak-shadow` via CSS `oklch`/`color-mix` rather than custom numbers.

## Review and step budget

- `compileStage(def)` returns `{ ok: true, stage }` or `{ ok: false, errors }` (format with `formatStageError`), checking beats, cast names, stretches, morph piece counts, layouts, and skins cleanly with typed errors (`StageError`).
- `evaluateFrame(stage, { time, events, boxes })` enforces `shape_mismatch` on every returned actor/group/list at runtime and computes visibility, readouts (`readoutErrors`), morphs, and extra uncast keys.
- Scenes run whole per frame with zero mutable state across frames (`tally` / `events` folding instead of 0..t loops) so seeking and step-timing budgets (`--budget 8`) hold evenly.

## Traps

- Never cast with `as` or assert `!`; type pose literals cleanly (`const p: Pose2d = { x: 1 }`) and use `?? 0`.
- `gerak review` checks continuity even while hidden by `opacity: 0` or outside `.on(...)`; avoid resetting scale/position mid-gap.
- Shadow DOM hosts `:host { background: ... }`; `<svg>` paths keep `overflow: visible` and base stroke bounds.
- Return exact-length arrays for `m.many`/`m.letters`/`m.words` and single objects for actors/groups — mismatched shapes produce `shape_mismatch` errors.
