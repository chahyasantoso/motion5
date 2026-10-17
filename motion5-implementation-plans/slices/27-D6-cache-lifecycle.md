# D6 — Prove FK and IK cache isolation across the existing lifecycle

Status: not implemented. Depends on: D4, D5, B7, C7, A6.

## Start here

Read `00-overview.md`, `42-cache-contract.md` sections 4–5 and 9, B7/C7 implementations, both domain evaluators and existing value/schema transaction tests. This slice integrates and proves the shared protocol; it must not introduce a cache-specific acceptance manager.

## Outcome and work

Exercise generic provider snapshots through actual FK and IK runtimes. State is private per runtime/track/compiler-entry generation. Repeated definitions, same member IDs across rigs, separate runtimes and a shared immutable provider factory cannot share memo cells. Definitions and provider factories carry no mutable current state.

Verify numerical evaluation starts from accepted snapshots and stages next FK memo/poses and IK solve memo privately. Later operations/tracks can use staged outputs through normal graph delivery, not private cache access. Only the full existing transaction accepts every final state/output proposal. Every fallible provider operation, result validation/freezing and snapshot allocation is before the no-fail swap. No callback, cache flush, eviction mutation, disposal or provider call inside acceptance.

Reset affected evaluators on layout/source/root/solver/targets/definition rebinding, structural reorder/reparent, replacement, remove/reinsert and dispose/recreate. A public handle may retain move identity while the new evaluator starts cold. Numerically equal rebinding does not preserve provenance; ordinary numeric edits should not rediscover topology. Provider changes recreate the relevant generation. Do not migrate by IDs or add per-frame compile work.

Discard rejected candidates/proposals without changing active snapshots or old output references. Lookup cannot mutate LRU/recency; remember cannot mutate aliased old Maps or values. Release abandoned/retired evaluator references under existing lifecycle ownership, idempotently where public disposal promises it; immutable snapshot sharing needs no finalizer and must not be invalidated by disposal. Keep postcommit subscriber/adapter errors distinct from precommit rollback.

## Evidence and finish

Inject cache creation/equality/lookup/remember, preparation, early/late collect/fold, solver, downstream validation/freeze and abandonment failures. Cover an IK miss and an IK hit followed by a late failure; FK writes followed by downstream failure; collect success then fold failure; two candidate forks from one accepted snapshot. Assert no active key/value/eviction state or ready output changed. Retry must match a fresh cache-disabled reference and cannot hit a solve written only by the failed attempt.

Verify numeric edits, equal-data structural rebinding, same-ID remove/reinsert, reorder, runtime replacement, error/blocked transitions, interleaved rigs/providers, abandoned resource cleanup and disposal/recreation. Assert rejected candidates do not break active subscriptions/render bindings. Check cache slot counts and dropped-generation reachability/owned references using bounded deterministic instrumentation; avoid unsupported claims about garbage-collector timing.

Run focused lifecycle/transaction tests and provider conformance tests. Record actual accepted transaction scope, commands/results and remaining cleanup/delivery limits. Done when **both** domain caches follow the same generic protocol with no hidden mutable history or alternate commit path. Next: D7.
