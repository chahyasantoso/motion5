# CI log archive: 33310524572

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lv-live-value-updates
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33310524572
- Captured: 2026-08-30T12:05:25Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-30T12:04:50.8591832Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.8592242Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.8631706Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.8631981Z env:
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.8632481Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.8632707Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.9721464Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.9722575Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.9723640Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:50.9724297Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:51.3105213Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:51.3106766Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:51.3107269Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.0062065Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.0293029Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 68^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2033382Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2036314Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2037635Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2038450Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2044518Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2045453Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2045852Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2046529Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2047309Z });
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2048035Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2048537Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2049881Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2051452Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.2372611Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 150^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.3278309Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.3644225Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.5531934Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.6072271Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.8943317Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 59^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.9194009Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:52.9922695Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 56^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.1955643Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.2607566Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.2781614Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.4930882Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.5377184Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.5749390Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.8739702Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.8783821Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:53.9027128Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.1840509Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.2022198Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.2132412Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.4793402Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.4972961Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.5588103Z  ^[[31m❯^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.5623776Z ^[[31m     ^[[31m×^[[31m LV-2 reaches both surfaces from one call^[[39m^[[32m 50^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.5625855Z ^[[31m     ^[[31m×^[[31m LV-3 makes a dependent IK solver recompute from the masked member^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.7812678Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.7992760Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:54.8882598Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.0638791Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.1414022Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.1782034Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.4213170Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.4290751Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.4966878Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.7075143Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.7369463Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.7528095Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:55.9778543Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.0516473Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.0631986Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.2078494Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.2850763Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.3209730Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.4474031Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.5175463Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.5212861Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.7147979Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.7302151Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.8067731Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.9027658Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:56.9642325Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.0326039Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.1213265Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.2556016Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.2771606Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.3165203Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.5003254Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.5052469Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.5522956Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.6708525Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.6989178Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7025399Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7026404Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7026923Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7031008Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/live-value-composition.test.ts^[[2m > ^[[22ma masked value reaches composition and the publisher's MemberState^[[2m > ^[[22mLV-2 reaches both surfaces from one call
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7038176Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 261.1325030024024, …(2) } to not deeply equal { x: 261.1325030024024, …(2) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7038980Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7039705Z ^[[2mCompared values have no visual difference.^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7040116Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7041225Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/live-value-composition.test.ts:^[[2m104:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7082517Z     ^[[90m102|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7083854Z     ^[[90m103|^[[39m     // Ordinary composition: the bone this mask belongs to composes a …
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7085982Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(^[[34mvalues^[[39m(handle^[[33m,^[[39m ^[[33mUPPER^[[39m))^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(before)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7087680Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7089344Z     ^[[90m105|^[[39m     // The publisher-delivered MemberState: the solve read the same 10…
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7091765Z     ^[[90m106|^[[39m     ^[[34mexpect^[[39m(^[[34msolved^[[39m(handle)[^[[33mUPPER^[[39m])^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7092889Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7093394Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7093775Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7095996Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/live-value-composition.test.ts^[[2m > ^[[22ma masked value reaches composition and the publisher's MemberState^[[2m > ^[[22mLV-3 makes a dependent IK solver recompute from the masked member
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7099051Z ^[[31m^[[1mAssertionError^[[22m: expected 40.1680100853265 to not be close to 40.168, received difference is 0.000010085326501041436, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7100923Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/live-value-composition.test.ts:^[[2m123:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7101960Z     ^[[90m121|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7102838Z     ^[[90m122|^[[39m     // A member's length is an input to the solve, so both published r…
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7104350Z     ^[[90m123|^[[39m     ^[[34mexpect^[[39m(^[[34msolved^[[39m(handle)[^[[33mUPPER^[[39m])^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7105453Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7106442Z     ^[[90m124|^[[39m     ^[[34mexpect^[[39m(^[[34msolved^[[39m(handle)[^[[33mFOREARM^[[39m])^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[33m-^[[39m^[[34m51.318^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7107676Z     ^[[90m125|^[[39m     // Recomputed rather than merely different: the tip is on the goal…
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7108016Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7108272Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7108486Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7108538Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7109004Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m60 passed^[[39m^[[22m^[[90m (61)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7110197Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m252 passed^[[39m^[[22m^[[90m (254)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7111103Z ^[[2m   Start at ^[[22m 12:04:51
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7111803Z ^[[2m   Duration ^[[22m 6.37s^[[2m (transform 1.67s, setup 450ms, import 5.34s, tests 1.72s, environment 10ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7112440Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7127140Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7151779Z ##[error]AssertionError: expected { x: 261.1325030024024, …(2) } to not deeply equal { x: 261.1325030024024, …(2) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Compared values have no visual difference.
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/live-value-composition.test.ts:104:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7161218Z 
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7163847Z ##[error]AssertionError: expected 40.1680100853265 to not be close to 40.168, received difference is 0.000010085326501041436, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/live-value-composition.test.ts:123:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T12:04:57.7497981Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-30T12:05:00.9077778Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-30T12:05:00.9078101Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-30T12:05:00.9097642Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-30T12:05:00.9097941Z env:
quality (node 24)	Run npm test	2026-08-30T12:05:00.9098258Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-30T12:05:00.9098483Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-30T12:05:00.9823591Z 
quality (node 24)	Run npm test	2026-08-30T12:05:00.9824749Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-30T12:05:00.9825188Z > vitest run
quality (node 24)	Run npm test	2026-08-30T12:05:00.9825410Z 
quality (node 24)	Run npm test	2026-08-30T12:05:01.2337915Z 
quality (node 24)	Run npm test	2026-08-30T12:05:01.2340829Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:01.2341338Z 
quality (node 24)	Run npm test	2026-08-30T12:05:01.5484446Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:01.5587664Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:01.6976077Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:01.7526404Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-30T12:05:01.7529835Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T12:05:01.7541084Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T12:05:01.7541591Z 
quality (node 24)	Run npm test	2026-08-30T12:05:01.7542012Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T12:05:01.7542344Z 
quality (node 24)	Run npm test	2026-08-30T12:05:01.7542527Z act(() => {
quality (node 24)	Run npm test	2026-08-30T12:05:01.7542848Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T12:05:01.7543236Z });
quality (node 24)	Run npm test	2026-08-30T12:05:01.7543570Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T12:05:01.7543787Z 
quality (node 24)	Run npm test	2026-08-30T12:05:01.7544251Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T12:05:01.7544775Z 
quality (node 24)	Run npm test	2026-08-30T12:05:01.7658113Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:01.7753405Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 65^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:01.8751655Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:01.9251015Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:01.9534608Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.0517246Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.0927975Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.1014172Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.2476950Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.2512002Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.3000011Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4606840Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4608773Z ^[[31m     ^[[31m×^[[31m LV-4 never reaches replace(), and a real replace() drops the mask^[[39m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4619283Z      ^[[32m✓^[[39m LV-5 invalidates exactly once and returns that batch^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4620712Z ^[[31m     ^[[31m×^[[31m LV-8 rewrites the retained definition and keeps topology and progress^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4622820Z ^[[31m     ^[[31m×^[[31m LV-9 merges partially and preserves the observation the track declared^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4624347Z ^[[31m     ^[[31m×^[[31m LV-10 invalidates the dependent, asserted on its patch rather than on a flag^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4625317Z ^[[31m     ^[[31m×^[[31m LV-11 refuses an animated key by name and commits nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4625992Z      ^[[32m✓^[[39m LV-13 refuses both new members on a stale handle^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4697105Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.4738371Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 73^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.6131089Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.6133325Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.6134651Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.7588048Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.7593354Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.9032308Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.9103524Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:02.9896695Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.0621446Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.0776480Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.1467925Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.1970974Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.2726456Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.2845907Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.3287643Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.4089766Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.4270684Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.5099378Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.5699024Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.6151877Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.6728841Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.6915810Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.7469453Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.8500593Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.8561272Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:03.8789160Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.0052306Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.0137145Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.0495957Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.1589194Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.1808566Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.2011844Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.3164593Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.3445462Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.4724395Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.4920798Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.5995876Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.6025757Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.7441684Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.8091921Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:04.9235188Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.0370321Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.1212547Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.2202781Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.3269175Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.3942021Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.4825325Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.6006900Z  ^[[31m❯^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.6013148Z ^[[31m     ^[[31m×^[[31m LV-2 reaches both surfaces from one call^[[39m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.6014330Z ^[[31m     ^[[31m×^[[31m LV-3 makes a dependent IK solver recompute from the masked member^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.6435648Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.7693828Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.8512085Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:05.9596223Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.0275858Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.1797682Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.1799174Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.3508962Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.3910591Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.4234027Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2125^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.4235778Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2122^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.5082163Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.5432255Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.5936235Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.6316531Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.7145215Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.7505842Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.8014500Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.8546720Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.8651476Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:06.9335924Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.0124358Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.0606226Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.1661757Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.2225357Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.3153598Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.3617204Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.5021202Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.5052058Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.6802660Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.6964085Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.8335550Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:07.8972446Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.0482187Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.0922477Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.2310865Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.2334267Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.3831328Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.4180019Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-30T12:05:08.4182151Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T12:05:08.4183070Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T12:05:08.4183533Z 
quality (node 24)	Run npm test	2026-08-30T12:05:08.4184049Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T12:05:08.4184500Z 
quality (node 24)	Run npm test	2026-08-30T12:05:08.4184738Z act(() => {
quality (node 24)	Run npm test	2026-08-30T12:05:08.4185200Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T12:05:08.4185728Z });
quality (node 24)	Run npm test	2026-08-30T12:05:08.4186219Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T12:05:08.4186550Z 
quality (node 24)	Run npm test	2026-08-30T12:05:08.4187345Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T12:05:08.4201166Z 
quality (node 24)	Run npm test	2026-08-30T12:05:08.4261414Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-30T12:05:08.4267232Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T12:05:08.4269419Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T12:05:08.4270057Z 
quality (node 24)	Run npm test	2026-08-30T12:05:08.4270484Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T12:05:08.4271752Z 
quality (node 24)	Run npm test	2026-08-30T12:05:08.4272017Z act(() => {
quality (node 24)	Run npm test	2026-08-30T12:05:08.4272458Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T12:05:08.4272978Z });
quality (node 24)	Run npm test	2026-08-30T12:05:08.4273361Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T12:05:08.4273652Z 
quality (node 24)	Run npm test	2026-08-30T12:05:08.4274321Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T12:05:08.4275853Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.4276507Z 
quality (node 24)	Run npm test	2026-08-30T12:05:08.5149195Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.6305391Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.6840921Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.8027494Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.8485172Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.9564921Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:08.9792281Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.0956271Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.1291101Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.2317919Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.3121988Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.3744324Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.4521898Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.5316500Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.6362140Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.6847461Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.7794338Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.8148163Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.9325215Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:09.9938513Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.0590722Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.1201981Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.1841990Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.2655561Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-30T12:05:10.2678096Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T12:05:10.2701128Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T12:05:10.2711162Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.2730513Z 
quality (node 24)	Run npm test	2026-08-30T12:05:10.2762982Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T12:05:10.2763414Z 
quality (node 24)	Run npm test	2026-08-30T12:05:10.2763535Z act(() => {
quality (node 24)	Run npm test	2026-08-30T12:05:10.2763974Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T12:05:10.2764324Z });
quality (node 24)	Run npm test	2026-08-30T12:05:10.2764613Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T12:05:10.2764862Z 
quality (node 24)	Run npm test	2026-08-30T12:05:10.2765435Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T12:05:10.2765977Z 
quality (node 24)	Run npm test	2026-08-30T12:05:10.3236920Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.4111312Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.4652920Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.5716491Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.6080979Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.7184312Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.7802257Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.9094606Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:10.9126556Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.0585210Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.0728360Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.1238340Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 4151^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.1240271Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1095^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.1242034Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1136^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.1823273Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.2093501Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.2708228Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.3097641Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.3367767Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.3817046Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.4250272Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.4529033Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.4994817Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.5492688Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.5991752Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.6294741Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.7184718Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.7361887Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.7971848Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.8740724Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.8807508Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.9561805Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.9914847Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.9937249Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.9978493Z 
quality (node 24)	Run npm test	2026-08-30T12:05:11.9979261Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 7 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.9979524Z 
quality (node 24)	Run npm test	2026-08-30T12:05:11.9981895Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/live-value-composition.test.ts^[[2m > ^[[22ma masked value reaches composition and the publisher's MemberState^[[2m > ^[[22mLV-2 reaches both surfaces from one call
quality (node 24)	Run npm test	2026-08-30T12:05:11.9985357Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 261.1325030024024, …(2) } to not deeply equal { x: 261.1325030024024, …(2) }^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:11.9985699Z 
quality (node 24)	Run npm test	2026-08-30T12:05:11.9985944Z ^[[2mCompared values have no visual difference.^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:11.9986153Z 
quality (node 24)	Run npm test	2026-08-30T12:05:11.9986552Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/live-value-composition.test.ts:^[[2m104:39^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0010153Z     ^[[90m102|^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0011099Z     ^[[90m103|^[[39m     // Ordinary composition: the bone this mask belongs to composes a …
quality (node 24)	Run npm test	2026-08-30T12:05:12.0012245Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(^[[34mvalues^[[39m(handle^[[33m,^[[39m ^[[33mUPPER^[[39m))^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(before)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0013139Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0013993Z     ^[[90m105|^[[39m     // The publisher-delivered MemberState: the solve read the same 10…
quality (node 24)	Run npm test	2026-08-30T12:05:12.0015112Z     ^[[90m106|^[[39m     ^[[34mexpect^[[39m(^[[34msolved^[[39m(handle)[^[[33mUPPER^[[39m])^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0015826Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0016310Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0016659Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0017885Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/live-value-composition.test.ts^[[2m > ^[[22ma masked value reaches composition and the publisher's MemberState^[[2m > ^[[22mLV-3 makes a dependent IK solver recompute from the masked member
quality (node 24)	Run npm test	2026-08-30T12:05:12.0019865Z ^[[31m^[[1mAssertionError^[[22m: expected 40.1680100853265 to not be close to 40.168, received difference is 0.000010085326501041436, but expected 0.0005^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0021260Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/live-value-composition.test.ts:^[[2m123:39^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0021982Z     ^[[90m121|^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0022763Z     ^[[90m122|^[[39m     // A member's length is an input to the solve, so both published r…
quality (node 24)	Run npm test	2026-08-30T12:05:12.0023909Z     ^[[90m123|^[[39m     ^[[34mexpect^[[39m(^[[34msolved^[[39m(handle)[^[[33mUPPER^[[39m])^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0025036Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0026174Z     ^[[90m124|^[[39m     ^[[34mexpect^[[39m(^[[34msolved^[[39m(handle)[^[[33mFOREARM^[[39m])^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[33m-^[[39m^[[34m51.318^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0027394Z     ^[[90m125|^[[39m     // Recomputed rather than merely different: the tip is on the goal…
quality (node 24)	Run npm test	2026-08-30T12:05:12.0027960Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0028329Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0028696Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0030064Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-updates.test.ts^[[2m > ^[[22mlive values reach the graph without replacing it^[[2m > ^[[22mLV-4 never reaches replace(), and a real replace() drops the mask
quality (node 24)	Run npm test	2026-08-30T12:05:12.0031745Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 200, y: 300, rotation: 45 } to deeply equal { x: 200, y: 320, rotation: 45 }^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0032313Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0032588Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0033050Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0033346Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0033593Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0034080Z ^[[2m    "rotation": 45,^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0034565Z ^[[2m    "x": 200,^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0035027Z ^[[32m-   "y": 320,^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0035754Z ^[[31m+   "y": 300,^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0036180Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0036481Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0037166Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-updates.test.ts:^[[2m138:33^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0037933Z     ^[[90m136|^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0038784Z     ^[[90m137|^[[39m     ^[[34mexpect^[[39m(replaceGraph)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0040017Z     ^[[90m138|^[[39m     expect(values(handle, ARM)).toEqual({ x: 200, y: 320, rotation: 45…
quality (node 24)	Run npm test	2026-08-30T12:05:12.0040830Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0041418Z     ^[[90m139|^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0042031Z     ^[[90m140|^[[39m     // Stickiness ends at a real replacement by construction rather th…
quality (node 24)	Run npm test	2026-08-30T12:05:12.0042528Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0043171Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0043512Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0044637Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-updates.test.ts^[[2m > ^[[22mlive values reach the graph without replacing it^[[2m > ^[[22mLV-8 rewrites the retained definition and keeps topology and progress
quality (node 24)	Run npm test	2026-08-30T12:05:12.0045992Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 200, y: 300, rotation: 45 } to deeply equal { x: 260, y: 300, rotation: 45 }^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0046524Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0046804Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0047214Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0047540Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0047819Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0048255Z ^[[2m    "rotation": 45,^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0049292Z ^[[32m-   "x": 260,^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0049902Z ^[[31m+   "x": 200,^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0050109Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0050364Z ^[[2m    "y": 300,^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0050774Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0050994Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0051498Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-updates.test.ts:^[[2m193:33^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0052276Z     ^[[90m191|^[[39m     // Progress survives because nothing recompiled: the interpolator …
quality (node 24)	Run npm test	2026-08-30T12:05:12.0053325Z     ^[[90m192|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[33mARM^[[39m)^[[33m?.^[[39msourceProgress)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0.5^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0054171Z     ^[[90m193|^[[39m     expect(values(handle, ARM)).toEqual({ x: 260, y: 300, rotation: 45…
quality (node 24)	Run npm test	2026-08-30T12:05:12.0054902Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0055701Z     ^[[90m194|^[[39m     ^[[34mexpect^[[39m(replaceGraph)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0056514Z     ^[[90m195|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0056872Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0057222Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0057605Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0058701Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-updates.test.ts^[[2m > ^[[22mlive values reach the graph without replacing it^[[2m > ^[[22mLV-9 merges partially and preserves the observation the track declared
quality (node 24)	Run npm test	2026-08-30T12:05:12.0060405Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 200, y: 300, rotation: 45 } to deeply equal { x: 260, y: 300, rotation: 45 }^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0061041Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0061333Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0061772Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0062249Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0062563Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0063034Z ^[[2m    "rotation": 45,^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0063466Z ^[[32m-   "x": 260,^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0063999Z ^[[31m+   "x": 200,^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0064386Z ^[[2m    "y": 300,^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0064830Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0065088Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0065679Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-updates.test.ts:^[[2m218:33^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0066385Z     ^[[90m216|^[[39m       }^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0067012Z     ^[[90m217|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0067925Z     ^[[90m218|^[[39m     expect(values(handle, ARM)).toEqual({ x: 260, y: 300, rotation: 45…
quality (node 24)	Run npm test	2026-08-30T12:05:12.0068581Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0069589Z     ^[[90m219|^[[39m     ^[[34mexpect^[[39m(^[[34mretained^[[39m(leg))^[[33m.^[[39m^[[34mtoEqual^[[39m({ values^[[33m:^[[39m { x^[[33m:^[[39m ^[[34m40^[[39m } })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0070738Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m157 passed^[[39m^[[22m^[[90m (159)^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0071809Z     ^[[90m220|^[[39m     ^[[34mexpect^[[39m(leg^[[33m.^[[39mtrack^[[33m.^[[39mobserves)^[[33m.^[[39m^[[34mtoEqual^[[39m([{ source^[[33m:^[[39m ^[[33mARM^[[39m }])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0072410Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0072860Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0073394Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0074764Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-updates.test.ts^[[2m > ^[[22mlive values reach the graph without replacing it^[[2m > ^[[22mLV-10 invalidates the dependent, asserted on its patch rather than on a flag
quality (node 24)	Run npm test	2026-08-30T12:05:12.0076027Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'hero/leg'^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0076975Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-updates.test.ts:^[[2m232:56^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0078791Z     ^[[90m230|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m arm^[[33m.^[[39m^[[34msetValues^[[39m({ x^[[33m:^[[39m ^[[34m260^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0079503Z     ^[[90m231|^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0080597Z     ^[[90m232|^[[39m     ^[[34mexpect^[[39m(batch^[[33m.^[[39mpatches^[[33m.^[[39m^[[34mmap^[[39m((patch) ^[[33m=>^[[39m patch^[[33m.^[[39mnodeId))^[[33m.^[[39m^[[34mtoContain^[[39m(^[[33mLEG^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0081623Z     ^[[90m   |^[[39m                                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0082542Z     ^[[90m233|^[[39m     ^[[34mexpect^[[39m(batch^[[33m.^[[39mpatches^[[33m.^[[39mlength)^[[33m.^[[39m^[[34mtoBeGreaterThan^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0083417Z     ^[[90m234|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0083701Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0084033Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0084308Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0085405Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-updates.test.ts^[[2m > ^[[22mlive values reach the graph without replacing it^[[2m > ^[[22mLV-11 refuses an animated key by name and commits nothing
quality (node 24)	Run npm test	2026-08-30T12:05:12.0086543Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0087431Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-updates.test.ts:^[[2m260:10^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0088185Z     ^[[90m258|^[[39m           ^[[35mthrow^[[39m error^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0088632Z     ^[[90m259|^[[39m         }
quality (node 24)	Run npm test	2026-08-30T12:05:12.0089220Z     ^[[90m260|^[[39m       })^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTypeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0089929Z     ^[[90m   |^[[39m          ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0090820Z     ^[[90m261|^[[39m       ^[[34mexpect^[[39m((thrown ^[[35mas^[[39m { ruleId^[[33m?^[[39m^[[33m:^[[39m string })^[[33m.^[[39mruleId)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[33mRULE_ID^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0091607Z     ^[[90m262|^[[39m     }
quality (node 24)	Run npm test	2026-08-30T12:05:12.0091786Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0092101Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0092411Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0092914Z ^[[2m      Tests ^[[22m ^[[1m^[[31m7 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m759 passed^[[39m^[[22m^[[90m (766)^[[39m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0093560Z ^[[2m   Start at ^[[22m 12:05:01
quality (node 24)	Run npm test	2026-08-30T12:05:12.0094335Z ^[[2m   Duration ^[[22m 10.75s^[[2m (transform 1.69s, setup 684ms, import 5.72s, tests 8.10s, environment 13ms)^[[22m
quality (node 24)	Run npm test	2026-08-30T12:05:12.0094801Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0094808Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0117305Z ##[error]AssertionError: expected { x: 261.1325030024024, …(2) } to not deeply equal { x: 261.1325030024024, …(2) }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Compared values have no visual difference.
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/live-value-composition.test.ts:104:39
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T12:05:12.0125115Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0127906Z ##[error]AssertionError: expected 40.1680100853265 to not be close to 40.168, received difference is 0.000010085326501041436, but expected 0.0005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/live-value-composition.test.ts:123:39
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T12:05:12.0129418Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0131708Z ##[error]AssertionError: expected { x: 200, y: 300, rotation: 45 } to deeply equal { x: 200, y: 320, rotation: 45 }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	    "rotation": 45,
quality (node 24)	Run npm test	    "x": 200,
quality (node 24)	Run npm test	-   "y": 320,
quality (node 24)	Run npm test	+   "y": 300,
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-updates.test.ts:138:33
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T12:05:12.0133060Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0135036Z ##[error]AssertionError: expected { x: 200, y: 300, rotation: 45 } to deeply equal { x: 260, y: 300, rotation: 45 }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	    "rotation": 45,
quality (node 24)	Run npm test	-   "x": 260,
quality (node 24)	Run npm test	+   "x": 200,
quality (node 24)	Run npm test	    "y": 300,
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-updates.test.ts:193:33
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T12:05:12.0136470Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0138400Z ##[error]AssertionError: expected { x: 200, y: 300, rotation: 45 } to deeply equal { x: 260, y: 300, rotation: 45 }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	    "rotation": 45,
quality (node 24)	Run npm test	-   "x": 260,
quality (node 24)	Run npm test	+   "x": 200,
quality (node 24)	Run npm test	    "y": 300,
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-updates.test.ts:218:33
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T12:05:12.0139888Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0141442Z ##[error]AssertionError: expected [] to include 'hero/leg'
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-updates.test.ts:232:56
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T12:05:12.0142472Z 
quality (node 24)	Run npm test	2026-08-30T12:05:12.0143976Z ##[error]AssertionError: expected function to throw an error, but it didn't
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-updates.test.ts:260:10
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T12:05:12.0552900Z ##[error]Process completed with exit code 1.
```
