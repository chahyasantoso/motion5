# Page mount

`mountPage(scene, { root? })` animates an existing site's DOM nodes without creating a frame, a shadow root or a skin. Site CSS owns the layout and look; motion writes transforms, opacity and custom properties through [the DOM renderer](./drawing.md).

## Binding nodes

Bind every element in a page scene with `el(selector)`:

```ts
const headline = text("headline", "Fresh pressed citrus every morning", {
  split: "words",
  node: el("#headline"),
});
const card = box("card", { node: el("#card") });
```

- `compileScene` refuses a page scene if any element lacks `node`, or if a `skin` is passed.
- `mountPage` matches each `selector` inside `root` (`document` by default) and throws if a node is missing.
- Plain `box`, `shape`, non-split `text`, `group` and matched `many` elements create no DOM nodes and leave CSS and HTML text intact; only readout text updates `textContent`.
- Calling `.dispose()` cancels listeners and the animation loop and clears inline values written by gerak.

## Live clock and inputs

A page mount runs one live clock (`liveAt`) feeding scroll, pointer and watched element events into the scene:

- Window or scroll target scrolling samples `INPUT_EVENTS.scroll` in px (`scroll.y`).
- Pointer movement over the page samples normalized viewport coordinates `INPUT_EVENTS.pointerX` and `INPUT_EVENTS.pointerY` from 0 to 1 (`pointer.x`, `pointer.y`).
- Elements with `watch: true` log `enter`, `leave`, `down`, `up`, `click`, `focus` and `blur`.
- `mounted.send(name, value, target?)` logs a sample at the current clock time, and `mounted.events()` returns the recorded log.
- The mount owns the inline `transform`, `opacity`, `z-index`, `transform-origin`, `transform-box`, `filter` and `clip-path` of every node it animates, and sets each only when its text changes; site code writing them inline is overwritten only when the pose changes that property.
- An input only logs its sample and asks for a frame; the scene runs and writes once per animation frame, however many inputs arrived in it.
- A frame after an input runs the whole scene. A frame with no new input runs only the elements that move with time alone: a clock beat not ended, a running trigger, a `smooth` beat or `springTo` not yet settled, a loop; and, until `settleMs` after the last input, a motion that read the clock, `carry` or another element. With none of them, the mount asks for no frame and costs nothing.
- The mount never smooths the page's own scrolling. Smooth anchor jumps are the site's CSS (`scroll-behavior: smooth`), a smooth-scroll library is the site's script, and either reaches the scene as ordinary scroll samples.

Headless tools advance scroll via `cues` or `npx gerak frames ... --action scroll:px@ms`.

## Sections and CSS layout

Site CSS owns page layout; `mountPage` never alters layout geometry.

- **Pinned section:** wrap a `position: sticky` inner container (`top: 0` or a px offset) inside a tall outer section wrapper. Scroll beats span the outer wrapper while content pins inside the sticky inner container.
- **Fixed layer:** place viewport-locked layers inside a `position: fixed` container (`inset: 0; pointer-events: none` in CSS).

`section(name, el(selector))` exposes `.top` and `.end` as scroll points (supporting `.plus(px)`, `.minus(px)` and `.reached`). Scroll and trigger beats register any referenced section onto the stage; `mountPage` measures its document box into `rest` (`flow`, matching `minY`/`maxY`/`pinY` when sticky) and remeasures on resize.

- **Slot:** a static element bound to an empty CSS-placed node (`box("slotHero", { node: el("#hero .slot") })`) with no motions.
- **`travel({ to: slot, arc?, fit? })`:** moves and scales an element from its current pose (or rest) to `slot`'s measured viewport box over its beat, bending perpendicularly by `arc` px at mid-travel, across `flow`, `sticky` and `fixed` layers at any viewport size. It keeps its proportions unless `fit: "fill"`, and with no window it sits on the slot.
- Elements animated by `mountPage` keep `transform` unset in site CSS so the pose-to-CSS writer owns transforms alone.

## Rests and measured lines

`mountPage` temporarily clears its own inline transforms to measure each node's CSS rest box (`flow` and `sticky` in document coordinates, `fixed` in viewport coordinates), then remeasures on `ResizeObserver`, viewport `resize`, font load or `mounted.remeasure()`.

`text(name, value, { split: "words" | "letters", node: el(selector) })` keeps a fixed part count from `value`:

- If the matched element already has matching child elements, `mountPage` binds them in place; if it has no child elements, `mountPage` wraps the parts in `<span>` nodes on mount and restores the original text on `dispose()`.
- Each list part's `MotionContext` receives its layout row in `context.line` (0 headless, recomputed on resize without changing part count).
- `stagger(motion, { spread, from?, by: "line" })` orders lanes by measured `line` so parts on the same visual line move together.

## Ownership

An element belongs to one scene; `sceneBuilder` refuses an element placed in two scenes and names both. Scenes may share beats, states, signals and sections.
