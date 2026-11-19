# @gerak/stage

Read this page whole before making a piece. A piece is one default export from `@gerak/stage`, a `sceneBuilder` chain or a `defineStage({ ... })`; look signatures up by group below (an author needs [author](./reference/author.md) only), motion primitives in [@gerak/core](../../core/docs/core.md), and topic guides in [README.md](./README.md); never read package source. `<pieces>` is the `gerak.pieces` directory in `package.json`.

<!-- generated:reference:start -->
- [author](./reference/author.md) (64): `ActorSpec`, `CastBuilder`, `Content`, `Expect`, `GroupSpec`, `ItemContent`, `ListSpec`, `Members`, `Meta`, `Modifiers`, `Path`, `Pivot`, `Spec`, `Stretch`, `beat`, `Beat`, `BeatPlace`, `box`, `group`, `many`, `shape`, `text`, `Element`, `ElementOptions`, `MorphSource`, `Outline`, `ShapeSource`, `TextOptions`, `bind`, `carry`, `sceneBuilder`, `stayWith`, `BoundFields`, `ElementStep`, `MotionContext`, `Principle`, `ReadAt`, `SceneBuilder`, `SceneBuilderOptions`, `SceneMotion`, `NO_REST`, `ZERO_BOX`, `restReader`, `Box`, `Carry`, `CarryMode`, `CarryOptions`, `Frame`, `Rest`, `RestReader`, `defineStage`, `each`, `isStageDefinition`, `Beats`, `DomSkinInput`, `Limits`, `LayoutsInput`, `ListPose`, `MemberName`, `MemberOf`, `SceneContext`, `StageDefinition`, `StageOptions`, `Targets`
- [run](./reference/run.md) (20): `DEFAULT_FRAME`, `compileStage`, `isStage`, `CompileResult`, `DomSkin`, `Member`, `Stage`, `StageLayouts`, `formatStageError`, `StageError`, `check`, `frame`, `listPose`, `poseOf`, `FrameInput`, `FrameOutput`, `beatAt`, `Window`, `blendShapes`, `matchOutlines`
- [render](./reference/render.md) (5): `drawStrokes`, `morphAt`, `restOfBounds`, `strokeBox`, `Strokes`
- [dom](./reference/dom.md) (2): `cssVariables`, `isTokenName`
<!-- generated:reference:end -->

## How stage works

```text
defineStage({ beats, cast, scene }) -> compileStage -> Stage -> frame(stage, { time, events, boxes }) -> { layout, visible, targets } -> renderer
                                                                 check(stage, targets) -> StageError[]   (review and authoring pages)
```

- **One name per member.** Names are unique, group children included, and the scene names them flat. A list's items are `<list>.0`, `<list>.1`, … in skins, rests and review findings; `[data-cast^="<list>."]` selects them all.
- **The scene is pure.** It returns poses from `({ time, beats, events, rest, layouts, carry })` only, so every frame can be sought; fold `events`, keep no state.
- **Shadow DOM.** The DOM renderer builds `[data-cast="<name>"]` elements inside `[data-stage="frame"]`, labelled `[data-layout="<name>"]`; a piece without layouts has one, `main`. Headless runs read zero boxes unless the piece gives `rest`.
- **Playback.** A piece plays once at real speed from 0 and holds its last frame (reduced motion shows it). Its clock runs on past `durationMs` while any member is watched, so a later hover still plays out.

## The loop

1. **Find the idea first.** Name the obvious answer, then write three non-obvious ideas differing in material and mechanics. Keep the strongest as three lines: what moves in what order, its character, the one moment the eye must not miss.
2. `npx gerak new <name> [--in <brief>]` scaffolds `<pieces>/<brief>/src/<name>.ts`; preview `stage.html?piece=<name>`.
3. **Choose primitives.** From `@gerak/core`: `span`, `chain`, `lanes`, `loop`, `sequence`, `mix`, `mixPose`, `keyframes`, `ease`, `wave`, `arch`, `attack`, `decay`, `taper`, `ballistic`, `along`, `toCubics`.
4. **Check.** `npx gerak review <pieces>/<brief>/src/<name>.ts` checks compile errors, shapes, expectations and bounds headlessly; `npx gerak review "stage.html?piece=<name>" --watch '[data-cast="<member>"]' --to <ms>` captures a `sheet.png`. Repeat until clean and `npx tsc --noEmit` passes.

Never open sibling `<pieces>/*/src` files; trust sheets beside numeric checks.

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

## sceneBuilder

```ts
const fall = beat("fall", 600);
const hand = box("hand");
const ball = shape("ball", circlePath({ cx: 0, cy: 0, r: 20 }));
export default sceneBuilder({ skins: { dom: { css } } })
  .element(hand)
  .show(fall)
  .element(ball)
  .motion(drop({ distance: 300 }).in(fall))
  .modify(squashStretch({ stretch: 0.1, max: 1.4 }))
  .motion(stayWith(hand).in(fall).take());
```

- **The chain is a `StageDefinition`.** Beats come from `.in` and `.show`; an element with no motion is static, one with a `.loop` motion ambient.
- **Layering.** Motions run in list order: a layer motion adds by each field's rule, a `.take()` motion replaces its fields from its beat's start, `.modify(principle)` wraps all above it. `stayWith` loops are refused.

