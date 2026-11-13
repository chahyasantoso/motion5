# ADR-177: Strokes that combine, presence the review reads, and text over time

**Status:** Accepted, 2026-11-13

## Context

Three rebuilds of the hand-made showreel cost 190 k, 242 k and 252 k tokens; quality rose, cost did not fall. The
fifth named where it went: each measure wrote its own PNG diff; a draw-on and its retract could not combine, and an
empty stroke still painted a dot, so each stroke needed a beat only to hide; a group's `still` passed to children that
moved; the review called a change while a member was hidden a jump; text could not change over time; and a path could
not read another stroke.

## Decision

- **Frames compare in the tools:** `motion:frames --compare <dir>`, mean difference and share over 32 per frame.
- **Strokes combine:** `drawn` multiplies and `drawnFrom` adds; their rests, 1 and 0, are the neutral elements.
- **An empty stroke paints nothing:** `drawn` at or below `drawnFrom` hides the path; otherwise its `visibility` is
  cleared, never set to `visible`, so presence still hides it.
- **`still` is the member's own:** a still group says its own value never moves; its members state their own.
- **The review reads presence:** a change between samples where the member is hidden at either is not a jump.
- **Text may follow time:** `actor({ text: (time) => string })`, written by the renderer each frame it changes;
  `letters` and `words` keep fixed text.
- **A path may read another stroke:** strokes are drawn in passes; a pass that draws nothing new is a loop, reported
  by the stage and refused by the review.

## Consequences

- A stroke's draw-on and retract are one combined value with one presence.
- A moving child of a still group needs no `still: false`.
- A readout such as a timecode is a text actor, not a move.
