# B8 — Implement uniform entry-addressed value transactions

Status: implemented. Depends on: B2, B3, B4, A2, A6.

## Start here

Read `00-overview.md`, `packages/core/src/contract/value-transaction.ts`, `packages/core/src/runtime/authored-values.ts`, `packages/core/src/contract/track-handle.ts`, `packages/core/src/domain/authoring/keyframes.ts`, and the compiled entry/codec schema owners from B2/B3.

## Outcome and work

All public value batches are nested by entry ID, including former singletons: `setValues({fore:{length:22},frame:{x:10}})`. Resolve through the compiled entry/leaf schema and existing value transaction owner. Remove the flat singleton shortcut and mixed-namespace collision logic; no external encoded leaf strings. A plugin name is never an implicit instance selector.

Apply the same address validation to scalar/static replacements, authored stops, percent maps, contributions/prepared refusals, overlays, and recompilation. Preserve the existing value-transaction policy for accepted/refused batches without bypassing it through a convenience setter. Generation-backed entry live handles later forward here; reserve their reference contract now.

Reject attempts to write entry ID, array order, plugin, requires bindings, or dictionary member keys as value content. They are structural fields, not structuralKeys leaves. Preserve legitimate zeros/false/empty strings where the declared leaf schema permits them; point numeric leaves still require their own schema.

Atomic invalid multi-entry writes leave overlays, effective values, outputs, and committed evaluator state unchanged. A value edit cannot silently recreate topology or retarget a removed/reinserted entry.

## Evidence and finish

Run focused value tests: two entries sharing rotation/x update independently; all-ID transform writes work; no old flat/encoded addresses accepted; stops/percent maps agree with initial authoring; zero preserved; unknown/kind/prepared refusals remain meaningful; mixed valid-invalid batch is atomic; structural field writes refuse; stale generation token cannot hit reused ID.

Done when one address/transaction owner serves all value entrypoints and new writes do not depend on group flattening. Report actual commands/results, touched modules, and any unimplemented structural-handle dependency. Next: C1.
