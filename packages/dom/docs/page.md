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

- `mount` matches `[data-cast="<name>"]` inside `root` (`document` by default) and throws, naming the element, if no node matches. Pass `nodes: { name: nodeOrList }` to override matching by name.
- Pass `binders: [threeBinder(world, { ... })]` to draw `object` elements; `mount` verifies every `object` in the scene is claimed by one binder.
- Plain `box`, `shape` and non-readout `text` leave CSS and HTML text intact (`shape` sets the `<path>`'s `d` attribute from its path); only a readout `text(name, (time) => string)` updates `textContent`.
- Calling `.dispose()` cancels listeners and the animation loop and clears inline values written by gerak.

## Clock and frame modes

- `clock: "live"` runs one continuous clock from mount, feeding scroll, pointer and watched element events into the scene.
- `clock: "timed"` runs a seekable `ClockDriver` over the scene's `durationMs`, evaluating the full scene each step for reels, capture and scrubbing (`options.onDriver` receives the driver).
- `frame: "page"` (default) animates elements in place on the page.
- `frame: "fit"` treats `root` (required to be an `HTMLElement` sized in CSS) as the fixed frame, clips overflow, and scales it about its top-left corner to fit its parent or the viewport; rest boxes are measured in unscaled frame px.

## Live clock and inputs

A live mount runs one clock (`liveAt`) feeding scroll, pointer and watched element events into the scene:

- Window or `scrollTarget` scrolling samples `INPUT_EVENTS.scroll` in px (`scroll.y`).
- Pointer movement over the page samples normalized viewport coordinates `INPUT_EVENTS.pointerX` and `INPUT_EVENTS.pointerY` from 0 to 1 (`pointer.x`, `pointer.y`).
- Elements with `watch: true` log `enter`, `leave`, `down`, `up`, `click`, `focus` and `blur`.
- `mounted.send(name, value, target?)` logs a sample at the current clock time, and `mounted.events()` returns the recorded log.
- The mount owns the inline `transform`, `opacity`, `z-index`, `transform-origin`, `transform-box`, `filter` and `clip-path` of every node it animates, setting each only when its text changes; it leaves `transform-origin` and `transform-box` untouched unless a pose specifies an `anchor`.
- An input only logs its sample and asks for a frame; the scene runs and writes once per animation frame, however many inputs arrived in it.
- A frame after an input runs the whole scene. A frame with no new input runs only the elements that move with time alone: a clock beat not ended, a running trigger, a `smooth` beat or `springTo` not yet settled, a loop; and, until `settleMs` after the last input or re-measure, a motion that read the clock, `carry` or another element.
- The mount never smooths the page's own scrolling.

Headless tools advance scroll via `cues` or `npx gerak frames ... --action scroll:px@ms`.

## Motion the browser plays

On a `"live"` `"page"` mount and on each remeasure, `mount` hands Chromium the elements whose motion it can work out ahead of time, as Web Animations; Chromium plays animations of `transform` and `opacity` on its compositor thread, so they keep up with the scroll while the page's script is busy.

- **Scroll-driven:** every motion on the element plays in a scroll beat without `smooth`. It plays on one `ScrollTimeline` over the document's whole scroll range.
- **Trigger-driven:** every motion on the element plays in one trigger beat, and its pose before the trigger fires equals its pose at the start. It plays on the document timeline; on each input the mount asks the beat which way it runs and how far it has come, so `reverse`, `stay` and `replay` stay the beat's to decide.
- Either way the element sets only `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY` and `opacity` (with one fixed `anchor`), and its motions read nothing but their window's time and the measured boxes. A read of the clock, `events`, `carry` or another element, a `bind`, `travel`, `.loop`, `.modify`, `.show` or `.ambient()` keeps it in the engine, as does a `smooth` scroll beat.
- Without `ScrollTimeline`, or with a `scrollTarget` other than the window, every element stays in the engine, and so it does while the page tools hold the clock.

## Sections and CSS layout

Site CSS owns page layout; `mount` never alters layout geometry.

- **Pinned section:** wrap a `position: sticky` inner container (`top: 0` or a px offset) inside a tall outer section wrapper. Scroll beats span the outer wrapper while content pins inside the sticky inner container.
- **Fixed layer:** place viewport-locked layers inside a `position: fixed` container (`inset: 0; pointer-events: none` in CSS).

Every box element's `.top` and `.end` are scroll points on its measured box (supporting `.plus(px)`, `.minus(px)` and `.reached`). A scroll or trigger beat that reads them adds the element to the scene, with no motions if it has none; `mount` measures its document box into `rest` (`flow`, matching `minY`/`maxY`/`pinY` when sticky) and remeasures on resize.

- **Slot:** a static element bound to an empty CSS-placed node (`box("slotHero")` on `<div data-cast="slotHero" class="slot">`) with no motions.
- **`travel({ to: slot, arc?, fit? })`:** moves and scales an element from its current pose (or rest) to `slot`'s measured viewport box over its beat, bending perpendicularly by `arc` px at mid-travel, across `flow`, `sticky` and `fixed` layers at any viewport size. It keeps its proportions unless `fit: "fill"`, and with no window it sits on the slot.
- Elements animated by `mount` keep `transform` unset in site CSS so the pose-to-CSS writer owns transforms alone.

## Rests, parts, and measured lines

`mount` temporarily clears its own inline transforms to measure each node's CSS rest box (`flow` and `sticky` in document coordinates, `fixed` in viewport coordinates), then remeasures on `ResizeObserver`, viewport `resize`, font load or `mounted.remeasure()`. Any element whose rest box changes records a measurement timestamp so `carry` can transition it to its new box.

`box(name, { parts: true })` and `text(name, { split: "words" | "letters" })` read part counts from the markup:

- Multiple `[data-cast="<name>"]` nodes bind directly as parts `0..count-1`.
- One `[data-cast="<name>"]` node with child elements binds its child elements as parts; otherwise, `text(name, { split })` wraps its `textContent` in `<span>` nodes on mount and restores the original text on `dispose()`.
- Each list part's `MotionContext` receives its layout row in `context.line` (0 headless, recomputed on resize without changing part count).
- `stagger(motion, { spread, from?, by: "line" })` orders lanes by measured `line` so parts on the same visual line move together.

## Ownership

An element belongs to one scene; `sceneBuilder` refuses an element placed in two scenes and names both. Scenes may share beats, states and signals; `.include(scene)` merges several into the one a page mounts.
