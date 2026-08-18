# CI log archive: 32152053394

- Workflow: CI
- Conclusion: failure
- Head branch: fix/issue-149-track-progress-atomicity
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32152053394
- Captured: 2026-08-18T15:03:27Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-18T15:03:02.8314890Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-18T15:03:02.8315302Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-18T15:03:02.8367828Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-18T15:03:02.8368275Z env:
quality (node 24)	Run npm test	2026-08-18T15:03:02.8368587Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-18T15:03:02.8368925Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-18T15:03:02.9572610Z 
quality (node 24)	Run npm test	2026-08-18T15:03:02.9573725Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-18T15:03:02.9574267Z > vitest run
quality (node 24)	Run npm test	2026-08-18T15:03:02.9574496Z 
quality (node 24)	Run npm test	2026-08-18T15:03:03.2797851Z 
quality (node 24)	Run npm test	2026-08-18T15:03:03.2799897Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:03.2800542Z 
quality (node 24)	Run npm test	2026-08-18T15:03:03.8668615Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:03.8819780Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:03.9650316Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-18T15:03:03.9653290Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T15:03:03.9678380Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:03:03.9708061Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:03:03.9709629Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:03.9727944Z 
quality (node 24)	Run npm test	2026-08-18T15:03:04.1095099Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.1899301Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.2453934Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.3322372Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.4691640Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.5309003Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.5729632Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.8580034Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.8689059Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:04.8741053Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.0830113Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.1651795Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.3520404Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4020328Z  ^[[31m❯^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4054855Z      ^[[32m✓^[[39m clamps progress and marks the leaf dirty only when progress changes^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4057365Z      ^[[32m✓^[[39m rejects non-finite progress and composes local values once per dirty state^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4058835Z      ^[[32m✓^[[39m recomposes a clean track when its inputs change^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4060072Z      ^[[32m✓^[[39m is a leaf with no composite or graph API^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4088513Z      ^[[32m✓^[[39m disposes once and rejects future work^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4090425Z ^[[31m     ^[[31m×^[[31m S-1 keeps clean Track bookkeeping at the accepted value after rejection^[[39m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4099986Z ^[[31m     ^[[31m×^[[31m S-2 retries the same value after a timeline rejection^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4101509Z ^[[31m     ^[[31m×^[[31m S-3 leaves an already-dirty Track unchanged after rejection^[[39m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.4103069Z      ^[[32m✓^[[39m S-4 commits progress and dirtiness after the timeline accepts^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.5858472Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.6858369Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.8446851Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:05.9433443Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:06.1390330Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:06.1720439Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:06.4312052Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:06.4432227Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:06.6515284Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:06.7113359Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:06.8746093Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:06.9799435Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.1319818Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.2139553Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.3780640Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.4709594Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.6039821Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.6972950Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.8327750Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.9120113Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.9584767Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2860^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:07.9588489Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2857^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.0728329Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.1264596Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.1329045Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.2897362Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.3264739Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.3654376Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.5033168Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.5419818Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.5979554Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.6940652Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.7327964Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.8039532Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.8989137Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:08.9691106Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.0132082Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.1154742Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.1681248Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.2106518Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.3576601Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.3926665Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.4454574Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.5501995Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.6223950Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.6306155Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.7467857Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.8259048Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.8482176Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:09.9903288Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.0229813Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.0313396Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.1717601Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.2206341Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.2590842Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.3605435Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.4319387Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.4348416Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.5325865Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.6228687Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.6847024Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.6943078Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.8222792Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-18T15:03:10.8226872Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T15:03:10.8228908Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:03:10.8231652Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:03:10.8232821Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:03:10.8234422Z 
quality (node 24)	Run npm test	2026-08-18T15:03:10.8244947Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.8768931Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:10.8972034Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.0149589Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.0629797Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.0900365Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.2178251Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.2641648Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.3183709Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.3975437Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.4789725Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.4899125Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.6015968Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.6700782Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.6939542Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.7951699Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.8568533Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.8666194Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:11.9607546Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.0480099Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.0661041Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.1687734Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.2349545Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.2451658Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.3635310Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.4459476Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.4524329Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-18T15:03:12.4543789Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T15:03:12.4545286Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:03:12.4546435Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:03:12.4548220Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.4550219Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T15:03:12.4552245Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.5706791Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.6432058Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.6804568Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.7942207Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.8545044Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.8653648Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9415622Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9454139Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9455073Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9455701Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9460065Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/track.test.ts^[[2m > ^[[22mTrack leaf^[[2m > ^[[22mS-1 keeps clean Track bookkeeping at the accepted value after rejection
quality (node 24)	Run npm test	2026-08-18T15:03:12.9465609Z ^[[31m^[[1mAssertionError^[[22m: expected 0.5 to be 0.25 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9466169Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9466430Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9466874Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9467268Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9467462Z ^[[32m- 0.25^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9467839Z ^[[31m+ 0.5^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9468047Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9468987Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/track.test.ts:^[[2m121:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9519410Z     ^[[90m119|^[[39m     expect(() => track.setProgress(0.5)).toThrow("timeline rejected pr…
quality (node 24)	Run npm test	2026-08-18T15:03:12.9520849Z     ^[[90m120|^[[39m     // The renderer rejected 0.5, so Track must still report the accep…
quality (node 24)	Run npm test	2026-08-18T15:03:12.9522359Z     ^[[90m121|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mprogress)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0.25^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9523479Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9524819Z     ^[[90m122|^[[39m     ^[[34mexpect^[[39m(fake^[[33m.^[[39m^[[34mtimelineProgress^[[39m())^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0.25^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9526468Z     ^[[90m123|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mdirty)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9555272Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9555301Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9556221Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m111 passed^[[39m^[[22m^[[90m (112)^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9557795Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m476 passed^[[39m^[[22m^[[90m (479)^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9559041Z ^[[2m   Start at ^[[22m 15:03:03
quality (node 24)	Run npm test	2026-08-18T15:03:12.9560146Z ^[[2m   Duration ^[[22m 9.63s^[[2m (transform 1.74s, setup 0ms, import 5.72s, tests 4.44s, environment 14ms)^[[22m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9560819Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9561503Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9562012Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9563408Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/track.test.ts^[[2m > ^[[22mTrack leaf^[[2m > ^[[22mS-2 retries the same value after a timeline rejection
quality (node 24)	Run npm test	2026-08-18T15:03:12.9564396Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9565205Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9604597Z ##[error]AssertionError: expected 0.5 to be 0.25 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0.25
quality (node 24)	Run npm test	+ 0.5
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/track.test.ts:121:28
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T15:03:12.9615998Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9616386Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9616877Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9617379Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9617561Z ^[[32m- true^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9617960Z ^[[31m+ false^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9618157Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9618865Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/track.test.ts:^[[2m132:36^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9619913Z     ^[[90m130|^[[39m     fake^[[33m.^[[39m^[[34macceptRejectedValue^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9620566Z     ^[[90m131|^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9621706Z     ^[[90m132|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39m^[[34msetProgress^[[39m(^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9622844Z     ^[[90m   |^[[39m                                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9624057Z     ^[[90m133|^[[39m     ^[[34mexpect^[[39m(fake^[[33m.^[[39mprogress)^[[33m.^[[39m^[[34mtoHaveBeenCalledTimes^[[39m(^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9625521Z     ^[[90m134|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mprogress)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0.5^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9626180Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9627712Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9628079Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9629404Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/track.test.ts^[[2m > ^[[22mTrack leaf^[[2m > ^[[22mS-3 leaves an already-dirty Track unchanged after rejection
quality (node 24)	Run npm test	2026-08-18T15:03:12.9631014Z ^[[31m^[[1mAssertionError^[[22m: expected 0.5 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9631557Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9631778Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9632262Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9632470Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9632646Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9632998Z ^[[31m+ 0.5^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9633194Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9633845Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/track.test.ts:^[[2m143:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9635092Z     ^[[90m141|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mdirty)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9636305Z     ^[[90m142|^[[39m     expect(() => track.setProgress(0.5)).toThrow("timeline rejected pr…
quality (node 24)	Run npm test	2026-08-18T15:03:12.9637728Z     ^[[90m143|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mprogress)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9638690Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9639867Z     ^[[90m144|^[[39m     ^[[34mexpect^[[39m(fake^[[33m.^[[39m^[[34mtimelineProgress^[[39m())^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9641236Z     ^[[90m145|^[[39m     ^[[34mexpect^[[39m(track^[[33m.^[[39mdirty)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9641829Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9642218Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T15:03:12.9642536Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9642554Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9645117Z ##[error]AssertionError: expected false to be true // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- true
quality (node 24)	Run npm test	+ false
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/track.test.ts:132:36
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T15:03:12.9646766Z 
quality (node 24)	Run npm test	2026-08-18T15:03:12.9649451Z ##[error]AssertionError: expected 0.5 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 0.5
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/track.test.ts:143:28
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T15:03:13.0060775Z ##[error]Process completed with exit code 1.
```
