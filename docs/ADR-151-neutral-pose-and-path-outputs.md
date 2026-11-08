# ADR-151: Neutral pose and path outputs

**Status:** Accepted, 2026-11-08

## Context

Four move outputs are DOM formats: `transformOrigin`, `clipPath`, stroke dash, and CSS `path()`, in `Sprite2d`,
`Clip2d`, `Stroke2d` and `PathData2d`. A Three.js page cannot use them, and the math cannot be tested without
parsing CSS.

## Decision

`Pose2d` holds `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `opacity`, and `anchor`, one of `"center"`,
`"bottom"`, `"top"`, `"left"` and `"right"`. Path moves output geometry: a cubic path, a `reveal` circle
`{ x, y, radius }`, and a `drawn` share from 0 to 1.

Each renderer owns its format. DOM writes `transform-origin`, `clip-path`, stroke dash from the path's own length
and SVG `d`. Three.js offsets position by bounding box for `anchor`, masks for `reveal` and sets a draw range for
`drawn`.

`Sprite2d`, `Sprites2d`, `Clip2d`, `Stroke2d` and `PathData2d` are deleted with no aliases; the packages are
private `0.0.0` and every reader is in this repository. The `svgPath` plugin is removed; its formatting moves to
`@motion5/dom`.

## Consequences

A test checks that every `Pose2d` field reaches each renderer. The browser frame check must still match the
TIMING and rope beats after the change.

## Rejected

- A numeric pivot now: no brief has asked for one; it is added when one does.
- Keeping DOM fields beside neutral ones: two answers for one output.
