# C7 — Integrate derivation and generic cache state into candidate acceptance

Status: not implemented. Depends on: C1, C2, C3, C4, C5, C6, B7, A6.

## Start here

Read `00-overview.md`, `cache-contract.md`, A6's failure protocol, `packages/core/src/contract/schema-transaction.ts`, `packages/core/src/runtime/project-runtime.ts`, `packages/core/src/runtime/graph-publisher.ts`, `packages/core/src/domain/track.ts` (`composeFrom`), `packages/core/src/domain/execution-plan.ts` (`ExecutionStrategy`, `executionStrategyOf`), `packages/core/src/domain/track-operations.ts`, `packages/core/src/domain/cache.ts` and C1's staged descriptor implementation. Locate every load/replace/edit acceptance entrypoint.

## Outcome and work

Insert complete structural compilation, plugin derivation/cross-source validation, preparation/evaluation and publication validation before active replacement. Every structural entrypoint uses this ONE candidate pipeline. Today the runtime runs structural derivation (`project-runtime.ts` calls `deriveStructuralDescriptors`) but evaluates through `Track.compose`, not the B6/B7 operation executor. This slice routes candidate evaluation through `executeTrackOperations`, feeds it the committed per-entry states (`committedStates`) and the runtime's `EvaluatorServices`, and accepts its `proposedStates` with ready output in the one swap. Evaluate the complete final candidate, not individually valid edits or partial lists.

### One runner, with a temporary `legacy-compose` strategy

The executor handles only `stateless` and `stateful`, and `executionStrategyOf` (`packages/core/src/domain/execution-plan.ts`) compiles a compose-only plugin to an empty `stateless` strategy. Routing the runtime through the executor as-is would silently drop the output of every plugin not yet migrated (`transform`, `transform3d`, `rig`, `pose-classify`, `fk`, `ik`, `fk3d`, `ik3d`). So the runtime has exactly one runner from this slice on, and the unmigrated plugins run inside it:

- Add a third `ExecutionStrategy` variant, `{ kind: "legacy-compose"; compose }`, compiled from a definition for which C6's `isLegacyComposeDefinition` holds. No second predicate.
- The executor's exhaustive switch gains the `legacy-compose` case. It reproduces today's `Track.composeFrom` result exactly: the same seed, the same plugin order, replacement chaining (each `compose` result replaces the running record), the same scoped `inputs` shape and `nodeId`, the same `CompositionOutputError` for a non-record, and publication through the same published-keys filter (`publishableValues`).
- A track that mixes `legacy-compose` entries with `collect`/`fold` entries has no defined meaning (replacement chaining versus delta folds) and is refused at plan compilation with a dedicated temporary rule id, for example `legacy-compose-mixed-track`. Search the maintained fixtures first and record the result; no maintained case mixes them today.
- Prove parity with one test per catalog compose plugin that compares the executor's published record with the pre-switch `Track.compose` result on the same fixtures, including a multi-plugin chain where a later compose replaces an earlier one. These parity tests are deleted by the slice that migrates each plugin.
- F2 deletes the variant, its case and the mixed-track rule. Because the switch is exhaustive (ADR-092), any reader left behind becomes a compile error. This is the single named exception to the overview's "no legacy fallback" rule; it is a strategy kind inside the one runner, not a second runtime path.

### Keys, inputs and services

- Drop the `committedStates.get(compilerKey) ?? committedStates.get(entryId)` fallback in `track-operations.ts`. Committed and proposed maps are typed `ReadonlyMap<CompilerEntryKey, unknown>` (the branded key already used by the execution plan), so an entry-id lookup no longer typechecks. Rewrite the B6 test in `packages/core/test/contract/operations-b6.test.ts` that seeds `committedStates` with `"entry1"` to seed by the entry's compiler key.
- Key requirement inputs by entry. `buildLocalEvaluation` falls back to `requirementInputs[entry.plugin.name]`, which is legacy plugin-name scoping (INVENTORY §1.2); delete that fallback. Plugin-name scoping survives only inside the `legacy-compose` case, which rebuilds the legacy `inputs` shape from entry-keyed inputs, and F2 deletes it.
- Replace the `readonly [service: string]: unknown` index signature on `EvaluatorServices` (`packages/core/src/domain/cache.ts`) with an augmentable interface carrying `cache` only, extended by plugin packages with `declare module "@motion5/core/plugin-api"` exactly as `CapabilityMap` is. Runtime construction accepts the augmented interface, so a missing declared service is a type error, not an `unknown` lookup.

### Private state and disposal

Keep descriptors, timelines, stateful plugin state/cache tables, subscriptions, bindings and resources private until acceptance. Replaced/rebound entry generations start cold (a fresh `init` with injected services); same numeric values or matching IDs cannot migrate active cache state. A shared provider factory must still return isolated empty tables. Do not dispose or mutate tables reachable from committed plugin state while preparing a candidate.

`dispose(state)` runs once per entry generation, not once per state value. A continued generation proposes a new state value every evaluation (a copy-on-write cache snapshot, for example), and disposing each superseded value would release resources the next value still shares. The runner marks every proposed state with its origin as a discriminated union, `{ origin: "continued"; state } | { origin: "initialized"; state }`, where `initialized` means `init` ran in this candidate. Then:

- After a successful commit, dispose the last committed state of every key the accepted candidate did not continue: the key is absent from the proposals, or its proposal has origin `initialized` (a cold reset of the same key).
- On candidate abandonment, dispose only proposals with origin `initialized`. Never dispose a `continued` proposal; it may share resources with the committed state.
- Read the origin with an exhaustive switch. Disposal runs outside the no-fail swap: a throwing `dispose` after commit is a postcommit delivery error and never un-commits; during abandonment it is reported alongside, never instead of, the original failure.

All fallible provider creation/equality/lookup/remember, math, validation and freezing happens before acceptance. Swap output and private state only after success; no provider or arbitrary plugin code in the no-fail section. Preserve diagnostics locating track, entry and relevant slot/member/source.

Root duplicates, rooted imports, goal coverage and solver provenance faults refuse before topology activation. No lighter load path, per-operation recompile fast path, cache migration or legacy fallback other than the `legacy-compose` strategy above. Preserve distinct error/blocked/last-ready handling and postcommit delivery errors.

## Evidence and finish

Test invalid duplicate IDs/goals/reparent/root imports and same-numeric rebinding without changes to active authoring, values, descriptors, outputs, **generic/FK/IK cache states**, subscriptions, bindings and handles. Test final-valid multi-edit recipes with invalid intermediate states. Inject provider creation/read/write/equality faults, preparation/derivation/evaluation/freeze failures and candidate disposal; retry from the retained active state. Test rejected candidate forks from one active snapshot and postcommit subscriber failures separately.

Add the `legacy-compose` parity tests for every catalog compose plugin and a mixed-track refusal test. Add disposal tests: a continued generation over many ticks is disposed exactly once, when it is removed or cold-reset; an abandoned candidate disposes its freshly initialized states and none of its continued ones; a throwing `dispose` after commit leaves the commit in place. Add a type test that an entry-id string does not index the committed-state map and that an unaugmented service name is not readable from `EvaluatorServices`.

Done when one complete candidate protocol protects all entrypoints without core knowledge of cache consumers, the runtime has one runner, and every unmigrated plugin publishes the same record as before. Record actual entrypoints, tests/commands/results and delivery/cleanup limits. Phase C gate: sound precommit layouts, guarded dynamic inputs, isolated generic state, no core kinematics on the new path, and the legacy kinematic channel and `legacy-compose` strategy quarantined until F2. Next: D1.
