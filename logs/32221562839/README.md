# CI log archive: 32221562839

- Workflow: CI
- Conclusion: failure
- Head branch: feat/time-loop-semantics
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32221562839
- Captured: 2026-08-19T06:00:33Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-19T06:00:09.1123136Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-19T06:00:09.1123454Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-19T06:00:09.1145419Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-19T06:00:09.1145814Z env:
quality (node 24)	Run npm test	2026-08-19T06:00:09.1146065Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-19T06:00:09.1146310Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-19T06:00:09.2195374Z 
quality (node 24)	Run npm test	2026-08-19T06:00:09.2195976Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-19T06:00:09.2196477Z > vitest run
quality (node 24)	Run npm test	2026-08-19T06:00:09.2196622Z 
quality (node 24)	Run npm test	2026-08-19T06:00:09.4586151Z 
quality (node 24)	Run npm test	2026-08-19T06:00:09.4589419Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:09.4590689Z 
quality (node 24)	Run npm test	2026-08-19T06:00:09.8395351Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:09.8464735Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:09.9284755Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-19T06:00:09.9311172Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:00:09.9312942Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:09.9314561Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:00:09.9315663Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:00:09.9316320Z 
quality (node 24)	Run npm test	2026-08-19T06:00:10.0094144Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0617770Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m11 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0623616Z ^[[31m     ^[[31m×^[[31m L-11 accepts the loop fields and names each loop rule by id^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0625163Z ^[[31m     ^[[31m×^[[31m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0626611Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0627842Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0629314Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0630786Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0632446Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0634254Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0653921Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0683851Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.0702389Z ^[[31m     ^[[31m×^[[31m L-21 keeps loop time running while its Motion is paused^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.1168793Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.2014788Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.2659157Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.3049886Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.3694554Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.4514914Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.4821669Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.5263050Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.7139731Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.7214124Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.7324135Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.8733469Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:10.9121156Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.0510707Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.0590425Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.2236616Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.2517286Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.3936902Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.4049570Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.5897510Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.6276405Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8062882Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8388268Z  ^[[31m❯^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m9 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8444366Z      ^[[32m✓^[[39m L-1 keeps a trigger with no loop fields on one pass that latches at 1^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8458691Z ^[[31m     ^[[31m×^[[31m L-2 treats repeat 0 as the default spelled out, value for value^[[39m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8502535Z ^[[31m     ^[[31m×^[[31m L-3 runs the initial pass plus repeat more, each ending at 1^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8504020Z ^[[31m     ^[[31m×^[[31m L-4 reverses the odd cycle of a yoyo and finishes where it started^[[39m^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8511005Z ^[[31m     ^[[31m×^[[31m L-5 finishes a yoyo at the end when its last cycle runs forward^[[39m^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8512509Z ^[[31m     ^[[31m×^[[31m L-6 reads a boundary tick as the end of the cycle it finished^[[39m^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8514983Z ^[[31m     ^[[31m×^[[31m L-7 never latches an infinite repeat and never repeats one endpoint^[[39m^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8543567Z ^[[31m     ^[[31m×^[[31m L-8 emits once for a tick that crosses several cycles^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8546199Z ^[[31m     ^[[31m×^[[31m L-9 clamps a delta past the end to the finishing endpoint^[[39m^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:11.8547792Z ^[[31m     ^[[31m×^[[31m L-10 keeps an infinite loop advancing after an enormous delta^[[39m^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.0101622Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.0604624Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.2344697Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.2462023Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.3942668Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.4593693Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.6121125Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.6564821Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.8111637Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.8489340Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:12.9940424Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.0283296Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2165^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.0285180Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2163^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.0328711Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.1315372Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.1918489Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.2365458Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.2754220Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.3641205Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.3950000Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.5525933Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.5616915Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.7342141Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.7483164Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.8887279Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:13.9288263Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.0677607Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.1101474Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.2999732Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.3160987Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.4787443Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.4844462Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.6534755Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.7006367Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.8593528Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.9009921Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:14.9974234Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.1069205Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.1745366Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.3031497Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.3613428Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.4808789Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.5446343Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.6533229Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.6867000Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.8241839Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:15.8494269Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.0148797Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.0353441Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.1944464Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.2367381Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.4035095Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.4224379Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.5967445Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.6047734Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.7676677Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.7876595Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-19T06:00:16.7887500Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:00:16.7888893Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.7890961Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:00:16.7891852Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:00:16.7893047Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:00:16.7893658Z 
quality (node 24)	Run npm test	2026-08-19T06:00:16.9143636Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:16.9530367Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.0720404Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.0972098Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.2295729Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.3314378Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.4040779Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.4975367Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.6081850Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.6566032Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.7914462Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.8230041Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:17.9979741Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.0033901Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.0461752Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 4624^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.0463616Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1204^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.0464973Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1285^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.1396723Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.1468837Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.1769515Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.2827131Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.2862030Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.3241937Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.4277575Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.4371103Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.4615798Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.5998981Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.6054288Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.6152081Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-19T06:00:18.6155320Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:00:18.6156449Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:00:18.6157401Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:00:18.6158427Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:00:18.6159025Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.6173205Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.7657522Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.7798696Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.7870369Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9159537Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9225842Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9379312Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9414477Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9415583Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 20 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9416010Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9419003Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-11 accepts the loop fields and names each loop rule by id
quality (node 24)	Run npm test	2026-08-19T06:00:18.9423180Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9423768Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9423951Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9424605Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9424827Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9424955Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9425260Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9425642Z ^[[31m+   "trigger-time-repeat-unsupported",^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9425983Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9426137Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9426549Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m72:67^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9475101Z     ^[[90m 70|^[[39m     ^[[35mconst^[[39m repeatShape ^[[33m=^[[39m [^[[32m"trigger-time-repeat-shape"^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9476616Z     ^[[90m 71|^[[39m     ^[[34mexpect^[[39m(^[[34mloopRules^[[39m({ type^[[33m:^[[39m ^[[32m"time"^[[39m^[[33m,^[[39m duration^[[33m:^[[39m ^[[34m100^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9477969Z     ^[[90m 72|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 0 })).toEq…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9478868Z     ^[[90m   |^[[39m                                                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9479771Z     ^[[90m 73|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: -1, yoyo: …
quality (node 24)	Run npm test	2026-08-19T06:00:18.9480710Z     ^[[90m 74|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 3, yoyo: f…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9481175Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9481820Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9483931Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9504473Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-12 refuses a yoyo with no cycle to reverse, at either spelling
quality (node 24)	Run npm test	2026-08-19T06:00:18.9506607Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal [ 'trigger-time-yoyo-requires-repeat' ]^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9507481Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9507921Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9508485Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9508835Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9509121Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9509961Z ^[[32m-   "trigger-time-yoyo-requires-repeat",^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9510759Z ^[[31m+   "trigger-time-repeat-unsupported",^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9511399Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9511735Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9512647Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m86:68^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9513829Z     ^[[90m 84|^[[39m     ^[[90m// field accepted and then ignored is exactly what ADR-033 forbids.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9515334Z     ^[[90m 85|^[[39m     ^[[35mconst^[[39m required ^[[33m=^[[39m [^[[32m"trigger-time-yoyo-requires-repeat"^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9516515Z     ^[[90m 86|^[[39m     expect(loopRules({ type: "time", duration: 100, yoyo: true })).toE…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9518269Z     ^[[90m   |^[[39m                                                                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9519293Z     ^[[90m 87|^[[39m     expect(loopRules({ type: "time", duration: 100, yoyo: false })).to…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9519981Z     ^[[90m 88|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 0, yoyo: t…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9520251Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9520525Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9520784Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9521452Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
quality (node 24)	Run npm test	2026-08-19T06:00:18.9522854Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9523162Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9523336Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9523655Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9523821Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9523937Z ^[[32m- true^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9524279Z ^[[31m+ false^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9524420Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9524838Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9525472Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
quality (node 24)	Run npm test	2026-08-19T06:00:18.9525922Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9526533Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9527069Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9527608Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9528083Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9528263Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9528520Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9528711Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9529494Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
quality (node 24)	Run npm test	2026-08-19T06:00:18.9530983Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9532079Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9555089Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9563320Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:00:18.9564759Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:00:18.9565320Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9566061Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9566913Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9567805Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9568781Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9569692Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9570067Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9570325Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9570637Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9571362Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
quality (node 24)	Run npm test	2026-08-19T06:00:18.9573522Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9575233Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9576234Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9584117Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:00:18.9585268Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:00:18.9586253Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9586781Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9587374Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9587959Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9588638Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9589360Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9589698Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9589961Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9590139Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9590924Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
quality (node 24)	Run npm test	2026-08-19T06:00:18.9592060Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9593363Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9594375Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9595523Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:00:18.9596560Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:00:18.9597241Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9598040Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9598877Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9599790Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9600919Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9602095Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9602732Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9603116Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9603475Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9604561Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
quality (node 24)	Run npm test	2026-08-19T06:00:18.9607351Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9609508Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9610801Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9611971Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:00:18.9613106Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:00:18.9613833Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9614608Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9615411Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9616329Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9617367Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9618013Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9618444Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9618792Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9619919Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
quality (node 24)	Run npm test	2026-08-19T06:00:18.9621679Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9622991Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9624017Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9625213Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:00:18.9626195Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:00:18.9626860Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9627598Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9628569Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9629390Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9630385Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9631446Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9631947Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9632507Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9632800Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9633929Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
quality (node 24)	Run npm test	2026-08-19T06:00:18.9635398Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9636695Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9637637Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9638716Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:00:18.9639605Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:00:18.9640107Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9640796Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9641540Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9642610Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9643961Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9645071Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9645618Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9645962Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9646303Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9647718Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
quality (node 24)	Run npm test	2026-08-19T06:00:18.9650173Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9651849Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9653498Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9654580Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:00:18.9655474Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:00:18.9656173Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9656917Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9657731Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9658577Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9659567Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9660706Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9661299Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9661642Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9661905Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9663199Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-21 keeps loop time running while its Motion is paused
quality (node 24)	Run npm test	2026-08-19T06:00:18.9664842Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9666336Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9667430Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9668520Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9669712Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9670553Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9671412Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9672085Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9673164Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m254:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9673689Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9674082Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9674426Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9675627Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-2 treats repeat 0 as the default spelled out, value for value
quality (node 24)	Run npm test	2026-08-19T06:00:18.9677512Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9678958Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9680308Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9681469Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9682808Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9683660Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9684479Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9685337Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9686271Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9687418Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m62:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9688149Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9688517Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9688856Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9690108Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-3 runs the initial pass plus repeat more, each ending at 1
quality (node 24)	Run npm test	2026-08-19T06:00:18.9691917Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9693514Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9694671Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9695847Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9696989Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9697883Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9698720Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9699401Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9700302Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9701487Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m68:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9701949Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9702478Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9702785Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9703960Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-4 reverses the odd cycle of a yoyo and finishes where it started
quality (node 24)	Run npm test	2026-08-19T06:00:18.9706320Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9707972Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9708993Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9710054Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9711089Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9711813Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9712798Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9713565Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9714400Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9715721Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m73:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9716164Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9716486Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9716809Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9717969Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-5 finishes a yoyo at the end when its last cycle runs forward
quality (node 24)	Run npm test	2026-08-19T06:00:18.9720348Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9722164Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9723711Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9724909Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9726045Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9726827Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9727626Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9728329Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9729117Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9730201Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m78:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9730709Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9730999Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9731316Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9732668Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-6 reads a boundary tick as the end of the cycle it finished
quality (node 24)	Run npm test	2026-08-19T06:00:18.9734424Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9735757Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9736876Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9738003Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9738749Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9739508Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9740370Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9741228Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9742038Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9743305Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m85:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9743755Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9744096Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9744438Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9745480Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-7 never latches an infinite repeat and never repeats one endpoint
quality (node 24)	Run npm test	2026-08-19T06:00:18.9747477Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9748931Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9749978Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9751108Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9752167Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9753056Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9753866Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9754546Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9755289Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9756004Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m89:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9756532Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9756840Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9757145Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9758207Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-8 emits once for a tick that crosses several cycles
quality (node 24)	Run npm test	2026-08-19T06:00:18.9760732Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9762669Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9763810Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9764981Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9766125Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9767092Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9767940Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9768695Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9769589Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9770406Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m97:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9770738Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9770989Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9771248Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9772348Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-9 clamps a delta past the end to the finishing endpoint
quality (node 24)	Run npm test	2026-08-19T06:00:18.9774801Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9776757Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9777771Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9778771Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9779725Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9780520Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9781359Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9782209Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9783676Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9784645Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m103:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9785135Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9785400Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9785673Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9786852Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-10 keeps an infinite loop advancing after an enormous delta
quality (node 24)	Run npm test	2026-08-19T06:00:18.9788594Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9790020Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9791023Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9792065Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9793272Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:00:18.9794020Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9794730Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9795348Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:00:18.9796106Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9797143Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m109:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9797605Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9797994Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/20]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9798357Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9798389Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9798944Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m115 passed^[[39m^[[22m^[[90m (117)^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9799986Z ^[[2m      Tests ^[[22m ^[[1m^[[31m20 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m497 passed^[[39m^[[22m^[[90m (517)^[[39m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9800708Z ^[[2m   Start at ^[[22m 06:00:09
quality (node 24)	Run npm test	2026-08-19T06:00:18.9801507Z ^[[2m   Duration ^[[22m 9.46s^[[2m (transform 1.36s, setup 0ms, import 4.70s, tests 8.13s, environment 13ms)^[[22m
quality (node 24)	Run npm test	2026-08-19T06:00:18.9802102Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9802187Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9827775Z ##[error]AssertionError: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "trigger-time-repeat-unsupported",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:72:67
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9836229Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9840495Z ##[error]AssertionError: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal [ 'trigger-time-yoyo-requires-repeat' ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	-   "trigger-time-yoyo-requires-repeat",
quality (node 24)	Run npm test	+   "trigger-time-repeat-unsupported",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:86:68
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9843056Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9845512Z ##[error]AssertionError: expected false to be true // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- true
quality (node 24)	Run npm test	+ false
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:98:26
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9847073Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9852022Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9855186Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9859983Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9863045Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9867021Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9869433Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9874891Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9877929Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9881979Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9884532Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9888549Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9891184Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9896233Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9899169Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9902759Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:254:16
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9905462Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9909727Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:62:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9912677Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9916526Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:68:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9918704Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9923135Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:73:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9926148Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9930398Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:78:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9933628Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9937548Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:85:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9939814Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9943220Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:89:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9945370Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9949336Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:97:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9951867Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9956433Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:103:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:18.9959157Z 
quality (node 24)	Run npm test	2026-08-19T06:00:18.9962657Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:109:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:00:19.0018877Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-19T06:00:03.1516666Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.1517040Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.1555730Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.1556228Z env:
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.1556432Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.1556640Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.2681299Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.2682241Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.2683132Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.2683602Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.5925578Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.5927596Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:03.5928964Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.1690682Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.1814184Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.2871877Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.2888005Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.2939761Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.2952881Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 85^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.2969860Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.3019145Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.4800245Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5283626Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m11 failed^[[39m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5294051Z ^[[31m     ^[[31m×^[[31m L-11 accepts the loop fields and names each loop rule by id^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5296228Z ^[[31m     ^[[31m×^[[31m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5308957Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5321729Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5330437Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5350152Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5380593Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5405314Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5450301Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5452395Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.5480067Z ^[[31m     ^[[31m×^[[31m L-21 keeps loop time running while its Motion is paused^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.6410555Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.7358399Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.7941636Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.8805110Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:04.9911275Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.0565834Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.1125243Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.2291019Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.3255198Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.4274834Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.4330972Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.5924622Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.6226988Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.6725762Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.8268915Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.8733124Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:05.8955876Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.0714993Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.1026521Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.1202459Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.3182343Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.3260325Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.3696431Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.5113009Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.5555464Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.5972692Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.7349306Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.7519335Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.8171061Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.9536337Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:06.9624943Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.0132537Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.1604519Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.2010255Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.3898170Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.3975815Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.4601609Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.5712022Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.6174085Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.6730293Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8082959Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8386480Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8539037Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8582232Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8583104Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 11 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8583744Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8588712Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-11 accepts the loop fields and names each loop rule by id
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8593988Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8594732Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8595810Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8596693Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8596971Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8597147Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8597512Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8598096Z ^[[31m+   "trigger-time-repeat-unsupported",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8598855Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8599047Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8599856Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m72:67^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8670693Z     ^[[90m 70|^[[39m     ^[[35mconst^[[39m repeatShape ^[[33m=^[[39m [^[[32m"trigger-time-repeat-shape"^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8673032Z     ^[[90m 71|^[[39m     ^[[34mexpect^[[39m(^[[34mloopRules^[[39m({ type^[[33m:^[[39m ^[[32m"time"^[[39m^[[33m,^[[39m duration^[[33m:^[[39m ^[[34m100^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8674963Z     ^[[90m 72|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 0 })).toEq…
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8676273Z     ^[[90m   |^[[39m                                                                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8677535Z     ^[[90m 73|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: -1, yoyo: …
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8679078Z     ^[[90m 74|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 3, yoyo: f…
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8679855Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8680278Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8680623Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8681626Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-12 refuses a yoyo with no cycle to reverse, at either spelling
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8683072Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal [ 'trigger-time-yoyo-requires-repeat' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8683730Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8683977Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8684354Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8684604Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8684817Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8685277Z ^[[32m-   "trigger-time-yoyo-requires-repeat",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8685864Z ^[[31m+   "trigger-time-repeat-unsupported",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8686306Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8686532Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8687096Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m86:68^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8687972Z     ^[[90m 84|^[[39m     ^[[90m// field accepted and then ignored is exactly what ADR-033 forbids.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8689400Z     ^[[90m 85|^[[39m     ^[[35mconst^[[39m required ^[[33m=^[[39m [^[[32m"trigger-time-yoyo-requires-repeat"^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8690845Z     ^[[90m 86|^[[39m     expect(loopRules({ type: "time", duration: 100, yoyo: true })).toE…
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8692138Z     ^[[90m   |^[[39m                                                                    ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8693328Z     ^[[90m 87|^[[39m     expect(loopRules({ type: "time", duration: 100, yoyo: false })).to…
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8694581Z     ^[[90m 88|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 0, yoyo: t…
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8695242Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8696139Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8696513Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8697867Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8700019Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8700664Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8700950Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8701459Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8701705Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8701921Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8702385Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8702619Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8703493Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8704854Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8705751Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8706931Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8708045Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8709364Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8710245Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8710552Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8710980Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8711347Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8713087Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8716573Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8719635Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8765686Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8767624Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8769303Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8770057Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8770768Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8771857Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8772998Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8774645Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8775888Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8776366Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8776817Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8777171Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8778684Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8783034Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8785216Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8786410Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8787332Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8788123Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8788702Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8789234Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8789816Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8790431Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8791160Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8791978Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8792343Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8792584Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8792796Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8793686Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8794989Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8795874Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8796550Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8797345Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8798003Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8798422Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8799741Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8801205Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8802429Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8803916Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8805496Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8806185Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8806620Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8806994Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8819059Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8823619Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8826675Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8827902Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8829637Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8830865Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8831592Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8832527Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8833627Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8834739Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8836081Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8836761Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8837198Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8837553Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8854852Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8857593Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8859547Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8860777Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8862284Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8863513Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8864239Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8865160Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8866219Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8867316Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8868968Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8870459Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8871119Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8871806Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8872191Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8873835Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8876487Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8878146Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8880460Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8881993Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8883238Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8883979Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8884954Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8886040Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8887146Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8888736Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8890279Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8890950Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8891403Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8891835Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8893529Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8896999Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8899719Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8900980Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8902470Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8903731Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8904472Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8905415Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8906471Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8907629Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8909399Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8910949Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8911623Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8912049Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8912412Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8913987Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-21 keeps loop time running while its Motion is paused
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8916328Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8918252Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8920185Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8921754Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8923399Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8924420Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8925467Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8926275Z     ^[[90m180|^[[39m }
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8927308Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m254:16^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8927978Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8928414Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8928980Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8929023Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8929868Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m47 passed^[[39m^[[22m^[[90m (48)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8931334Z ^[[2m      Tests ^[[22m ^[[1m^[[31m11 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m179 passed^[[39m^[[22m^[[90m (190)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8932265Z ^[[2m   Start at ^[[22m 06:00:03
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8933448Z ^[[2m   Duration ^[[22m 4.24s^[[2m (transform 1.25s, setup 0ms, import 3.53s, tests 922ms, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8934141Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8934152Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8961769Z ##[error]AssertionError: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "trigger-time-repeat-unsupported",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:72:67
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8971161Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8974239Z ##[error]AssertionError: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal [ 'trigger-time-yoyo-requires-repeat' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	-   "trigger-time-yoyo-requires-repeat",
integration (node 24)	Run npm run test:integration	+   "trigger-time-repeat-unsupported",
integration (node 24)	Run npm run test:integration	  ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:86:68
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8975952Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8977660Z ##[error]AssertionError: expected false to be true // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- true
integration (node 24)	Run npm run test:integration	+ false
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:98:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8979106Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8982846Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8984926Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8989162Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8991678Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8994904Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.8996762Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9001119Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.yoyo: Time trigger yoyo is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9004255Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9007505Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9009668Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9012838Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9014818Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9018948Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9021318Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9023816Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:254:16
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:00:07.9237480Z ##[error]Process completed with exit code 1.
```
