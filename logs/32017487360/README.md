# CI log archive: 32017487360

- Workflow: CI
- Conclusion: failure
- Head branch: test/issue-114-motion-track-regressions
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32017487360
- Captured: 2026-08-17T09:54:19Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-17T09:53:55.9870290Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-17T09:53:55.9870596Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-17T09:53:55.9911110Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-17T09:53:55.9911441Z env:
quality (node 24)	Run npm test	2026-08-17T09:53:55.9911676Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-17T09:53:55.9911907Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-17T09:53:56.1015885Z 
quality (node 24)	Run npm test	2026-08-17T09:53:56.1016845Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-17T09:53:56.1017356Z > vitest run
quality (node 24)	Run npm test	2026-08-17T09:53:56.1017568Z 
quality (node 24)	Run npm test	2026-08-17T09:53:56.4168189Z 
quality (node 24)	Run npm test	2026-08-17T09:53:56.4176717Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:56.4177476Z 
quality (node 24)	Run npm test	2026-08-17T09:53:56.7640060Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:56.9138080Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.1008478Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-17T09:53:57.1017327Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:53:57.1027480Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:53:57.1029377Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:53:57.1030136Z 
quality (node 24)	Run npm test	2026-08-17T09:53:57.1048846Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 66^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.2032315Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.2345996Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.3511002Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.4509967Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.5447530Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.7018089Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.7878342Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.9184182Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:57.9829766Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:58.1287009Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:58.2873833Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:58.3847735Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:58.5093040Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:58.6652896Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:58.8112297Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:58.9158908Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.0662761Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.1895838Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.2604958Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.4261038Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.4858402Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.6600517Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.7014936Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.8998679Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:53:59.9276802Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.1323495Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.1448358Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2728^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.1457939Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2724^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.1914736Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.3393939Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.3986966Z  ^[[31m❯^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.4010550Z ^[[31m     ^[[31m×^[[31m does not drive the disposed Track after direct replacement^[[39m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.4012293Z ^[[31m     ^[[31m×^[[31m preserves current progress when replacing^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.4013923Z ^[[31m     ^[[31m×^[[31m preserves the original array index and stagger timing^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.4015360Z      ^[[32m✓^[[39m keeps sibling progress healthy after replacement^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.4016886Z      ^[[32m✓^[[39m keeps the observation replacement path live^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.4389976Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.5668728Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.6038518Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.6718050Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.7846090Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.8079949Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.8931254Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:00.9926829Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.0225375Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.0942279Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.2092353Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.2540448Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.3378746Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.3945332Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.4909384Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.5508801Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.6205599Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.6977331Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.7831983Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.8170830Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.9099766Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:01.9710581Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.0243455Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.1367539Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.1652387Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.2077430Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.3474400Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.3646978Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.3838943Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.5318975Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.5946421Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.6069665Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-17T09:54:02.6126366Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:54:02.6128107Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.6167574Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:54:02.6168792Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:54:02.6169850Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:54:02.6170476Z 
quality (node 24)	Run npm test	2026-08-17T09:54:02.7527863Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.8204436Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.8331811Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:02.9732485Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.0113112Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.1032235Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.1895896Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.2442934Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.2828715Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.4148792Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.4443335Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.4508335Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.6254820Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.6446373Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.6504030Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.8099962Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.8384428Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:03.8432660Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.0064472Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.0378319Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.0504528Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.2107905Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.2222624Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.2639739Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.4119747Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-17T09:54:04.4121835Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:54:04.4122995Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:54:04.4123926Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:54:04.4124840Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:54:04.4125663Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.4143353Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.4328487Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.5001798Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.6282476Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.6628718Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.7134931Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.7976816Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8222027Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8277934Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8287577Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8287928Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8289373Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mdoes not drive the disposed Track after direct replacement
quality (node 24)	Run npm test	2026-08-17T09:54:04.8290910Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 250 } to deeply equal { x: 125 }^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8291325Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8291729Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8292055Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8292203Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8292477Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8292823Z ^[[32m-   "x": 125,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8293116Z ^[[31m+   "x": 250,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8293508Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8294031Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8294958Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m36:45^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8323483Z     ^[[90m 34|^[[39m       scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8325035Z     ^[[90m 35|^[[39m     })^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/Track is disposed/^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8327212Z     ^[[90m 36|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m125^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8329260Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8330456Z     ^[[90m 37|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8331183Z     ^[[90m 38|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8331781Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8332176Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8332529Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8333996Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves current progress when replacing
quality (node 24)	Run npm test	2026-08-17T09:54:04.8335841Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 50 } to deeply equal { x: 100 }^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8338710Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8339015Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8339421Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8339604Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8339758Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8340120Z ^[[32m-   "x": 100,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8340479Z ^[[31m+   "x": 50,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8340843Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8341010Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8341946Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m47:45^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8343923Z     ^[[90m 45|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"scene/arm"^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34mtrack^[[39m(^[[32m"arm"^[[39m^[[33m,^[[39m ^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8345062Z     ^[[90m 46|^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8346551Z     ^[[90m 47|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8347864Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8348640Z     ^[[90m 48|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8349309Z     ^[[90m 49|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8349577Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8349980Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8350311Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8354057Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves the original array index and stagger timing
quality (node 24)	Run npm test	2026-08-17T09:54:04.8357263Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 100 } to deeply equal { x: 200 }^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8357786Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8358036Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8358444Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8358654Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8358830Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8359211Z ^[[32m-   "x": 200,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8359591Z ^[[31m+   "x": 100,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8359954Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8360113Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8360996Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m62:47^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8362920Z     ^[[90m 60|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"scene/first"^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34mtrack^[[39m(^[[32m"first"^[[39m^[[33m,^[[39m ^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8364088Z     ^[[90m 61|^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8365408Z     ^[[90m 62|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/first"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m200^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8366992Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8368498Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/second"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8370534Z     ^[[90m 64|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/third"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8371800Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8372335Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8372692Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8372761Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8373558Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m96 passed^[[39m^[[22m^[[90m (97)^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8375174Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m400 passed^[[39m^[[22m^[[90m (403)^[[39m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8376035Z ^[[2m   Start at ^[[22m 09:53:56
quality (node 24)	Run npm test	2026-08-17T09:54:04.8377321Z ^[[2m   Duration ^[[22m 8.39s^[[2m (transform 1.57s, setup 0ms, import 4.93s, tests 4.06s, environment 13ms)^[[22m
quality (node 24)	Run npm test	2026-08-17T09:54:04.8377957Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8377968Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8413553Z ##[error]AssertionError: expected { x: 250 } to deeply equal { x: 125 }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	-   "x": 125,
quality (node 24)	Run npm test	+   "x": 250,
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:36:45
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:54:04.8424617Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8428043Z ##[error]AssertionError: expected { x: 50 } to deeply equal { x: 100 }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	-   "x": 100,
quality (node 24)	Run npm test	+   "x": 50,
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:47:45
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:54:04.8430076Z 
quality (node 24)	Run npm test	2026-08-17T09:54:04.8433114Z ##[error]AssertionError: expected { x: 100 } to deeply equal { x: 200 }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	-   "x": 200,
quality (node 24)	Run npm test	+   "x": 100,
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:62:47
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:54:04.8871281Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-17T09:53:55.4709364Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.4709738Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.4751076Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.4751595Z env:
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.4751797Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.4752008Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.5792265Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.5792948Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.5793572Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:55.5793865Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.0012741Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.0016868Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.0017945Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.4796402Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.5067911Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.6058985Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.6062199Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.6065061Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.6066620Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.6067482Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.6093779Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 70^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.7428014Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.7779434Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.8677591Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:56.9764153Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.0560105Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.1516782Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.2070906Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.3454956Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.3755070Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.4700245Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.6054290Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.6176759Z  ^[[31m❯^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.6179915Z ^[[31m     ^[[31m×^[[31m does not drive the disposed Track after direct replacement^[[39m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.6181826Z ^[[31m     ^[[31m×^[[31m preserves current progress when replacing^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.6183620Z ^[[31m     ^[[31m×^[[31m preserves the original array index and stagger timing^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.6191000Z      ^[[32m✓^[[39m keeps sibling progress healthy after replacement^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.6192753Z      ^[[32m✓^[[39m keeps the observation replacement path live^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.7251859Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.8275443Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.8600824Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:57.9765398Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.1211221Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.1315582Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.1860665Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.3466069Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.3623532Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.4073217Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.5850955Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.5994441Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.6274004Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.7817426Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.8173000Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:58.8330239Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.0039771Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.0365447Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.2070352Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.2628758Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.2786852Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.4200901Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.4817779Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.5109806Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.6761405Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.6847273Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7285702Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7319522Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7320664Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7321135Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7325445Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mdoes not drive the disposed Track after direct replacement
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7329755Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 250 } to deeply equal { x: 125 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7330390Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7330618Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7331052Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7331266Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7331464Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7331885Z ^[[32m-   "x": 125,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7332369Z ^[[31m+   "x": 250,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7332762Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7332950Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7333935Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m36:45^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7376040Z     ^[[90m 34|^[[39m       scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7391091Z     ^[[90m 35|^[[39m     })^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/Track is disposed/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7391632Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7392722Z     ^[[90m 36|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m125^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7393709Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7394324Z     ^[[90m 37|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7395196Z     ^[[90m 38|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7395593Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7396111Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7396495Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7398786Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves current progress when replacing
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7401132Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 50 } to deeply equal { x: 100 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7401806Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7402262Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7402828Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7403085Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7403285Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7403718Z ^[[32m-   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7404158Z ^[[31m+   "x": 50,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7404637Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7404850Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7405923Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m47:45^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7408504Z     ^[[90m 45|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"scene/arm"^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34mtrack^[[39m(^[[32m"arm"^[[39m^[[33m,^[[39m ^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7409945Z     ^[[90m 46|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7411484Z     ^[[90m 47|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7413043Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7413951Z     ^[[90m 48|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7414765Z     ^[[90m 49|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7415075Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7415991Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7416387Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7418639Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves the original array index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7421108Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 100 } to deeply equal { x: 200 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7421743Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7422028Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7422544Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7422817Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7423034Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7423472Z ^[[32m-   "x": 200,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7423944Z ^[[31m+   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7424391Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7424608Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7425688Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m62:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7428390Z     ^[[90m 60|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"scene/first"^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34mtrack^[[39m(^[[32m"first"^[[39m^[[33m,^[[39m ^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7429925Z     ^[[90m 61|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7431532Z     ^[[90m 62|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/first"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m200^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7433188Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7435005Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/second"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7437422Z     ^[[90m 64|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/third"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7438667Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7439148Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7439506Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7440370Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m41 passed^[[39m^[[22m^[[90m (42)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7441895Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m150 passed^[[39m^[[22m^[[90m (153)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7442899Z ^[[2m   Start at ^[[22m 09:53:56
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7444122Z ^[[2m   Duration ^[[22m 3.71s^[[2m (transform 1.06s, setup 0ms, import 2.97s, tests 781ms, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7444862Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7444878Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7474125Z ##[error]AssertionError: expected { x: 250 } to deeply equal { x: 125 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 125,
integration (node 24)	Run npm run test:integration	+   "x": 250,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:36:45
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7485894Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7489834Z ##[error]AssertionError: expected { x: 50 } to deeply equal { x: 100 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 100,
integration (node 24)	Run npm run test:integration	+   "x": 50,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:47:45
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7492071Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7495375Z ##[error]AssertionError: expected { x: 100 } to deeply equal { x: 200 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 200,
integration (node 24)	Run npm run test:integration	+   "x": 100,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:62:47
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T09:53:59.7939066Z ##[error]Process completed with exit code 1.
```
