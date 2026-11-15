# ADR-176: Strokes from the layout, skins that keep their own, and a library that grows

**Status:** Accepted, 2026-11-13

**Superseded in part by [ADR-185](./ADR-185-layers-as-folders-laws-fields-and-a-measured-catalog.md), 2026-11-14.** A move no longer names its recipe; what it is made of is read from its source.

## Context

The fourth rebuild of the hand-made showreel drew its strokes as path members, but a path was fixed when the cast
was built: an underline under a measured word was drawn at guessed points and stretched by hand, and the skin
restated each stroke's box to place it. Text no skin named fell back to 48 px, and `applyValue` wrote
`transformOrigin` on every frame, so a skin could not keep its own pivot. Separately, a move proved in several pieces
had no way into the library, and the catalog said what a move does but not what it is built from.

## Decision

- **A path may be a function of where things rest.** `actor({ path: (rest) => cubics })` is evaluated after the
  stage measures and on each measure; a tool with no renderer passes the module's `rest` or `NO_REST`. The stage
  measures the other members first; a path never reads its own box.
- **A path's points are frame px from the frame's top-left,** the space `Rest` boxes are in. The stage converts them
  to the parent's space and places the stroke member at the path's box.
- **Default text inherits its size** from its parent.
- **`applyValue` writes only what the value says.** On an HTML element, no `anchor` clears `transformOrigin`; an SVG
  element keeps `center`, since its own default is the top-left.
- **A move is promoted, not copied.** A local move that passes the gate and is imported by two or more pieces is a
  candidate; `motion:promote` moves it into `@gerak/moves` and rewrites its imports in one commit.
- **A move may name its recipe,** a list of part ids the catalog prints and the gate checks.
- **Squash from speed is a part.**
- **`trail`'s cost is measured before it changes;** a keyed cache is built only if a frame's scene passes 4 ms.

## Consequences

- A stroke follows the layout with no hand stretch and no box in the skin.
- A skin's `transform-origin` survives the motion; a piece that needs another pivot names `anchor`.
- The library grows from pieces by a command, and agents can read how a move is built.
