# ADR-145: One track kind and nominal models (v5.2)

**Status:** Accepted, 2026-11-05

**Supersedes:** v5.1 rev 4 D1 (plain tracks stay plain) and D19 (reader-pull).

## Context

The v5.1 authored contract had two track forms. A source carried `type` or an ad-hoc
`input.schema`; a computed track carried `plugin`. The runtime guessed the kind from which field was
present, an untyped source had no static guard, and plugin parameters shared `input.values` with
local data. Reader-pull structures made a plugin rebuild its inputs per frame.

## Decision

- Every authored track is `{ id, input?, output, duration? }` with exactly one of
  `output: { model }` or `output: { plugin }`.
- A model owns its id, value spec and optional `parse`; plugins implement and require models by id.
  S5 lands the authored shape and model outputs; first-party plugins keep their typed slots and the
  `legacyTypeId` bridge until S6 rewrites them to model slots.
  A source is a model output run through the engine's passthrough processor.
- Plugin parameters live in `input.param` and are written through `input.param.set` and `setField`.
  `input.values` stays the model's data or the plugin's local data.
- A source model's values are parsed at commit. A computed output is parsed at first compose, and its
  static cells never change after that; a difference is a node error.
- `type`, the top-level `plugin` and `input.schema` are refused by name. There is no compatibility
  alias and `schemaVersion` stays 5 while every document lives in this repository.

## Consequences

- Every track has a declared contract and a static guard; matching is nominal.
- One resolved slot map and one compose path replace the two-map/two-resolver pipeline.
- Documents migrate once; published values stay plain tables and records.
- The v5.1 type machinery remains internal until the S6 removal slice deletes it.
