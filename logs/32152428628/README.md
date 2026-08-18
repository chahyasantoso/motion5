# CI log archive: 32152428628

- Workflow: CI
- Conclusion: failure
- Head branch: fix/track-progress-commit-ordering
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32152428628
- Captured: 2026-08-18T15:07:05Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-18T15:06:37.5516911Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-18T15:06:37.5517154Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-18T15:06:37.5549615Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-18T15:06:37.5549828Z env:
quality (node 24)	Run npm test	2026-08-18T15:06:37.5549992Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-18T15:06:37.5550161Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-18T15:06:37.6356280Z 
quality (node 24)	Run npm test	2026-08-18T15:06:37.6356822Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-18T15:06:37.6357100Z > vitest run
quality (node 24)	Run npm test	2026-08-18T15:06:37.6357207Z 
quality (node 24)	Run npm test	2026-08-18T15:06:37.8672647Z 
quality (node 24)	Run npm test	2026-08-18T15:06:37.8675730Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:37.8676289Z 
quality (node 24)	Run npm test	2026-08-18T15:06:38.2221403Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.2302110Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.3039016Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-18T15:06:38.3054470Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T15:06:38.3055684Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:06:38.3056851Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:06:38.3057413Z 
quality (node 24)	Run npm test	2026-08-18T15:06:38.3060149Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.3857407Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4192430Z  ^[[31m❯^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4204782Z      ^[[32m✓^[[39m clamps progress and marks the leaf dirty only when progress changes^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4224352Z      ^[[32m✓^[[39m rejects non-finite progress and composes local values once per dirty state^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4251354Z      ^[[32m✓^[[39m recomposes a clean track when its inputs change^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4274109Z      ^[[32m✓^[[39m is a leaf with no composite or graph API^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4280087Z      ^[[32m✓^[[39m disposes once and rejects future work^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4283719Z ^[[31m     ^[[31m×^[[31m L-1 leaves progress at the prior value when the timeline rejects the new one^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4285304Z ^[[31m     ^[[31m×^[[31m L-2 rejects a repeated update identically instead of reporting no change^[[39m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4286839Z ^[[31m     ^[[31m×^[[31m L-3 lets a retry reach the timeline once it is willing to accept the value^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4288858Z ^[[31m     ^[[31m×^[[31m L-4 leaves a clean Track clean and self-consistent after a rejection^[[39m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4290247Z      ^[[32m✓^[[39m L-5 still commits a successful update and hands the timeline the clamped value^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.4291584Z      ^[[32m✓^[[39m L-6 keeps every rejection that precedes the timeline call ahead of it^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.5097051Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.5775489Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.5854951Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.6774764Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.7520358Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.7560462Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.9432554Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.9477489Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:38.9544554Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.1093033Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.1395333Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.3085811Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.3169843Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.4364906Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.4750552Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.5694040Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.6732674Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.7556403Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.8602820Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:39.9744417Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.0955291Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.1684585Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.3003707Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.3442446Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.4965489Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.5631615Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.7087628Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.7663095Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.9050479Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:40.9584136Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.0929881Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.1283912Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.2906294Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.3044015Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.3129156Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2230^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.3131112Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2227^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.4442161Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.4557996Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.4784282Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.6194903Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.6236521Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.6489099Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.7689440Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.7958868Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.8072762Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.9357742Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.9424852Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:41.9820953Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.0958291Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.1125701Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.1296696Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.2464880Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.2955225Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.2983634Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.4109644Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.4264996Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.4948426Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.5622975Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.5953551Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.6440083Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.7196258Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.7707691Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.8147823Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.8526377Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.9243506Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:42.9645300Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.0234958Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.0753078Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.1175199Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.1689568Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.2179867Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.2727299Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.3452127Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.3750145Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.4395192Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-18T15:06:43.4414488Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T15:06:43.4415728Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.4454210Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:06:43.4460779Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:06:43.4461725Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:06:43.4462320Z 
quality (node 24)	Run npm test	2026-08-18T15:06:43.4891717Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.5213945Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.5967070Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.6458424Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.6752626Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.7578620Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.8292477Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.8480157Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.8830157Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:43.9863056Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.0123181Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.0566784Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.1355044Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.1595003Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.2071820Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.2901896Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.2985001Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.3400339Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.4746117Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.4884333Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.5056684Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.6191901Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.6314741Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.6615274Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.7907597Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.7948128Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-18T15:06:44.7949772Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T15:06:44.7951068Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:06:44.7951907Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:06:44.7953320Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.7954151Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:06:44.7954487Z 
quality (node 24)	Run npm test	2026-08-18T15:06:44.8350229Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.9528461Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:44.9604693Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.0035228Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1107214Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1245433Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1301455Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1335449Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1336244Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 4 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1336765Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1338317Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/track.test.ts^[[2m > ^[[22mTrack progress commit ordering^[[2m > ^[[22mL-1 leaves progress at the prior value when the timeline rejects the new one
quality (node 24)	Run npm test	2026-08-18T15:06:45.1342739Z ^[[31m^[[1mAssertionError^[[22m: expected 0.5 to be 0.25 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1343462Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1343766Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1344302Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1344622Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1344901Z ^[[32m- 0.25^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1345244Z ^[[31m+ 0.5^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1345401Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1345970Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/track.test.ts:^[[2m137:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1378425Z     ^[[90m135|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m track^[[33m.^[[39m^[[34msetProgress^[[39m(^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTIMELINE_REJECTED^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1379324Z     ^[[90m136|^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1380050Z     ^[[90m137|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mprogress)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0.25^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1380804Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1381512Z     ^[[90m138|^[[39m     // Asserted against the timeline as well, because "unchanged" has …
quality (node 24)	Run npm test	2026-08-18T15:06:45.1382783Z     ^[[90m139|^[[39m     ^[[90m// timeline still agree, not merely that some number stayed put.^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1383645Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1384041Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1384324Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1385506Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/track.test.ts^[[2m > ^[[22mTrack progress commit ordering^[[2m > ^[[22mL-2 rejects a repeated update identically instead of reporting no change
quality (node 24)	Run npm test	2026-08-18T15:06:45.1386820Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw an error^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1387177Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1387359Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1387633Z null
quality (node 24)	Run npm test	2026-08-18T15:06:45.1387761Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1411028Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1411434Z undefined
quality (node 24)	Run npm test	2026-08-18T15:06:45.1411586Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1412153Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/track.test.ts:^[[2m151:42^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1412968Z     ^[[90m149|^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1414158Z     ^[[90m150|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m track^[[33m.^[[39m^[[34msetProgress^[[39m(^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTIMELINE_REJECTED^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1415671Z     ^[[90m151|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m track^[[33m.^[[39m^[[34msetProgress^[[39m(^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTIMELINE_REJECTED^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1416663Z     ^[[90m   |^[[39m                                          ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1417103Z     ^[[90m152|^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1417700Z     ^[[90m153|^[[39m     // Twice, because the second attempt has to reach the timeline at …
quality (node 24)	Run npm test	2026-08-18T15:06:45.1418095Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1418431Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1418694Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1419853Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/track.test.ts^[[2m > ^[[22mTrack progress commit ordering^[[2m > ^[[22mL-3 lets a retry reach the timeline once it is willing to accept the value
quality (node 24)	Run npm test	2026-08-18T15:06:45.1421222Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1421633Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1421830Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1422162Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1422319Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1422466Z ^[[32m- true^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1422771Z ^[[31m+ false^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1422930Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1423622Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/track.test.ts:^[[2m166:36^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1424376Z     ^[[90m164|^[[39m     fake^[[33m.^[[39m^[[34maccept^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1424819Z     ^[[90m165|^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1425636Z     ^[[90m166|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39m^[[34msetProgress^[[39m(^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1426468Z     ^[[90m   |^[[39m                                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1427277Z     ^[[90m167|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mprogress)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0.5^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1428209Z     ^[[90m168|^[[39m     ^[[34mexpect^[[39m(fake^[[33m.^[[39maccepted)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0.5^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1428662Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1428947Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1429189Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1430235Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/track.test.ts^[[2m > ^[[22mTrack progress commit ordering^[[2m > ^[[22mL-4 leaves a clean Track clean and self-consistent after a rejection
quality (node 24)	Run npm test	2026-08-18T15:06:45.1431426Z ^[[31m^[[1mAssertionError^[[22m: expected 0.5 to be 0.25 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1431793Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1431945Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1432255Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1432398Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1432529Z ^[[32m- 0.25^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1432797Z ^[[31m+ 0.5^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1432952Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1433570Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/track.test.ts:^[[2m184:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1434391Z     ^[[90m182|^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1435065Z     ^[[90m183|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mdirty)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1436033Z     ^[[90m184|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mprogress)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0.25^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1436751Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1437580Z     ^[[90m185|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39m^[[34mcompose^[[39m())^[[33m.^[[39m^[[34mtoBe^[[39m(composed)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1438753Z     ^[[90m186|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39m^[[34mcompose^[[39m()^[[33m.^[[39mprogress)^[[33m.^[[39m^[[34mtoBe^[[39m(track^[[33m.^[[39mprogress)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1439357Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1439675Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1439940Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1439976Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1440812Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m111 passed^[[39m^[[22m^[[90m (112)^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1441794Z ^[[2m      Tests ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m477 passed^[[39m^[[22m^[[90m (481)^[[39m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1442441Z ^[[2m   Start at ^[[22m 15:06:37
quality (node 24)	Run npm test	2026-08-18T15:06:45.1443583Z ^[[2m   Duration ^[[22m 7.25s^[[2m (transform 1.32s, setup 0ms, import 4.20s, tests 3.41s, environment 11ms)^[[22m
quality (node 24)	Run npm test	2026-08-18T15:06:45.1444048Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1444058Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1465060Z ##[error]AssertionError: expected 0.5 to be 0.25 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0.25
quality (node 24)	Run npm test	+ 0.5
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/track.test.ts:137:28
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T15:06:45.1474033Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1476128Z ##[error]AssertionError: expected [Function] to throw an error
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	null
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/track.test.ts:151:42
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T15:06:45.1477344Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1479111Z ##[error]AssertionError: expected false to be true // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- true
quality (node 24)	Run npm test	+ false
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/track.test.ts:166:36
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T15:06:45.1480272Z 
quality (node 24)	Run npm test	2026-08-18T15:06:45.1481862Z ##[error]AssertionError: expected 0.5 to be 0.25 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0.25
quality (node 24)	Run npm test	+ 0.5
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/track.test.ts:184:28
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T15:06:45.1918275Z ##[error]Process completed with exit code 1.
```
