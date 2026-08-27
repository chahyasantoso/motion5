# CI log archive: 33062757144

- Workflow: CI
- Conclusion: failure
- Head branch: feat/c2-resolve-solvers-diagnostics
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33062757144
- Captured: 2026-08-27T10:23:21Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-27T10:22:53.4772786Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-27T10:22:53.4773104Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-27T10:22:53.4811635Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-27T10:22:53.4811910Z env:
quality (node 24)	Run npm test	2026-08-27T10:22:53.4812115Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-27T10:22:53.4812325Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-27T10:22:53.5959268Z 
quality (node 24)	Run npm test	2026-08-27T10:22:53.5959687Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-27T10:22:53.5960040Z > vitest run
quality (node 24)	Run npm test	2026-08-27T10:22:53.5960200Z 
quality (node 24)	Run npm test	2026-08-27T10:22:53.9195891Z 
quality (node 24)	Run npm test	2026-08-27T10:22:53.9200432Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:53.9201191Z 
quality (node 24)	Run npm test	2026-08-27T10:22:54.4575600Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:54.4694754Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:54.4834667Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:54.6677323Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:54.7089040Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:54.7752296Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:54.9949572Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-27T10:22:54.9991867Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T10:22:54.9993958Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:54.9995525Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T10:22:54.9996262Z 
quality (node 24)	Run npm test	2026-08-27T10:22:54.9996946Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T10:22:54.9997577Z 
quality (node 24)	Run npm test	2026-08-27T10:22:54.9997896Z act(() => {
quality (node 24)	Run npm test	2026-08-27T10:22:54.9998362Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T10:22:54.9998817Z });
quality (node 24)	Run npm test	2026-08-27T10:22:54.9999242Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T10:22:54.9999457Z 
quality (node 24)	Run npm test	2026-08-27T10:22:55.0000041Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T10:22:55.0000596Z 
quality (node 24)	Run npm test	2026-08-27T10:22:55.0115282Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 65^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.0399516Z  ^[[31m❯^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.0424533Z ^[[31m     ^[[31m×^[[31m RS-1 derives solves on solver node root-most first and nowhere else^[[39m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.0427240Z ^[[31m     ^[[31m×^[[31m RS-2 reports all five IK diagnostics with correct ruleId, path, and participant ids^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.0453956Z ^[[31m     ^[[31m×^[[31m RS-3 solves derivation is deterministic under track permutation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.0496934Z ^[[31m     ^[[31m×^[[31m RS-4 produces identical solves when reconstructed from a graph snapshot^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.0505340Z ^[[31m     ^[[31m×^[[31m RS-5 rebuild after removing a solver binding updates solves without stale cache mutation^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.0507943Z ^[[31m     ^[[31m×^[[31m RS-6 both buildGraphIR and IncrementalGraphBuilder produce identical solves across corpus^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.2252383Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.2656800Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.3765393Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 143^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.4457063Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.5048685Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.6208668Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.7117877Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.7211080Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.8514748Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.9336808Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:55.9508966Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.1404230Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.1515301Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.1897069Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.3582321Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.4133829Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.4200179Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.5718800Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.6563948Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.6716910Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.7691751Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:56.8674821Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:57.0679403Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:57.0843609Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:57.3095662Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:57.3534845Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:57.5554792Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:57.5611346Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:57.7868985Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:57.8164129Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:58.0474761Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:58.1339616Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:58.3322304Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:58.3777772Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:58.5964863Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:58.6834073Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:58.8234783Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:58.9540518Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.1194719Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.1770539Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.3614801Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.4687230Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.6360558Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.7308987Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.8367098Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2857^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.8397259Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2854^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.9037538Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:22:59.9481123Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.0516698Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.1353980Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.1963407Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.2757434Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.3212745Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.4159004Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.5477961Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.6245520Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.8072144Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:00.8824398Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:01.1057843Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:01.1543133Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:01.3248178Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:01.4166989Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:01.5620045Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:01.7011283Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:01.8396663Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:01.9145329Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:02.0875175Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:02.1920583Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:02.3574773Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:02.4437844Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:02.5823055Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:02.6774702Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:02.8627419Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-27T10:23:02.8630222Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T10:23:02.8631449Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T10:23:02.8631941Z 
quality (node 24)	Run npm test	2026-08-27T10:23:02.8632856Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T10:23:02.8633528Z 
quality (node 24)	Run npm test	2026-08-27T10:23:02.8633707Z act(() => {
quality (node 24)	Run npm test	2026-08-27T10:23:02.8634525Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T10:23:02.8635000Z });
quality (node 24)	Run npm test	2026-08-27T10:23:02.8635417Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T10:23:02.8635707Z 
quality (node 24)	Run npm test	2026-08-27T10:23:02.8636779Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T10:23:02.8637753Z 
quality (node 24)	Run npm test	2026-08-27T10:23:02.8732912Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-27T10:23:02.8735630Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T10:23:02.8737000Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T10:23:02.8737687Z 
quality (node 24)	Run npm test	2026-08-27T10:23:02.8738448Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T10:23:02.8739223Z 
quality (node 24)	Run npm test	2026-08-27T10:23:02.8739518Z act(() => {
quality (node 24)	Run npm test	2026-08-27T10:23:02.8740140Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T10:23:02.8740816Z });
quality (node 24)	Run npm test	2026-08-27T10:23:02.8741361Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T10:23:02.8743744Z 
quality (node 24)	Run npm test	2026-08-27T10:23:02.8745011Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T10:23:02.8746212Z 
quality (node 24)	Run npm test	2026-08-27T10:23:02.8765896Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:02.8826758Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:03.1315244Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:03.1664820Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:03.3565061Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:03.3671530Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:03.5676934Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:03.6074647Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:03.8134880Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:03.8387748Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:04.0927087Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:04.1089154Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:04.3281156Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:04.3415710Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:04.5554426Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:04.6139782Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:04.7847647Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:04.8336933Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.0080180Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.0895707Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.2011895Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.2913424Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.3870833Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.5388537Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-27T10:23:05.5417133Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T10:23:05.5418538Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T10:23:05.5419018Z 
quality (node 24)	Run npm test	2026-08-27T10:23:05.5419620Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T10:23:05.5420213Z 
quality (node 24)	Run npm test	2026-08-27T10:23:05.5420373Z act(() => {
quality (node 24)	Run npm test	2026-08-27T10:23:05.5420800Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T10:23:05.5421268Z });
quality (node 24)	Run npm test	2026-08-27T10:23:05.5421640Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T10:23:05.5421925Z 
quality (node 24)	Run npm test	2026-08-27T10:23:05.5423229Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T10:23:05.5424408Z 
quality (node 24)	Run npm test	2026-08-27T10:23:05.5426753Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.5734607Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.7679619Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:05.7995257Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.0225892Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.0529044Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.2470923Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.3243629Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.5291694Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.5784558Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.7914936Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.7984877Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.8424577Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6389^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.8426791Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1805^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.8429072Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1769^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:06.9867144Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.0024027Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.0639741Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.1883196Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.1997344Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.2567151Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.3753840Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.4007984Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.4362308Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.5457220Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.6155058Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.6334976Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.7757092Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.8367191Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.8566342Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:07.9878412Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.0853281Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.0974497Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.1550355Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2281890Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2335922Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2336585Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 6 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2336903Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2340468Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/resolve-solvers.test.ts^[[2m > ^[[22mresolveSolvers (Slice C2)^[[2m > ^[[22mRS-1 derives solves on solver node root-most first and nowhere else
quality (node 24)	Run npm test	2026-08-27T10:23:08.2348352Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal [ …(2) ]^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2348952Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2349226Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2349624Z [
quality (node 24)	Run npm test	2026-08-27T10:23:08.2349924Z   {
quality (node 24)	Run npm test	2026-08-27T10:23:08.2350291Z     "base": "walker/shoulder",
quality (node 24)	Run npm test	2026-08-27T10:23:08.2351064Z     "id": "walker/upper-arm",
quality (node 24)	Run npm test	2026-08-27T10:23:08.2351477Z   },
quality (node 24)	Run npm test	2026-08-27T10:23:08.2351774Z   {
quality (node 24)	Run npm test	2026-08-27T10:23:08.2352163Z     "base": "walker/upper-arm",
quality (node 24)	Run npm test	2026-08-27T10:23:08.2352829Z     "id": "walker/forearm",
quality (node 24)	Run npm test	2026-08-27T10:23:08.2353232Z   },
quality (node 24)	Run npm test	2026-08-27T10:23:08.2353427Z ]
quality (node 24)	Run npm test	2026-08-27T10:23:08.2353535Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2353695Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2353928Z undefined
quality (node 24)	Run npm test	2026-08-27T10:23:08.2354042Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2354501Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/resolve-solvers.test.ts:^[[2m97:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2404306Z     ^[[90m 95|^[[39m     const solverNode = graph.nodeById["walker/arm-solve"] as GraphNode…
quality (node 24)	Run npm test	2026-08-27T10:23:08.2405062Z     ^[[90m 96|^[[39m     ^[[34mexpect^[[39m(solverNode)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2405777Z     ^[[90m 97|^[[39m     ^[[34mexpect^[[39m(solverNode^[[33m.^[[39msolves)^[[33m.^[[39m^[[34mtoEqual^[[39m([
quality (node 24)	Run npm test	2026-08-27T10:23:08.2406328Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2407064Z     ^[[90m 98|^[[39m       { id^[[33m:^[[39m ^[[32m"walker/upper-arm"^[[39m^[[33m,^[[39m base^[[33m:^[[39m ^[[32m"walker/shoulder"^[[39m }^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2408004Z     ^[[90m 99|^[[39m       { id^[[33m:^[[39m ^[[32m"walker/forearm"^[[39m^[[33m,^[[39m base^[[33m:^[[39m ^[[32m"walker/upper-arm"^[[39m }^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2408779Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2409502Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2410176Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2411983Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/resolve-solvers.test.ts^[[2m > ^[[22mresolveSolvers (Slice C2)^[[2m > ^[[22mRS-2 reports all five IK diagnostics with correct ruleId, path, and participant ids
quality (node 24)	Run npm test	2026-08-27T10:23:08.2414466Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2415742Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/resolve-solvers.test.ts:^[[2m135:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2417185Z     ^[[90m133|^[[39m     ^[[35mconst^[[39m res1 ^[[33m=^[[39m ^[[34mbuildGraphIR^[[39m(unreachableRootRig)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2418542Z     ^[[90m134|^[[39m     const diag1 = res1.diagnostics.find((d) => d.ruleId === "ik-solver…
quality (node 24)	Run npm test	2026-08-27T10:23:08.2419813Z     ^[[90m135|^[[39m     ^[[34mexpect^[[39m(diag1)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2420703Z     ^[[90m   |^[[39m                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2421886Z     ^[[90m136|^[[39m     ^[[34mexpect^[[39m(diag1^[[33m?.^[[39mpath)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"walker/upper-arm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2423661Z     ^[[90m137|^[[39m     ^[[34mexpect^[[39m(diag1^[[33m?.^[[39mseverity)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"error"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2424570Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2425005Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2425362Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2426956Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/resolve-solvers.test.ts^[[2m > ^[[22mresolveSolvers (Slice C2)^[[2m > ^[[22mRS-3 solves derivation is deterministic under track permutation
quality (node 24)	Run npm test	2026-08-27T10:23:08.2428693Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2430651Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/resolve-solvers.test.ts:^[[2m227:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2432046Z     ^[[90m225|^[[39m     ^[[35mconst^[[39m reference ^[[33m=^[[39m ^[[34mbuildGraphIR^[[39m(baseP)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2433569Z     ^[[90m226|^[[39m     const expectedSolves = (reference.graph?.nodeById["walker/arm-solv…
quality (node 24)	Run npm test	2026-08-27T10:23:08.2434825Z     ^[[90m227|^[[39m     ^[[34mexpect^[[39m(expectedSolves)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2435780Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2436922Z     ^[[90m228|^[[39m     ^[[35mconst^[[39m expectedOrder ^[[33m=^[[39m reference^[[33m.^[[39mgraph^[[33m?.^[[39morder^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2437807Z     ^[[90m229|^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2438031Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2438442Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2439312Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2440452Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/resolve-solvers.test.ts^[[2m > ^[[22mresolveSolvers (Slice C2)^[[2m > ^[[22mRS-4 produces identical solves when reconstructed from a graph snapshot
quality (node 24)	Run npm test	2026-08-27T10:23:08.2441477Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2442219Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/resolve-solvers.test.ts:^[[2m258:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2443665Z     ^[[90m256|^[[39m     const solver2 = rebuilt.graph?.nodeById["walker/arm-solve"] as Gra…
quality (node 24)	Run npm test	2026-08-27T10:23:08.2444963Z     ^[[90m257|^[[39m     ^[[34mexpect^[[39m(solver1^[[33m?.^[[39msolves)^[[33m.^[[39m^[[34mtoEqual^[[39m(solver2^[[33m?.^[[39msolves)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2446338Z     ^[[90m258|^[[39m     ^[[34mexpect^[[39m(solver1^[[33m?.^[[39msolves)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2447419Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2448138Z     ^[[90m259|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2448641Z     ^[[90m260|^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2448859Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2449284Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2449641Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2451478Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/resolve-solvers.test.ts^[[2m > ^[[22mresolveSolvers (Slice C2)^[[2m > ^[[22mRS-5 rebuild after removing a solver binding updates solves without stale cache mutation
quality (node 24)	Run npm test	2026-08-27T10:23:08.2453790Z ^[[31m^[[1mAssertionError^[[22m: Target cannot be null or undefined.^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2455134Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/resolve-solvers.test.ts:^[[2m267:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2456489Z     ^[[90m265|^[[39m     ^[[34mexpect^[[39m(res1^[[33m.^[[39mdiagnostics)^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2457867Z     ^[[90m266|^[[39m     const solver1 = res1.graph?.nodeById["walker/arm-solve"] as GraphN…
quality (node 24)	Run npm test	2026-08-27T10:23:08.2459268Z     ^[[90m267|^[[39m     ^[[34mexpect^[[39m(solver1^[[33m?.^[[39msolves)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2460333Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2460899Z     ^[[90m268|^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2461708Z     ^[[90m269|^[[39m     // Replace forearm with a version that drops the solver binding ->…
quality (node 24)	Run npm test	2026-08-27T10:23:08.2462292Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2462934Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2463382Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2464877Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/resolve-solvers.test.ts^[[2m > ^[[22mresolveSolvers (Slice C2)^[[2m > ^[[22mRS-6 both buildGraphIR and IncrementalGraphBuilder produce identical solves across corpus
quality (node 24)	Run npm test	2026-08-27T10:23:08.2466630Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2467362Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/resolve-solvers.test.ts:^[[2m288:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2468068Z     ^[[90m286|^[[39m     const incSolver = incremental.graph?.nodeById["walker/arm-solve"] …
quality (node 24)	Run npm test	2026-08-27T10:23:08.2469061Z     ^[[90m287|^[[39m     ^[[34mexpect^[[39m(refSolver^[[33m?.^[[39msolves)^[[33m.^[[39m^[[34mtoEqual^[[39m(incSolver^[[33m?.^[[39msolves)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2471091Z     ^[[90m288|^[[39m     ^[[34mexpect^[[39m(refSolver^[[33m?.^[[39msolves)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2472245Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2473169Z     ^[[90m289|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2473780Z     ^[[90m290|^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2473975Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2474233Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2474454Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2474493Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2474963Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m135 passed^[[39m^[[22m^[[90m (136)^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2475742Z ^[[2m      Tests ^[[22m ^[[1m^[[31m6 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m633 passed^[[39m^[[22m^[[90m (639)^[[39m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2476239Z ^[[2m   Start at ^[[22m 10:22:53
quality (node 24)	Run npm test	2026-08-27T10:23:08.2477130Z ^[[2m   Duration ^[[22m 14.29s^[[2m (transform 1.94s, setup 909ms, import 6.67s, tests 11.59s, environment 21ms)^[[22m
quality (node 24)	Run npm test	2026-08-27T10:23:08.2477553Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2489388Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2515694Z ##[error]AssertionError: expected undefined to deeply equal [ …(2) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	[
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	    "base": "walker/shoulder",
quality (node 24)	Run npm test	    "id": "walker/upper-arm",
quality (node 24)	Run npm test	  },
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	    "base": "walker/upper-arm",
quality (node 24)	Run npm test	    "id": "walker/forearm",
quality (node 24)	Run npm test	  },
quality (node 24)	Run npm test	]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/resolve-solvers.test.ts:97:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T10:23:08.2527314Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2528875Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/resolve-solvers.test.ts:135:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T10:23:08.2529823Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2531063Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/resolve-solvers.test.ts:227:28
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T10:23:08.2531936Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2533453Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/resolve-solvers.test.ts:258:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T10:23:08.2534404Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2535699Z ##[error]AssertionError: Target cannot be null or undefined.
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/resolve-solvers.test.ts:267:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T10:23:08.2536908Z 
quality (node 24)	Run npm test	2026-08-27T10:23:08.2538187Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/resolve-solvers.test.ts:288:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T10:23:08.2931306Z ##[error]Process completed with exit code 1.
```
