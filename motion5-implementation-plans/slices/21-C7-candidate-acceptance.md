# C7 — Integrate derivation and generic cache state into candidate acceptance

Status: not implemented. Depends on: C1, C2, C3, C4, C5, C6, B7, A6.

## Start here

Read `00-overview.md`, `42-cache-contract.md`, A6's failure protocol, `packages/core/src/contract/schema-transaction.ts`, `packages/core/src/runtime/project-runtime.ts`, `packages/core/src/runtime/graph-publisher.ts` and C1's staged descriptor implementation. Locate every load/replace/edit acceptance entrypoint.

## Outcome and work

Insert complete structural compilation, plugin derivation/cross-source validation, preparation/evaluation and publication validation before active replacement. Every structural entrypoint uses this ONE candidate pipeline. Evaluate the complete final candidate, not individually valid edits or partial lists.

Keep descriptors, timelines, evaluator factories/state/cache tables, subscriptions, bindings and resources private until acceptance. Replaced/rebound evaluator generations start cold through injected services; same numeric values or matching IDs cannot migrate active cache state. A shared provider factory must still return isolated empty tables. Do not dispose or mutate tables reachable from active evaluators while preparing a candidate.

All fallible provider creation/equality/lookup/remember, math, validation and freezing happens before acceptance. Swap output and private state only after success; no provider or arbitrary plugin code in the no-fail section. Dispose abandoned candidate resources; retire old resources only after successful replacement. Preserve diagnostics locating track, entry and relevant slot/member/source.

Root duplicates, rooted imports, goal coverage and solver provenance faults refuse before topology activation. No lighter load path, per-operation recompile fast path, cache migration or legacy fallback. Preserve distinct error/blocked/last-ready handling and postcommit delivery errors.

## Evidence and finish

Test invalid duplicate IDs/goals/reparent/root imports and same-numeric rebinding without changes to active authoring, values, descriptors, outputs, **generic/FK/IK cache states**, subscriptions, bindings and handles. Test final-valid multi-edit recipes with invalid intermediate states. Inject provider creation/read/write/equality faults, preparation/derivation/evaluation/freeze failures and candidate disposal; retry from the retained active state. Test rejected candidate forks from one active snapshot and postcommit subscriber failures separately.

Done when one complete candidate protocol protects all entrypoints without core knowledge of cache consumers. Record actual entrypoints, tests/commands/results and delivery/cleanup limits. Phase C gate: sound precommit layouts, guarded dynamic inputs, isolated generic state and no core kinematics. Next: D1.
