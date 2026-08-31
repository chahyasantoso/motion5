# CI log archive: 33376725270

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-48-plugin-group-edit
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33376725270
- Captured: 2026-08-31T09:16:06Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-31T09:15:29.6489459Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-31T09:15:29.6489769Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-31T09:15:29.6529262Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-31T09:15:29.6529529Z env:
quality (node 24)	Run npm test	2026-08-31T09:15:29.6529730Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-31T09:15:29.6529943Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-31T09:15:29.7684670Z 
quality (node 24)	Run npm test	2026-08-31T09:15:29.7685529Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-31T09:15:29.7686024Z > vitest run
quality (node 24)	Run npm test	2026-08-31T09:15:29.7686221Z 
quality (node 24)	Run npm test	2026-08-31T09:15:30.0947888Z 
quality (node 24)	Run npm test	2026-08-31T09:15:30.0952464Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.0953203Z 
quality (node 24)	Run npm test	2026-08-31T09:15:30.4136184Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.5846056Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.7243413Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9389442Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m | ^[[22m^[[31m9 failed^[[39m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9392624Z ^[[31m     ^[[31m×^[[31m RA-48 originates a group on a node that authored none, edges and values together^[[39m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9396005Z ^[[31m     ^[[31m×^[[31m RA-49 replaces a bound group wholesale, dropping the bindings it no longer names^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9399771Z ^[[31m     ^[[31m×^[[31m RA-50 removes a group and every edge it derived in one commit, leaving no empty record^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9402228Z ^[[31m     ^[[31m×^[[31m RA-51 refuses a name this node authors as a property, and originates nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9404389Z ^[[31m     ^[[31m×^[[31m RA-52 refuses a group that names no reserved section rather than committing a husk^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9406621Z ^[[31m     ^[[31m×^[[31m RA-53 commits nothing when a group edit changes nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9409405Z ^[[31m     ^[[31m×^[[31m RA-54 addresses one goal by member id, and the last one leaves no husk behind^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9411858Z ^[[31m     ^[[31m×^[[31m RA-55 reserves the goals slot by name in both binding verbs, and points at setGoal^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:30.9413913Z ^[[31m     ^[[31m×^[[31m RA-56 lets the graph refuse a candidate a goal edit produced, and rolls it back^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.0987523Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.1003586Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-31T09:15:31.1039584Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T09:15:31.1050990Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T09:15:31.1063254Z 
quality (node 24)	Run npm test	2026-08-31T09:15:31.1075179Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T09:15:31.1085573Z 
quality (node 24)	Run npm test	2026-08-31T09:15:31.1086053Z act(() => {
quality (node 24)	Run npm test	2026-08-31T09:15:31.1086822Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T09:15:31.1087513Z });
quality (node 24)	Run npm test	2026-08-31T09:15:31.1088473Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T09:15:31.1088966Z 
quality (node 24)	Run npm test	2026-08-31T09:15:31.1090281Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T09:15:31.1093279Z 
quality (node 24)	Run npm test	2026-08-31T09:15:31.1283511Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 120^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.2330871Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.3590251Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.4450292Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.4735606Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.6354763Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.6861494Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.7336181Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:31.9871962Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.0874466Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 70^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.0987079Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.2619366Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.3613574Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.3859086Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.4620514Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6455239Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6628910Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6631585Z ^[[31m     ^[[31m×^[[31m SH-1 refuses on every member of the enumerated public handle surface^[[39m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6635290Z      ^[[32m✓^[[39m SH-2 keeps the current message verbatim and carries its stable rule id^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6637866Z      ^[[32m✓^[[39m SH-3 stays a TypeError, so every existing narrowing keeps matching^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6640061Z      ^[[32m✓^[[39m SH-4 answers `live` on both sides of every invalidation and never throws doing it^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6642689Z      ^[[32m✓^[[39m SH-5 lets expected cleanup guard on `live` instead of on try/catch^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6644343Z      ^[[32m✓^[[39m SH-6 leaves the live path exactly as it was^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.6646119Z      ^[[32m✓^[[39m SH-7 keeps one token comparison and no branch inside the handle factory^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.7319403Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.9034339Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:32.9903700Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.0079150Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 169^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.1371963Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.2200826Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.3460681Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.4644674Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.5142579Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.6708436Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.7377426Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.7871133Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:33.9661797Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.0084954Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.0087297Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.2340165Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.2792858Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.2963064Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.4495239Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.5050018Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.5089214Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.7288439Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.7447431Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.7505822Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:34.9208930Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.0503796Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.0564286Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.1820281Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.3007302Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.3130506Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.4394950Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.5398343Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.5404632Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.6547016Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.7764940Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.8090385Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:35.9064307Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:36.0427980Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:36.2174892Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:36.3014726Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:36.4172708Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:36.5326853Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:36.7866500Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:36.7946265Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:37.1119967Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:37.1303563Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:37.4569856Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:37.4953779Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:37.7869799Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:37.7928779Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:38.0440333Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:38.1776251Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:38.2900901Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:38.4215458Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:38.5430533Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:38.7670182Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:38.8080110Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.0339233Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.0731182Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3110^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.0738665Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3106^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.1090112Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.2460140Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.3119768Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.3660210Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.5444372Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.5816822Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.6042206Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.7784114Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.8030137Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:39.8827977Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.0071710Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.0718771Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.0958813Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.2414903Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.2808105Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.4754431Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.5064491Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.7527043Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:40.7649319Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:41.0057434Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:41.0124340Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:41.2650142Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:41.2975143Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:41.5697362Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:41.5900470Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:41.8560089Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:41.8892405Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:42.1447187Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:42.2190604Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:42.4274220Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:42.5705510Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:42.6778124Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:42.8161577Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:43.0246377Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-31T09:15:43.0281382Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T09:15:43.0285198Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T09:15:43.0338835Z 
quality (node 24)	Run npm test	2026-08-31T09:15:43.0352196Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T09:15:43.0356863Z 
quality (node 24)	Run npm test	2026-08-31T09:15:43.0381934Z act(() => {
quality (node 24)	Run npm test	2026-08-31T09:15:43.0401072Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T09:15:43.0426146Z });
quality (node 24)	Run npm test	2026-08-31T09:15:43.0438637Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T09:15:43.0439254Z 
quality (node 24)	Run npm test	2026-08-31T09:15:43.0440579Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T09:15:43.0442471Z 
quality (node 24)	Run npm test	2026-08-31T09:15:43.0444662Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-31T09:15:43.0447178Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T09:15:43.0448833Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T09:15:43.0449603Z 
quality (node 24)	Run npm test	2026-08-31T09:15:43.0450445Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T09:15:43.0452526Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:43.0453743Z 
quality (node 24)	Run npm test	2026-08-31T09:15:43.0461526Z act(() => {
quality (node 24)	Run npm test	2026-08-31T09:15:43.0462337Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T09:15:43.0472550Z });
quality (node 24)	Run npm test	2026-08-31T09:15:43.0476038Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T09:15:43.0476676Z 
quality (node 24)	Run npm test	2026-08-31T09:15:43.0478283Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T09:15:43.0492294Z 
quality (node 24)	Run npm test	2026-08-31T09:15:43.0600172Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:43.3292919Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:43.3920654Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:43.6349727Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:43.6539349Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:43.8880202Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:43.9720457Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:44.1461865Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:44.1919088Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:44.4546567Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:44.4776688Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:44.7203625Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:44.7600037Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:45.0109735Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:45.0450697Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:45.2570001Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:45.2970091Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:45.5203703Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:45.6208623Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:45.7910039Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:45.8521086Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:46.0491567Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:46.1500489Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-31T09:15:46.1503097Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T09:15:46.1528659Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T09:15:46.1558274Z 
quality (node 24)	Run npm test	2026-08-31T09:15:46.1559450Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T09:15:46.1599555Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:46.1608153Z 
quality (node 24)	Run npm test	2026-08-31T09:15:46.1638530Z act(() => {
quality (node 24)	Run npm test	2026-08-31T09:15:46.1668886Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T09:15:46.1669848Z });
quality (node 24)	Run npm test	2026-08-31T09:15:46.1698915Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T09:15:46.1728116Z 
quality (node 24)	Run npm test	2026-08-31T09:15:46.1759059Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T09:15:46.1760503Z 
quality (node 24)	Run npm test	2026-08-31T09:15:46.3129922Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:46.4023781Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:46.5642109Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:46.6769978Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:46.7861223Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:46.9761773Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:47.0436480Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:47.2685210Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:47.3933738Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:47.6069966Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:47.6732735Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:47.8603075Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:47.9460037Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.1694093Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.1885521Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.4509953Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.4648265Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.5406616Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 8258^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.5429537Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 2515^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.5459160Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 2433^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.6730533Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.7590099Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.8000291Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.9018691Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:48.9984039Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.0451855Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.1469998Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.2478820Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.3446510Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.4547126Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.5364801Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.6197362Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.6809765Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7212236Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7264414Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7265820Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 10 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7266861Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7272243Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-48 originates a group on a node that authored none, edges and values together
quality (node 24)	Run npm test	2026-08-31T09:15:49.7276212Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7278201Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7344704Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7346393Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7348924Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7350103Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7351891Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7353837Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7355924Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m154:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7356917Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7357898Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7358580Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7361226Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-49 replaces a bound group wholesale, dropping the bindings it no longer names
quality (node 24)	Run npm test	2026-08-31T09:15:49.7364760Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7366858Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7369032Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7370916Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7372785Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7374277Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7376102Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7378232Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7380260Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m177:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7381246Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7381945Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7382537Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7385224Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-50 removes a group and every edge it derived in one commit, leaving no empty record
quality (node 24)	Run npm test	2026-08-31T09:15:49.7388438Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7390394Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7391450Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7392369Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7393301Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7393977Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7394728Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7395613Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7396528Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m200:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7397019Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7397376Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7398150Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7400559Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-51 refuses a name this node authors as a property, and originates nothing
quality (node 24)	Run npm test	2026-08-31T09:15:49.7403687Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7411174Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7412994Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7414825Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7416607Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7418097Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7419849Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7421536Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7423219Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m223:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7424119Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7424738Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7425308Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7428109Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-52 refuses a group that names no reserved section rather than committing a husk
quality (node 24)	Run npm test	2026-08-31T09:15:49.7431046Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7433044Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7433839Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7434749Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7436088Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7437458Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7439040Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7440519Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7442142Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7443923Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m257:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7445570Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m168 passed^[[39m^[[22m^[[90m (170)^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7446329Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7446993Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7447503Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7449977Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-53 commits nothing when a group edit changes nothing
quality (node 24)	Run npm test	2026-08-31T09:15:49.7452320Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7454161Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7455479Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7456321Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7457461Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7458498Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7459625Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7460415Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7461399Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m276:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7461954Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7462438Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7462822Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7464404Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-54 addresses one goal by member id, and the last one leaves no husk behind
quality (node 24)	Run npm test	2026-08-31T09:15:49.7467264Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7468754Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7470031Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7470931Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7471759Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7472315Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7472940Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7473748Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7474553Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m302:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7475033Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7475391Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7475783Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7478481Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-55 reserves the goals slot by name in both binding verbs, and points at setGoal
quality (node 24)	Run npm test	2026-08-31T09:15:49.7481135Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7482137Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7483467Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7484975Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7485825Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7486421Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7487054Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7488130Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7488991Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m343:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7489370Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7489603Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7490063Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7491333Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-group-edit.test.ts^[[2m > ^[[22ma whole plugin group and one solver goal, at the price the structural tier costs^[[2m > ^[[22mRA-56 lets the graph refuse a candidate a goal edit produced, and rolls it back
quality (node 24)	Run npm test	2026-08-31T09:15:49.7492774Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7494069Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m140:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7495106Z     ^[[90m138|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7495975Z     ^[[90m139|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7497234Z     ^[[90m140|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7498661Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7499441Z     ^[[90m141|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframeGroup"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7500626Z     ^[[90m142|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setGoal"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7501634Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-group-edit.test.ts:^[[2m384:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7502016Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7502255Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7502619Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7504178Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-1 refuses on every member of the enumerated public handle surface
quality (node 24)	Run npm test	2026-08-31T09:15:49.7506177Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'addObserve', 'definition', …(10) ] to deeply equal [ 'addObserve', 'definition', …(14) ]^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7506695Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7506948Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7507403Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7507857Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7508134Z ^[[33m@@ -3,16 +3,12 @@^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7508476Z ^[[2m    "definition",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7508756Z ^[[2m    "id",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7508997Z ^[[2m    "live",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7509294Z ^[[2m    "overrideValues",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7509648Z ^[[2m    "remove",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7510148Z ^[[32m-   "removeGoal",^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7510732Z ^[[32m-   "removeKeyframeGroup",^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7511155Z ^[[2m    "removeObserve",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7511485Z ^[[2m    "removeRequire",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7511780Z ^[[2m    "replace",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7512038Z ^[[2m    "requires",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7512300Z ^[[32m-   "setGoal",^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7512602Z ^[[32m-   "setKeyframeGroup",^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7512928Z ^[[2m    "setRequire",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7513417Z ^[[2m    "setValues",^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7513857Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7514056Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7514668Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m141:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7516113Z     ^[[90m139|^[[39m     ^[[35mconst^[[39m surface ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m.^[[39m^[[34msort^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7517521Z     ^[[90m140|^[[39m     const declared = [...NON_REFUSING, ...Object.keys(MEMBER_ARGUMENTS…
quality (node 24)	Run npm test	2026-08-31T09:15:49.7518696Z     ^[[90m141|^[[39m     ^[[34mexpect^[[39m(surface)^[[33m.^[[39m^[[34mtoEqual^[[39m(declared)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7519283Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7520084Z     ^[[90m142|^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7520819Z     ^[[90m143|^[[39m     // Collected rather than asserted one by one, so a red run names e…
quality (node 24)	Run npm test	2026-08-31T09:15:49.7521160Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7521403Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7521828Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7522350Z ^[[2m      Tests ^[[22m ^[[1m^[[31m10 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m830 passed^[[39m^[[22m^[[90m (840)^[[39m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7522883Z ^[[2m   Start at ^[[22m 09:15:30
quality (node 24)	Run npm test	2026-08-31T09:15:49.7523558Z ^[[2m   Duration ^[[22m 19.60s^[[2m (transform 2.51s, setup 1.18s, import 10.12s, tests 15.13s, environment 27ms)^[[22m
quality (node 24)	Run npm test	2026-08-31T09:15:49.7523959Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7523966Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7549780Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:154:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7559174Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7562276Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:177:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7564513Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7567043Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:200:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7568720Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7571240Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:223:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7573748Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7577973Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:257:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7580389Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7584426Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:276:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7586666Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7591014Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:302:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7593563Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7597824Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:343:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7600435Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7604471Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(9) ] to include 'setKeyframeGroup'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-group-edit.test.ts:140:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-group-edit.test.ts:384:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.7607091Z 
quality (node 24)	Run npm test	2026-08-31T09:15:49.7614106Z ##[error]AssertionError: expected [ 'addObserve', 'definition', …(10) ] to deeply equal [ 'addObserve', 'definition', …(14) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	@@ -3,16 +3,12 @@
quality (node 24)	Run npm test	    "definition",
quality (node 24)	Run npm test	    "id",
quality (node 24)	Run npm test	    "live",
quality (node 24)	Run npm test	    "overrideValues",
quality (node 24)	Run npm test	    "remove",
quality (node 24)	Run npm test	-   "removeGoal",
quality (node 24)	Run npm test	-   "removeKeyframeGroup",
quality (node 24)	Run npm test	    "removeObserve",
quality (node 24)	Run npm test	    "removeRequire",
quality (node 24)	Run npm test	    "replace",
quality (node 24)	Run npm test	    "requires",
quality (node 24)	Run npm test	-   "setGoal",
quality (node 24)	Run npm test	-   "setKeyframeGroup",
quality (node 24)	Run npm test	    "setRequire",
quality (node 24)	Run npm test	    "setValues",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:141:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T09:15:49.8122636Z ##[error]Process completed with exit code 1.
```
