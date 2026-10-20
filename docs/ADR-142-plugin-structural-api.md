# ADR-142: Plugin structural API

**Status:** Accepted, 2026-10-18

## Context

Phase C structural derivation shipped with untyped descriptor payloads, a collect output every
plugin had to name, two execution models (callbacks, or an evaluator factory with claims that
duplicated them), plugin-level `capabilities[]` nothing read, one hook that both validated and
produced layouts, and a `root` requirement for a `frame` capability no plugin provides. Reasons:
`motion5-implementation-plans/motion5-plugin-api-decisions.md`.

## Decision

- **D1 Collect and execution:** collect has no label; records go to the reserved output `collect`
  and fold outputs may not use that name. `collect` and `fold` are always functions on the
  definition. A plugin is stateful when it declares `init` and `prepare`; there is no evaluator
  factory and there are no claims. State is staged and committed atomically as before.
- **D2 Derive result:** `derive` returns `derived`, `refused` or `none`, built with the constructors
  of the same names and settled by one exhaustive switch. One payload per plugin per track and per
  capability per source. A refused track makes downstream bindings report
  `derivation-missing-capability`.
- **D3 Validate:** `validate` reads only payloads of sources bound through the plugin's own
  capability slots. Order: capability presence, `validate`, then `derive` (skipped on error).
- **D4 Capability list removed:** `PluginDefinition.capabilities[]` and its exports are deleted.
- **D5 Capability map:** `CapabilityMap` is open, re-exported from `plugin-api`, extended with
  `declare module "@motion5/core/plugin-api"`. `ctx.read(name, source)` is typed.
- **D6 Slot capability is the permission:** a slot's `capability` is both the presence check and the
  right to read it.
- **D7 Root frame:** `root` no longer requires the `frame` capability. Frame is a runtime value.
- **D8 Root rules stay with `root`:** `root.derive` refuses duplicate roots; chain layout reads the
  policy through `readRootPolicy` and stays silent when refused. A root-only track is a legal generic
  track without `chain`; FK and IK bound to it get `derivation-missing-capability`.

## Alternatives rejected

- Several collect outputs, per-plugin capability manifests, diagnostics inside descriptors.
- Root rules inside chain layout: they never run without a point entry.
- An eager root-only error: the capability model already refuses the consumers.
- Keeping the evaluator factory with claims: two declarations of one fact.

## Consequences

- One collect array per track; C5 reads it through the source capability.
- Join (C3) reuses `readRootPolicy` and adds `joined` to `CapabilityMap`.
- `cache-contract.md` section 4 is updated by the architect; `dispose` is not yet wired.

## Evidence

- `root-frame-d7.test.ts`, `root-duplicate-d8.test.ts`, `root-rules-f1.test.ts`.
- `structural-derivation-c1.test.ts`, `staged-state-b7.test.ts` (B7-14 to B7-26).
