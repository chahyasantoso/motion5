# E6 — Clean up removal, rebinding, and disposal safely

Status: not implemented. Depends on: E2, E4, E5.

## Start here

Read `00-overview.md`, adapter ownership/revision rules, `packages/core/src/adapters/dom.ts`, `packages/core/src/runtime/project-runtime.ts`, and current disposal/subscription tests reached from those owners.

## Outcome and work

Release old binding-owned dirty/revision/target references when a member/track disappears, source changes, target is rebound, or runtime/adapter is disposed. Structural acceptance determines when transitions become live; a rejected candidate must not mutate active bindings or clear their fields.

Define cleanup for adapter-owned transform fields without deleting user-owned elements or unrelated style/property values. Retired bindings must not clear fields now owned by an accepted replacement. Use binding generation/ownership tokens rather than member ID alone. Generation tokens, retirement and hand-off order belong to E4's renderer-neutral binding module so G6's Three adapter inherits the same lifecycle; only clearing DOM fields is adapter-specific. If a target is handed off, retire old ownership and initialize new ownership in the documented order.

Resolve and initialize replacement targets with the current committed frame even when pose numbers/revision are unchanged. Member removal then later reuse and same IDs in another track do not inherit stale baselines. Repeated cleanup/dispose is safe, no writes occur after disposal, and maps/subscriptions hold no unbounded strong references to retired targets.

Candidate resources and accepted adapter resources have different lifetimes; reuse the existing cleanup owner rather than adding rig-specific teardown services. Postcommit writer errors remain delivery failures and follow the adapter's retry/baseline policy; do not claim external writes were atomically rolled back.

## Evidence and finish

Run binding lifecycle tests: target A→B unchanged pose initializes B; remove/reuse member; track removal; two rigs with equal IDs; rejected structural batch preserves targets/baselines; replacement-owned fields survive old cleanup; user element remains; repeated dispose safe; no late subscription writes; bounded registry/map sizes after deterministic churn.

Done when editing sessions neither accumulate retired render state nor require nudging animation to repair bindings. Record actual resource checks, command/results, ownership policy, and any browser-only validation still pending. Next: E7.
