# ADR-187: Style kits

**Status:** Accepted, 2026-11-15

## Context

After ADR-186 an agent could design a piece in gerak's primitives and check it against its own spec, but a style
lived only inside one brief: its moves, any parts it needed and its look could not travel to a new brief, and nothing
said what made a new piece belong to that style. The qualities a design names were owned by `@gerak/tools`, so a
style could not name them without depending on the tools.

## Decision

- **The quality table belongs to `@gerak/moves`:** `Descriptors`, `DESCRIPTOR_KEYS`, `DescriptorRanges`, `QUALITIES`,
  `qualityOf` and `outsideRanges` live in `packages/moves/src/style/qualities.ts`, a layer at the height of `fields/`
  that imports nothing above it. Sampling stays in `@gerak/tools`.
- **A kit is a folder:** `kit.ts` holds a card made by `defineKit` (its own qualities as `<kit>/<name>`, a default
  quality per field, habits in words), `src/moves/` and `src/parts/<kind>/` its moves and parts, `skin.ts` its tokens,
  and `demo/` a piece agents never read. Kits live under `apps/pieces/kits/`, a reserved folder no tool takes for a
  brief.
- **A portable unit is a folder.** A move or part in a brief or kit imports `@gerak/moves` and its own folder's
  `src/parts/` by relative path, nothing else. This supersedes ADR-185's clause that a move outside `@gerak/moves`
  imports only `@gerak/moves`.
- **Custom parts** a brief or kit declares with `definePart` are listed and gated as library parts; one sampling as
  an existing part of its kind is a duplicate.
- **A piece names its kit** with `export const kit`. The design decides a field's quality; otherwise the kit's default
  does; the review checks either per member, list item and beat.
- **A kit is measured first, then narrowed:** `motion:kit -- new` measures a brief's pieces into a card a person
  narrows and gives habits.

## Consequences

- A style travels as one folder and is checked, not described.
- `@gerak/tools/scene` no longer exports the quality table; importers take it from `@gerak/moves`.
