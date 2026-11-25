# Mounting a page

`mount(scene, { clock, frame?, root?, binders?, nodes? })` animates a page's HTML and CSS nodes without creating a shadow root. Site HTML and CSS own the look, layout, hierarchy and `transform-origin`; motion writes transforms, opacity and custom properties through [the DOM renderer](./drawing.md).

## Binding nodes

An element binds to the nodes its markup tags with its name:

```html
<h1 data-cast="headline">Fresh pressed citrus every morning</h1>
<div data-cast="card"></div>
```

```ts
const headline = text("headline", { split: "words" });
const card = box("card");
```

- `mount` matches `[data-cast="<name>"]` inside `root` (`document` by default) and throws, naming the element, if no node matches — and also refuses a non-parts `box(name)` matching multiple nodes (naming `parts: true`). Pass `nodes: { name: nodeOrList }` to override matching by name.
- Pass `binders: [threeBinder(world, { objects, resize, draw })]` to draw, resize, report 3D `casts()`, count 3D list parts and measure `object` elements; `mount` publishes `Binder.casts()` via `BINDER_CASTS` before scene binding validates nodes and verifies every `object` in the scene is claimed by one binder. Async page setup calls `ready(promise)` from `@gerak/dom` so `window.__motionReady` is registered with one typed owner.
- Plain `box`, `shape` and non-readout `text` leave CSS and HTML text intact (`shape` sets the `<path>`'s `d` attribute from its path); only a readout `text(name, (time) => string)` updates `textContent`.
- A `box(name, { media: true })` binds an `HTMLMediaElement` (`<video>` or `<audio>`), pauses it on bind and unmount, plays it at rate 1 (re-seeking on drift over 1/30 s) on a running clock, and pauses and seeks it on every frame when the clock is held or scrubbing; `mounted.settled()` waits until all media nodes have `readyState >= 2` and `seeking === false`, and `mounted.media()` reports each clip's duration and window bounds.
- Calling `.dispose()` cancels listeners and the animation loop and clears inline values written by gerak.
- Dispose on `pagehide` only when `event.persisted` is false, never on `beforeunload`: a page the browser keeps in its back/forward cache comes back without rerunning scripts, so a disposed mount stays motionless.

## Clock and frame modes

- `clock: "live"` runs one continuous clock from mount, feeding scroll, pointer and watched element events into the scene and playing immediately on open. In a readout `text(name, (time) => string)` under `"live"`, read elapsed ms with `elapsedOf(time.clock)` rather than `time.progress` (which stays `0` on an unbounded live clock).
- `clock: "timed"` runs a seekable `ClockDriver` over the scene's `durationMs`, evaluating the full scene each step for reels, `gerak frames`, and scrubbing (`options.onDriver` receives the driver; call `driver.advance(dt)` in a `requestAnimationFrame` loop if an HTML page autoplays a timed piece on open).
- `frame: "page"` (default) animates elements in place on the page.
- `frame: "fit"` treats `root` (required to be an `HTMLElement` sized in CSS) as the fixed frame, clips overflow, and scales it about its top-left corner to fit its parent (or the viewport when the parent is `<body>`, `<html>`, or unsized); rest boxes are measured in unscaled frame px.

## Live clock and inputs

A live mount runs one clock (`liveAt`) feeding scroll, pointer and watched element events into the scene:

- Window or `scrollTarget` scrolling samples `INPUT_EVENTS.scroll` in px (`scroll.y`).
- Pointer movement over the page samples normalized viewport coordinates `INPUT_EVENTS.pointerX` and `INPUT_EVENTS.pointerY` from 0 to 1 (`pointer.x`, `pointer.y`).
- Elements with `watch: true` log `enter`, `leave`, `down`, `up`, `click`, `focus` and `blur`.
- `mounted.send(name, value, target?)` logs a sample at the current clock time, and `mounted.events()` returns the recorded log.
- `mounted.player.observe(signal, listener)` calls `listener` with a `state(...)` or other signal now and after each step that changes it, before the page draws that step. Page UI outside the cast reads the scene's own state this way instead of keeping a copy; a seek back undoes later events.
- The mount owns the inline `transform`, `opacity`, `z-index`, `transform-origin`, `transform-box`, `filter` and `clip-path` of every node it animates, setting each only when its text changes; it leaves `transform-origin` and `transform-box` untouched unless a pose specifies an `anchor`.
- An input only logs its sample and asks for a frame; the scene runs and writes once per animation frame, however many inputs arrived in it.
- A frame after an input runs the whole scene. A frame with no new input runs only the elements that move with time alone: a clock beat not ended, a running trigger, a `smooth` beat or `springTo` not yet settled, a loop; and, until `settleMs` after the last input or re-measure, a motion that read the clock, `carry` or another element.
- The mount never smooths the page's own scrolling.

Headless tools advance scroll via `cues` or `npx gerak frames ... --action scroll:px@ms` (or `scroll:selector[±px]@ms`).

## Motion the browser plays

On a `"live"` `"page"` mount and on each remeasure, `mount` hands Chromium the elements whose motion it can work out ahead of time, as Web Animations; Chromium plays animations of `transform` and `opacity` on its compositor thread, so they keep up with the scroll while the page's script is busy.

- **Scroll-driven:** every motion on the element plays in a scroll beat without `smooth`. It plays on one `ScrollTimeline` over the document's whole scroll range, sampled inside its active scroll intervals.
- **Trigger-driven:** every motion on the element plays in one trigger beat, and its pose before the trigger fires equals its pose at the start. It plays on the document timeline; on each input the mount asks the beat which way it runs and how far it has come, so `reverse`, `stay` and `replay` stay the beat's to decide.
- Either way the element sets only `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY` and `opacity` (with one fixed `anchor`), and its motions read nothing but their window's time and the measured boxes. A read of the clock, `events`, `carry` or another element, a `bind`, `travel`, `.loop`, `.modifies`, a timed or scroll `.shows`, or `.ambient()` keeps it in the engine, as does a `smooth` scroll beat.
- Without `ScrollTimeline`, or with a `scrollTarget` other than the window, every element stays in the engine, and so it does while the page tools hold the clock.
- `ResizeObserver` callbacks coalesce onto a single microtask, and a remeasure skips rebuilding compositor animations when `maxScroll`, `lines`, and the measured boxes read by handed tracks are unchanged.

## Sections and CSS layout

Site CSS owns page layout; `mount` never alters layout geometry.

- **Pinned section:** wrap a `position: sticky` inner container (`top: 0` or a px offset) inside a tall outer section wrapper. Scroll beats span the outer wrapper while content pins inside the sticky inner container.
- **Fixed layer:** place viewport-locked layers inside a `position: fixed` container (`inset: 0; pointer-events: none` in CSS).

Every box element's `.top`, `.end`, `.pinStart` and `.pinEnd` are scroll points on its measured box (supporting `.plus(px)`, `.minus(px)` and `.reached`). A scroll or trigger beat that reads them adds a read-only element reference to the scene, with no motions if it has none; `mount` measures its document box into `rest` (`flow`, matching `minY`/`maxY`/`pinY` when sticky) and remeasures on resize.

- **Slot:** a static element bound to an empty CSS-placed node (`box("slotHero")` on `<div data-cast="slotHero" class="slot">`) with no motions.
- **`travel({ to: slot, arc?, fit? })`:** moves and scales an element from its current pose (or rest) to `slot`'s measured viewport box over its beat, bending perpendicularly by `arc` px at mid-travel, across `flow`, `sticky` and `fixed` layers at any viewport size. It keeps its proportions unless `fit: "fill"`, and with no window it sits on the slot.
- Elements animated by `mount` keep `transform` unset in site CSS so the pose-to-CSS writer owns transforms alone.

## Rests, parts, and measured lines

`mount` invokes any `Binder.resize()` callback, temporarily detaches active compositor animation effects and clears its own inline transforms to measure each node's CSS rest box (`flow` and `sticky` in document coordinates, `fixed` in viewport coordinates) alongside any `Binder.measure()` 3D `ObjectBounds3d` into `Measurement.objects` (and `Binder.counts()` part counts into `Measurement.counts`) and `RestReader.object`, coalescing `ResizeObserver` callbacks onto a single microtask and also remeasuring on viewport `resize`, font load or `mounted.remeasure()`. Any element whose rest box or placement changes records a measurement timestamp so `carry` can transition it to its new box, while compositor handoff is rebuilt only if `maxScroll`, `lines`, or any rest box dependency of handed tracks changed.

`box(name, { parts: true })`, `text(name, { split: "words" | "letters" })`, and explicit `options.nodes[name]` arrays read part counts from the markup:

- `box(name, { parts: true })` and explicit `options.nodes[name]` arrays always bind matched or supplied `[data-cast="<name>"]` nodes directly as parts `0..count-1` (`1..N`), without descending into child elements.
- `text(name, { split })` binds multiple `[data-cast="<name>"]` nodes directly; on a single container node with child elements it binds those children as parts, and otherwise wraps its `textContent` in `<span>` nodes on mount and restores the original text on `dispose()`.
- Each list part's `MotionContext` receives its layout row in `context.line` (0 headless, recomputed on resize without changing part count).
- `stagger(motion, { spread, from?, by: "line" })` orders lanes by measured `line` so parts on the same visual line move together.

## Ownership

An element is bound once, in one scene, which gives it `.moves()`, `.shows()` or `.limits()`; `scene` refuses an element bound twice, while read-only geometry references may be shared across sub-scenes. Scenes may share beats, states and signals; `scene(options, heroScene, storyScene)` merges several into the one a page mounts.
