# ADR-157: What an agent needs from moves and rig

**Status:** Accepted, 2026-11-08

## Context

In a blind benchmark the code path won on look but cost more. Interviewed afterwards, the agent named what sent it
into the source: it could not ask when a hop lands, found no eases or blends, had to work out the rig's conventions
with a throwaway script, and cast pose literals because chain answers could be missing. The agent with no repo said
it would skip a library whose conventions it had to read from source.

## Decision

- A move declares `moments(options)`: named shares of its progress, such as a hop's `landings` and `lastLanding`.
  `move.moments` reads the caller's options with defaults filled, as the move itself does.
- `span(fromMs, toMs, durationMs)` in the time module names a stretch of a scene: `of(time, ease?)` gives a move its
  time inside it, and `at(share)` gives the ms a moment falls on.
- `@motion5/moves` owns the eases, blends and keyframes a code scene uses: `ease`, `mix`, `mixAngle`, `mixPoint`, `keyframes` and
  `mixPose`. `combine` and `mixPose` read one list of added and multiplied pose fields.
- `buildChain` keeps the bone ids it was given, so `fk` and `ik` answer every bone with no missing entry, and
  `chainPoses` gives bone and tip poses for elements laid out at the chain's base.
- The guide states the rig's conventions and lists the worked examples, each held by a test.

## Consequences

The engine keeps its GSAP eases, frozen with core; a code scene uses the eases in moves. A move with no moments
declares an empty record. The timing example uses spans, and its test still holds it equal to the engine project.

## Rejected

- Exposing landing times only through `contact`: it says whether a hop lands now, and a scene plans before it runs.
- A recipe page apart from the examples: a recipe that no test runs goes stale.
