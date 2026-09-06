# CI log archive: 34033788067

- Workflow: CI
- Conclusion: failure
- Head branch: chore/328-02-observable-outcomes
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/34033788067
- Captured: 2026-09-06T12:41:19Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-06T12:40:40.7105888Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-06T12:40:40.7106168Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-06T12:40:40.7128011Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-06T12:40:40.7128283Z env:
quality (node 24)	Run npm test	2026-09-06T12:40:40.7128479Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-06T12:40:40.7128681Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-06T12:40:40.8127973Z 
quality (node 24)	Run npm test	2026-09-06T12:40:40.8128453Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-06T12:40:40.8128755Z > vitest run
quality (node 24)	Run npm test	2026-09-06T12:40:40.8128885Z 
quality (node 24)	Run npm test	2026-09-06T12:40:41.0983694Z 
quality (node 24)	Run npm test	2026-09-06T12:40:41.0987298Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:41.0988021Z 
quality (node 24)	Run npm test	2026-09-06T12:40:41.4805293Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:41.8215874Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m40 tests^[[22m^[[2m)^[[22m^[[32m 64^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:41.8286541Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 61^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:42.1341389Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:42.2129384Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-06T12:40:42.2156305Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T12:40:42.2185447Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T12:40:42.2214869Z 
quality (node 24)	Run npm test	2026-09-06T12:40:42.2238180Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T12:40:42.2304863Z 
quality (node 24)	Run npm test	2026-09-06T12:40:42.2331781Z act(() => {
quality (node 24)	Run npm test	2026-09-06T12:40:42.2355144Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T12:40:42.2379195Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 104^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:42.2431136Z });
quality (node 24)	Run npm test	2026-09-06T12:40:42.2485161Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T12:40:42.2511306Z 
quality (node 24)	Run npm test	2026-09-06T12:40:42.2536433Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T12:40:42.2537458Z 
quality (node 24)	Run npm test	2026-09-06T12:40:42.4551548Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 351^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:42.5295121Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:42.6827004Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:42.9371299Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:43.1569034Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 150^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:43.4147992Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:43.6557474Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:43.9186694Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:44.2205175Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:44.4788676Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:44.7326811Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:45.0006780Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:45.2416890Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:45.5191334Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:45.7719048Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.0987331Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[33m 2610^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.0989725Z      ^[[33m^[[2m✓^[[22m^[[39m LF-16 leaves no authored schema in the repository on the retired form ^[[33m 2478^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.3075065Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.3371488Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m35 tests^[[22m^[[2m)^[[22m^[[33m 3950^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.3373827Z      ^[[33m^[[2m✓^[[22m^[[39m AE-24: requires exactly one original blob precondition per distinct path ^[[33m 306^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.3385717Z      ^[[33m^[[2m✓^[[22m^[[39m AE-26: rejects every supported CI-skip spelling including mixed case ^[[33m 457^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.3387484Z      ^[[33m^[[2m✓^[[22m^[[39m AE-27: control characters cannot inject workflow outputs through the subject ^[[33m 337^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.3399964Z      ^[[33m^[[2m✓^[[22m^[[39m AE-28: canonical paths reject traversal and line-oriented argument ambiguity ^[[33m 562^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.4787225Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 133^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.5566905Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.7365349Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.9721258Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 134^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:46.9856646Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:47.2662214Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 72^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:47.2783077Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:47.5436854Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:47.8871665Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 120^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:47.9589724Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 170^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:48.2356858Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:48.4230718Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:48.6036840Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 196^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:48.8082596Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:48.9900303Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:49.1302025Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:49.2943073Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:49.3356756Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:49.5428383Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:49.6256684Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:49.7729582Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:49.8706038Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.0206014Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.1227526Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.2726913Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.3257478Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.5149105Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[33m 2462^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.5150751Z      ^[[33m^[[2m✓^[[22m^[[39m declares the source helpers in one place and nowhere else ^[[33m 1440^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.5152002Z      ^[[33m^[[2m✓^[[22m^[[39m leaves no call to the retired two-bound helper anywhere in the suite ^[[33m 988^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.5297365Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.5644205Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.7255779Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.7707118Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:50.9301348Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.0094589Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.1176700Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.2632152Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.3098666Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4643437Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/automation-receipt.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m11 failed^[[39m^[[2m)^[[22m^[[33m 765^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4648457Z ^[[31m     ^[[31m×^[[31m AE-36: canonical identity ignores key order but preserves array order and edits^[[39m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4650543Z ^[[31m     ^[[31m×^[[31m AE-37: validation and formatter failure never claim publication or verified CI^[[39m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4652521Z ^[[31m     ^[[31m×^[[31m AE-38: a candidate without confirmed push remains ambiguous rather than absent^[[39m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4654757Z ^[[31m     ^[[31m×^[[31m AE-39: confirmed publication remains CI pending and survives report failure^[[39m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4656533Z      ^[[32m✓^[[39m AE-40: contradictory commits and malformed identities fail closed^[[32m 295^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4658110Z ^[[31m     ^[[31m×^[[31m AE-41: reruns have independent durable addresses^[[39m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4659766Z ^[[31m     ^[[31m×^[[31m AE-42: an older head or older run cannot replace the current summary^[[39m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4661579Z ^[[31m     ^[[31m×^[[31m AE-43: diagnostic fetch failure is unavailable, not captured command-error output^[[39m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4663621Z ^[[31m     ^[[31m×^[[31m AE-44: standalone diagnostics are bounded, chunked, escaped and redacted^[[39m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4665858Z ^[[31m     ^[[31m×^[[31m AE-45: truncation is explicit rather than misrepresented as complete logs^[[39m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4667792Z ^[[31m     ^[[31m×^[[31m AE-46: early setup failure remains identifiable without a parsed request^[[39m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.4669723Z ^[[31m     ^[[31m×^[[31m AE-47: CI conclusions stay distinct from publication and retain tested identity^[[39m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.5370184Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.5696704Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.6466673Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.7700155Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.7959126Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.8671544Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:51.9943542Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.0446659Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.0527493Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.1885504Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.2467157Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.2565781Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.4280181Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.4666566Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.6602853Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.7010813Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:52.8891742Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:53.0913639Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:53.4509677Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:53.4649178Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 289^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:53.6924006Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:53.7717147Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:54.0157945Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:54.0633103Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:54.2588161Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:54.3637188Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:54.5269553Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:54.6142201Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:54.8476919Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:54.8735441Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.1137313Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.2606423Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2834^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.2610275Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2831^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.3094261Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.5186565Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.5312738Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.5336716Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.7315178Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.7353387Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.7725641Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.9220889Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:55.9930332Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.0291893Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.1987465Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.2125898Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.2562320Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.3962214Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.4508552Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.4612644Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.6202912Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.6621482Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.6686772Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.7887000Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:56.9077082Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:57.0332600Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:57.1405408Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:57.2696713Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:57.3699301Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:57.6626827Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:57.8626609Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:57.9129023Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:58.1048895Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:58.1456305Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:58.4041648Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:58.4292466Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:58.6278223Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:58.6740393Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:58.9205600Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:58.9296638Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:59.1392377Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:59.2345665Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:59.3609924Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:59.5305850Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-06T12:40:59.5315782Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T12:40:59.5317207Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T12:40:59.5317827Z 
quality (node 24)	Run npm test	2026-09-06T12:40:59.5318544Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T12:40:59.5319276Z 
quality (node 24)	Run npm test	2026-09-06T12:40:59.5319554Z act(() => {
quality (node 24)	Run npm test	2026-09-06T12:40:59.5320209Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T12:40:59.5330380Z });
quality (node 24)	Run npm test	2026-09-06T12:40:59.5331084Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T12:40:59.5331601Z 
quality (node 24)	Run npm test	2026-09-06T12:40:59.5332815Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T12:40:59.5333999Z 
quality (node 24)	Run npm test	2026-09-06T12:40:59.5429431Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-06T12:40:59.5431850Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T12:40:59.5433142Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T12:40:59.5440778Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:59.5449893Z 
quality (node 24)	Run npm test	2026-09-06T12:40:59.5450717Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T12:40:59.5451799Z 
quality (node 24)	Run npm test	2026-09-06T12:40:59.5452045Z act(() => {
quality (node 24)	Run npm test	2026-09-06T12:40:59.5452530Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T12:40:59.5453079Z });
quality (node 24)	Run npm test	2026-09-06T12:40:59.5453516Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T12:40:59.5453854Z 
quality (node 24)	Run npm test	2026-09-06T12:40:59.5454944Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T12:40:59.5455853Z 
quality (node 24)	Run npm test	2026-09-06T12:40:59.5696485Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:59.7676026Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:59.7866982Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:40:59.9685674Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.0269525Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.1943119Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.2694378Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.4316461Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.5055063Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.7136272Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.7227312Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.9383612Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:00.9476665Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.1578267Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.2306611Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.3423890Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.4100510Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.5341080Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.6198911Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.7366935Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.8335142Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:01.9249744Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.0873420Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-06T12:41:02.0885934Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T12:41:02.0925773Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T12:41:02.0926697Z 
quality (node 24)	Run npm test	2026-09-06T12:41:02.0927407Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T12:41:02.0928081Z 
quality (node 24)	Run npm test	2026-09-06T12:41:02.0928346Z act(() => {
quality (node 24)	Run npm test	2026-09-06T12:41:02.0928901Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T12:41:02.0929476Z });
quality (node 24)	Run npm test	2026-09-06T12:41:02.0929960Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T12:41:02.0930344Z 
quality (node 24)	Run npm test	2026-09-06T12:41:02.0931406Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T12:41:02.0932364Z 
quality (node 24)	Run npm test	2026-09-06T12:41:02.0945168Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.1502344Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.2964211Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.4066792Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.5402721Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.5893321Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.7664966Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.8066679Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.9796078Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6142^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.9797725Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1629^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:02.9801381Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1641^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.0142644Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.1009121Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.2156722Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.3076523Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.4046630Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.5118766Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.5249602Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.5970788Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.7035011Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.7665769Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.7736424Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.8712194Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.9280356Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:03.9629718Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.0659884Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.1217205Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.1262569Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.2733283Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.3361307Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.3544380Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.4834219Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.5524688Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.5570625Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6290475Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6356671Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6357637Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 11 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6358058Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6362979Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-36: canonical identity ignores key order but preserves array order and edits
quality (node 24)	Run npm test	2026-09-06T12:41:04.6367996Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6368631Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6368929Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6369105Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6369729Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6370784Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6371689Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6372652Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6373708Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6374997Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6375759Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6376733Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6377625Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6378091Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6378501Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6378836Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6379023Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6379175Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6379892Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6380608Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6380864Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6381335Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6381570Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6381763Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6382160Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6382369Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6383173Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6427678Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6429007Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6430472Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6431749Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6433160Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6433979Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6435234Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m44:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6435964Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6436442Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6436801Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6438484Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-37: validation and formatter failure never claim publication or verified CI
quality (node 24)	Run npm test	2026-09-06T12:41:04.6440485Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6441070Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6441384Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6441542Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6442178Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6443228Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6444205Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6445296Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6446257Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6447079Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6447903Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6448824Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6449670Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6450173Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6450616Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6451011Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6451199Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6451421Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6452083Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6452444Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6452685Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6453114Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6453357Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6453526Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6453901Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6454080Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6457892Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6459442Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6460763Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6462223Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6463407Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6464988Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6465804Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6466817Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m55:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6467576Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6468019Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6468494Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6470158Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-38: a candidate without confirmed push remains ambiguous rather than absent
quality (node 24)	Run npm test	2026-09-06T12:41:04.6471980Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6472632Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6472998Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6473141Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6473712Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6474973Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6475685Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6476441Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6477208Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6477931Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6478646Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6479547Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6480404Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6480842Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6481368Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6481731Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6481884Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6482017Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6482760Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6483087Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6483308Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6483679Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6483868Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6484016Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6484318Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6484669Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6485459Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6486800Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6487927Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6489188Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6490176Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6494093Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6495196Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6496102Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m63:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6496685Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6497081Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6497391Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6498949Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-39: confirmed publication remains CI pending and survives report failure
quality (node 24)	Run npm test	2026-09-06T12:41:04.6500601Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6501197Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6501495Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6501654Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6502229Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6503514Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6504368Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6505448Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6506396Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6507216Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6507855Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6508705Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6509549Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6510080Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6510502Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6510855Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6511034Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6511188Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6512097Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6512456Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6512658Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6513056Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6513254Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6513433Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6513772Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6513969Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6514899Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6516349Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6517641Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6519028Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6520192Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6521353Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6522179Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6523142Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m71:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6523790Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6524188Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6524674Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6526097Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-41: reruns have independent durable addresses
quality (node 24)	Run npm test	2026-09-06T12:41:04.6527637Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6528196Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6528519Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6528712Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6529311Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6530243Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6531026Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6531961Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6532896Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6533633Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6534304Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6535378Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6536168Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6536648Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6537047Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6537364Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6537526Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6537664Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6538304Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6538911Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6539173Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6539590Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6539785Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6539962Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6540299Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6540488Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6541289Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6542570Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6543852Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6545552Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6546768Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6548100Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6548949Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6549957Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m105:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6550574Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6551007Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6551339Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6553116Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-42: an older head or older run cannot replace the current summary
quality (node 24)	Run npm test	2026-09-06T12:41:04.6555097Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6555718Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6556063Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6556221Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6556876Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6557885Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6558768Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6559731Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6560698Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6561493Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6562237Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6563143Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6563981Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6564686Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6565104Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6565463Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6565637Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6565791Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6566402Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6566790Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6567024Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6567409Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6567636Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6567814Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6568165Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6568339Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6569106Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6570453Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6571718Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6573149Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6574253Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6575465Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6576451Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6577390Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m113:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6577967Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6578360Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6578698Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6580367Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-43: diagnostic fetch failure is unavailable, not captured command-error output
quality (node 24)	Run npm test	2026-09-06T12:41:04.6582058Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6582615Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6582957Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6583136Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6583761Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6585080Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6585926Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6586872Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6587814Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6588525Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6589136Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6589984Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6590778Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6591278Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6591685Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6592013Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6592163Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6592286Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6592896Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6593236Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6593480Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6593898Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6594122Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6594312Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6594861Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6595077Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6595875Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6597264Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6598550Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6599935Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6601066Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6602136Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6602930Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6603891Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m127:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6604692Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6605133Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6605445Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6606952Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-44: standalone diagnostics are bounded, chunked, escaped and redacted
quality (node 24)	Run npm test	2026-09-06T12:41:04.6608630Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6609149Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6609425Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6609564Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6610112Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6611052Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6612036Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6612918Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6613793Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6614738Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6615431Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6616200Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6617006Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6617477Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6617873Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6618179Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6618284Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6618377Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6619075Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6619290Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6619428Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6619680Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6619812Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6619953Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6620317Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6620511Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6621374Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6622842Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6624044Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6625645Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6626795Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6627898Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6628704Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6629679Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m138:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6630297Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6630705Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6631043Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6632678Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-45: truncation is explicit rather than misrepresented as complete logs
quality (node 24)	Run npm test	2026-09-06T12:41:04.6634535Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6635141Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6635460Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6635630Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6636252Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6637258Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6638130Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6639085Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6640019Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6640800Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6641558Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6642477Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6643284Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6643807Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6644178Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6644615Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6644793Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6644940Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6645599Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6646244Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6646475Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6646939Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6647166Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6647355Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6647719Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6647915Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6648748Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6650170Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6651602Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6653112Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6654294Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6655728Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6656432Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6657351Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m150:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6657948Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6658346Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6658687Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6660279Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-46: early setup failure remains identifiable without a parsed request
quality (node 24)	Run npm test	2026-09-06T12:41:04.6661937Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6662515Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6662815Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6662982Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6663576Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6664710Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6665551Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6666239Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6666762Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6667201Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6667608Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6668121Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6668581Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6668868Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6669104Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6669301Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6669402Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6669486Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6669839Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6670044Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6670169Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6670415Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6670542Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6670648Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6670967Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6671147Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6671840Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6673084Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6674304Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6675872Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6676966Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6677944Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6678893Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6679812Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m158:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6680405Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6680786Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6681119Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6682732Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-receipt.test.ts^[[2m > ^[[22mautomation receipt contracts^[[2m > ^[[22mAE-47: CI conclusions stay distinct from publication and retain tested identity
quality (node 24)	Run npm test	2026-09-06T12:41:04.6684362Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	2026-09-06T12:41:04.6685093Z   throw err;
quality (node 24)	Run npm test	2026-09-06T12:41:04.6685411Z   ^
quality (node 24)	Run npm test	2026-09-06T12:41:04.6685556Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6686134Z Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	2026-09-06T12:41:04.6687233Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6688053Z     at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6688909Z     at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6689782Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6690544Z     at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6691219Z     at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6692089Z     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	2026-09-06T12:41:04.6692866Z     at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6693338Z   code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	2026-09-06T12:41:04.6693725Z   requireStack: []
quality (node 24)	Run npm test	2026-09-06T12:41:04.6694069Z }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6694232Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6694371Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T12:41:04.6695084Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6695431Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6695640Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6696020Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6696229Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6696397Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6696747Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6696925Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6697678Z ^[[36m ^[[2m❯^[[22m run packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m24:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6698944Z     ^[[90m 22|^[[39m ^[[35mfunction^[[39m ^[[34mrun^[[39m(command^[[33m:^[[39m string^[[33m,^[[39m input^[[33m:^[[39m unknown) {
quality (node 24)	Run npm test	2026-09-06T12:41:04.6700149Z     ^[[90m 23|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34minvoke^[[39m(command^[[33m,^[[39m input)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6701628Z     ^[[90m 24|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6702764Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6703822Z     ^[[90m 25|^[[39m   ^[[35mreturn^[[39m ^[[33mJSON^[[39m^[[33m.^[[39m^[[34mparse^[[39m(result^[[33m.^[[39mstdout)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6704830Z     ^[[90m 26|^[[39m }
quality (node 24)	Run npm test	2026-09-06T12:41:04.6705809Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-receipt.test.ts:^[[2m174:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6706383Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6706771Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/11]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6707105Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6707150Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6707885Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m186 passed^[[39m^[[22m^[[90m (187)^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6709109Z ^[[2m      Tests ^[[22m ^[[1m^[[31m11 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m1020 passed^[[39m^[[22m^[[90m (1031)^[[39m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6709911Z ^[[2m   Start at ^[[22m 12:40:41
quality (node 24)	Run npm test	2026-09-06T12:41:04.6710974Z ^[[2m   Duration ^[[22m 23.51s^[[2m (transform 2.78s, setup 1.11s, import 15.13s, tests 23.74s, environment 25ms)^[[22m
quality (node 24)	Run npm test	2026-09-06T12:41:04.6711572Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6711627Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6752331Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:44:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6767536Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6779879Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:55:23
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6786042Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6797875Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:63:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6804047Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6813422Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:71:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6819676Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6828667Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:105:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6832570Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6842308Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:113:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6848548Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6862745Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:127:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6869074Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6875875Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:138:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6880284Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6887228Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:150:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6890772Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6897877Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:158:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.6901532Z 
quality (node 24)	Run npm test	2026-09-06T12:41:04.6908949Z ##[error]AssertionError: node:internal/modules/cjs/loader:1568
quality (node 24)	Run npm test	  throw err;
quality (node 24)	Run npm test	  ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Error: Cannot find module '/home/runner/work/motion5/motion5/scripts/automation-receipt.mjs'
quality (node 24)	Run npm test	    at Module._resolveFilename (node:internal/modules/cjs/loader:1564:15)
quality (node 24)	Run npm test	    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
quality (node 24)	Run npm test	    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
quality (node 24)	Run npm test	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
quality (node 24)	Run npm test	    at Module._load (node:internal/modules/cjs/loader:1341:5)
quality (node 24)	Run npm test	    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
quality (node 24)	Run npm test	    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
quality (node 24)	Run npm test	    at node:internal/main/run_main_module:33:47 {
quality (node 24)	Run npm test	  code: 'MODULE_NOT_FOUND',
quality (node 24)	Run npm test	  requireStack: []
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ run packages/core/test/unit/scripts/automation-receipt.test.ts:24:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-receipt.test.ts:174:23
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T12:41:04.7175096Z ##[error]Process completed with exit code 1.
```
