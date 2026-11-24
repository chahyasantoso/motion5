# @gerak/stage

Read this page whole before making a piece. It says how a piece is built and played; [@gerak/core](../../core/docs/core.md) says how motion works; each reference page below lists every export with its signature; [README.md](./README.md) lists the topic pages. Never read package source. `<pieces>` is the `gerak.pieces` folder named in `package.json`.

## A piece

Three files under `<pieces>/<brief>/`:

- `<pieces>/<brief>/<name>.html`: HTML and CSS own the look, layout, text, nesting and `transform-origin`, tagging animated elements with `data-cast="<name>"`.
- `<pieces>/<brief>/src/<name>.ts`: `export default sceneBuilder(options).element(e).motion(m) ...` — only the cast names and their motion.
- `<pieces>/<brief>/src/<name>-main.ts`: `mount(scene, { clock, frame, root, binders, nodes })`.

```ts
import { ease, motion, type Pose2d, type Time } from "@gerak/core";
import { drop } from "@gerak/moves";
import { beat, box, sceneBuilder, stagger, text } from "@gerak/stage";

const enter = beat("enter", 600);
const card = box("card");
const dot = box("dot");
const word = text("word", { split: "letters" });
const rise = motion((t: Time): Pose2d => ({ y: 40 * (1 - t.progress) }));

export default sceneBuilder({ length: 1800 })
  .element(card)
  .element(dot)
  .motion(drop({ distance: 80 }).in(enter, ease.cubicOut))
  .element(word)
  .motion(stagger(rise, { spread: 0.3 }).in(enter));
```

`gerak new <name> [--in <brief>]` writes all three files; `gerak measure <brief>/<name>.html` writes `<name>.measure.json` and `<name>.cast.ts` (`export const cast`, `DomCast`, `ObjectCast`, `CastName`, also synced on HTML save in `gerak live`); `live.html?scene=<name>` plays it in the live editor.

## Elements

Each is a value with a unique name, made once. Multi-file pieces can import `{ cast }` directly from `<name>.cast.ts` (overriding only options like `{ split }` or `{ watch: true }` via `text(cast.x.name, ...)`, `box(cast.x.name, ...)`, `shape(cast.x.name, ...)`), or pass `<DomCast>` / `<ObjectCast>` to `box`, `text`, `shape`, and `object`.

- `box(name, { parts?, watch? })`: a page element. With `parts: true`, it binds all matched `[data-cast="<name>"]` nodes (`1..N`) directly as numbered parts `<name>.<index>`.
- `text(name, { split?, watch? })`: text whose string lives in the markup; `split: "letters" | "words"` gives one part per letter or word. `text(name, (time) => string, { watch? })` writes a readout string each frame.
- `shape(name, path, { watch? })`: an SVG `<path>` whose `d` attribute is drawn from `path` in frame px (`path` may also be a function of measured `rest` boxes). `shape(name, { base, targets })` is a morph: pose `shape` 0 is the base, 1 the first target, 1.5 halfway to the second, and so on.
- `object(name, { parts?, view? })`: a Three.js object (`Object3D` or writer) posed in `Pose3d` world units — or with `{ parts: true }`, an `Object3D[]` or `Group.children` list posed by `(index, count) => Pose3d` — drawn by `threeBinder` in `mount`'s `binders`, never by a DOM renderer. [3D scenes](../../three/docs/agent-3d.md) say how it is written, bound, reviewed and sent onto a page slot.

A part is `<name>.<index>`. Setting `watch: true` streams pointer events to the scene. On a [page mount](../../dom/docs/page.md), an element binds `[data-cast="<name>"]` inside `root` (or the overrides in `options.nodes`).

An element has one owner scene that gives it `.motion(...)`, `.show(...)` or `.limits(...)`; `sceneBuilder` refuses two scenes that claim ownership of the same element, while read-only geometry references (`view.canvas`, `travel.to`, edge points, `stayWith`) may be shared across `.include()` boundaries. `RestReader.object(name)` reads measured `ObjectBounds3d` (`{ width, height, depth }`) alongside 2D rest boxes (`rest.get(name)`).

## Beats

- Clock beat: `beat(name, ms, { at? } | { after, gap? })` is a named ms window. A piece's beats are the ones its motions and `.show` windows use; `length` ends the piece later than its last beat (required for timed scenes with only scroll or trigger beats).
- Scroll point: `scrollPoint(px)` with `.plus(px)`, `.minus(px)` and `.reached`.
- Edges: every DOM element (`box`, `text`, `shape`) exposes `.top`, `.end`, `.pinStart` and `.pinEnd` scroll points on its measured box (with `.plus(px)`, `.minus(px)` and `.reached`); `.pinStart` and `.pinEnd` read sticky `minY`/`maxY` (falling back to `.top`/`.end`). A scroll or trigger beat that reads an edge adds a read-only reference to that element unless owned locally.
- Scroll beat: `beat(name, { scroll: [from, to] })` takes scroll points and maps folded `scroll.y` across them to progress 0 to 1, holding before and after. `smooth: true` or `smooth: { stiffness, damping }` maps `springTo(scroll.y)` instead, so the motion trails the scroll and settles on it; headless it reads `scroll.y`.
- Trigger beat: `beat(name, ms, { when: point.reached, back })` starts a `ms` clock beat when scroll passes the point; `back: "reverse" | "stay" | "replay"` says what scrolling back past it does (no default).

Scenes can share beats, states and signals. `.include(scene)` merges another scene's elements, beats and motions onto this one's clock; it refuses two elements of one name, and a scene that sets `cues` or `length`, which only the mounted scene sets.

## The chain

