# How the DOM renderer draws a stage

Read this when a piece's look depends on layout, order, strokes or text in the page.

- **Frame and surround.** The page's HTML and CSS own styling and size. With `frame: "fit"`, `mount` reads `root`'s CSS size as the frame, clips what leaves it, and scales it about its top-left corner to fit its parent or the viewport; `:host` or `body` in CSS styles the surround. With `frame: "page"` (default), nodes stay in the page's flow without clipping or frame scaling.
- **Hierarchy and order.** Nesting in HTML (or `Object3D`) carries children with their parent's transforms, visibility and opacity. Elements follow DOM order unless `z-index` reorders them.
- **Pose to CSS.** A pose writes `translate3d(x, y, z)`, turns, skews and scales about the element's CSS `transform-origin` (overridden by pose `anchor` while a motion sets one); `x` and `y` move it from where CSS rests it. `along(path)(share)` answers a point in the path's own coordinates, not an offset from rest.
- **Text.** For `text(name, { split })` without pre-split child elements, word splits insert spaces between `<span>` elements (`white-space: pre` for letter splits keeps spaces intact). Pre-split child elements keep the markup's spacing.
- **Strokes and morphs.** Path coordinates are px in frame coordinates; `mount` writes the `<path>`'s `d` attribute from the scene's path (or blended morph outline) and rests its measured box at the path's bounds. `drawn` and `drawnFrom` dash it by length (`stroke-linecap: round` in CSS shows a short dash as a dot).
- **Writes.** A pose equal to the one last written to an element writes nothing, so a style set between frames stays until the pose changes.
- **Values on CSS.** Each `custom.<name>` number writes `--<name>` on the element (`stroke-width: calc(var(--width) * 1px)`); a pose field's name is refused.
- **Fonts.** Use fonts the page already loads; `mount` remeasures when `document.fonts` finishes loading.
