# Handoff to the next conductor session

**Written:** 2026-11-13, at the end of composition part three. Read this, then `docs/SESSION-STATUS.md`,
`plan/roadmap.md` section 5, `plan/composition-three-plan.md` section 3a, and `.claude/skills/wave-build/SKILL.md`.
Delete this file once part four's plan exists.

## Where things stand

- Layer 3 is built: a piece is one stage module (ADR-174 to ADR-177). Composition parts one to three closed the
  standing measure's gaps; the sixth rebuild, `showreel-f`, cost 189 k tokens, the first drop in three rebuilds.
- The wave workflow is the `wave-build` skill; its cost table is `references/lessons.md`. One pull request per plan,
  after its last wave. The owner merges by hand.
- Workers run on Opus or Sonnet at medium effort, fresh, from short briefs. A measure always runs in a fresh worker.
  The conductor stays in one session per plan and starts a new one when its history outgrows the work.

## Part four, what it is for

Transitions between two scenes, and layout moves (an element carried from one layout to another), roadmap stage 4.
They serve a site (a route change, a list reordering, a card opening) as much as a video. The showreel cannot exercise
them, so part four needs a measure of its own: a small site with a route change and a reordering list, built cold
from a brief, with tokens and frames recorded the way the showreel's are.

Carry the showreel measure's remaining costs as smaller slices beside it, only where cheap:
- an option range found only at run time (`jolt` count, `push` `to`); an `integer` option kind if a measure asks;
- one `on` for all of a `many`'s items;
- enter and exit moves holding their end, so replacing phases need `sequence`;
- `anticipate` returning to its start where a held lift is wanted;
- the scene review reporting a follow move still ringing after its member is hidden;
- `motion:moves -- --candidates` counting pieces from different briefs, not importing files: the six showreel
  rebuilds are one brief, so they count once;
- `motion:promote` writing the doc comment the generated reference requires; today it is added by hand.

## Promotion

A move is promoted when pieces from two different briefs import it. `smudge` (showreel and `nowplaying`) is promoted
into `@gerak/moves`. Every other candidate is imported only by showreel rebuilds and waits for a second brief; the
part-four site measure is the likely one.

## Deferred

- `trail` costs about 3.5 ms a frame on a seven-pendulum scene; a keyed cache is designed (ADR-176) but not built.
  Build it when a measure or a site shows `trail` in its frame budget, not before.
