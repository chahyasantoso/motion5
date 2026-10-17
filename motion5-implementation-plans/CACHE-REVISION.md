# Revision guide — generic pluggable FK and IK caches

Scope confirmed: revise the implementation plans for the **new architecture**, not implement caching in the legacy repository snapshot.

## What changed

The original plan proposed isolated evaluator state mainly for FK. This revision makes memoization an explicit reusable, injected facility and adds exact **whole-solve IK caching** alongside per-point FK reuse. Cache snapshots remain part of the existing proposed evaluator state; there is no second transaction system.

Read `00-overview.md` first, then `42-cache-contract.md` with A1/A3/A6 and B2/B7. Despite its filename, the cache contract is a reference appendix, not a 42nd implementation slice. Execute the original 01–41 order with the revised dependencies. All implementation statuses remain pending until code and executed evidence exist.

## Implementation owners

| Slice | Added responsibility |
| --- | --- |
| A1 / A3 / A6 | Cache ownership, exact equality/signed zero, shared acceptance/failure contract |
| B2 / B6 / B7 | Per-generation evaluator services; one executor; typed state proposals; provider port, defaults and conformance |
| C7 | Candidate cache isolation, no provider calls during acceptance, cold replacement |
| D4 | Canonical complete SolveRequest; whole-result IK memo; deterministic seeds and inspection projection |
| D5 | FK per-point effective keys using the same injected port |
| D6 / D7 | Both-domain failure/lifecycle tests and real pipeline/provider equivalence |
| F3 / F4 / F5 / F6 | Public API docs, performance matrix, generated faults/histories, final evidence gates |

## Key decisions

- Small synchronous `CacheProvider` / persistent `CacheSnapshot` interface; bounded default and interchangeable no-cache provider.
- Application composition-root injection into per-entry evaluator factories, not authored cache leaves or graph access.
- Plugins own immutable effective keys; core owns state/output acceptance. No-cache/eviction can change work, not accepted meaning.
- FK caches normalized parent-frame/pivot/extent/blended-angle compositions. IK caches a complete validated solve, including quality data needed for inspection; no history-dependent warm starts.
- Exact finite scalar comparison uses `Object.is`, including +0/-0 distinction. No epsilon, JSON-only hashes, broad record identity, or revision-only shortcuts.
- Hit/miss is an exhaustive discriminated union. Providers remain an open interface; collect/fold remain independent capabilities.
- All structural resets, downstream failures, candidate abandonment and disposal share the existing lifecycle protocol.

## Evidence and limits

The repository snapshot and relevant implementation-plan slices were inspected to ground these changes. The snapshot still uses `PluginDefinition.compose`, so these plans intentionally do not claim the future API already exists. An auxiliary review could not access its input archives; the revision relies on direct inspection instead.

This delivery contains planning changes only. No runtime source was implemented, dependencies installed, runtime tests executed, benchmarks measured, or release performed. Archive/content checks, when reported in the delivery message, validate the plan pack only. Actual implementation must satisfy every revised slice's positive, negative, type and failure tests before completion claims.
