# @gerak/stage

Read this page whole before making a piece. A piece is one `defineStage({ ... })` default export from `@gerak/stage`; look signatures up by group below (an author needs [author](./reference/author.md) only; `run` and `render` serve renderers and tools), motion primitives in [@gerak/core](../../core/docs/core.md), and topic guides in [README.md](./README.md) — never read package source for signatures. `<pieces>` is the `gerak.pieces` directory in `package.json`.

<!-- generated:reference:start -->
- [author](./reference/author.md) (37): `ActorSpec`, `CastBuilder`, `Content`, `Expect`, `GroupSpec`, `ItemContent`, `ListSpec`, `Members`, `Meta`, `Modifiers`, `Path`, `Pivot`, `Spec`, `Stretch`, `NO_REST`, `ZERO_BOX`, `restReader`, `Box`, `Carry`, `CarryMode`, `CarryOptions`, `Frame`, `Rest`, `RestReader`, `defineStage`, `each`, `isStageDefinition`, `Beats`, `DomSkinInput`, `Limits`, `LayoutsInput`, `ListPose`, `MemberName`, `SceneContext`, `StageDefinition`, `StageOptions`, `Targets`
- [run](./reference/run.md) (20): `DEFAULT_FRAME`, `compileStage`, `isStage`, `CompileResult`, `DomSkin`, `Member`, `Stage`, `StageLayouts`, `formatStageError`, `StageError`, `check`, `frame`, `listPose`, `poseOf`, `FrameInput`, `FrameOutput`, `Window`, `blendShapes`, `matchOutlines`, `piecesOf`
- [render](./reference/render.md) (11): `drawInPasses`, `drawStrokes`, `morphAt`, `pathOf`, `pathsOf`, `restOfBounds`, `strokeBox`, `thickened`, `PathAnswer`, `StrokeLoop`, `Strokes`
- [dom](./reference/dom.md) (2): `cssVariables`, `isTokenName`
<!-- generated:reference:end -->

## How stage works

```text
defineStage({ beats, cast, scene }) -> compileStage -> Stage -> frame(stage, { time, events, boxes }) -> { layout, visible, targets } -> renderer
                                                                 check(stage, targets) -> StageError[]   (review and authoring pages)
```

- **One name per member.** Every cast key is unique, group children included, and the scene names them flat. A list's items are `<list>.0`, `<list>.1`, … in skins, rests and review findings; `[data-cast^="<list>."]` selects them all.
- **The scene is pure.** It returns poses from `({ time, beats, events, rest, layouts, carry })` only, so every frame can be sought; fold `events`, never keep state between frames.
- **Shadow DOM.** The DOM renderer builds `[data-cast="<name>"]` elements inside the frame `[data-stage="frame"]`, labelled `[data-layout="<name>"]`; a piece without layouts has one, `main`. Headless runs read zero boxes unless the piece gives `rest`.
- **Playback.** A piece plays once at real speed from 0 and holds its last frame; under reduced motion it shows the last frame. Its clock runs on past `durationMs` while the piece has any `.watch()` member, so a later hover still plays out, and for a moment after each live sample.

## The loop

1. **Find the idea first.** Name the obvious answer in one line, then write three non-obvious ideas differing in material and mechanics. Choose the strongest and keep three lines: what moves in what order, its character, and the one moment the eye must not miss.
2. `npx gerak new <name> [--in <brief>]` scaffolds `<pieces>/<brief>/src/<name>.ts`; preview at `stage.html?piece=<name>`.
3. **Choose primitives.** With `@gerak/core` alone, compose `span`, `chain`, `lanes`, `loop`, `sequence`, `mix`, `mixPose`, `keyframes`, `ease`, `wave`, `arch`, `attack`, `decay`, `taper`, `ballistic`, `along` and `toCubics`. With `@gerak/moves` and `@gerak/moves-tools`, run `npx gerak moves --anatomy`, write `design` in `defineStage`, and query `npx gerak moves --design <file> --target <member> --in <brief>`.
4. **Build and check.** `npx gerak review <pieces>/<brief>/src/<name>.ts` checks compile errors, shapes, expectations, bounds and `design` headlessly; `npx gerak review "stage.html?piece=<name>" --watch '[data-cast="<member>"]' --to <ms>` captures a contact `sheet.png`. Repeat until clean and `npx tsc --noEmit` passes; `gerak init` writes no `tsconfig.json`, so give the project one: `{ "compilerOptions": { "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler", "lib": ["ES2022", "DOM"], "strict": true, "noEmit": true, "skipLibCheck": true }, "include": ["<pieces>/*/src"] }`. Without one, `tsc` prints its help and checks nothing.

Never open sibling `<pieces>/*/src` files; treat visual sheets as truth alongside numeric checks.

## Idiom

