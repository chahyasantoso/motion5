# CI log archive: 33959902284

- Workflow: CI
- Conclusion: failure
- Head branch: fix/314-source-region-anchors
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33959902284
- Captured: 2026-09-05T10:10:44Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-05T10:10:11.4842521Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-05T10:10:11.4842825Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-05T10:10:11.4880705Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-05T10:10:11.4881007Z env:
quality (node 24)	Run npm test	2026-09-05T10:10:11.4881209Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-05T10:10:11.4881425Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-05T10:10:11.6030920Z 
quality (node 24)	Run npm test	2026-09-05T10:10:11.6031528Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-05T10:10:11.6031985Z > vitest run
quality (node 24)	Run npm test	2026-09-05T10:10:11.6032204Z 
quality (node 24)	Run npm test	2026-09-05T10:10:11.9325848Z 
quality (node 24)	Run npm test	2026-09-05T10:10:11.9331657Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:11.9332693Z 
quality (node 24)	Run npm test	2026-09-05T10:10:12.3226547Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:12.5897346Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m16 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:12.6127076Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:12.7558551Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-05T10:10:12.7561368Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:10:12.7569091Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:10:12.7586303Z 
quality (node 24)	Run npm test	2026-09-05T10:10:12.7599769Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:10:12.7600829Z 
quality (node 24)	Run npm test	2026-09-05T10:10:12.7601392Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:10:12.7625920Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:10:12.7629632Z });
quality (node 24)	Run npm test	2026-09-05T10:10:12.7655543Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:10:12.7682354Z 
quality (node 24)	Run npm test	2026-09-05T10:10:12.7696440Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:10:12.7697864Z 
quality (node 24)	Run npm test	2026-09-05T10:10:12.7940787Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 125^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:12.8866632Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:12.9862184Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.0587174Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.1861151Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.2890192Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.3592519Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.4554006Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.5528072Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.7055786Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.7107370Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.8160692Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:13.9702986Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:14.1362492Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 61^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:14.2608405Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:14.4065182Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:14.4904044Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:14.6280834Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:14.7931304Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:14.8941875Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 995^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:14.9367049Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.0561602Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.2699197Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.2963024Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.3662681Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.5123075Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.5680874Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.6137157Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.8010515Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.8725970Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:15.8828037Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 160^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.0146690Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.1006845Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.1073354Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.3131626Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.3397452Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.4539317Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.5692259Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.6769343Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 56^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.7330910Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.8127008Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:16.9065601Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.0141614Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.0842057Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.1489452Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.2974458Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.3503096Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.3825356Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.5332417Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.5508370Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.6573451Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.7415177Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.8530214Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.9323915Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:17.9596465Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.1225353Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.1643337Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.2218888Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.3917818Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.4016451Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.4628029Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.6126964Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.6904250Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.6963887Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.8352029Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.9155346Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:18.9257378Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:19.1278942Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:19.1737345Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:19.4086977Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:19.4166806Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:19.6237198Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:19.6360320Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:19.8980957Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:20.0336056Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:20.1811085Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:20.3367110Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:20.5586995Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:20.6658443Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:20.7862598Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.0240822Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.0727226Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.0735235Z ^[[31m     ^[[31m×^[[31m declares the region helpers in one place and nowhere else^[[39m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.0737747Z ^[[31m     ^[[31m×^[[31m leaves no call to the retired two-bound helper anywhere in the suite^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.0739785Z ^[[31m     ^[[31m×^[[31m reads source through the one owner, and records the readers that do not yet^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.3016718Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.3595825Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.6212091Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.6506944Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.8818791Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:21.9504389Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.2090858Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.2318859Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.4204383Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3337^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.4205917Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3334^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.4539920Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.5137583Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.6106848Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.7393902Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.7637561Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.8935352Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:22.9985802Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.0527089Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.1614963Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.1850751Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.3299640Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.3827032Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.4857526Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.5312812Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.6126371Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.6928474Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.8643604Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:23.9168214Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:24.1027707Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:24.2067950Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:24.3467002Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:24.4417779Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:24.5799435Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:24.7533471Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:24.8157300Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:24.9976241Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:25.1537900Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:25.3137915Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:25.4347812Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:25.6573899Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:25.6838488Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:25.9550585Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:25.9905085Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:26.2327052Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:26.2407374Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:26.4869888Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:26.5531252Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-05T10:10:26.5542285Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:10:26.5544354Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:10:26.5550817Z 
quality (node 24)	Run npm test	2026-09-05T10:10:26.5552392Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:10:26.5553303Z 
quality (node 24)	Run npm test	2026-09-05T10:10:26.5553702Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:10:26.5554437Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:10:26.5555489Z });
quality (node 24)	Run npm test	2026-09-05T10:10:26.5556177Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:10:26.5556732Z 
quality (node 24)	Run npm test	2026-09-05T10:10:26.5558061Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:10:26.5559377Z 
quality (node 24)	Run npm test	2026-09-05T10:10:26.5726886Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-05T10:10:26.5732914Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:10:26.5735150Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:10:26.5735966Z 
quality (node 24)	Run npm test	2026-09-05T10:10:26.5736816Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:10:26.5737678Z 
quality (node 24)	Run npm test	2026-09-05T10:10:26.5738049Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:10:26.5738693Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:10:26.5739392Z });
quality (node 24)	Run npm test	2026-09-05T10:10:26.5740254Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:10:26.5740903Z 
quality (node 24)	Run npm test	2026-09-05T10:10:26.5742185Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:10:26.5743435Z 
quality (node 24)	Run npm test	2026-09-05T10:10:26.5786176Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:26.7280245Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:26.8460702Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:26.9927521Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:27.0999338Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:27.2056871Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:27.3056879Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:27.4980510Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:27.5307922Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:27.7255541Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:27.8397051Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:27.9529025Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:28.1170887Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:28.2216451Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:28.4149004Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:28.4272976Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:28.6426259Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:28.6651581Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:28.8636315Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:28.9407308Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:29.0871540Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:29.1508907Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:29.3127889Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:29.3957058Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-05T10:10:29.3958987Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:10:29.3963187Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:10:29.3974964Z 
quality (node 24)	Run npm test	2026-09-05T10:10:29.3987008Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:10:29.3995987Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:29.4031094Z 
quality (node 24)	Run npm test	2026-09-05T10:10:29.4043035Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:10:29.4043656Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:10:29.4044250Z });
quality (node 24)	Run npm test	2026-09-05T10:10:29.4045018Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:10:29.4045417Z 
quality (node 24)	Run npm test	2026-09-05T10:10:29.4046531Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:10:29.4047651Z 
quality (node 24)	Run npm test	2026-09-05T10:10:29.5588588Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:29.6336740Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:29.7946339Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:29.8987292Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.0395671Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.1187149Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.2717345Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.3979173Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.6004182Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.6149032Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.7216760Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 7012^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.7226698Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1894^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.7228584Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1812^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.8149797Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.8343859Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:30.9288368Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.0276877Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.0406142Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.1928893Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.2173998Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.2382599Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.3914240Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.4252524Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.4317254Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.5747698Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.6245953Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.6507442Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.7714357Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.8971226Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.9227079Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:31.9881363Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1372329Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1456938Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1577554Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1641139Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1641985Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1642314Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1646660Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/source-region-anchors.test.ts^[[2m > ^[[22msource-region anchors^[[2m > ^[[22mdeclares the region helpers in one place and nowhere else
quality (node 24)	Run npm test	2026-09-05T10:10:32.1652123Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(7) ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1652705Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1652963Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1653468Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1653726Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1653938Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1654331Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1655235Z ^[[31m+   "packages/core/test/contract/gsap-patch-keys.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1655939Z ^[[31m+   "packages/core/test/unit/domain/track-live-values.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1656673Z ^[[31m+   "packages/core/test/unit/graph/solved-rotation-weight.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1657367Z ^[[31m+   "packages/core/test/unit/plugins/angle-blend.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1658049Z ^[[31m+   "packages/core/test/unit/plugins/pivot-offset-solve.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1658771Z ^[[31m+   "packages/core/test/unit/runtime/live-value-updates.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1659713Z ^[[31m+   "packages/core/test/unit/runtime/stale-track-handle.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1660175Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1660320Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1660869Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/source-region-anchors.test.ts:^[[2m77:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1685466Z     ^[[90m 75|^[[39m   it("declares the region helpers in one place and nowhere else", () =…
quality (node 24)	Run npm test	2026-09-05T10:10:32.1686578Z     ^[[90m 76|^[[39m     const offenders = testFiles().filter((file) => REDECLARED.test(sou…
quality (node 24)	Run npm test	2026-09-05T10:10:32.1687816Z     ^[[90m 77|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1688471Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1688842Z     ^[[90m 78|^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1689327Z     ^[[90m 79|^[[39m     // The owner exists and exports all three, so a green run above is…
quality (node 24)	Run npm test	2026-09-05T10:10:32.1689681Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1689944Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1690195Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1691489Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/source-region-anchors.test.ts^[[2m > ^[[22msource-region anchors^[[2m > ^[[22mleaves no call to the retired two-bound helper anywhere in the suite
quality (node 24)	Run npm test	2026-09-05T10:10:32.1693321Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(3) ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1693943Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1694224Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1694908Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1695151Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1695339Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1695718Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1696209Z ^[[31m+   "packages/core/test/unit/domain/track-live-values.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1696883Z ^[[31m+   "packages/core/test/unit/runtime/live-value-updates.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1697553Z ^[[31m+   "packages/core/test/unit/runtime/stale-track-handle.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1697986Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1698120Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1698613Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/source-region-anchors.test.ts:^[[2m87:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1699549Z     ^[[90m 85|^[[39m   it("leaves no call to the retired two-bound helper anywhere in the s…
quality (node 24)	Run npm test	2026-09-05T10:10:32.1700233Z     ^[[90m 86|^[[39m     const offenders = testFiles().filter((file) => RETIRED_CALL.test(s…
quality (node 24)	Run npm test	2026-09-05T10:10:32.1701056Z     ^[[90m 87|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1701689Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1702079Z     ^[[90m 88|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1702387Z     ^[[90m 89|^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1702525Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1702774Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1703001Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1703985Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/source-region-anchors.test.ts^[[2m > ^[[22msource-region anchors^[[2m > ^[[22mreads source through the one owner, and records the readers that do not yet
quality (node 24)	Run npm test	2026-09-05T10:10:32.1706358Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(7) ] to deeply equal [ …(2) ]^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1706705Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1706951Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1707459Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1707719Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1707900Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1708389Z ^[[31m+   "packages/core/test/contract/gsap-patch-keys.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1709423Z ^[[2m    "packages/core/test/integration/bare-authored-leaf.test.ts",^[[22m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1715389Z ^[[2m    "packages/core/test/integration/plugin-group-values-section.test.ts",^[[22m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1716566Z ^[[31m+   "packages/core/test/unit/domain/track-live-values.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1717233Z ^[[31m+   "packages/core/test/unit/runtime/handle-base.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1717907Z ^[[31m+   "packages/core/test/unit/runtime/live-value-updates.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1719146Z ^[[31m+   "packages/core/test/unit/runtime/stale-track-handle.test.ts",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1719906Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1720100Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1720619Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/source-region-anchors.test.ts:^[[2m97:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1721186Z     ^[[90m 95|^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1721951Z     ^[[90m 96|^[[39m     const unmigrated = readers.filter((file) => !sourceOf(file).includ…
quality (node 24)	Run npm test	2026-09-05T10:10:32.1723222Z     ^[[90m 97|^[[39m     ^[[34mexpect^[[39m(unmigrated^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[33m...^[[39m^[[33mPENDING^[[39m]^[[33m.^[[39m^[[34msort^[[39m())^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1724012Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1725187Z     ^[[90m 98|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1725843Z     ^[[90m 99|^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1726154Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1726509Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1726771Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1726800Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1727301Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m185 passed^[[39m^[[22m^[[90m (186)^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1728133Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m950 passed^[[39m^[[22m^[[90m (953)^[[39m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1728715Z ^[[2m   Start at ^[[22m 10:10:11
quality (node 24)	Run npm test	2026-09-05T10:10:32.1729504Z ^[[2m   Duration ^[[22m 20.20s^[[2m (transform 2.68s, setup 1.25s, import 10.79s, tests 15.41s, environment 34ms)^[[22m
quality (node 24)	Run npm test	2026-09-05T10:10:32.1729935Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1745143Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1775481Z ##[error]AssertionError: expected [ …(7) ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "packages/core/test/contract/gsap-patch-keys.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/domain/track-live-values.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/graph/solved-rotation-weight.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/plugins/angle-blend.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/plugins/pivot-offset-solve.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/runtime/live-value-updates.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/runtime/stale-track-handle.test.ts",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/source-region-anchors.test.ts:77:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T10:10:32.1784471Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1788372Z ##[error]AssertionError: expected [ …(3) ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "packages/core/test/unit/domain/track-live-values.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/runtime/live-value-updates.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/runtime/stale-track-handle.test.ts",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/source-region-anchors.test.ts:87:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T10:10:32.1790214Z 
quality (node 24)	Run npm test	2026-09-05T10:10:32.1797031Z ##[error]AssertionError: expected [ …(7) ] to deeply equal [ …(2) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	+   "packages/core/test/contract/gsap-patch-keys.test.ts",
quality (node 24)	Run npm test	    "packages/core/test/integration/bare-authored-leaf.test.ts",
quality (node 24)	Run npm test	    "packages/core/test/integration/plugin-group-values-section.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/domain/track-live-values.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/runtime/handle-base.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/runtime/live-value-updates.test.ts",
quality (node 24)	Run npm test	+   "packages/core/test/unit/runtime/stale-track-handle.test.ts",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/source-region-anchors.test.ts:97:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T10:10:32.2266602Z ##[error]Process completed with exit code 1.
```