## Cast builders and modifiers

| Builder | Member | Scene value |
| --- | --- | --- |
| `m.box()`, `m.text(value)` | actor | `Pose2d` |
| `m.readout((time) => string)` | actor whose text the stage writes each frame; never in a list | `Pose2d` |
| `m.stroke(cubics \| (rest) => cubics)` | SVG path, skinned with `[data-path="<name>"]`; a function reads other members' boxes, and a loop fails as `stroke_loop` | `Pose2d` with `drawn` |
| `m.morph(base, targets)` | outline blended by `shape`: 0 is `base`, 1 `targets[0]`; outlines need equal piece counts | `Pose2d` with `shape` |
| `m.many(count)`, `m.many(items, (item, i) => m.text(...))`, `m.letters(text)`, `m.words(text)` | list | `(index, count) => Pose2d` |
| `m.group({ ... })` | container moving its children | `Pose2d` |

- **Lists take a function of the index.** The cast owns the count; `each(items, (item, i) => pose)` poses per-item data.
- **Literal names type the scene.** `Targets` checks names and lists only while the cast's keys are literal; keys typed `string` make it a plain record, and then only `gerak review` checks them.
- **Time in the scene.** `time.progress` runs 0 to 1 over `durationMs`; `elapsedOf(time.clock)` answers ms (`undefined` untimed); `beats.<name>.of(time)` is time inside that beat.
- `.on(beat, [from, to], ...)` shows a member only then (end excluded); a stretch reaching the end holds past it, and a group hides its children.
- `.watch()` streams pointer events (`enter`, `leave`, `down`, `up`, `click`, `focus`, `blur`) into `events`; `.pivot({ x, y })` sets the origin in frame px.
- `.settle()` (default) moves and holds; `.ambient()` keeps moving (children and items inherit it) and must stay in frame; `.static()` forbids scene poses.

## Layouts, carry and skins

- `rest.get("<name>")` returns a measured centre-origin `Box` (zero box when unmeasured).
- `layouts` names layouts styled under `[data-layout="<name>"]`, picked from `events`; `carry("<member>", options)` animates a member across layout changes (`mode`: `"scale" | "clip" | "keep"`).
- `skins.dom` takes inline `css`/`defs` strings or `URL`s (`new URL("./piece.css", import.meta.url)`). `cssVariables` from `@gerak/stage/dom` writes style-card tokens as `:host` custom properties.

## How the DOM renderer draws

- **Frame and surround.** The frame is 1280 by 720 unless `frame` says otherwise, clips what leaves it, and scales to fit its host. Set `:host { background: #000; }` in the skin for a black surround, and the frame's background and font on `[data-stage="frame"]`.
- **Default layout.** The renderer's rules have zero specificity (`:where`), so any skin rule wins. The frame, groups and lists lay children out as centred, wrapping flex rows, with a 24 px gap in the frame and 8 px in groups and lists. `position: absolute` places a member against its group's box (the frame's at the top level); a group whose children are all absolute has no size, so give it one (`inset: 0`). Never `position: static` or `display: contents`.
- **Order.** Elements follow cast order, later on top; `z-index` reorders them. A group's pose, opacity and blur carry its children.
- **Pose to CSS.** A pose writes `translate(x, y)`, `rotation`, skews, scales, about the member's `.pivot` (its centre without one); `x` and `y` move it from where it rests. `along(path)(share)` answers a point in the path's own coordinates, not an offset from that rest.
- **Text.** Letter and word items hold no spaces: the list's flex gap spaces them, so a skin that changes the list's display spaces them itself (`margin`). Text keeps its spaces and line breaks (`white-space: pre`).
- **Strokes and morphs.** Path coordinates are frame px wherever the member sits in the cast: the renderer places the member at its path's bounds (at least 1 px thick), so give a stroke no `left`, `top`, `width` or `height`. Style the path with `[data-path="<name>"]` (default `fill: none; stroke: currentColor; stroke-width: 2`); `drawn` and `drawnFrom` dash it by length. A morph pairs points in order along each piece: draw base and targets in the same direction from matching starts; a closed outline is turned to start nearest the base's.
- **Values on CSS.** Each `custom.<name>` number is a unitless `--<name>` on the member's element and its path (`stroke-width: calc(var(--width) * 1px)`); a field's name is refused.
- **Fonts.** Use fonts the page already has; the renderer measures again when one loads.

## Traps

- `npx gerak review` names a member that never moves, a static member the scene poses, an ambient member that stops or leaves the frame, a list given an array, and a name not in the cast. It judges ambient bounds only where the box is known (`rest`) and the member shows; `opacity: 0` counts as shown.
- Never cast with `as` or assert `!`; type pose literals (`const p: Pose2d = { x: 1 }`), use `?? 0`.
- Review checks continuity even under `opacity: 0`; a member hidden by `.on(...)` may jump while hidden.
- Keep scenes O(1) per frame: fold events with `tally`, sample other moments with `timeAt`; never loop from 0 to `time`.