```ts
import { ease, lanes, mix } from "@gerak/core";
import { defineStage } from "@gerak/stage";

const letters = lanes([1, 1, 1, 1, 1], 0.3);

export default defineStage({
  beats: { enter: [0, 600], hold: [600, 1800] },
  cast: (m) => ({
    card: m.group({ dot: m.box(), word: m.letters("HELLO") }),
    caption: m.text("Hello").static(),
  }),
  skins: { dom: { css: `[data-cast="dot"] { width: 36px; height: 36px; background: #f53; }` } },
  scene: ({ time, beats }) => {
    const t = beats.enter.of(time, ease.cubicOut).progress;
    return {
      card: { y: mix(40, 0, t) },
      dot: { scale: mix(0.4, 1, t) },
      word: (i) => ({ opacity: letters.of(beats.enter.of(time), i).progress }),
    };
  },
});
```

## Cast builders and modifiers

| Builder | Member | Scene value |
| --- | --- | --- |
| `m.box()`, `m.text(value)` | actor | `Pose2d` |
| `m.readout((time) => string)` | actor whose text the stage writes each frame; never in a list | `Pose2d` |
| `m.stroke(cubics \| (rest) => cubics)` | SVG path, skinned with `[data-path="<name>"]`; a function reads other members' boxes, and a loop fails as `stroke_loop` | `Pose2d` with `drawn` |
| `m.morph(base, targets)` | outline blended by `shape`: 0 is `base`, 1 `targets[0]`, 1.5 halfway to `targets[1]`; outlines need equal piece counts | `Pose2d` with `shape` |
| `m.many(count)`, `m.many(items, (item, i) => m.text(...))`, `m.letters(text)`, `m.words(text)` | list | `(index, count) => Pose2d` |
| `m.group({ ... })` | container moving its children | `Pose2d` |

- **Lists take a function of the index.** The cast owns the count; the renderer asks for each shown item. With per-item data, `each(items, (item, i) => pose)` gives that function.
- `.on(beat, [from, to], ...)` shows a member only then, start included and end excluded; a stretch reaching the end holds past it, and a group hides its children.
- `.watch()` streams pointer events (`enter`, `leave`, `down`, `up`, `click`, `focus`, `blur`) on the member into `events`; `.pivot({ x, y })` turns and scales it about a frame point.
- `.settle()` is the default: the member moves and holds its end. `.ambient()` keeps moving, like snow, passes to children and items, and must stay in the frame. `.static()` means the scene never poses it; on a group it marks the container only.

## Layouts, carry and skins

- `rest.get("<name>")` is a measured box `{ x, y, width, height }`, centre origin; an unmeasured name answers a zero box.
- `layouts: { names, pick: (events) => name, rests? }` names layouts the skin styles under `[data-layout="<name>"]`; `carry("<member>", { ms, ease?, mode?, target? })` moves a member from its box in the last layout to its box in the next, `mode` `"scale" | "clip" | "keep"`.
- `skins.dom` is `{ css: string, defs?: string }`, or `{ css: URL, defs?: URL }` for files beside the piece (`new URL("./piece.css", import.meta.url)`), fetched then applied the same way. `cssVariables` from `@gerak/stage/dom` writes style-card tokens as `:host` custom properties.

## How the DOM renderer draws

- **Frame and surround.** The frame is 1280 by 720 unless `frame` says otherwise, clips what leaves it, and is scaled to fit inside a host that fills its container (on `stage.html`, the whole window). Around the frame shows the host: set `:host { background: #000; }` in the skin for a black surround, and the frame's own background and font on `[data-stage="frame"]`.
- **Default layout.** The renderer's own rules have zero specificity (`:where`), so any skin rule wins. The frame, groups and lists lay children out as centred, wrapping flex rows, with a 24 px gap in the frame and 8 px in groups and lists. `position: absolute` places a member against its group's box (the frame's at the top level); a group whose children are all absolute has no size, so give it one (`inset: 0` places its children in frame px). Never `position: static` or `display: contents`.
- **Order.** Elements follow cast order, later on top; `z-index` in the skin reorders them. A group's pose, opacity and blur carry its children.
- **Text.** `m.words` and `m.letters` items hold no space characters: the list's flex gap spaces them, so a skin that changes the list's display spaces the items itself (`margin`). Text keeps its spaces and line breaks (`white-space: pre`).
- **Strokes and morphs.** Path coordinates are frame px wherever the member sits in the cast: the renderer sizes and places the member at its path's bounds (at least 1 px thick), so give a stroke member no `left`, `top`, `width` or `height`. Style the path with `[data-path="<name>"]` (default `fill: none; stroke: currentColor; stroke-width: 2`); `drawn` and `drawnFrom` dash it by length. A morph keeps its base's box, so a target outline beyond it draws outside it. A morph pairs points in order along each piece: draw base and targets in the same direction from matching starts; a closed outline is turned to start nearest the base's.
- **Values on CSS.** Each `custom.<name>` number is written as a unitless `--<name>` on the member's element and inherited by its path, for what no field covers (`stroke-width: calc(var(--width) * 1px)`); a field's name there is refused.
- **Fonts.** Use fonts the page already has; the renderer measures again when a page font finishes loading.

## Traps

- `npx gerak review` names a member that never moves, a static member the scene poses, an ambient member that stops or leaves the frame, a list given an array, and a name not in the cast. It judges an ambient member's bounds only where its box is known (`rest`) and while `.on(...)` shows it; `opacity: 0` still counts as shown.
- Never cast with `as` or assert `!`; type pose literals (`const p: Pose2d = { x: 1 }`) and use `?? 0`.
- Review checks continuity even under `opacity: 0`; a member hidden by `.on(...)` is not written, so it may jump while hidden.
- Keep scenes O(1) per frame: fold events with `tally`, sample other moments with `timeAt`, never loop from 0 to `time`.