- `.element(e)` selects an element; it may be selected again later.
- `.motion(...)` appends motions to its list; `.modify(principle)` wraps everything above it in the list.
- `.show(beat | scrollBeat | [from, to] | { from } | { until })` shows it only then: during a clock or scroll beat, across two beats or `scrollPoint`s, from a beat or scroll point on, or until one ends; hidden, it and its DOM descendants are hidden and may jump.
- `.limits({ jump, turn, ratio })` sets its review limits.

Only `.motion` and `.modify` order matters.

## Motions

A motion is a core `Motion` or a plain `(time, context) => pose`.

- `time` is the motion's own: inside `.in(beat)` it runs 0 to 1 across the beat, holding its start before and its end after. Without `.in` it spans the piece.
- `context` holds `time` (the scene's), `events`, `rest` (measured boxes), `carry`, `element`, `read`, plus `index`, `count` and `line` (measured row on a page mount, 0 headless) on a part.
- **Layering:** an element's motions run in list order and join by core's field rules. A `.take()` motion replaces the fields it sets from its beat's start.
- **Inferred:** nothing in the list is static; a `.loop` or `.ambient()` motion is ambient; anything else settles and must come to rest.

Helpers:

- `bind({ y: signal })`: fields from signals at scene time. `bindEach({ y: (i) => signal })`: one per part; also typed for 3D lists on `object(..., { parts: true })`.
- `stagger(m | (i, n) => m, { spread, from?, by? })`: each part plays in its own lane of the beat (on 2D lists or 3D `object` lists); `by: "line"` starts parts on the same measured `line` together.
- `stayWith(e)`: adds `e`'s travel since this motion's clock beat began (use a clock beat or no window). Elements reading each other in a loop are refused.
- `carry({ ms, ease, mode, target? })`: moves an element from its old rest box to its new one after a re-measure (see [layout](./agent-layout.md)).
- `travel({ to: slot, arc?, fit? })`: moves and scales an element across its beat to `slot`'s measured viewport box, bending perpendicularly by `arc` px at mid-travel; on 2D elements `fit: "contain"` (default) scales evenly to fit inside the box, centred, and `"fill"` stretches to it. On 3D `object` elements `fit` accepts `"none"` (default) or `"contain"` (uniform scale from `viewSize3d` and measured `rest.object(element)` bounds); pixel `arc` and `fit: "fill"` are refused. With no window it sits on the slot on every clock (live, timed, and untimed); sweeping requires `.in(beat)`. Referencing `slot` registers a read-only geometry dependency.

Two elements that react to one thing share one signal; wrap it in `shared` when several read it.

## Space and drawing

- **The frame:** `frame: "page"` (default) animates nodes where the page lays them out. `frame: "fit"` reads `root`'s CSS size as the stage frame, clips overflow, and scales it about its top-left corner to fit its parent or the viewport.
- **Rest:** where the page's CSS puts an element. `x` and `y` move it from there. `placementOf(box)`, `boxInViewport(box, scrollY)`, and `BoxPlacement` compute measured flow, fixed, or sticky viewport positions. `gerak measure <brief>/<name>.html` writes `<name>.measure.json` with the frame, rest boxes, lines, DOM parents, and 3D `objects` bounds so headless tools read the same geometry.
- **Turning:** `rotation` and `scale` act about the element's CSS `transform-origin` (overridden by pose `anchor` while a motion sets one). A DOM parent element carries its nested children with it when moved, scaled or hidden.
- **Strokes:** `drawn` and `drawnFrom` dash a `<path>` by length. A dash of a few px is barely visible; `stroke-linecap: round` in CSS shows it as a dot.
- More on layout, order, text spacing and CSS values: [drawing](../../dom/docs/drawing.md).

## Events and re-measure

- An element with `watch: true` streams pointer events (`enter`, `leave`, `down`, `up`, `click`, `focus`, `blur`). Fold them with core's `state`; `cues` in `sceneBuilder` options script them.
- When page CSS or viewport changes and the mount re-measures (`ResizeObserver`, `resize`, font load, or `mounted.remeasure()`), `carry` transitions any element whose rest box moved from its old box to its new one.

## Checking

- Run `gerak measure <brief>/<name>.html` after creating or editing the page so `<name>.measure.json` and `<name>.cast.ts` match its markup and CSS (or pass `--measure` to `gerak review` / `gerak sample` to refresh on demand).
- `gerak review <file>`: compile errors, jumps, holds, elements that never move, reading the measure cache headless. Headless review treats scroll `cues` as discrete samples (keep step deltas small or use `gerak check "<brief>/<name>.html" --action scroll:px@ms` or `scroll:sel[±px]@ms` to test smooth scrolling in a browser); `gerak sample <file> --events scroll=px@ms` passes scroll samples by hand.
- `gerak check "<brief>/<name>.html" --watch '[data-cast="<name>"]' --to <ms>`: real Chromium frames against review limits.
- `tsc --noEmit` clean. Never cast with `as` or `!`; type pose literals. Keep motions O(1) per frame: fold, never loop from 0 to now.
- Never open another piece's `src` files.

## Reference

<!-- generated:reference:start -->
- [author](./reference/author.md): What a piece is written with: `sceneBuilder`, its elements, beats and motions. Reach for it whenever you write a piece.
- [run](./reference/run.md): What renderers and tools run a piece with: `compileScene`'s `Stage`, `frame` and `check`, and the closed `StageError`. Reach for it when you run, test or review a piece.
- [render](./reference/render.md): Outlines for renderers, from `@gerak/stage/render`: drawing strokes in order, blending morphs, matching outlines.
- [dom](./reference/dom.md): Browser CSS custom property helpers exported from `@gerak/stage/dom` (`cssVariables`, `isTokenName`).
<!-- generated:reference:end -->
