# ADR-185: Layers as folders, laws and fields, and a measured catalog

**Status:** Accepted, 2026-11-14

## Context

`@gerak/moves` held its fields, laws, moves and composition helpers in one folder of 54 files, and `@gerak/tools`
kept a second, hand-written list of which of them were building blocks. Oscillations and envelopes were written by
hand with `Math.sin`, `Math.cos` and `Math.exp` in five built-in moves and seven local ones, each with its own
constants. Skew was impossible and colour and shadow existed only as untyped `custom` numbers. A move's `recipe` was a
hand list that two moves declared. The catalog printed every move in one order with nothing measured to search by,
and an app's pieces, players and moves shared one folder, with `export const brief` naming a piece's brief.

## Decision

- **The layers are folders.** In `packages/moves/src`: `fields/` (what can change, where it rests, how answers join,
  how the review judges it), `parts/<group>/` (how a number, point or pose changes, with no role or rest contract),
  `moves/` (parts coupled on fields inside one progress, with a role, options, moments and an example) and
  `compose/` (moves placed in time and across targets). A file never imports from a higher layer's folder. The
  package keeps one entry point. In `apps/pieces`, each brief is a top-level folder with its own `src/`,
  `src/moves/`, `references/` and pages; the folder is the brief, and the worked examples are briefs there too.
- **The building blocks are listed from their folders,** each by its doc comment; no hand list.
- **Laws are parts:** `wave`, the envelopes `taper`, `decay`, `attack` and `arch`, `ballistic`, `radial` and
  `noise1d`. A move multiplies them instead of calling `Math.sin`, `Math.cos` or `Math.exp`.
- **New 2D fields:** `skewX`, `skewY`; `shadowX`, `shadowY`, `shadowBlur`, written as `drop-shadow()` in the one
  `filter`; `hue`, `lightness` and `tint`, colour moved relative to the skin's own and blended in OKLCH through CSS
  variables the renderer writes. `ValueField` gains `judged`, which the review reads instead of matching names.
- **A move is a portable file:** one outside `@gerak/moves` imports only `@gerak/moves`.
- **No `recipe` and no stored compositions.** What a move is made of is read from its source. This supersedes
  ADR-176's clause that a move may name its recipe.
- **Moves are measured.** The gate records each moved field's peak, overshoot, rings, wind-up and settle, and the
  catalog searches by them.
- **One search over every declared source.** A project lists its sources of moves and where promotion writes in its
  app's `package.json` under `gerak`. Results are tagged by source, ranked by fit and never by use, capped, and give
  the import. An index caches the records behind one query function. A near-duplicate of any source's move is a
  gate finding at writing time, with the import of the move it repeats.

## Consequences

- A layer is found by its folder, a brief's work by its folder, and a building block by searching its folder.
- A third-party pack of moves is searched, measured and checked like the project's own.
- The descriptor ranges a quality uses are the shape a style card will use.
- Changing a part changes every move built on it, inside this repository and in any pack.
