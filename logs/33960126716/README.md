# CI log archive: 33960126716

- Workflow: CI
- Conclusion: failure
- Head branch: fix/314-source-region-anchors
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33960126716
- Captured: 2026-09-05T10:16:00Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-05T10:15:27.5992667Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-05T10:15:27.5992958Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-05T10:15:27.6030923Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-05T10:15:27.6031194Z env:
quality (node 24)	Run npm test	2026-09-05T10:15:27.6031400Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-05T10:15:27.6031605Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-05T10:15:27.7130491Z 
quality (node 24)	Run npm test	2026-09-05T10:15:27.7131187Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-05T10:15:27.7131780Z > vitest run
quality (node 24)	Run npm test	2026-09-05T10:15:27.7132042Z 
quality (node 24)	Run npm test	2026-09-05T10:15:28.0511543Z 
quality (node 24)	Run npm test	2026-09-05T10:15:28.0516090Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:28.0516729Z 
quality (node 24)	Run npm test	2026-09-05T10:15:28.4272259Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:28.7049172Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:28.7122027Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m16 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:28.8652720Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-05T10:15:28.8656145Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:15:28.8665596Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:15:28.8679257Z 
quality (node 24)	Run npm test	2026-09-05T10:15:28.8680187Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:15:28.8681192Z 
quality (node 24)	Run npm test	2026-09-05T10:15:28.8681781Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:15:28.8682575Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:15:28.8705149Z });
quality (node 24)	Run npm test	2026-09-05T10:15:28.8735212Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:15:28.8765100Z 
quality (node 24)	Run npm test	2026-09-05T10:15:28.8766692Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:15:28.8795038Z 
quality (node 24)	Run npm test	2026-09-05T10:15:28.8908503Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 135^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.0117549Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.0380085Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 69^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.1212557Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.2893011Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.3416932Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.4599949Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 61^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.5814204Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.5849853Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.7637291Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.8344981Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:29.8487857Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:30.0506492Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:30.1612196Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:30.3044849Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:30.3943962Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:30.5552391Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:30.6226866Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:30.8423152Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:30.9595915Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.0183722Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 1050^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.1096560Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 67^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.3297046Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.3523188Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.3995874Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.5778903Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.6043937Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.6517048Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.8349712Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:31.9154918Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.0042719Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 168^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.0682135Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.1339157Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.2030795Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.3921012Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.4237420Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.4936155Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.6454360Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.7151312Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.7837516Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.9115829Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:32.9523209Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.0512821Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.1563792Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.1931330Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.3507427Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.3997080Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.4207488Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.5727039Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.6140601Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.7115996Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.7705390Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.9041552Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.9757417Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:33.9907635Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.1823616Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.2236863Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.2408136Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.4426739Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.4486674Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.5135545Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.6513338Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.7196419Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.7456758Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.8937647Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.9526931Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:34.9782311Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:35.1248197Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:35.2426725Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:35.4119950Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:35.5040830Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:35.6096938Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:35.7691694Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:35.8581237Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:36.1546825Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:36.1606371Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:36.4333480Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:36.4996442Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:36.7327448Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:36.7570102Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.0106918Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.0176649Z ^[[31m     ^[[31m×^[[31m declares the region helpers in one place and nowhere else^[[39m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.0186082Z      ^[[32m✓^[[39m leaves no call to the retired two-bound helper anywhere in the suite^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.0189242Z      ^[[32m✓^[[39m reads source through the one owner, and records the readers that do not yet^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.0565589Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.2806126Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.3637036Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.6253422Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.6518336Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.8566397Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:37.9185016Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.1854067Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.2042844Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.3760002Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3222^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.3762694Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3218^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.4348475Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.4988776Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.5709341Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.6976360Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.7503734Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.8448291Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:38.9597994Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.0107176Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.1181347Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.1638013Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.2725851Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.3637450Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.4556705Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.4661356Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.5765623Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.6943395Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.8186746Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:39.8948763Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:40.0667714Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:40.1735995Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:40.3167102Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:40.4166590Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:40.5552977Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:40.7436755Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:40.7923328Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:40.9973089Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:41.0430249Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:41.3615046Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:41.4240726Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:41.6312724Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:41.6609259Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:41.9287334Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:41.9662211Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:42.1986157Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:42.2154965Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:42.4439913Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:42.5696728Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-05T10:15:42.5715910Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:15:42.5735573Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:15:42.5736454Z 
quality (node 24)	Run npm test	2026-09-05T10:15:42.5737457Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:15:42.5738488Z 
quality (node 24)	Run npm test	2026-09-05T10:15:42.5738910Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:15:42.5739684Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:15:42.5740474Z });
quality (node 24)	Run npm test	2026-09-05T10:15:42.5741119Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:15:42.5741683Z 
quality (node 24)	Run npm test	2026-09-05T10:15:42.5743018Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:15:42.5744326Z 
quality (node 24)	Run npm test	2026-09-05T10:15:42.5875212Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-05T10:15:42.5884239Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:15:42.5904030Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:42.5914935Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:15:42.5947518Z 
quality (node 24)	Run npm test	2026-09-05T10:15:42.5948405Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:15:42.5950585Z 
quality (node 24)	Run npm test	2026-09-05T10:15:42.5951048Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:15:42.5951792Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:15:42.5952523Z });
quality (node 24)	Run npm test	2026-09-05T10:15:42.5953164Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:15:42.5953715Z 
quality (node 24)	Run npm test	2026-09-05T10:15:42.5955180Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:15:42.5956301Z 
quality (node 24)	Run npm test	2026-09-05T10:15:42.6686591Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:42.8143672Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:42.8859217Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:43.0823481Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:43.1325757Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:43.3313962Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:43.4066790Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:43.5615367Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:43.6276172Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:43.8357171Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:43.8853917Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.0631380Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.1261679Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.3506568Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.3742108Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.5381512Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.5856906Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.7322458Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.8655289Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:44.9164339Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.0485581Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.1511827Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.3047118Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-05T10:15:45.3106123Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:15:45.3108051Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.3122749Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:15:45.3144915Z 
quality (node 24)	Run npm test	2026-09-05T10:15:45.3187783Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:15:45.3213011Z 
quality (node 24)	Run npm test	2026-09-05T10:15:45.3213438Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:15:45.3246561Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:15:45.3265420Z });
quality (node 24)	Run npm test	2026-09-05T10:15:45.3265981Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:15:45.3266390Z 
quality (node 24)	Run npm test	2026-09-05T10:15:45.3267568Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:15:45.3268628Z 
quality (node 24)	Run npm test	2026-09-05T10:15:45.3949059Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.5194803Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.6756942Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.7566830Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.8914062Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:45.9954319Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.1324124Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.2507949Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.3556611Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6731^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.3566921Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1761^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.3569281Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1852^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.4456954Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.4557156Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.5665841Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.6499639Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.6736854Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.7753543Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.8513989Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.9320920Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:46.9806759Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.0426991Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.1171973Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.1805139Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.2380800Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.3202810Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.3913281Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.4286841Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.5555677Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.6412108Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.6586625Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.8035639Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.8747669Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.8776162Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9543874Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9598582Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9599716Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9600670Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9604744Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/source-region-anchors.test.ts^[[2m > ^[[22msource-region anchors^[[2m > ^[[22mdeclares the region helpers in one place and nowhere else
quality (node 24)	Run npm test	2026-09-05T10:15:47.9612395Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(3) ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9613373Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9613693Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9614215Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9614754Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9614998Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9615452Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9616397Z ^[[31m+   "packages/core/test/unit/graph/solved-rotation-weight.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9617636Z ^[[31m+   "packages/core/test/unit/plugins/angle-blend.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9618861Z ^[[31m+   "packages/core/test/unit/plugins/pivot-offset-solve.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9619646Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9619865Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9620757Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/source-region-anchors.test.ts:^[[2m77:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9650598Z     ^[[90m 75|^[[39m   it("declares the region helpers in one place and nowhere else", () =…
quality (node 24)	Run npm test	2026-09-05T10:15:47.9652339Z     ^[[90m 76|^[[39m     const offenders = testFiles().filter((file) => REDECLARED.test(sou…
quality (node 24)	Run npm test	2026-09-05T10:15:47.9653832Z     ^[[90m 77|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9655277Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9655938Z     ^[[90m 78|^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9656701Z     ^[[90m 79|^[[39m     // The owner exists and exports all three, so a green run above is…
quality (node 24)	Run npm test	2026-09-05T10:15:47.9657231Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9657663Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9658056Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9658100Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9663156Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m185 passed^[[39m^[[22m^[[90m (186)^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9671298Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m952 passed^[[39m^[[22m^[[90m (953)^[[39m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9672297Z ^[[2m   Start at ^[[22m 10:15:28
quality (node 24)	Run npm test	2026-09-05T10:15:47.9676064Z ^[[2m   Duration ^[[22m 19.88s^[[2m (transform 2.64s, setup 1.23s, import 10.59s, tests 15.15s, environment 30ms)^[[22m
quality (node 24)	Run npm test	2026-09-05T10:15:47.9678046Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9701802Z 
quality (node 24)	Run npm test	2026-09-05T10:15:47.9728439Z ##[error]AssertionError: expected [ …(3) ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "packages/core/test/unit/graph/solved-rotation-weight.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/plugins/angle-blend.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/plugins/pivot-offset-solve.test.ts",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/source-region-anchors.test.ts:77:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T10:15:48.0278276Z ##[error]Process completed with exit code 1.
```
