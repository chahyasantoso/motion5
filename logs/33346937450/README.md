# CI log archive: 33346937450

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-02-structural-commit-seeds-a-flush
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33346937450
- Captured: 2026-08-31T01:14:33Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-31T01:14:00.9061000Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-31T01:14:00.9061300Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-31T01:14:00.9099796Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-31T01:14:00.9100074Z env:
quality (node 24)	Run npm test	2026-08-31T01:14:00.9100276Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-31T01:14:00.9100488Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-31T01:14:01.0240305Z 
quality (node 24)	Run npm test	2026-08-31T01:14:01.0241045Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-31T01:14:01.0241579Z > vitest run
quality (node 24)	Run npm test	2026-08-31T01:14:01.0241765Z 
quality (node 24)	Run npm test	2026-08-31T01:14:01.3289217Z 
quality (node 24)	Run npm test	2026-08-31T01:14:01.3310751Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:01.3317381Z 
quality (node 24)	Run npm test	2026-08-31T01:14:01.6984042Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:01.8031767Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:01.9736082Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.1789053Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.2219158Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.2434731Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-31T01:14:02.2438342Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T01:14:02.2440043Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T01:14:02.2447632Z 
quality (node 24)	Run npm test	2026-08-31T01:14:02.2448582Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T01:14:02.2449428Z 
quality (node 24)	Run npm test	2026-08-31T01:14:02.2449820Z act(() => {
quality (node 24)	Run npm test	2026-08-31T01:14:02.2450764Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T01:14:02.2451812Z });
quality (node 24)	Run npm test	2026-08-31T01:14:02.2453899Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T01:14:02.2457092Z 
quality (node 24)	Run npm test	2026-08-31T01:14:02.2458464Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T01:14:02.2459652Z 
quality (node 24)	Run npm test	2026-08-31T01:14:02.2741072Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 118^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.4768616Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.4999575Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.5001971Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.5033754Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.5034833Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.5035694Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.5036813Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.5038406Z      ^[[32m✓^[[39m T-6 rolls the Motion back when the candidate graph rejects it^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.5039842Z      ^[[32m✓^[[39m T-7 keeps one clock subscription when a Motion is created at runtime^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.5566279Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.7164484Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.7320027Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:02.8555035Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.0803503Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.1341935Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.1442272Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.3554475Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.3748045Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.3958733Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.5800876Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.6348623Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.7480985Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 151^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.8188018Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.8616481Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:03.9398231Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.1017403Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.1448387Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.2849700Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.3599474Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.4186061Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.5079825Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.5755521Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.7218783Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.7621159Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.8198869Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.9477682Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:04.9748595Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.0707360Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.1997019Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.2053776Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.3737468Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.4021713Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.4738835Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.6008829Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.6496052Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.7507139Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.8200857Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.8709230Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:05.9865960Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.0932209Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.0935084Z ^[[31m     ^[[31m×^[[31m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[39m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.0937966Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.0940590Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.0943775Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.0946812Z      ^[[32m✓^[[39m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.0949066Z      ^[[32m✓^[[39m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1594099Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1596911Z ^[[31m     ^[[31m×^[[31m adopts a free track under ~/id and publishes through the ordinary graph path^[[39m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1599856Z      ^[[32m✓^[[39m rejects duplicate adopted ids instead of silently replacing membership^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1604153Z      ^[[32m✓^[[39m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1606957Z ^[[31m     ^[[31m×^[[31m keeps every adopted track independently addressable across sequential adopt and destroy calls^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1608598Z      ^[[32m✓^[[39m rejects adopted tracks with non-finite stop positions^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1609508Z      ^[[32m✓^[[39m rejects adopted tracks with non-monotonic stop positions^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1610395Z      ^[[32m✓^[[39m rejects adopted tracks with duplicate stop positions^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1611382Z ^[[31m     ^[[31m×^[[31m adopts a track into an existing motion under motionId/trackId^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1612246Z      ^[[32m✓^[[39m rejects adopting into a non-existent motion^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.1613102Z      ^[[32m✓^[[39m destroys a motion-adopted track and invokes removeMotionTrack^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.2188325Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.2999336Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.4461308Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.5524833Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.6878655Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.8144869Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:06.9266373Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:07.0342603Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:07.2880021Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:07.2978945Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:07.5708690Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:07.6044090Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:07.8663711Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:07.8800508Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:08.1987039Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:08.2119028Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:08.4564197Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:08.5826411Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:08.6784583Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:08.8253592Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:08.9804309Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.1007606Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.2337047Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.4123516Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.4752101Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.5355193Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3122^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.5362262Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3118^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.6825204Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.6827892Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.8318726Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.9293302Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:09.9368806Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.0873192Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.1515663Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.1898303Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.3258882Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.3852690Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.4530580Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.5200290Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.6249285Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.7659280Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:10.8288547Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:11.0469949Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:11.0820653Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:11.3065979Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:11.3338979Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:11.5423349Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:11.6098105Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:11.8099167Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:11.9669016Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:12.0602815Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:12.1949041Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:12.3477407Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:12.4995340Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:12.5958953Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:12.7314937Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:12.8188635Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.0416463Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.0627396Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-31T01:14:13.0629799Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T01:14:13.0632784Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T01:14:13.0633913Z 
quality (node 24)	Run npm test	2026-08-31T01:14:13.0634767Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T01:14:13.0635679Z 
quality (node 24)	Run npm test	2026-08-31T01:14:13.0636100Z act(() => {
quality (node 24)	Run npm test	2026-08-31T01:14:13.0637178Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T01:14:13.0637966Z });
quality (node 24)	Run npm test	2026-08-31T01:14:13.0638639Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T01:14:13.0639230Z 
quality (node 24)	Run npm test	2026-08-31T01:14:13.0640555Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T01:14:13.0641883Z 
quality (node 24)	Run npm test	2026-08-31T01:14:13.0795453Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-31T01:14:13.0798781Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T01:14:13.0803475Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T01:14:13.0810116Z 
quality (node 24)	Run npm test	2026-08-31T01:14:13.0810858Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T01:14:13.0811701Z 
quality (node 24)	Run npm test	2026-08-31T01:14:13.0812092Z act(() => {
quality (node 24)	Run npm test	2026-08-31T01:14:13.0812717Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T01:14:13.0813377Z });
quality (node 24)	Run npm test	2026-08-31T01:14:13.0814071Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T01:14:13.0825269Z 
quality (node 24)	Run npm test	2026-08-31T01:14:13.0826291Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.0831607Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T01:14:13.0833598Z 
quality (node 24)	Run npm test	2026-08-31T01:14:13.3753427Z  ^[[31m❯^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.3771129Z ^[[31m     ^[[31m×^[[31m adopts a free track and publishes a ready patch via seek^[[39m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.3776822Z      ^[[32m✓^[[39m destroyAdopted removes the node from the graph^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.3781352Z      ^[[32m✓^[[39m rejects adoption of a track with malformed keyframes^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.3782926Z      ^[[32m✓^[[39m adopts a track into an existing motion and receives motion signals^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.3848760Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.6378913Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.6546262Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.8707035Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:13.8804187Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:14.1147606Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:14.1258246Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:14.3238073Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:14.4099281Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:14.5458888Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:14.6561718Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:14.7861804Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:14.9758906Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.0198891Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.2219692Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.2469336Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.4466266Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.5260501Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.6572566Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.7041534Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.8493558Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:15.9635604Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-31T01:14:15.9640621Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T01:14:15.9642495Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T01:14:15.9643254Z 
quality (node 24)	Run npm test	2026-08-31T01:14:15.9644105Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T01:14:15.9644996Z 
quality (node 24)	Run npm test	2026-08-31T01:14:15.9645342Z act(() => {
quality (node 24)	Run npm test	2026-08-31T01:14:15.9646078Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T01:14:15.9647091Z });
quality (node 24)	Run npm test	2026-08-31T01:14:15.9647706Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T01:14:15.9648221Z 
quality (node 24)	Run npm test	2026-08-31T01:14:15.9649500Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T01:14:15.9650797Z 
quality (node 24)	Run npm test	2026-08-31T01:14:15.9668639Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:16.0629867Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:16.1753735Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:16.3119383Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:16.4288914Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:16.5339362Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:16.6467575Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:16.7918657Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:16.9129646Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.1084182Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.1234155Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.3519114Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.3708328Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.4108799Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6776^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.4111269Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1774^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.4128213Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1863^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.5374612Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.6028629Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.6274822Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.7241535Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.7901939Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.8321893Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.9184257Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:17.9647226Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.0534079Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.1399165Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.1545776Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.2957557Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.3707529Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.3976714Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.5366759Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.6135922Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.6337684Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7212753Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7647292Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7705368Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7706480Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 6 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7707333Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7711457Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22madopts a free track under ~/id and publishes through the ordinary graph path
quality (node 24)	Run npm test	2026-08-31T01:14:18.7717978Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { node: '~/cursor' }^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7719211Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7719753Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7720795Z {
quality (node 24)	Run npm test	2026-08-31T01:14:18.7721495Z   "node": "~/cursor",
quality (node 24)	Run npm test	2026-08-31T01:14:18.7722143Z }
quality (node 24)	Run npm test	2026-08-31T01:14:18.7722581Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7723029Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7723658Z undefined
quality (node 24)	Run npm test	2026-08-31T01:14:18.7724067Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7724960Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m25:79^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7768151Z     ^[[90m 23|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"~/cursor"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7769978Z     ^[[90m 24|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39minstanceCount)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7771402Z     ^[[90m 25|^[[39m     expect(batch.patches.find(({ nodeId }) => nodeId === "~/cursor")?.…
quality (node 24)	Run npm test	2026-08-31T01:14:18.7772600Z     ^[[90m   |^[[39m                                                                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7773941Z     ^[[90m 26|^[[39m       node^[[33m:^[[39m ^[[32m"~/cursor"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7774708Z     ^[[90m 27|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7775046Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7775447Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7775685Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7777298Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mkeeps every adopted track independently addressable across sequential adopt and destroy calls
quality (node 24)	Run npm test	2026-08-31T01:14:18.7779469Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { node: '~/cursor' }^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7780025Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7780176Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7780402Z {
quality (node 24)	Run npm test	2026-08-31T01:14:18.7780594Z   "node": "~/cursor",
quality (node 24)	Run npm test	2026-08-31T01:14:18.7780804Z }
quality (node 24)	Run npm test	2026-08-31T01:14:18.7780899Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7781033Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7781240Z undefined
quality (node 24)	Run npm test	2026-08-31T01:14:18.7781352Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7781766Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m61:7^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7782264Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(
quality (node 24)	Run npm test	2026-08-31T01:14:18.7782783Z     ^[[90m 60|^[[39m       runtime.seek(cursor.id, 0).patches.find(({ nodeId }) => nodeId =…
quality (node 24)	Run npm test	2026-08-31T01:14:18.7783298Z     ^[[90m 61|^[[39m     )^[[33m.^[[39m^[[34mtoEqual^[[39m({
quality (node 24)	Run npm test	2026-08-31T01:14:18.7783654Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7784065Z     ^[[90m 62|^[[39m       node^[[33m:^[[39m ^[[32m"~/cursor"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7784460Z     ^[[90m 63|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7784625Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7784858Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7785067Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7785914Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22madopts a track into an existing motion under motionId/trackId
quality (node 24)	Run npm test	2026-08-31T01:14:18.7787299Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { node: 'hero/opacity' }^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7787726Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7787869Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7788089Z {
quality (node 24)	Run npm test	2026-08-31T01:14:18.7788299Z   "node": "hero/opacity",
quality (node 24)	Run npm test	2026-08-31T01:14:18.7788525Z }
quality (node 24)	Run npm test	2026-08-31T01:14:18.7788629Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7788756Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7788980Z undefined
quality (node 24)	Run npm test	2026-08-31T01:14:18.7789089Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7789491Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m140:83^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7790023Z     ^[[90m138|^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7792254Z     ^[[90m139|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"hero/opacity"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7793637Z     ^[[90m140|^[[39m     expect(batch.patches.find(({ nodeId }) => nodeId === "hero/opacity…
quality (node 24)	Run npm test	2026-08-31T01:14:18.7794349Z     ^[[90m   |^[[39m                                                                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7794920Z     ^[[90m141|^[[39m       node^[[33m:^[[39m ^[[32m"hero/opacity"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7795621Z     ^[[90m142|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7795806Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7796048Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7796265Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7797517Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22madopts a free track and publishes a ready patch via seek
quality (node 24)	Run npm test	2026-08-31T01:14:18.7798533Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7799243Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m27:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7800154Z     ^[[90m 25|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(adopted^[[33m.^[[39mid^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7800940Z     ^[[90m 26|^[[39m     const patch = batch.patches.find(({ nodeId }) => nodeId === adopte…
quality (node 24)	Run npm test	2026-08-31T01:14:18.7801765Z     ^[[90m 27|^[[39m     ^[[34mexpect^[[39m(patch)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7802261Z     ^[[90m   |^[[39m                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7802941Z     ^[[90m 28|^[[39m     ^[[34mexpect^[[39m(patch^[[33m!^[[39m^[[33m.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7803593Z     ^[[90m 29|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7803846Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7804084Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7804303Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7805437Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m1. Adoption produces ready patches and publishes through the ordinary graph path
quality (node 24)	Run npm test	2026-08-31T01:14:18.7807000Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7807891Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m26:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7846750Z     ^[[90m 24|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"~/cursor"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7848871Z     ^[[90m 25|^[[39m     const patch = batch.patches.find(({ nodeId }) => nodeId === "~/cur…
quality (node 24)	Run npm test	2026-08-31T01:14:18.7850455Z     ^[[90m 26|^[[39m     ^[[34mexpect^[[39m(patch)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7851646Z     ^[[90m   |^[[39m                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7853127Z     ^[[90m 27|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7854993Z     ^[[90m 28|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ node^[[33m:^[[39m ^[[32m"~/cursor"^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7855833Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7856316Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7857018Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7859056Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
quality (node 24)	Run npm test	2026-08-31T01:14:18.7861670Z ^[[31m^[[1mAssertionError^[[22m: expected [ { x: 25 }, { x: 50 }, …(2) ] to deeply equal [ { x: +0 }, { x: 25 }, …(3) ]^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7862458Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7862740Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7863265Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7863511Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7863791Z ^[[33m@@ -1,10 +1,7 @@^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7864252Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7864635Z ^[[2m    {^[[22m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7865093Z ^[[32m-     "x": 0,^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7865531Z ^[[32m-   },^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7865943Z ^[[32m-   {^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7866399Z ^[[2m      "x": 25,^[[22m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7867090Z ^[[2m    },^[[22m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7867474Z ^[[2m    {^[[22m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7867928Z ^[[2m      "x": 50,^[[22m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7868688Z ^[[2m    },^[[22m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7868900Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7869845Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m196:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7900631Z     ^[[90m194|^[[39m     // Deep equality of the whole sequence, not the end state. A doubl…
quality (node 24)	Run npm test	2026-08-31T01:14:18.7901990Z     ^[[90m195|^[[39m     // and would pass a final-value assertion; it cannot reproduce the…
quality (node 24)	Run npm test	2026-08-31T01:14:18.7903497Z     ^[[90m196|^[[39m     ^[[34mexpect^[[39m(runtimeSeen)^[[33m.^[[39m^[[34mtoEqual^[[39m(authoredSeen)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7904524Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7905490Z     ^[[90m197|^[[39m     expect(moved(authoredSeen)).toEqual([{ x: 25 }, { x: 50 }, { x: 75…
quality (node 24)	Run npm test	2026-08-31T01:14:18.7906259Z     ^[[90m198|^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7907808Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7908314Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7908692Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7909019Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7918946Z ^[[2m Test Files ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m159 passed^[[39m^[[22m^[[90m (163)^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7927264Z ^[[2m      Tests ^[[22m ^[[1m^[[31m6 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m791 passed^[[39m^[[22m^[[90m (797)^[[39m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7928370Z ^[[2m   Start at ^[[22m 01:14:01
quality (node 24)	Run npm test	2026-08-31T01:14:18.7932418Z ^[[2m   Duration ^[[22m 17.41s^[[2m (transform 2.28s, setup 1.11s, import 8.89s, tests 13.27s, environment 26ms)^[[22m
quality (node 24)	Run npm test	2026-08-31T01:14:18.7937931Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7961137Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7985783Z ##[error]AssertionError: expected undefined to deeply equal { node: '~/cursor' }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "node": "~/cursor",
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:25:79
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T01:14:18.7994950Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.7997268Z ##[error]AssertionError: expected undefined to deeply equal { node: '~/cursor' }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "node": "~/cursor",
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:61:7
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T01:14:18.7998498Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.8000623Z ##[error]AssertionError: expected undefined to deeply equal { node: 'hero/opacity' }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "node": "hero/opacity",
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:140:83
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T01:14:18.8001847Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.8003110Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/handle-adoption.test.ts:27:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T01:14:18.8003990Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.8005284Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:26:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T01:14:18.8006193Z 
quality (node 24)	Run npm test	2026-08-31T01:14:18.8008573Z ##[error]AssertionError: expected [ { x: 25 }, { x: 50 }, …(2) ] to deeply equal [ { x: +0 }, { x: 25 }, …(3) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	@@ -1,10 +1,7 @@
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    {
quality (node 24)	Run npm test	-     "x": 0,
quality (node 24)	Run npm test	-   },
quality (node 24)	Run npm test	-   {
quality (node 24)	Run npm test	      "x": 25,
quality (node 24)	Run npm test	    },
quality (node 24)	Run npm test	    {
quality (node 24)	Run npm test	      "x": 50,
quality (node 24)	Run npm test	    },
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:196:25
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T01:14:18.8478958Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-31T01:13:46.7577316Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:46.7577709Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:46.7600855Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:46.7601406Z env:
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:46.7601680Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:46.7601948Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:46.8427814Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.1305681Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.1306662Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.1307053Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.1307066Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.1326995Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.1328365Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6860718Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6863017Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6864681Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6865955Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6869234Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6870620Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6871851Z      ^[[32m✓^[[39m T-6 rolls the Motion back when the candidate graph rejects it^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6873071Z      ^[[32m✓^[[39m T-7 keeps one clock subscription when a Motion is created at runtime^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.6960205Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8331644Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8375691Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8419129Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8431665Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8446752Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8475876Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8506848Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8532732Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8555559Z });
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8590697Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 102^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8623831Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8645871Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8675503Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.8693735Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.9203512Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:47.9857990Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.1206747Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.1469632Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.3924193Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.4076192Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.4556811Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.6456477Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.6681017Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.6849076Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.8960993Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9096011Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9097823Z ^[[31m     ^[[31m×^[[31m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9098870Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9099979Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9101002Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9101874Z      ^[[32m✓^[[39m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9102787Z      ^[[32m✓^[[39m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9695221Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9697401Z ^[[31m     ^[[31m×^[[31m adopts a free track under ~/id and publishes through the ordinary graph path^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9698766Z      ^[[32m✓^[[39m rejects duplicate adopted ids instead of silently replacing membership^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9699994Z      ^[[32m✓^[[39m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9701486Z ^[[31m     ^[[31m×^[[31m keeps every adopted track independently addressable across sequential adopt and destroy calls^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9702636Z      ^[[32m✓^[[39m rejects adopted tracks with non-finite stop positions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9703817Z      ^[[32m✓^[[39m rejects adopted tracks with non-monotonic stop positions^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9705100Z      ^[[32m✓^[[39m rejects adopted tracks with duplicate stop positions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9713309Z ^[[31m     ^[[31m×^[[31m adopts a track into an existing motion under motionId/trackId^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9714732Z      ^[[32m✓^[[39m rejects adopting into a non-existent motion^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:48.9715965Z      ^[[32m✓^[[39m destroys a motion-adopted track and invokes removeMotionTrack^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.1416820Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.1955085Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.2024128Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.3805909Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.4406546Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.4624878Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.6074826Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.6572201Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.7069098Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.8439807Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.9134095Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:49.9462058Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.0925973Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.1453186Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.1653754Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.3307136Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.3796108Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.3846953Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.5705738Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.5786363Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.6311877Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.8050394Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.8052921Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.8205630Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:50.9718242Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.0279849Z  ^[[31m❯^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.0280968Z ^[[31m     ^[[31m×^[[31m adopts a free track and publishes a ready patch via seek^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.0281778Z      ^[[32m✓^[[39m destroyAdopted removes the node from the graph^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.0282424Z      ^[[32m✓^[[39m rejects adoption of a track with malformed keyframes^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.0283387Z      ^[[32m✓^[[39m adopts a track into an existing motion and receives motion signals^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.1103549Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.1383329Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.1848575Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.2856437Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.3376982Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.3402085Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.4900296Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.4940503Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.5526479Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.6484734Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.6626020Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.7717552Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.7906414Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.8462006Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.9600552Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:51.9630906Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.0396382Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.0979528Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1200267Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1225834Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1227168Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 6 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1227611Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1229590Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22madopts a free track under ~/id and publishes through the ordinary graph path
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1233067Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { node: '~/cursor' }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1233549Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1233715Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1234316Z {
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1234630Z   "node": "~/cursor",
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1234968Z }
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1235140Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1235319Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1235712Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1236140Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1236661Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m25:79^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1276771Z     ^[[90m 23|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"~/cursor"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1278588Z     ^[[90m 24|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39minstanceCount)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1280055Z     ^[[90m 25|^[[39m     expect(batch.patches.find(({ nodeId }) => nodeId === "~/cursor")?.…
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1281294Z     ^[[90m   |^[[39m                                                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1282340Z     ^[[90m 26|^[[39m       node^[[33m:^[[39m ^[[32m"~/cursor"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1283203Z     ^[[90m 27|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1283718Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1284446Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1284993Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1286667Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mkeeps every adopted track independently addressable across sequential adopt and destroy calls
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1288703Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { node: '~/cursor' }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1289376Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1289783Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1290368Z {
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1290951Z   "node": "~/cursor",
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1291487Z }
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1291914Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1292366Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1292985Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1293396Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1294229Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m61:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1295247Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1296138Z     ^[[90m 60|^[[39m       runtime.seek(cursor.id, 0).patches.find(({ nodeId }) => nodeId =…
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1297023Z     ^[[90m 61|^[[39m     )^[[33m.^[[39m^[[34mtoEqual^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1297722Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1298470Z     ^[[90m 62|^[[39m       node^[[33m:^[[39m ^[[32m"~/cursor"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1299207Z     ^[[90m 63|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1299572Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1300069Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1300508Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1301724Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22madopts a track into an existing motion under motionId/trackId
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1303362Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { node: 'hero/opacity' }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1304241Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1304595Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1305177Z {
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1305669Z   "node": "hero/opacity",
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1306188Z }
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1306512Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1306905Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1307425Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1307702Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1308515Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m140:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1309298Z     ^[[90m138|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1310365Z     ^[[90m139|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"hero/opacity"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1311839Z     ^[[90m140|^[[39m     expect(batch.patches.find(({ nodeId }) => nodeId === "hero/opacity…
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1312971Z     ^[[90m   |^[[39m                                                                                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1314293Z     ^[[90m141|^[[39m       node^[[33m:^[[39m ^[[32m"hero/opacity"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1315120Z     ^[[90m142|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1315522Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1316125Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1316878Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1318415Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22madopts a free track and publishes a ready patch via seek
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1320252Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1321463Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m27:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1323030Z     ^[[90m 25|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(adopted^[[33m.^[[39mid^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1324649Z     ^[[90m 26|^[[39m     const patch = batch.patches.find(({ nodeId }) => nodeId === adopte…
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1325826Z     ^[[90m 27|^[[39m     ^[[34mexpect^[[39m(patch)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1326779Z     ^[[90m   |^[[39m                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1327905Z     ^[[90m 28|^[[39m     ^[[34mexpect^[[39m(patch^[[33m!^[[39m^[[33m.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1329108Z     ^[[90m 29|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1329633Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1330135Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1330621Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1332356Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m1. Adoption produces ready patches and publishes through the ordinary graph path
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1335066Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1336377Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m26:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1337884Z     ^[[90m 24|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"~/cursor"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1339223Z     ^[[90m 25|^[[39m     const patch = batch.patches.find(({ nodeId }) => nodeId === "~/cur…
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1340440Z     ^[[90m 26|^[[39m     ^[[34mexpect^[[39m(patch)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1341320Z     ^[[90m   |^[[39m                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1342456Z     ^[[90m 27|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1343894Z     ^[[90m 28|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ node^[[33m:^[[39m ^[[32m"~/cursor"^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1344849Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1345383Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1345852Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1347398Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1349435Z ^[[31m^[[1mAssertionError^[[22m: expected [ { x: 25 }, { x: 50 }, …(2) ] to deeply equal [ { x: +0 }, { x: 25 }, …(3) ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1350151Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1350514Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1351115Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1351409Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1351819Z ^[[33m@@ -1,10 +1,7 @@^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1352404Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1353027Z ^[[2m    {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1353589Z ^[[32m-     "x": 0,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1354228Z ^[[32m-   },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1354822Z ^[[32m-   {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1355379Z ^[[2m      "x": 25,^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1355921Z ^[[2m    },^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1356475Z ^[[2m    {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1356990Z ^[[2m      "x": 50,^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1357547Z ^[[2m    },^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1357905Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1358742Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m196:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1371866Z     ^[[90m194|^[[39m     // Deep equality of the whole sequence, not the end state. A doubl…
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1376769Z     ^[[90m195|^[[39m     // and would pass a final-value assertion; it cannot reproduce the…
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1377454Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1378332Z     ^[[90m196|^[[39m     ^[[34mexpect^[[39m(runtimeSeen)^[[33m.^[[39m^[[34mtoEqual^[[39m(authoredSeen)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1383228Z ^[[2m Test Files ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m57 passed^[[39m^[[22m^[[90m (61)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1384918Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1385781Z ^[[2m      Tests ^[[22m ^[[1m^[[31m6 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m248 passed^[[39m^[[22m^[[90m (254)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1386451Z     ^[[90m197|^[[39m     expect(moved(authoredSeen)).toEqual([{ x: 25 }, { x: 50 }, { x: 75…
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1386974Z     ^[[90m198|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1387114Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1387390Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1387608Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1388052Z ^[[2m   Start at ^[[22m 01:13:47
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1389494Z ^[[2m   Duration ^[[22m 4.96s^[[2m (transform 1.54s, setup 343ms, import 4.51s, tests 1.27s, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1390134Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1400783Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1426549Z ##[error]AssertionError: expected undefined to deeply equal { node: '~/cursor' }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "node": "~/cursor",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:25:79
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1437147Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1440108Z ##[error]AssertionError: expected undefined to deeply equal { node: '~/cursor' }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "node": "~/cursor",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:61:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1441888Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1444738Z ##[error]AssertionError: expected undefined to deeply equal { node: 'hero/opacity' }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "node": "hero/opacity",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:140:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1446623Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1448742Z ##[error]AssertionError: expected undefined to be defined
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/handle-adoption.test.ts:27:19
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1450068Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1452121Z ##[error]AssertionError: expected undefined to be defined
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:26:19
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1453447Z 
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1456303Z ##[error]AssertionError: expected [ { x: 25 }, { x: 50 }, …(2) ] to deeply equal [ { x: +0 }, { x: 25 }, …(3) ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	@@ -1,10 +1,7 @@
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	    {
integration (node 24)	Run npm run test:integration	-     "x": 0,
integration (node 24)	Run npm run test:integration	-   },
integration (node 24)	Run npm run test:integration	-   {
integration (node 24)	Run npm run test:integration	      "x": 25,
integration (node 24)	Run npm run test:integration	    },
integration (node 24)	Run npm run test:integration	    {
integration (node 24)	Run npm run test:integration	      "x": 50,
integration (node 24)	Run npm run test:integration	    },
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:196:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T01:13:52.1657437Z ##[error]Process completed with exit code 1.
```
