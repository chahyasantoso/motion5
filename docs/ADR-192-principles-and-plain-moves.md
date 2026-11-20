# ADR-192: Principles, plain moves and state

**Status:** Accepted, 2026-11-19
**Superseded in part by ADR-193:** the size ceiling on the pages read whole.

## Context

`@gerak/moves` declared each move with `defineMove` (an id, a role, a description, an options schema checked at run
time, an example and moments) and each part with `definePart`, and held style cards and qualities. `@gerak/moves-tools`
read those declarations through plugin hooks in `@gerak/tools` to list a catalog, gate parts, promote moves and check a
piece's `design` and `style`. The motion principles lived partly in moves (`anticipate`, `arc`, `trail`, `smear`) and
partly nowhere. Four places replayed the event log over time, each with its own code: `follow`, `react`, `tally` and a
piece's own helper. An agent read all of it before it could write a move, and nothing used the catalog at run time.

## Decision

1. **Core holds the motion principles.** `packages/core/src/principles/` holds `squashStretch`, `anticipation`,
   `followThrough`, `overlap`, `arc`, `exaggerate` and `secondary`, each with a `3d` twin where the pose type needs
   one, and `smear`, `smear3d`, `trail` and `trailTurn`, moved from moves. Each principle is built from its options,
   then given a signal: `squashStretch(options)(signal)`. Every knob is in px, world units, ms, degrees or a share,
   and none is named after a feel.
2. **`@gerak/moves` is a plain move package.** A move is a function from typed options to a function of time:
   `drop(options)(time)`. Defaults live in the function, and a value the old schema refused still throws a
   `RangeError`. A modifier takes its options, then the signal it changes. `defineMove`, `definePart`, roles,
   moments, examples, the part contract, style cards and qualities are gone, and so are the `anticipate` and `arc`
   moves. A moment a piece reads is a plain export: `hopLandings(options)` and `DROP_LANDING`.
3. **`@gerak/moves-tools` and the plugin hooks go.** `gerak moves`, `new-move`, `promote` and `style` no longer exist.
   `@gerak/tools` loads no command or review plugin, serves no built-in moves module, lints no brief imports and
   clamps no move range. `design` and `style` leave the stage.
4. **Pieces keep their look.** A piece's own move is a plain factory of the same name; a style card is a plain object
   of tokens passed to `cssVariables`.
5. **State from events has one owner.** `packages/core/src/state/` holds `state(start, rule, { target? })`, a signal
   of the state folded from the events up to a time, with `steps` (the moments it changed), and `springTo` and
   `easeTo`, which move from where a value is when the picked state changes. `follow` and `tally` are built on it
   and give the same values; `react` sums independent responses and stays as it is.
6. **The pages read whole stay small.** `test/repo/agent-reference.test.ts` is the one owner of their size: `core.md`
   under 8 KB and `stage.md` under 10,500 bytes. What one kind of piece needs goes on a page read on demand.

## Consequences

- An agent reads a move package's README to choose a move, and writes its own move beside the scene with no
  registration. There is no catalog to search.
- Every piece samples exactly as before, `anticipate` callers through `anticipation`.
- `plan/search-plan.md` is withdrawn.
- Supersedes in part: [ADR-149](./ADR-149-the-move-contract.md) (the move contract),
  [ADR-168](./ADR-168-motion-principles-are-knobs-not-presets.md) ("no wrapper that takes a move"),
  [ADR-172](./ADR-172-a-move-declares-its-role.md) (roles), [ADR-185](./ADR-185-layers-as-folders-laws-fields-and-a-measured-catalog.md)
  (the catalog), [ADR-186](./ADR-186-the-motion-vocabulary.md), [ADR-187](./ADR-187-styles-on-briefs.md) (style cards)
  and [ADR-189](./ADR-189-core-modules-and-library.md) (the library's tools, plugins and search).
