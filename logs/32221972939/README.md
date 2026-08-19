# CI log archive: 32221972939

- Workflow: CI
- Conclusion: failure
- Head branch: feat/time-loop-semantics
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32221972939
- Captured: 2026-08-19T06:06:28Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-19T06:06:01.2549130Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-19T06:06:01.2549450Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-19T06:06:01.2586793Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-19T06:06:01.2587058Z env:
quality (node 24)	Run npm test	2026-08-19T06:06:01.2587256Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-19T06:06:01.2587474Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-19T06:06:01.4501226Z 
quality (node 24)	Run npm test	2026-08-19T06:06:01.4501868Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-19T06:06:01.4502768Z > vitest run
quality (node 24)	Run npm test	2026-08-19T06:06:01.4503045Z 
quality (node 24)	Run npm test	2026-08-19T06:06:01.8029717Z 
quality (node 24)	Run npm test	2026-08-19T06:06:01.8044534Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:01.8045951Z 
quality (node 24)	Run npm test	2026-08-19T06:06:02.3738134Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.3854001Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.5104877Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-19T06:06:02.5133763Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:06:02.5163152Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:06:02.5165058Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 68^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.5188025Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:06:02.5232498Z 
quality (node 24)	Run npm test	2026-08-19T06:06:02.6415686Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7154714Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 67^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7193875Z      ^[[32m✓^[[39m L-11 accepts the loop fields and names each loop rule by id^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7195909Z      ^[[32m✓^[[39m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7197842Z      ^[[32m✓^[[39m L-13 no longer rejects repeat and yoyo as unsupported^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7199770Z      ^[[32m✓^[[39m L-14 yoyos an authored Motion through the runtime and stops at the start^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7201789Z      ^[[32m✓^[[39m L-15 gives a runtime-created looping Motion the identical sequence^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7204084Z      ^[[32m✓^[[39m L-16 applies stagger inside each cycle and carries nothing across one^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7206011Z      ^[[32m✓^[[39m L-17 keeps one project clock subscription for looping Motions^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7207947Z      ^[[32m✓^[[39m L-18 keeps publishing an infinite loop where a single pass latches^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7210505Z      ^[[32m✓^[[39m L-19 lets the next loop emission overwrite a leaf seek^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7214462Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.7216506Z      ^[[32m✓^[[39m L-21 keeps loop time running while its Motion is paused^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.8371929Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.9577004Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:02.9994912Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.1261059Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.1994865Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.2864762Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.4039537Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.4546713Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.7264219Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.7363831Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.7384197Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:03.9844060Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:04.0025914Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:04.2252620Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:04.2457732Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:04.4630226Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:04.4930807Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:04.6969874Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:04.7481328Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:04.9644803Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:05.0003847Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:05.2122904Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:05.2619403Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:05.4734627Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:05.5474375Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:05.7836019Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:05.8034545Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.0523415Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.0572495Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.3349329Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.3444453Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.5783055Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.6193840Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.7018403Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2741^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.7020361Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2738^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.7787006Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.8637726Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:06.9084174Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.0214273Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.0667616Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.0909484Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.2469691Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.2784457Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.4698467Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.5188782Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.7256916Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.7676068Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.9543435Z  ^[[31m❯^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.9546273Z ^[[31m     ^[[31m×^[[31m T-8 reaches the manual port once in the factory, after both driver branches^[[39m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.9581781Z      ^[[32m✓^[[39m T-9 keeps the time driver's own manual port driver-owned rather than a fallback^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:07.9590010Z      ^[[32m✓^[[39m T-10 leaves no other manual port call site in core^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:08.0324453Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:08.1864569Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:08.2904261Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:08.4656356Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:08.5684439Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:08.6798962Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:08.7905597Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:08.9024310Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:09.0398675Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:09.1776550Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:09.3311875Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:09.3888259Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:09.5721140Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:09.6298659Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:09.8368784Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:09.8691438Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.0467279Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.0867716Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.2636589Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.2945740Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.4741379Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.5299862Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.7230690Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.7517807Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:10.9674131Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.0021429Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.1854310Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.2229834Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.4317992Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.4739788Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.6550237Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-19T06:06:11.6559267Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:06:11.6560686Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:06:11.6561805Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:06:11.6563614Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:06:11.6564315Z 
quality (node 24)	Run npm test	2026-08-19T06:06:11.6576560Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.6766491Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.8580939Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:11.8804394Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.0658504Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.0988875Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.2797713Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.3872493Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.4941590Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.6214287Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.7104870Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.8481895Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:12.9931799Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.0293948Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.2334457Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.2574458Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.4309528Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6158^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.4310586Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1694^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.4311447Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1737^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.4368511Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.4581173Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.6013790Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.6335635Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.6484065Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.7887008Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.8279934Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.8367637Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:13.9755740Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.0348999Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.0741259Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-19T06:06:14.0743818Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:06:14.0745028Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:06:14.0746020Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:06:14.0746980Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:06:14.0747486Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.0780232Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.1669841Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.2788531Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.3224430Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.3892424Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.4916097Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5175902Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5604129Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5648182Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5649139Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5649665Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5651442Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
quality (node 24)	Run npm test	2026-08-19T06:06:14.5657250Z ^[[31m^[[1mTypeError^[[22m: Motion "gone" still has 1 track(s). Remove them before destroying it.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5659132Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.destroyMotion packages/core/src/runtime/project-runtime.ts:^[[2m204:13^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5724946Z     ^[[90m202|^[[39m     const owned = [...this.#tracks.entries()].filter(([, entry]) => en…
quality (node 24)	Run npm test	2026-08-19T06:06:14.5726446Z     ^[[90m203|^[[39m     ^[[35mif^[[39m (owned^[[33m.^[[39mlength)
quality (node 24)	Run npm test	2026-08-19T06:06:14.5727769Z     ^[[90m204|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:06:14.5729225Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5730556Z     ^[[90m205|^[[39m         `Motion "${motionId}" still has ${owned.length} track(s). Remo…
quality (node 24)	Run npm test	2026-08-19T06:06:14.5731623Z     ^[[90m206|^[[39m       )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5733184Z ^[[90m ^[[2m❯^[[22m Object.destroyMotion packages/core/src/engine.ts:^[[2m74:42^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5734821Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m235:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5735701Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5736310Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5737055Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5739397Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts^[[2m > ^[[22mT5 no manual trigger fallback^[[2m > ^[[22mT-8 reaches the manual port once in the factory, after both driver branches
quality (node 24)	Run npm test	2026-08-19T06:06:14.5741762Z ^[[31m^[[1mAssertionError^[[22m: expected -1 to be greater than -1^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5742883Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5744091Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts:^[[2m45:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5745565Z     ^[[90m 43|^[[39m     const scroll = FACTORY_SOURCE.indexOf('if (trigger.type === "scrol…
quality (node 24)	Run npm test	2026-08-19T06:06:14.5746814Z     ^[[90m 44|^[[39m     // Guards the guard: two missing needles would otherwise both be -…
quality (node 24)	Run npm test	2026-08-19T06:06:14.5748153Z     ^[[90m 45|^[[39m     ^[[34mexpect^[[39m(time)^[[33m.^[[39m^[[34mtoBeGreaterThan^[[39m(^[[33m-^[[39m^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5749446Z     ^[[90m   |^[[39m                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5750617Z     ^[[90m 46|^[[39m     ^[[34mexpect^[[39m(scroll)^[[33m.^[[39m^[[34mtoBeGreaterThan^[[39m(^[[33m-^[[39m^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5751984Z     ^[[90m 47|^[[39m     ^[[34mexpect^[[39m(call)^[[33m.^[[39m^[[34mtoBeGreaterThan^[[39m(time)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5752850Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5753295Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5753672Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5754566Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m115 passed^[[39m^[[22m^[[90m (117)^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5756358Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m515 passed^[[39m^[[22m^[[90m (517)^[[39m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5757593Z ^[[2m   Start at ^[[22m 06:06:01
quality (node 24)	Run npm test	2026-08-19T06:06:14.5759147Z ^[[2m   Duration ^[[22m 12.73s^[[2m (transform 1.89s, setup 0ms, import 6.27s, tests 10.77s, environment 18ms)^[[22m
quality (node 24)	Run npm test	2026-08-19T06:06:14.5760085Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5780368Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5813027Z ##[error]TypeError: Motion "gone" still has 1 track(s). Remove them before destroying it.
quality (node 24)	Run npm test	 ❯ ProjectRuntime.destroyMotion packages/core/src/runtime/project-runtime.ts:204:13
quality (node 24)	Run npm test	 ❯ Object.destroyMotion packages/core/src/engine.ts:74:42
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:235:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:06:14.5826027Z 
quality (node 24)	Run npm test	2026-08-19T06:06:14.5828879Z ##[error]AssertionError: expected -1 to be greater than -1
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts:45:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:06:14.6217297Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-19T06:05:57.8158302Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.8158834Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.8196414Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.8196673Z env:
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.8196862Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.8197110Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.9348551Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.9349280Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.9349885Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:57.9350122Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.3630201Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.3633780Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.3634484Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.8579803Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.8697299Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.9508428Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.9516941Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.9539816Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.9541560Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 71^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.9570290Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:58.9576862Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1242362Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1248301Z      ^[[32m✓^[[39m L-11 accepts the loop fields and names each loop rule by id^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1250213Z      ^[[32m✓^[[39m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1251991Z      ^[[32m✓^[[39m L-13 no longer rejects repeat and yoyo as unsupported^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1255511Z      ^[[32m✓^[[39m L-14 yoyos an authored Motion through the runtime and stops at the start^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1257395Z      ^[[32m✓^[[39m L-15 gives a runtime-created looping Motion the identical sequence^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1268484Z      ^[[32m✓^[[39m L-16 applies stagger inside each cycle and carries nothing across one^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1269990Z      ^[[32m✓^[[39m L-17 keeps one project clock subscription for looping Motions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1271377Z      ^[[32m✓^[[39m L-18 keeps publishing an infinite loop where a single pass latches^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1272660Z      ^[[32m✓^[[39m L-19 lets the next loop emission overwrite a leaf seek^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1273669Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1274474Z      ^[[32m✓^[[39m L-21 keeps loop time running while its Motion is paused^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.1316566Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.2120154Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.3687990Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.4016924Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.4495214Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.6501087Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.6587431Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.7327489Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.8820786Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:05:59.9314273Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.0000769Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.0957757Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.2055172Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.2139270Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.3443983Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.4476862Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.4717253Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.5342442Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.6835556Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.7372420Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.7454001Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.9122808Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.9797679Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:00.9976425Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.1116510Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.1946119Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.2393143Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.3492940Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.4010946Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.4290381Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.5699690Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.6176884Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.6272775Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.7895387Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:01.8309229Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.0366732Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.0442441Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.0868649Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.2314858Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.2523673Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.3066900Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.4438005Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.4843646Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5053471Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5084407Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5085336Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5086023Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5089475Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5095588Z ^[[31m^[[1mTypeError^[[22m: Motion "gone" still has 1 track(s). Remove them before destroying it.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5097385Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.destroyMotion packages/core/src/runtime/project-runtime.ts:^[[2m204:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5182996Z     ^[[90m202|^[[39m     const owned = [...this.#tracks.entries()].filter(([, entry]) => en…
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5183670Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5184642Z     ^[[90m203|^[[39m     ^[[35mif^[[39m (owned^[[33m.^[[39mlength)
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5186214Z     ^[[90m204|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5187428Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5188767Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m47 passed^[[39m^[[22m^[[90m (48)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5190359Z     ^[[90m205|^[[39m         `Motion "${motionId}" still has ${owned.length} track(s). Remo…
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5191262Z     ^[[90m206|^[[39m       )^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5192322Z ^[[90m ^[[2m❯^[[22m Object.destroyMotion packages/core/src/engine.ts:^[[2m74:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5193751Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m235:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5194429Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5195192Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5195596Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5196780Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m189 passed^[[39m^[[22m^[[90m (190)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5197952Z ^[[2m   Start at ^[[22m 06:05:58
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5199129Z ^[[2m   Duration ^[[22m 4.13s^[[2m (transform 1.12s, setup 0ms, import 3.30s, tests 908ms, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5199821Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5213117Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5245274Z ##[error]TypeError: Motion "gone" still has 1 track(s). Remove them before destroying it.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.destroyMotion packages/core/src/runtime/project-runtime.ts:204:13
integration (node 24)	Run npm run test:integration	 ❯ Object.destroyMotion packages/core/src/engine.ts:74:42
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:235:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:06:02.5605969Z ##[error]Process completed with exit code 1.
```
