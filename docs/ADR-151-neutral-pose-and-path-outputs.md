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

Each renderer owns its format. `@motion5/dom` writes `transform-origin`, `clip-path`, a stroke dash from the
path's own length and SVG `d`; an absent anchor is the centre, measured on an SVG element's own box as on HTML.
`@motion5/three` keeps the anchor's point on the geometry box still; `reveal` and `drawn` wait for a brief that
needs them there.

In the engine, `Sprite2d`, `Sprites2d`, `Clip2d`, `Stroke2d` and `PathData2d` stay until the engine decision:
deleting them needs the DOM adapter to know which model each patch carries. Until then `movePlugin` and the path
plugins translate neutral outputs to them through `@motion5/dom`'s format functions, the one owner of each CSS
and SVG string.

## Consequences

A test checks that every `Pose2d` field reaches each renderer. The browser frame check must still match the
TIMING and rope beats after the change.

## Rejected

- A numeric pivot now: no brief has asked for one; it is added when one does.
- Keeping DOM fields beside neutral ones in moves: two answers for one output.
- Putting the model id on every patch now: a change to core's patch contract that pays only if the engine stays.
