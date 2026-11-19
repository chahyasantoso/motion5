# @gerak/stage

Read this page whole before making a piece. A piece is a file whose default export is a `sceneBuilder` chain and whose `skin` export is how the DOM draws it; look signatures up by group below, motion primitives in [@gerak/core](../../core/docs/core.md), and topic guides in [README.md](./README.md); never read package source. `<pieces>` is the `gerak.pieces` directory in `package.json`.

<!-- generated:reference:start -->
- [author](./reference/author.md) (55): `Content`, `Expect`, `ItemContent`, `Path`, `Pivot`, `beat`, `Beat`, `BeatPlace`, `box`, `group`, `many`, `shape`, `text`, `Element`, `ElementOptions`, `MorphSource`, `Outline`, `ShapeSource`, `TextOptions`, `bind`, `bindEach`, `carry`, `compileScene`, `isScene`, `sceneBuilder`, `stagger`, `stayWith`, `BoundEachFields`, `BoundFields`, `CompileSceneOptions`, `ElementStep`, `MotionContext`, `Principle`, `ReadAt`, `SceneBuilder`, `SceneBuilderOptions`, `SceneMotion`, `ShowWindow`, `StaggerFrom`, `StaggerOptions`, `NO_REST`, `ZERO_BOX`, `restReader`, `Box`, `Carry`, `CarryMode`, `CarryOptions`, `Frame`, `Rest`, `RestReader`, `isDomSkin`, `DomSkinInput`, `Limits`, `LayoutsInput`, `ListPose`
- [run](./reference/run.md) (19): `DEFAULT_FRAME`, `isStage`, `CompileResult`, `DomSkin`, `Member`, `Stage`, `StageLayouts`, `formatStageError`, `StageError`, `check`, `frame`, `listPose`, `poseOf`, `FrameInput`, `FrameOutput`, `beatAt`, `Window`, `blendShapes`, `matchOutlines`
- [render](./reference/render.md) (5): `drawStrokes`, `morphAt`, `restOfBounds`, `strokeBox`, `Strokes`
- [dom](./reference/dom.md) (2): `cssVariables`, `isTokenName`
<!-- generated:reference:end -->

## How stage works

```text
sceneBuilder().element(e).motion(m) -> compileScene(scene, { skin }) -> Stage -> frame(stage, { time, events, boxes }) -> renderer
```

- **Elements are values,** each made once with a unique name: `box`, `text` (`split: "letters" | "words"`, or a function of time for a readout), `shape` (a path, a function of rest boxes, or `{ base, targets }` for a morph), `many(name, count | items, make?)` and `group(name, children)`. Options: `pivot`, `watch` (pointer events), `split`. A part of a many or split text is `<name>.<index>` in skins and findings.
- **Beats are values:** `beat(name, ms, { at? } | { after, gap? })`. A piece's beats are the ones its motions and windows use; `length` ends it later.
- **The scene is pure.** Every motion is a function of time and its context (`time`, `events`, `rest`, `carry`, `element`, `read`, and `index`/`count` on parts), so every frame can be sought; fold `events` with core's `state`, keep no state.
- **Playback.** A piece plays once at real speed from 0 and holds its last frame (reduced motion shows it). The clock runs past its length while an element is watched. Headless runs read zero boxes unless the scene's `rest` option gives them.

## The loop

1. **Find the idea first.** Name the obvious answer, then write three non-obvious ideas differing in material and mechanics. Keep the strongest as three lines: what moves in what order, its character, the one moment the eye must not miss.
2. `npx gerak new <name> [--in <brief>]` scaffolds `<pieces>/<brief>/src/<name>.ts`; preview `stage.html?piece=<name>`.
3. **Choose motions.** Moves from an installed move package, core's principles, `bind` over shared signals, and `motion(fn)` for the rest.
4. **Check.** `npx gerak review <pieces>/<brief>/src/<name>.ts` checks compile errors, shapes, expectations and bounds headlessly; `npx gerak review "stage.html?piece=<name>" --watch '[data-cast="<name>"]' --to <ms>` captures a `sheet.png`. Repeat until clean and `npx tsc --noEmit` passes.

Never open sibling `<pieces>/*/src` files.

## Idiom

```ts
import { ease, motion, type Pose2d, type Time } from "@gerak/core";
import { drop } from "@gerak/moves";
import { beat, box, group, sceneBuilder, stagger, text } from "@gerak/stage";

export const skin = { css: `[data-cast="dot"] { width: 36px; height: 36px; background: #f53; }` };

const enter = beat("enter", 600);
const dot = box("dot");
const word = text("word", "HELLO", { split: "letters" });
const rise = motion((t: Time): Pose2d => ({ y: 40 * (1 - t.progress) }));

export default sceneBuilder({ length: 1800 })
  .element(group("card", [dot, word]))
  .element(dot)
  .motion(drop({ distance: 80 }).in(enter, ease.cubicOut))
  .element(word)
  .motion(stagger(rise, { spread: 0.3 }).in(enter));
```

## Motions and layering

- **A motion** is a core `Motion`: `.in(beat, ease?)` plays it over a beat, holding its start before and its end after; `.loop(ms)` repeats it; `.take()` makes it replace the fields it sets from its beat's start; `.ambient()` marks it as never settling.
- **Layering.** An element's motions run in list order and join by each field's rule (position adds, scale multiplies). `.modify(principle)` applies a principle to everything above it.
- **Per part.** `stagger(m | (i, n) => m, { spread, from? })` plays a motion in each part's lane of its beat; `bindEach({ y: (i) => signal })` binds a field per part.
- **Shared values.** `bind({ y: signal })` sets fields from signals at scene time; two elements that react to one thing share a signal, wrapped in core's `shared` when several read it.
- **Reading another element.** `stayWith(e)` adds `e`'s travel since its beat started; elements reading each other in a loop are refused.
- **Windows and limits.** `.show(beat | [from, to])` shows an element only then; `.limits({ jump, turn, ratio })` sets its review limits.
- **Inferred.** An element with nothing in its list is static, one with a `.loop` or `.ambient()` motion is ambient, every other settles.

## Layouts, carry and skins

- `context.rest.get("<name>")` returns a measured centre-origin `Box` (zero box when unmeasured).
- `layouts: { names, pick }` names layouts styled under `[data-layout="<name>"]`, picked from `events`; `carry({ ms, ease, mode })` moves an element across layout changes (`mode`: `"scale" | "clip" | "keep"`).
- `export const skin = { css, defs? }` takes inline strings or `URL`s (`new URL("./piece.css", import.meta.url)`). `cssVariables` from `@gerak/stage/dom` writes style-card tokens as `:host` custom properties.
- How the DOM lays out, orders, strokes and spaces what it draws: [drawing](../../dom/docs/drawing.md).

## Traps

- `npx gerak review` names an element that never moves, an ambient element that stops or leaves the frame, and a skin rule naming no element. It judges ambient bounds only where the box is known (`rest`) and the element shows; `opacity: 0` counts as shown.
- Never cast with `as` or assert `!`; type pose literals (`const p: Pose2d = { x: 1 }`), use `?? 0`.
- Review checks continuity even under `opacity: 0`; an element hidden by `.show` may jump while hidden.
- Keep motions O(1) per frame: fold events with `state`, sample other moments with `timeAt`; never loop from 0 to `time`.
