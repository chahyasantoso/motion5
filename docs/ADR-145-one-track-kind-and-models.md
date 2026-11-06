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
  The first-party plugins publish `Solved2d`/`Solved3d` and `Points2d`/`Points3d` and require
  `Body2d`/`Body3d`, `Goals2d`/`Goals3d` and `Point2d`/`Point3d`. A model object carries exactly
  `id`, `spec` and optional `parse`.
  A source is a model output run through the engine's passthrough processor.
- Plugin parameters live in `input.param` and are written through `input.param.set` and `setField`.
  `input.values` stays the model's data or the plugin's local data.
- `prepare` refuses with a non-empty diagnostic tuple; each diagnostic carries its own rule id and
  ids, and there is no warnings channel. A refusal without an error-severity diagnostic is a plugin
  bug.
- A source model's values are parsed at commit. A computed output is parsed at first compose, and its
  static cells never change after that; a difference is a node error.
- Every computed output is finite-checked on every compose; a non-finite leaf is `output-invalid`.
- `type`, the top-level `plugin` and `input.schema` are refused by name. There is no compatibility
  alias and `schemaVersion` stays 5 while every document lives in this repository.

## Consequences

- Every track has a declared contract and a static guard; matching is nominal. An engine
  requires a catalog.
- One resolved slot map and one compose path replace the two-map/two-resolver pipeline.
- Documents migrate once; published values stay plain tables and records.
- The v5.1 type machinery, the Pose specs and `legacyTypeId` are removed.
