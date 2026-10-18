# ADR-142: Plugin structural API

**Status:** Accepted, 2026-10-18

## Context

Phase C structural derivation introduced `StructuralDescriptor`, plugin derivation hooks, and
capability checks. However, several friction points emerged during plugin integration:
untyped descriptor payloads requiring explicit downcasts, ambiguous collect output naming
with multi-collector ordering hazards, duplicate diagnostics across overlapping derivation
hooks (`root` vs `point`), and premature validation coupling (such as root requiring a "frame"
capability from upstream tracks before any plugin produced one).

## Decision

This decision establishes a cohesive structural API contract across core and plugins, codified in
`motion5-implementation-plans/motion5-plugin-api-decisions.md` (D1–D8):

- **D1 (Stateless vs Stateful Collect):** Stateless collect is a pure `(entry, ctx) => record`
  function published under the single reserved output `"collect"`. Stateful collectors declare
  `collect: true` and supply `createEvaluator`.
- **D2 (Single Collect Array):** Track operations publish a single `collected` array under
  output name `"collect"`, guaranteeing stable entry order across collectors. Fold outputs are
  strictly forbidden from colliding with `"collect"` at admission.
- **D3 (Tagged DeriveResult):** Derivation hooks return a tagged union `DeriveResult` (`derived`,
  `refused`, or `none`). Descriptors drop the embedded `diagnostics` property; refusal is
  explicit and first-class.
- **D4 (Validation Hook):** Plugins may declare a separate `validate?: (ctx: RequirementContext) => readonly Diagnostic[]`
  hook. Validation runs prior to derivation, decoupling prerequisite validation from structural synthesis.
- **D5 (Open CapabilityMap):** Core declares an open `CapabilityMap` interface re-exported from
  `plugin-api.ts`. Plugins augment it via `declare module "@motion5/core/plugin-api"` to provide
  statically typed `ctx.read<K>(cap, source)` queries without central core changes.
- **D6 (Eliminate Plugin Capabilities List):** Removed the plugin-level `capabilities: readonly string[]`
  declaration. Capabilities are emitted dynamically by derivation or fold, not declared statically.
- **D7 (Root Frame Requirement):** Removed `capability: "frame"` from `root` plugin requirement
  slots, allowing root entries to bind to any source providing kinematic frame values.
- **D8 (Root Policy Helper & Single Derivation Owner):** Removed `root.derive` hook. Root policy
  reading is extracted to `readRootPolicy` helper called exclusively by `chain-layout.ts`,
  ensuring single-owner derivation and preventing duplicate diagnostics.

## Alternatives rejected

- **Multiple named collect outputs:** Caused ordering hazards across distinct plugins and fragmented
  downstream consumption.
- **Per-plugin capability manifests:** Created redundant static declarations out of sync with dynamic
  derivation results.
- **Diagnostics inside descriptors:** Allowed invalid partial descriptors to escape into runtime
  caches without clean refusal semantics.

## Consequences

- All plugins and contract tests conform to the unified collect and derivation interfaces.
- `public-declaration-surface` boundaries remain intact with zero leakage of internal runtime types.
- Single-owner derivation eliminates diagnostic duplication on invalid track topologies.

## Evidence

- Repro test `packages/plugins/test/unit/root-frame-d7.test.ts` proves frame binding without refusal.
- Repro test `packages/plugins/test/unit/root-duplicate-d8.test.ts` confirms exactly one diagnostic.
- Contract suites B1–B7 and C1–C2 pass cleanly under Vitest and strict TypeScript checks.
