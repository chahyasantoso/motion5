# ADR-187: Styles on briefs

**Status:** Accepted, 2026-11-15
**Superseded in part by ADR-189:** a brief imports `@gerak/core`, and a module or `@gerak/moves` only when installed.

## Context

After ADR-186 an agent could design a piece in gerak's primitives and check it against its own spec, but nothing said
what made a new piece belong to another brief's style, and the qualities a design names were owned by `@gerak/tools`,
so a style could not name them without depending on the tools.

## Decision

- **The quality table belongs to `@gerak/moves`:** `Descriptors`, `DESCRIPTOR_KEYS`, `DescriptorRanges`, `QUALITIES`,
  `qualityOf` and `outsideRanges` live in `packages/moves/src/style/qualities.ts`, a layer at the height of `fields/`
  that imports nothing above it. Sampling stays in `@gerak/tools`.
- **A brief folder is the portable unit.** A move or part in a brief imports `@gerak/moves` and its own folder's
  `src/parts/` by relative path, nothing else. This supersedes ADR-185's clause that a move outside `@gerak/moves`
  imports only `@gerak/moves`. There is no separate kit folder: a style travels as its brief.
- **Custom parts** a brief declares with `definePart` are listed and gated as library parts; one sampling as an
  existing part of its kind is a duplicate.
- **A style is a brief's optional card**, `style.ts`, made by `defineStyle`: per field, the range of the share of its motions that
  are lively (overshooting, ringing or winding up), its own qualities as `<brief>/<name>`, skin tokens, habits in
  words. A brief mixes springy and plain motion, so one shape per field cannot describe it; the lively share can. A piece names it with `export const style`; the review counts its
  lively motions per field, leaving out fields its design names.
- **A card is measured first, then narrowed:** `motion:style -- measure` measures a brief's pieces into a card a person
  narrows and gives habits.

## Consequences

- A style is checked, not described, and is shared by copying one folder.
- An agent working in another brief's style must not open that brief's pieces; only the guide holds that.
- `@gerak/tools/scene` no longer exports the quality table; importers take it from `@gerak/moves`.
