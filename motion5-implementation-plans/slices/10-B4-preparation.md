# B4 — Isolate preparation, static data, and timing

Status: implemented on branch `feat/plugin-structural-api`. Depends on: B2, B3.

Evidence: `packages/core/src/domain/track-preparation.ts`, `packages/core/test/contract/track-preparation-b4.test.ts`.

## Start here

Read `00-overview.md`, the B2/B3 interfaces, `packages/core/src/domain/plugins.ts`, `packages/core/src/domain/track.ts`, `packages/core/src/contract/keyframe-compiler.ts`, and contribution tests located under `packages/core/test` by reference search.

## Outcome and work

Run contribution/preparation per owning entry and property with that entry's schema/context/address namespace. Contributions may create only validated internal leaves owned by that entry. A contribute-only plugin is invalid after B1; preprocessing belongs to an entry with collect and/or fold. Cross-plugin shared seed contributions are retired.

Reassemble each entry's static and animated leaves without sibling merges, dropped zeros, or accidental public internal keys. Validate contribution ownership/reserved tween names and refuse writes outside the owner's permitted leaves. Keep one track progress/timeline and correct reverse seek/endpoints. All preparation completes before authored-order operation execution; stage/priority cannot reorder entries.

Dependency-only entries must still be scheduled for evaluation without dummy numeric leaves. Preparation failures must abandon candidate resources/timelines without changing live values or committed state. Avoid a shared mutable seed bag used as an undeclared communication channel.

Rewrite old prepare-stage/priority tests by invariant: local contribution succeeds; sibling entry cannot see it; explicit cross-track requirements remain the communication path. Do not retain old stage metadata to keep fixtures green.

## Evidence and finish

Run focused preparation/interpolation tests: two repeated entries contribute the same internal name independently; static zero and animated values stay attached to their owner; endpoints/reverse seek match direct sampling; dependency-only synthetic operations run; invalid contribution ownership/reserved names refuse; preparation failure leaks no active timeline/subscription.

Done when the new plan drives preparation with no old group flattening or shared seed dependency. Report actual changed paths, tests/results, and any unrelated incomplete-branch failures. Next: B5.
