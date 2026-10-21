# A6 — Define atomicity, generic private state and failure boundaries

Status: not implemented. Depends on: A1, A2.

## Start here

Read `00-overview.md`, `42-cache-contract.md`, contract/identity artifacts, `packages/core/src/contract/schema-transaction.ts`, `packages/core/src/contract/value-transaction.ts`, `packages/core/src/runtime/project-runtime.ts` and `packages/core/src/runtime/graph-publisher.ts`. Follow existing stage/accept/notify/dispose owners only.

## Outcome and work

Define one candidate/evaluation protocol: privately build, validate authoring/operation claims, derive descriptors, prepare/evaluate, validate/freeze outputs and immutable state-owned material, accept ready output and proposed per-entry state together, swap, then notify/deliver. Integrate with existing transactions, not another edit or cache manager.

Document actual evaluation transaction scope. Downstream reads may see staged upstream output, but externally observable ready outputs/private states cannot accept piecemeal. Preserve error/blocked/last-ready distinctions; a failed transaction is not partial ready success. Document how multiple staged evaluations within one operation obtain private baselines and are accepted/discarded together; never mutate active state while establishing those baselines.

Rejected structural/value candidates preserve active authoring, overlays, bindings, subscriptions, outputs, handle generations and **all plugin cache snapshots**, including FK and IK. Pure lookup cannot mutate committed eviction/recency; proposed remember cannot evict active entries. Cold-reset relevant structural/rebound generations; no migration by member ID. Moves may preserve public identity while rebuilding evaluator state cold.

Provider create/lookup/equality/remember exceptions are fallible preparation/evaluation work with contextual diagnostics, not implicit misses. Validate cached hit values at normal plugin/publication boundaries. Default providers retain only immutable data and need no snapshot-level finalizers. Candidate abandonment/retirement releases evaluator references through one lifecycle protocol, with idempotent public disposal and no disposal of storage still shared with committed state.

No provider calls or arbitrary plugin commit callbacks in the no-fail swap. Shared definitions remain immutable. Subscriber/adapter exceptions after acceptance are delivery failures, not rollback of accepted state or external effects. Record the runtime's actual distinction and cleanup error policy.

## Evidence and finish

Create a failure ledger for provider creation, preparation, derivation, early/late operation, key comparison/lookup/remember, output validation/freezing, candidate disposal and postcommit delivery. Name preserved observations and a test owner for each. Include collect success then fold failure, FK success then downstream failure, and IK hit/miss then late failure. Retry must start from the last accepted state and match uncached semantics.

Done when B7/C7/E2 and both domain caches share one precise boundary. This slice defines requirements, not completed runtime tests. Report reviewed sources/artifacts and unresolved scope limits. Next: B1.
