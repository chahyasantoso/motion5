# ADR-180: Rigging vector artwork

**Status:** Accepted, 2026-11-13

## Context

An SVG drawn by someone else could not become motion: a part turned about its centre, never its joint; a path member
drew one outline, joining separate ones with stray lines; a skin was CSS only, so gradients had nowhere to live; and
paint order was fixed. `chainPoses` poses elements laid out at a chain's base, not parts left where an artist drew them.

## Decision

- **A rigged artwork is an ordinary stage module:** each part a top-level path member named for what moves, filled and
  stroked by its skin. There is no artwork format beside it.
- **`motion:import-svg`** writes that module from an SVG: shapes as cubics in frame px with transforms flattened and
  strokes scaled, paint order as `z-index`, gradients in the skin's `defs`, the frame from the `viewBox`; what it cannot
  carry it lists by element.
- **A path member draws every outline it is given:** a cubic that does not start where the last ended starts another.
- **`skins.dom.defs`** holds SVG paint servers the stage mounts once inside its root.
- **`pivot: { x, y }`** on a member, in frame px, is where it turns, set from its measured box on every measure. A
  pose's `anchor` wins on the frames that give one.
- **`layer` is a field of a value,** written as `z-index`, replacing and free to step, so a part passes behind another
  while it moves. It orders siblings only, since a group paints as one layer.
- **Parts stay flat; a chain carries them.** `chainFromRest` answers each bone's pose against the chain at rest, so a
  part pivoting at its start joint follows it. `chainPoses` keeps its own question, parts laid out at the base.
- **`motion:compare`** renders a piece and its SVG from the `viewBox` at the frame's size and scores each member's box.
- **The review holds a skin to its cast:** a selector naming no member is a finding.
- **References** live in `apps/pieces/references/` with their source and licence; only artwork that may be changed and
  kept goes there.

## Consequences

- Rebuilding from a raster picture is out; a Three.js model waits for the 3D stage.
- Morphing one outline into another waits for the live-inputs stage, where a talking mouth needs it.
