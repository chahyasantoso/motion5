# Revision guide — generic pluggable FK and IK caches

Scope confirmed: revise the implementation plans for the **new architecture**, not implement caching in the legacy repository snapshot.

Status (2026-10-20): the generic seam is implemented on branch `feat/plugin-structural-api` (B7), and the plugin structural API (ADR-142) replaced the per-entry evaluator factory with stateful plugin `init`/`prepare`. Runtime wiring (C7, D6) and both domain consumers (D4, D5) remain pending.

## What changed

The original plan proposed isolated per-entry state mainly for FK. This revision makes memoization an explicit reusable, injected facility and adds exact **whole-solve IK caching** alongside per-point FK reuse. Cache snapshots remain part of the existing proposed per-entry plugin state; there is no second transaction system.

Read `00-overview.md` first, then `cache-contract.md` with A1/A3/A6 and B2/B7. The cache contract is a reference appendix, not an implementation slice. Execute filename order 01–49 (phase G before F) with the revised dependencies. Each slice's status line records whether code and executed evidence exist.

## Implementation owners

- **A1 / A3 / A6:** cache ownership, exact equality/signed zero, shared acceptance/failure contract. Implemented as contract documents in `docs/skeldata/`.
- **B2 / B6 / B7:** per-generation evaluator services; one executor; typed state proposals through `defineStatefulPlugin` (`init`/`prepare`); provider port, defaults and conformance. Implemented at the executor seam; runtime wiring is pending.
- **C7:** candidate cache isolation, no provider calls during acceptance, cold replacement, and wiring the executor's `committedStates`/`proposedStates` (keyed by `CompilerEntryKey` only, with no entry-id fallback) and `dispose(state)` into the runtime transaction. Proposals carry an `origin` union, `continued` or `initialized`; dispose runs once per entry generation, after commit for keys not continued and on abandonment for `initialized` proposals only. C7 also replaces the `EvaluatorServices` string index signature with an augmentable interface.
- **D4:** canonical complete SolveRequest; whole-result IK memo factored as a reusable capacity-one helper with a hit/miss union; deterministic seeds and inspection projection.
- **D5:** FK per-point effective keys using the same injected port, through a cached walk helper generic over frame type and composer.
- **G3 / G4:** `fk3d` and `ik3d` reuse the D5 walk and D4 memo helpers with 3D composers, keys and requests; no second cache implementation.
- **D6 / D7:** both-domain failure/lifecycle tests and real pipeline/provider equivalence.
- **F3 / F4 / F5 / F6:** public API docs, performance matrix, generated faults/histories, final evidence gates.

## Key decisions

- Small synchronous `CacheProvider` / persistent `CacheSnapshot` interface; bounded default and interchangeable no-cache provider.
- Application composition-root injection through `EvaluatorServices` into stateful plugin `init`/`prepare` (`defineStatefulPlugin<S, P>`), not authored cache leaves or graph access. There is no evaluator factory and there are no operation claims.
- Plugins own immutable effective keys; core owns state/output acceptance. No-cache/eviction can change work, not accepted meaning.
- FK caches normalized parent-frame/pivot/extent/blended-angle compositions. IK caches a complete validated solve, including quality data needed for inspection; no history-dependent warm starts.
- Exact finite scalar comparison uses `Object.is`, including +0/-0 distinction. No epsilon, JSON-only hashes, broad record identity, or revision-only shortcuts.
- Hit/miss is an exhaustive discriminated union. Providers remain an open interface; collect/fold remain independent operations.
- All structural resets, downstream failures, candidate abandonment and disposal share the existing lifecycle protocol.

## Evidence and limits

The original revision was grounded in a snapshot that still used `PluginDefinition.compose`. The current branch implements the B7 seam: `packages/core/src/domain/cache.ts`, `packages/core/src/domain/cache-providers.ts`, `packages/core/src/domain/stateful-plugin.ts` and the stateful case in `packages/core/src/domain/track-operations.ts`, proven by `packages/core/test/contract/cache-provider-b7.test.ts` (B7-1..B7-13) and `packages/core/test/contract/staged-state-b7.test.ts` (B7-14..B7-26). Legacy `compose` still drives runtime evaluation until C7 wires the executor in; from C7 not-yet-migrated compose plugins run through the temporary `legacy-compose` strategy until F2.

The 2026-10-20 reconciliation changed documentation only; it ran no tests, benchmarks or release. Archive/content checks, when reported in the delivery message, validate the plan pack only. Actual implementation must satisfy every revised slice's positive, negative, type and failure tests before completion claims.
