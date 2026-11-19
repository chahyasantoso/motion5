# @gerak/stage

Read this page whole before making a piece. It says how a piece is built and played; [@gerak/core](../../core/docs/core.md) says how motion works; each reference page below lists every export with its signature; [README.md](./README.md) lists the topic pages. Never read package source. `<pieces>` is the `gerak.pieces` folder named in `package.json`.

## A piece

One file under `<pieces>/<brief>/src/`:

- `export default sceneBuilder(options).element(e).motion(m) ...`: what moves, and how.
- `export const skin = { css, defs? }`: how the DOM draws it. `css` and `defs` are strings or `URL`s.

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

`gerak new <name> [--in <brief>]` writes one; `stage.html?piece=<name>` plays it.

## Elements

Each is a value with a unique name, made once.

- `box(name)`: a page element; its look is the skin's.
- `text(name, value, { split? })`: text. `split: "letters" | "words"` gives one part per letter or word. A function of time instead of a string writes the text each frame (a readout).
- `shape(name, path)`: an SVG path, drawn in frame px. `path` may be a function of rest boxes. `shape(name, { base, targets })` is a morph: pose `shape` 0 is the base, 1 the first target, 1.5 halfway to the second, and so on through every target.
- `many(name, count | items, make?)`: numbered parts.
- `group(name, children)`: a container; its pose moves, turns and scales its children with it.

A part is `<name>.<index>`. Options: `pivot` (frame px; the point it turns and scales about, its centre without one), `watch` (pointer events reach it), `split`, and `node` (`el(selector)`, binding an existing node on a [page mount](../../dom/docs/page.md); in a page scene every element has one and no `skin` is passed).

A group's children are in the piece already. Call `.element(child)` only to give a child motions.

## Beats

- Clock beat: `beat(name, ms, { at? } | { after, gap? })` is a named ms window. A piece's beats are the ones its motions and windows use; `length` ends the piece later than its last beat (required when a piece uses only scroll or trigger beats).
- Scroll point: `scrollPoint(px)` with `.plus(px)`, `.minus(px)` and `.reached`.
- Scroll beat: `beat(name, { scroll: [from, to] })` takes scroll points and maps folded `scroll.y` across them to progress 0 to 1, holding before and after.
- Trigger beat: `beat(name, ms, { when: point.reached, back })` starts a `ms` clock beat when scroll passes the point; `back: "reverse" | "stay" | "replay"` says what scrolling back past it does (no default).

## The chain

- `.element(e)` selects an element; it may be selected again later.
- `.motion(...)` appends motions to its list; `.modify(principle)` wraps everything above it in the list.
- `.show(beat | [from, to])` shows it only then; hidden, it is not drawn and may jump.
- `.limits({ jump, turn, ratio })` sets its review limits.

Only `.motion` and `.modify` order matters.

## Motions

A motion is a core `Motion` or a plain `(time, context) => pose`.

- `time` is the motion's own: inside `.in(beat)` it runs 0 to 1 across the beat, holding its start before and its end after. Without `.in` it spans the piece.
- `context` holds `time` (the scene's), `events`, `rest` (measured boxes), `carry`, `element`, `read`, plus `index`, `count` and `line` (measured row on a page mount, 0 headless) on a part.
- **Layering:** an element's motions run in list order and join by core's field rules. A `.take()` motion replaces the fields it sets from its beat's start.
- **Inferred:** nothing in the list is static; a `.loop` or `.ambient()` motion is ambient; anything else settles and must come to rest.

Helpers:

- `bind({ y: signal })`: fields from signals at scene time. `bindEach({ y: (i) => signal })`: one per part.
- `stagger(m | (i, n) => m, { spread, from?, by? })`: each part plays in its own lane of the beat; `by: "line"` starts parts on the same measured `line` together.
- `stayWith(e)`: adds `e`'s travel since this motion's clock beat began (use a clock beat or no window). Elements reading each other in a loop are refused.
- `carry({ ms, ease, mode })`: moves an element between layouts.

Two elements that react to one thing share one signal; wrap it in `shared` when several read it.

## Space and drawing

- **The frame** is 1280 by 720 unless `frame` says otherwise. It clips what leaves it and scales to fit the window; `:host { background }` colours the surround.
- **Rest** is where the skin's CSS puts an element. `x` and `y` move it from there. Headless tools read zero boxes unless the `rest` option gives them.
- **Turning:** `rotation` and `scale` act about the element's pivot. A group turns its children about the group's pivot, so a camera is a group holding the scene: its `x`, `y` pan, `scale` zooms and `rotation` tilts, all about its pivot.
- **Strokes:** `drawn` and `drawnFrom` dash a path by length. A dash of a few px is barely visible; `stroke-linecap: round` in the skin shows it as a dot.
- More on layout, order, text spacing and CSS values: [drawing](../../dom/docs/drawing.md).

## Events and layouts

- An element with `watch: true` streams pointer events (`enter`, `leave`, `down`, `up`, `click`, `focus`, `blur`). Fold them with core's `state`; `cues` in the options script them.
- `layouts: { names, pick }` picks a layout from events; each is styled under `[data-layout="<name>"]`. `carry` moves an element across a change.

## Checking

- `gerak review <file>`: compile errors, jumps, holds, elements that never move, skin rules naming no element, all headless. Headless review sees scroll motion from scripted `cues`; `gerak sample <file> --events scroll=px@ms` passes scroll samples by hand.
- `gerak review "stage.html?piece=<name>" --watch '[data-cast="<name>"]' --to <ms>`: a contact sheet of real frames.
- `tsc --noEmit` clean. Never cast with `as` or `!`; type pose literals. Keep motions O(1) per frame: fold, never loop from 0 to now.
- Never open another piece's `src` files.

## Reference

<!-- generated:reference:start -->
- [author](./reference/author.md): What a piece is written with: `sceneBuilder`, its elements, beats and motions. Reach for it whenever you write a piece.
- [run](./reference/run.md): What renderers and tools run a piece with: `compileScene`'s `Stage`, `frame` and `check`, and the closed `StageError`. Reach for it when you run, test or review a piece.
- [render](./reference/render.md): Outlines for renderers, from `@gerak/stage/render`: drawing strokes in order, blending morphs, matching outlines.
- [dom](./reference/dom.md): Browser CSS custom property helpers exported from `@gerak/stage/dom` (`cssVariables`, `isTokenName`).
<!-- generated:reference:end -->
