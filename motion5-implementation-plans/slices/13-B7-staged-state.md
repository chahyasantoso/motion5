# B7 — Add generic proposed plugin state and injectable caches

Status: implemented on branch `feat/plugin-structural-api`. Depends on: B2, B6, A3, A6.

Evidence: `packages/core/src/domain/cache.ts`, `packages/core/src/domain/cache-providers.ts`, `packages/core/src/domain/stateful-plugin.ts`, `packages/core/src/domain/plugin-admission.ts`, `packages/core/test/contract/cache-provider-b7.test.ts` (B7-1..B7-13), `packages/core/test/contract/staged-state-b7.test.ts` (B7-14..B7-26). The plugin structural API follow-up replaced the evaluator factory with `defineStatefulPlugin` and `init`/`prepare` (ADR-142); the text below is updated. Known limit: the executor is proven through contract suites; the runtime evaluation path (`project-runtime.ts`) does not call `executeTrackOperations` yet, so runtime provider override, committed-state storage and `dispose` wiring remain open (see `docs/skeldata/STATUS.md` follow-ups; C7 and D6 own the runtime transaction).

## Start here

Read `00-overview.md`, `cache-contract.md`, A6's acceptance protocol, `packages/core/src/domain/plugins.ts`, `packages/core/src/domain/track.ts`, `packages/core/src/runtime/graph-publisher.ts`, and `packages/core/src/runtime/project-runtime.ts`. Follow existing transaction/lifecycle owners. The supplied snapshot still uses compose; implement the new B2/B6 API, not a legacy cache wrapper.

## Outcome and work

Implement the generic cache port, bounded immutable provider, no-cache provider, `EvaluatorServices` DI and the typed `defineStatefulPlugin<S, P>` helper specified in the cache contract. Contracts must not import provider implementations or skeleton types. The operation executor supplies `DEFAULT_CACHE_PROVIDER` when no services are passed and accepts an override (runtime construction wiring is the known limit above); `init` receives explicit `EvaluatorContext` and services, `prepare` receives services, and neither gets engine/registry access. No authored cache syntax or plugin-name dispatch.

Keep ordinary collect/fold definitions pure and usable without state/cache plumbing. A stateful definition declares `init` and `prepare`; its `collect`/`fold.run` take the prepared value instead of the local evaluation. Core selects stateful or stateless execution once, never both. Use a typed helper to bind private state and prepared-data types; isolate heterogeneous state erasure internally rather than forcing casts on plugins. Add public type tests for missing/extra operations, state mismatch and invalid proposals.

Per entry, read committed state by compiler key (then entry ID) or call `init` once; an undefined initial state is a TypeError. Call `prepare(entry, state, services)` once; it sees local inputs/context and committed state, but not fold/collection state, and returns `{ prepared, state }`. Collect runs first if declared; `fold.run(prepared, prior, ctx)` receives the same prepared data plus preceding fold state, not its own collect result, and returns `{ delta, state? }`. A returned fold state wins; otherwise prepare's state is the proposal. No hidden mutable callback history. Fold-dependent cached computations must include every consumed preceding-fold field in their keys. Do not automatically memoize callbacks or entire fold deltas.

Allocate state/tables per runtime/track/compiler-entry generation, never on shared plugin definitions or a member-ID global map. Stage output and new immutable snapshots privately until the **whole existing evaluation transaction** passes validation/freezing. Only then accept output and final opaque state together. Downstream tracks read staged upstream output through normal graph delivery, never private state. No provider or arbitrary plugin calls in the no-fail acceptance section.

Lookup cannot mutate committed recency; remember applies an ordered batch without mutating prior snapshots, caller-owned write arrays or aliased keys/values. The default copies a private map once per batch, not once per point; FK stages all misses into one batch and IK uses a singleton batch. Empty writes may preserve snapshot identity. Prove capacity and last-write behavior for repeated slots. A frozen Map is not immutable storage. Provider creation/lookup/equality/remember failures reject preparation/evaluation with entry diagnostics; do not silently convert exceptions to misses. No second transaction manager, commit callback, rollback list, automatic state migration or provider-wide mutable current table.

Start structural/rebound generations cold and release candidate/retired plugin state under the existing lifecycle protocol. Provider selection changes require recreation. Stateless definitions remain immutable and simple; no-cache uses the same plugin path. Keep optional resource disposal in the stateful plugin's `dispose(state)`, not cache-snapshot finalizers.

## Evidence and finish

Run the shared provider conformance suite: fresh state; hit/miss including undefined; exact signed-zero equality; finite capacity; slot replacement/eviction; ordered/duplicate/empty write batches; batch atomicity and one-copy instrumentation; lookup purity; old-snapshot stability; key/value/write-array alias safety; throwing operations; candidate forks. Verify default, no-cache and an aggressively evicting test provider through the same typed port.

Use a stateful **non-skeleton** plugin to prove dependency injection and genericity. Cover collect-only/fold-only/both and unchanged stateless definitions; repeated entries; two rigs/tracks/runtimes with matching IDs; immutable shared definitions; prior-fold key changes; late collect/fold/output-validation/freeze failure; retry; rejected replacement; disposal. Assert no earlier cache state or ready output accepts after a later transaction failure. Count `init`/`prepare`/operation invocations separately from cache/math work.

Run focused transaction/state/provider tests and typecheck. Record actual public API choices, module boundaries, transaction scope, commands/results and O(N) copying costs. Done when any plugin can memoize through DI without engine access or a second acceptance path, and FK/IK can consume the seam without new core branches. Next: B8.
