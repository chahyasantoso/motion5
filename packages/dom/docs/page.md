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

Headless tools advance scroll via `cues` or `npx gerak frames ... --action scroll:px@ms`.

## Rests and measured lines

`mountPage` temporarily clears its own inline transforms to measure each node's CSS rest box (`flow` and `sticky` in document coordinates, `fixed` in viewport coordinates), then remeasures on `ResizeObserver`, viewport `resize`, font load or `mounted.remeasure()`.

`text(name, value, { split: "words" | "letters", node: el(selector) })` keeps a fixed part count from `value`:

- If the matched element already has matching child elements, `mountPage` binds them in place; if it has no child elements, `mountPage` wraps the parts in `<span>` nodes on mount and restores the original text on `dispose()`.
- Each list part's `MotionContext` receives its layout row in `context.line` (0 headless, recomputed on resize without changing part count).
- `stagger(motion, { spread, from?, by: "line" })` orders lanes by measured `line` so parts on the same visual line move together.
