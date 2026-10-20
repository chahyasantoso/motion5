# E1 — Add entry structural operations and generation-backed handles

Status: not implemented. Depends on: A2, A6, B2, C7.

## Start here

Read `00-overview.md`, canonical identity semantics, `packages/core/src/runtime/authoring-edit.ts`, `packages/core/src/contract/track-handle.ts`, `packages/core/src/domain/authoring/keyframes.ts`, and `packages/core/src/contract/schema-transaction.ts`.

## Outcome and work

Extend the existing closed edit union/interpreter for entry insert/remove/move/replace and entry-specific values/requires operations. Use discriminated variants only when payloads differ and exhaustive handling through the repository's unreachable helper. Every operation feeds the existing candidate builder, not a parallel rig editor.

Track-level structural insert/move/remove targets authored entry IDs and array placement. `track.entry(entryId)` captures a generation-backed EntryHandle; content edits (leaf, requires, replace, live value) use that handle only. Avoid parallel current-ID and retained-handle content APIs. Public batch value writes remain uniformly entry-nested and share B8's owner.

Moving preserves logical entry generation and overlays but changes execution/chain order. Removal invalidates retained handles/overlays. Reinsertion of the same ID creates a new generation; old handles never revive. Same-entry replace preserves handle identity but revalidates plugin/values/requires and creates cold plugin state/resources on acceptance. Ambiguous remove/recreate within one transaction follows the existing model's refusal unless explicit new-generation operation is specified consistently.

Structural identity/plugin/binding changes are not scalar writes. An entry handle identifies one entry generation, not whichever entry now has the same index/plugin/ID. Candidate refusal preserves live handle validity.

## Evidence and finish

Run edit/handle tests: insert before target does not retarget handles; move preserves values/overlays; invalid address/refused replacement leaves state unchanged; plugin replacement revalidates; remove/reinsert invalidates old handle; other tracks with same IDs unaffected; closed union compile-time exhaustiveness. Do not bypass candidate validation for convenience methods.

Done when public edits have one addressing/transaction owner and unambiguous generation semantics. Record actual signatures, public API removals, test commands/results, and unresolved limitations. Next: E2.
