# How the DOM renderer draws a stage

Read this when a piece's look depends on layout, order, strokes or text in the page.

- **Frame and surround.** The frame is 1280 by 720 unless the scene's `frame` says otherwise, clips what leaves it, and scales to fit its host. Set `:host { background: #000; }` in the skin for a black surround, and the frame's background and font on `[data-stage="frame"]`.
- **Default layout.** The renderer's rules have zero specificity (`:where`), so any skin rule wins. The frame, groups and lists lay children out as centred, wrapping flex rows, with a 24 px gap in the frame and 8 px in groups and lists. `position: absolute` places an element against its group's box (the frame's at the top level); a group whose children are all absolute has no size, so give it one (`inset: 0`). Never `position: static` or `display: contents`.
- **Order.** Elements follow the order of their first `.element` call, later on top; `z-index` reorders them. A group's pose, opacity and blur carry its children.
- **Pose to CSS.** A pose writes `translate(x, y)`, `rotation`, skews, scales, about the element's `pivot` (its centre without one); `x` and `y` move it from where it rests. `along(path)(share)` answers a point in the path's own coordinates, not an offset from that rest.
- **Text.** Letter and word parts hold no spaces: the element's flex gap spaces them, so a skin that changes its display spaces them itself (`margin`). Text keeps its spaces and line breaks (`white-space: pre`).
- **Strokes and morphs.** Path coordinates are frame px wherever the element sits: the renderer places it at its path's bounds (at least 1 px thick), so give a shape no `left`, `top`, `width` or `height`. Style the path with `[data-path="<name>"]` (default `fill: none; stroke: currentColor; stroke-width: 2`); `drawn` and `drawnFrom` dash it by length. A morph pairs points in order along each piece: draw base and targets in the same direction from matching starts; a closed outline is turned to start nearest the base's.
- **Values on CSS.** Each `custom.<name>` number is a unitless `--<name>` on the element and its path (`stroke-width: calc(var(--width) * 1px)`); a field's name is refused.
- **Fonts.** Use fonts the page already has; the renderer measures again when one loads.
