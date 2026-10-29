# ADR-144: Identified tables, table-or-record values, and explicit plugins

**Status:** Accepted, 2026-10-29

## Context

The schema-5 contract carried two authored forms and two plugin contracts at once. A track could
author grouped `keyframes` read by a `PluginRegistry`, or `input.values`/`input.requires` read by a
`PluginCatalog`. The grouped form narrowed plugin inputs by ownership and composed flat records; the
identified form declares one input spec per plugin, publishes named outputs as tables or records, and
leaves selection to the consumer. Two forms meant two validators, two loaders, two execution paths,
and a renderer could accept a shape no validator had proved.

The consumer migration is complete: all three apps, the React and Three packages, and every graph
fixture use identified tables or records and a `PluginCatalog`. The grouped readers, output-edge
merge phase and legacy plugin layer have no remaining live consumer.

## Decision

One authored value model survives.

- `input.values` is a table of identified rows or a flat record. Authored cells are scalars or stop
  sequences; evaluated cells are renderer-neutral scalars. A table's envelope id is identity;
  `cells.id` is ordinary data.
- `input.requires` binds one declared dependency slot to one source, or to a map of member keys to
  sources. Edges derive from that record alone, so no grouped keyframes member exists.
- A plugin is one identified definition at `@motion5/plugins/<name>`: declared `inputs`, named
  `outputs`, an optional `validate`, and one `transform`. Admission is atomic in `PluginCatalog`, and
  `EngineOptions.plugins` accepts that catalog only.
- Selection is a consumer concern. One core selector module owns record and row selection, returning
  closed results. DOM and Three adapters stay record-only; a caller that needs a row selects its
  cells and passes them through `applyValues`. React exposes one generic row projection for a
  row-derived target.
- Grouped keyframes, grouped requirement ownership, plugin stages, priority, contributions, key
  claims and output-edge merging are deleted rather than translated. `track-legacy-field` refuses a
  document that still carries `keyframes` or `observes`.

## Alternatives rejected

- Keeping the grouped form as an accepted alias: two validation and execution paths for one
  document, which is the defect this replaces.
- Translating grouped documents at load: a compatibility layer with no owner and no sunset.
- Making adapters table-aware: a renderer would choose rows, moving consumer policy into the
  renderer and giving every adapter its own selection rules.
- One plugin registry that accepts both definitions: one registry with two contracts and ambiguous
  output ownership.

## Consequences

The contract has one parser, one graph edge kind, one execution path and one selector owner. A
consumer that reads a table must name the row and handle absence explicitly; a first-row fallback,
local flat-record guard or table cast no longer compiles into the supported contract. Historical ADRs
that describe grouped authoring or inspection are marked superseded and retain their text. The v4
converter is deleted because its output was already rejected by this contract.
