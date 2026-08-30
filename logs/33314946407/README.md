# CI log archive: 33314946407

- Workflow: CI
- Conclusion: failure
- Head branch: feat/pk-patch-key-animated-live-values
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33314946407
- Captured: 2026-08-30T13:44:32Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-30T13:43:46.6432735Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.6433087Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.6472399Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.6472877Z env:
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.6473076Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.6473286Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.7460287Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.7461032Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.7461762Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:46.7462164Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.0552327Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.0556220Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.0557100Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.6090559Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.6370136Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 56^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7918552Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7921849Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7948931Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7963133Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7963710Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7964651Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7965146Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7966031Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7966974Z });
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7967504Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7968278Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7969843Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.7971011Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.8230350Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 130^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.8830210Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:47.9520675Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:48.0859289Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:48.1200067Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:48.4293518Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:48.4449508Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:48.5306146Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:48.7379923Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:48.7658586Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:48.8358429Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.0223902Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.0609632Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.1467007Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.3439550Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.4592175Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.4680171Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.6510364Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.7854623Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.7951331Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:49.9269907Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.0638948Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.1085333Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.2060769Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.3881951Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.4114390Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.5146359Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.6879816Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.7252495Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.8166442Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:50.9850084Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.1038206Z  ^[[31m❯^[[39m packages/core/test/integration/live-animated-values.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.1046636Z ^[[31m     ^[[31m×^[[31m PK-13 rewrites an animated key on the live timeline^[[39m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.1453559Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.2862349Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.3862694Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.4562740Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.5992466Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.6717935Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.7590029Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.8846968Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:51.9250053Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.0159202Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.1560061Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.1815285Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.2709839Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.4249991Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.4424229Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.6021464Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.6279718Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.7324042Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.8445271Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:52.8929755Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.0369705Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.1229836Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.1365023Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.3003473Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.3823089Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.4240733Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5564902Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5574843Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5638947Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5640211Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5640867Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5645460Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/live-animated-values.test.ts^[[2m > ^[[22man animated authored value moves without a recompile^[[2m > ^[[22mPK-13 rewrites an animated key on the live timeline
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5649406Z ^[[31m^[[1mLiveValueKeyError^[[22m: Key "rotation" of track "hero/arm" is animated and cannot carry a live value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5651730Z ^[[36m ^[[2m❯^[[22m Track.#acceptedValues packages/core/src/domain/track.ts:^[[2m232:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5701080Z     ^[[90m230|^[[39m       if (!Object.hasOwn(authored, key)) throw new LiveValueKeyError(t…
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5709126Z     ^[[90m231|^[[39m       ^[[35mif^[[39m (^[[34mreadAuthoredLeaf^[[39m(authored[key])^[[33m.^[[39mkind ^[[33m===^[[39m ^[[32m"animated"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5709920Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5721118Z     ^[[90m232|^[[39m         ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mLiveValueKeyError^[[39m(^[[35mthis^[[39m^[[33m.^[[39m#nodeId^[[33m,^[[39m key^[[33m,^[[39m ^[[32m"animated"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5723104Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m61 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5724743Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5725999Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m254 passed^[[39m^[[22m^[[90m (255)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5727505Z     ^[[90m233|^[[39m       accepted[key] ^[[33m=^[[39m value^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5728538Z     ^[[90m234|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5729599Z ^[[90m ^[[2m❯^[[22m Track.overrideValues packages/core/src/domain/track.ts:^[[2m210:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5731049Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.#overrideValues packages/core/src/engine.ts:^[[2m406:65^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5732685Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.#writeValues packages/core/src/runtime/project-runtime.ts:^[[2m500:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5734280Z ^[[90m ^[[2m❯^[[22m Object.setValues packages/core/src/runtime/project-runtime.ts:^[[2m422:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5735749Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/live-animated-values.test.ts:^[[2m78:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5736409Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5736830Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5737199Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5737508Z ^[[2m   Start at ^[[22m 13:43:47
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5738892Z ^[[2m   Duration ^[[22m 6.48s^[[2m (transform 1.49s, setup 489ms, import 5.28s, tests 1.79s, environment 10ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5739620Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5753515Z 
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.5789601Z ##[error]LiveValueKeyError: Key "rotation" of track "hero/arm" is animated and cannot carry a live value.
integration (node 24)	Run npm run test:integration	 ❯ Track.#acceptedValues packages/core/src/domain/track.ts:232:15
integration (node 24)	Run npm run test:integration	 ❯ Track.overrideValues packages/core/src/domain/track.ts:210:25
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#overrideValues packages/core/src/engine.ts:406:65
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#writeValues packages/core/src/runtime/project-runtime.ts:500:10
integration (node 24)	Run npm run test:integration	 ❯ Object.setValues packages/core/src/runtime/project-runtime.ts:422:17
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/live-animated-values.test.ts:78:19
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
integration (node 24)	Run npm run test:integration	Serialized Error: { ruleId: 'live-value-key', nodeId: 'hero/arm', key: 'rotation', reason: 'animated' }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T13:43:53.6153702Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-30T13:43:58.3213653Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-30T13:43:58.3213957Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-30T13:43:58.3252268Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-30T13:43:58.3252556Z env:
quality (node 24)	Run npm test	2026-08-30T13:43:58.3252769Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-30T13:43:58.3252989Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-30T13:43:58.4250830Z 
quality (node 24)	Run npm test	2026-08-30T13:43:58.4251484Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-30T13:43:58.4252006Z > vitest run
quality (node 24)	Run npm test	2026-08-30T13:43:58.4252194Z 
quality (node 24)	Run npm test	2026-08-30T13:43:58.7245706Z 
quality (node 24)	Run npm test	2026-08-30T13:43:58.7257198Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:58.7257917Z 
quality (node 24)	Run npm test	2026-08-30T13:43:59.0759186Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:59.2090037Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:59.4160000Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:59.5818374Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 66^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:59.6528212Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-30T13:43:59.6577366Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T13:43:59.6607575Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T13:43:59.6625484Z 
quality (node 24)	Run npm test	2026-08-30T13:43:59.6664835Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T13:43:59.6675580Z 
quality (node 24)	Run npm test	2026-08-30T13:43:59.6698034Z act(() => {
quality (node 24)	Run npm test	2026-08-30T13:43:59.6735824Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T13:43:59.6747076Z });
quality (node 24)	Run npm test	2026-08-30T13:43:59.6825721Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T13:43:59.6826175Z 
quality (node 24)	Run npm test	2026-08-30T13:43:59.6827355Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T13:43:59.6828339Z 
quality (node 24)	Run npm test	2026-08-30T13:43:59.6877088Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:59.6907447Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 120^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:59.9069375Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:59.9497607Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:43:59.9611266Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.2322781Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.2329966Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4082451Z  ^[[31m❯^[[39m packages/core/test/contract/gsap-patch-key.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m11 failed^[[39m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4084588Z ^[[31m     ^[[31m×^[[31m PK-1 rebuilds from a bare array and refuses the retired wrapper^[[39m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4087010Z ^[[31m     ^[[31m×^[[31m PK-2 builds no second timeline and never kills the whole one^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4088357Z ^[[31m     ^[[31m×^[[31m PK-3 leaves every sibling child the same object, unkilled^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4089647Z ^[[31m     ^[[31m×^[[31m PK-4 refuses a key that was never animated, and changes nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4091473Z ^[[31m     ^[[31m×^[[31m PK-5 refuses a static key, structurally rather than by name^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4093409Z ^[[31m     ^[[31m×^[[31m PK-6 refuses a leaf whose stops all filter away, without diagnostics^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4094727Z ^[[31m     ^[[31m×^[[31m PK-7 refuses a patch that collides with a sibling's ease^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4096703Z ^[[31m     ^[[31m×^[[31m PK-8 compiles a later patch against the record an earlier one left^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4098478Z ^[[31m     ^[[31m×^[[31m PK-9 re-seeds the proxy, so state carries only the new stops^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4100194Z ^[[31m     ^[[31m×^[[31m PK-10 keeps the total duration and the terminal padding tween^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4101833Z      ^[[32m✓^[[39m PK-11 leaves the one-tween interpolator without the capability^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4103655Z ^[[31m     ^[[31m×^[[31m PK-12 is indistinguishable from a fresh create with the same config^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.4867599Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.5537652Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.7132652Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.7311840Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.8998940Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.9089822Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 152^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:00.9770957Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.1200729Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.1811338Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.2074074Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.4383029Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.4647526Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.4955995Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/live-animated-values.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 61^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.4958119Z      ^[[32m✓^[[39m PK-14 still refuses an animated key on overrideValues^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.4960028Z ^[[31m     ^[[31m×^[[31m PK-15 refuses a kind change and an unknown key, one reason each^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.4986716Z ^[[31m     ^[[31m×^[[31m PK-16 escalates to one recompile when the interpolator declines^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.4999333Z ^[[31m     ^[[31m×^[[31m PK-17 refuses a malformed leaf through the definition validator^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.5001277Z ^[[31m     ^[[31m×^[[31m PK-18 kills the guards a passing suite would leave alive^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.7281634Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.7344081Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.7453023Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.9743605Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.9816914Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:01.9839027Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.2206145Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.2296853Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.2579480Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.4312393Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.4378681Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.5147178Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.6572907Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.7395297Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.7577235Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.8603668Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:02.9460965Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.0040499Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.1134513Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.1712582Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.2307941Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.3244065Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.4161523Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.4687688Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.5250587Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.6213346Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.7249322Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.8707076Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:03.9823371Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:04.0997681Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:04.1847284Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:04.3226252Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:04.6027424Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:04.6089900Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:04.9586739Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:04.9789506Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:05.2573612Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:05.3787668Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:05.5643914Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:05.6643420Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:05.7777142Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:05.8883319Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:06.0037169Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:06.1909432Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:06.2295547Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:06.4314157Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:06.5044553Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:06.6550174Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:06.8307398Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:06.8742597Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.0507924Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3337^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.0512786Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3333^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.1097208Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.1529234Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.2836543Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.3444039Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.3862698Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.5294975Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.5668046Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.6614100Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.7477026Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.7881375Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:07.8567313Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.0450372Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.0529098Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.3118175Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.3910387Z  ^[[31m❯^[[39m packages/core/test/integration/live-animated-values.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.3921313Z ^[[31m     ^[[31m×^[[31m PK-13 rewrites an animated key on the live timeline^[[39m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.6043540Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.6337432Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.8623534Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:08.9246317Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:09.0928177Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:09.2487799Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:09.3954713Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:09.4853302Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:09.6375009Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:09.7697229Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:09.8928520Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.0614548Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.1169099Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.3030019Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.4094682Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-30T13:44:10.4097494Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T13:44:10.4098928Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T13:44:10.4105989Z 
quality (node 24)	Run npm test	2026-08-30T13:44:10.4107258Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T13:44:10.4108130Z 
quality (node 24)	Run npm test	2026-08-30T13:44:10.4108514Z act(() => {
quality (node 24)	Run npm test	2026-08-30T13:44:10.4109271Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T13:44:10.4110056Z });
quality (node 24)	Run npm test	2026-08-30T13:44:10.4110682Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T13:44:10.4111254Z 
quality (node 24)	Run npm test	2026-08-30T13:44:10.4112538Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T13:44:10.4113862Z 
quality (node 24)	Run npm test	2026-08-30T13:44:10.4251976Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-30T13:44:10.4254349Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T13:44:10.4255810Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T13:44:10.4256248Z 
quality (node 24)	Run npm test	2026-08-30T13:44:10.4256870Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T13:44:10.4257535Z 
quality (node 24)	Run npm test	2026-08-30T13:44:10.4257722Z act(() => {
quality (node 24)	Run npm test	2026-08-30T13:44:10.4258210Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T13:44:10.4258712Z });
quality (node 24)	Run npm test	2026-08-30T13:44:10.4259143Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T13:44:10.4259450Z 
quality (node 24)	Run npm test	2026-08-30T13:44:10.4260506Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T13:44:10.4261749Z 
quality (node 24)	Run npm test	2026-08-30T13:44:10.4263287Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.5098211Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.7074440Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.7690513Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.9636917Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:10.9746134Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:11.1867703Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:11.2127145Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:11.4407265Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:11.4695594Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:11.6739591Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:11.7630883Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:11.8954449Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.0152138Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.1312447Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.3176533Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.3298773Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.5207619Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.5687711Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.7306351Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.8096406Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.9653587Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:12.9907353Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:13.1836185Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:13.2260779Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-30T13:44:13.2263494Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T13:44:13.2264943Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T13:44:13.2274073Z 
quality (node 24)	Run npm test	2026-08-30T13:44:13.2274983Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T13:44:13.2276122Z 
quality (node 24)	Run npm test	2026-08-30T13:44:13.2276498Z act(() => {
quality (node 24)	Run npm test	2026-08-30T13:44:13.2277193Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T13:44:13.2277926Z });
quality (node 24)	Run npm test	2026-08-30T13:44:13.2278547Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T13:44:13.2279024Z 
quality (node 24)	Run npm test	2026-08-30T13:44:13.2280250Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T13:44:13.2281521Z 
quality (node 24)	Run npm test	2026-08-30T13:44:13.2287990Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:13.4380797Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:13.4476988Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:13.7019857Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:13.7237444Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:13.8994211Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:13.9578075Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.1288252Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.2736837Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.3405330Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.4057554Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6451^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.4059618Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1760^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.4061306Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1756^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.5147733Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.5436125Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.6084751Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.7163752Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.7783633Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.8008788Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.9112045Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.9799537Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:14.9877185Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.1065918Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.1638763Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.1892284Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.3074392Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.3610860Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.4263160Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.5246060Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.6029119Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.6452535Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.7492123Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.8406922Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.8458750Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9116643Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9166282Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9167190Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 16 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9167736Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9172608Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-1 rebuilds from a bare array and refuses the retired wrapper
quality (node 24)	Run npm test	2026-08-30T13:44:15.9178705Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9179449Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9179968Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9180895Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9181280Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9182454Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9242151Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9243636Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9247485Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9248788Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9250398Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9251560Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9252539Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m196:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9253177Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9253605Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9253960Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9256057Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-2 builds no second timeline and never kills the whole one
quality (node 24)	Run npm test	2026-08-30T13:44:15.9258621Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9259260Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9259657Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9260356Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9260689Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9261506Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9262795Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9264190Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9266484Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9267925Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9269549Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9270696Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9271648Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m213:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9272251Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9272668Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9273022Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9274863Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-3 leaves every sibling child the same object, unkilled
quality (node 24)	Run npm test	2026-08-30T13:44:15.9277350Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9278009Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9278437Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9279153Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9279490Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9280388Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9281691Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9283072Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9284729Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9286137Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9287741Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9288940Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9289930Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m226:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9290533Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9290950Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9291308Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9293204Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-4 refuses a key that was never animated, and changes nothing
quality (node 24)	Run npm test	2026-08-30T13:44:15.9297114Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9297786Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9298236Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9298953Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9299290Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9300120Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9301687Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9303077Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9304746Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9305829Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9306764Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9307440Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9307998Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m237:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9308354Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9308596Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9308988Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9310042Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-5 refuses a static key, structurally rather than by name
quality (node 24)	Run npm test	2026-08-30T13:44:15.9311244Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9311624Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9311859Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9312264Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9312462Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9312928Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9313668Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9314476Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9315755Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9316477Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9317406Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9318187Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9318750Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m249:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9319097Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9319338Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9319553Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9320639Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-6 refuses a leaf whose stops all filter away, without diagnostics
quality (node 24)	Run npm test	2026-08-30T13:44:15.9321887Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9322262Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9322482Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9322883Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9323082Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9323542Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9324287Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9325222Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9326176Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9326872Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9327955Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9328627Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9329668Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m257:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9330238Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9330650Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9330992Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9332754Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-7 refuses a patch that collides with a sibling's ease
quality (node 24)	Run npm test	2026-08-30T13:44:15.9334028Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9334403Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9334639Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9335449Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9335662Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9336143Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9336899Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9337694Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9338650Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9339346Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9340258Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9340927Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9341482Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m273:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9341836Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9342079Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9342287Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9343376Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-8 compiles a later patch against the record an earlier one left
quality (node 24)	Run npm test	2026-08-30T13:44:15.9344615Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9344983Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9345516Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9345943Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9346143Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9346608Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9347351Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9348153Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9349100Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9349782Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9350678Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9351342Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9351887Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m279:24^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9352234Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9352475Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9352680Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9353732Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-9 re-seeds the proxy, so state carries only the new stops
quality (node 24)	Run npm test	2026-08-30T13:44:15.9355224Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9355599Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9355829Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9356229Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9356425Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9356881Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9357611Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9358397Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9359335Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9360162Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9361053Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9361721Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9362253Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m296:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9362596Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9362829Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9363032Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9364076Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-10 keeps the total duration and the terminal padding tween
quality (node 24)	Run npm test	2026-08-30T13:44:15.9365413Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9365797Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9366027Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9366428Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9366621Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9367065Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9367817Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9368598Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9369538Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9370227Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9371116Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9371803Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9372336Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m312:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9372679Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9372912Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9373114Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9374187Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-key.test.ts^[[2m > ^[[22ma patched key is rebuilt on the live timeline, or nothing happens^[[2m > ^[[22mPK-12 is indistinguishable from a fresh create with the same config
quality (node 24)	Run npm test	2026-08-30T13:44:15.9375522Z ^[[31m^[[1mAssertionError^[[22m: expected 'undefined' to be 'function' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9375893Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9376115Z Expected: ^[[32m"^[[7mf^[[27mun^[[7mction^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9376516Z Received: ^[[31m"un^[[7mdefined^[[27m"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9376715Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9377301Z ^[[36m ^[[2m❯^[[22m patchable packages/core/test/contract/gsap-patch-key.test.ts:^[[2m39:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9378036Z     ^[[90m 37|^[[39m function patchable(timeline: InterpolationTimeline): (key: string, lea…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9378819Z     ^[[90m 38|^[[39m   ^[[35mconst^[[39m candidate ^[[33m=^[[39m timeline ^[[35mas^[[39m ^[[33mPatchableTimeline^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9379759Z     ^[[90m 39|^[[39m   ^[[34mexpect^[[39m(^[[35mtypeof^[[39m candidate^[[33m.^[[39mpatchKey)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"function"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9380486Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9381376Z     ^[[90m 40|^[[39m   ^[[35mreturn^[[39m (key^[[33m,^[[39m leaf) ^[[33m=>^[[39m candidate^[[33m.^[[39m^[[34mpatchKey^[[39m^[[33m?.^[[39m(key^[[33m,^[[39m leaf) ^[[33m??^[[39m ^[[35mfalse^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9382039Z     ^[[90m 41|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9382576Z ^[[90m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-key.test.ts:^[[2m335:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9383049Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9383392Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9383762Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9385800Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/live-animated-values.test.ts^[[2m > ^[[22man animated authored value moves without a recompile^[[2m > ^[[22mPK-13 rewrites an animated key on the live timeline
quality (node 24)	Run npm test	2026-08-30T13:44:15.9388222Z ^[[31m^[[1mLiveValueKeyError^[[22m: Key "rotation" of track "hero/arm" is animated and cannot carry a live value.^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9389778Z ^[[36m ^[[2m❯^[[22m Track.#acceptedValues packages/core/src/domain/track.ts:^[[2m232:15^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9391034Z     ^[[90m230|^[[39m       if (!Object.hasOwn(authored, key)) throw new LiveValueKeyError(t…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9392294Z     ^[[90m231|^[[39m       ^[[35mif^[[39m (^[[34mreadAuthoredLeaf^[[39m(authored[key])^[[33m.^[[39mkind ^[[33m===^[[39m ^[[32m"animated"^[[39m)
quality (node 24)	Run npm test	2026-08-30T13:44:15.9394022Z     ^[[90m232|^[[39m         ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mLiveValueKeyError^[[39m(^[[35mthis^[[39m^[[33m.^[[39m#nodeId^[[33m,^[[39m key^[[33m,^[[39m ^[[32m"animated"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9394783Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9395570Z     ^[[90m233|^[[39m       accepted[key] ^[[33m=^[[39m value^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9395978Z     ^[[90m234|^[[39m     }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9396576Z ^[[90m ^[[2m❯^[[22m Track.overrideValues packages/core/src/domain/track.ts:^[[2m210:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9397403Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.#overrideValues packages/core/src/engine.ts:^[[2m406:65^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9398300Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.#writeValues packages/core/src/runtime/project-runtime.ts:^[[2m500:10^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9399188Z ^[[90m ^[[2m❯^[[22m Object.setValues packages/core/src/runtime/project-runtime.ts:^[[2m422:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9400020Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/live-animated-values.test.ts:^[[2m78:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9400413Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9400671Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9400885Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9402026Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-animated-values.test.ts^[[2m > ^[[22man animated key is writable, and the refusals that replace the old one^[[2m > ^[[22mPK-15 refuses a kind change and an unknown key, one reason each
quality (node 24)	Run npm test	2026-08-30T13:44:15.9403589Z ^[[31m^[[1mAssertionError^[[22m: expected 'animated' to be 'kind' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9404219Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9404563Z Expected: ^[[32m"^[[7mkin^[[27md"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9405393Z Received: ^[[31m"^[[7manimate^[[27md"^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9405739Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9406632Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-animated-values.test.ts:^[[2m130:79^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9408063Z     ^[[90m128|^[[39m     // would drop the key from `compiled.properties` and a stop list f…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9409165Z     ^[[90m129|^[[39m     ^[[90m// there, and neither is a patch.^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9410772Z     ^[[90m130|^[[39m     expect(refusalOf(() => animated(arm).setValues({ rotation: 45 })).…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9412021Z     ^[[90m   |^[[39m                                                                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9413218Z     ^[[90m131|^[[39m     expect(refusalOf(() => animated(arm).setValues({ x: ROTATION_MOVED…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9414483Z     ^[[90m132|^[[39m     expect(refusalOf(() => animated(arm).setValues({ z: 1 })).reason).…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9415336Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9415844Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9416253Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9418423Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-animated-values.test.ts^[[2m > ^[[22man animated key is writable, and the refusals that replace the old one^[[2m > ^[[22mPK-16 escalates to one recompile when the interpolator declines
quality (node 24)	Run npm test	2026-08-30T13:44:15.9420995Z ^[[31m^[[1mLiveValueKeyError^[[22m: Key "rotation" of track "hero/arm" is animated and cannot carry a live value.^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9422673Z ^[[36m ^[[2m❯^[[22m Track.#acceptedValues packages/core/src/domain/track.ts:^[[2m232:15^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9423962Z     ^[[90m230|^[[39m       if (!Object.hasOwn(authored, key)) throw new LiveValueKeyError(t…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9425730Z     ^[[90m231|^[[39m       ^[[35mif^[[39m (^[[34mreadAuthoredLeaf^[[39m(authored[key])^[[33m.^[[39mkind ^[[33m===^[[39m ^[[32m"animated"^[[39m)
quality (node 24)	Run npm test	2026-08-30T13:44:15.9427784Z     ^[[90m232|^[[39m         ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mLiveValueKeyError^[[39m(^[[35mthis^[[39m^[[33m.^[[39m#nodeId^[[33m,^[[39m key^[[33m,^[[39m ^[[32m"animated"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9429118Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9429943Z     ^[[90m233|^[[39m       accepted[key] ^[[33m=^[[39m value^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9430614Z     ^[[90m234|^[[39m     }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9431680Z ^[[90m ^[[2m❯^[[22m Track.overrideValues packages/core/src/domain/track.ts:^[[2m210:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9433208Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.#overrideValues packages/core/src/engine.ts:^[[2m406:65^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9434870Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.#writeValues packages/core/src/runtime/project-runtime.ts:^[[2m500:10^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9437034Z ^[[90m ^[[2m❯^[[22m Object.setValues packages/core/src/runtime/project-runtime.ts:^[[2m422:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9438092Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-animated-values.test.ts:^[[2m150:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9439006Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9439521Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9439931Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9442108Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-animated-values.test.ts^[[2m > ^[[22man animated key is writable, and the refusals that replace the old one^[[2m > ^[[22mPK-17 refuses a malformed leaf through the definition validator
quality (node 24)	Run npm test	2026-08-30T13:44:15.9444440Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9446123Z ^[[36m ^[[2m❯^[[22m published packages/core/test/unit/runtime/live-animated-values.test.ts:^[[2m79:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9447683Z     ^[[90m 77|^[[39m function published(handle: ProjectHandle, id: string): Readonly<Record…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9448486Z     ^[[90m 78|^[[39m   ^[[35mconst^[[39m patch ^[[33m=^[[39m handle^[[33m.^[[39m^[[35mget^[[39m(id)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9449251Z     ^[[90m 79|^[[39m   ^[[34mexpect^[[39m(patch)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9450145Z     ^[[90m   |^[[39m                 ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9450916Z     ^[[90m 80|^[[39m   ^[[35mreturn^[[39m patch^[[33m?.^[[39mvalues ^[[33m??^[[39m {}^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9451350Z     ^[[90m 81|^[[39m }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9451974Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-animated-values.test.ts:^[[2m167:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9452529Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9452990Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9453765Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9454976Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-animated-values.test.ts^[[2m > ^[[22man animated key is writable, and the refusals that replace the old one^[[2m > ^[[22mPK-18 kills the guards a passing suite would leave alive
quality (node 24)	Run npm test	2026-08-30T13:44:15.9456829Z ^[[31m^[[1mLiveValueKeyError^[[22m: Key "rotation" of track "hero/arm" is animated and cannot carry a live value.^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9458517Z ^[[36m ^[[2m❯^[[22m Track.#acceptedValues packages/core/src/domain/track.ts:^[[2m232:15^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9459893Z     ^[[90m230|^[[39m       if (!Object.hasOwn(authored, key)) throw new LiveValueKeyError(t…
quality (node 24)	Run npm test	2026-08-30T13:44:15.9461456Z     ^[[90m231|^[[39m       ^[[35mif^[[39m (^[[34mreadAuthoredLeaf^[[39m(authored[key])^[[33m.^[[39mkind ^[[33m===^[[39m ^[[32m"animated"^[[39m)
quality (node 24)	Run npm test	2026-08-30T13:44:15.9462834Z     ^[[90m232|^[[39m         ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mLiveValueKeyError^[[39m(^[[35mthis^[[39m^[[33m.^[[39m#nodeId^[[33m,^[[39m key^[[33m,^[[39m ^[[32m"animated"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9463584Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9464032Z     ^[[90m233|^[[39m       accepted[key] ^[[33m=^[[39m value^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9464409Z     ^[[90m234|^[[39m     }
quality (node 24)	Run npm test	2026-08-30T13:44:15.9464995Z ^[[90m ^[[2m❯^[[22m Track.overrideValues packages/core/src/domain/track.ts:^[[2m210:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9466109Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.#overrideValues packages/core/src/engine.ts:^[[2m406:65^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9466996Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.#writeValues packages/core/src/runtime/project-runtime.ts:^[[2m500:10^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9467865Z ^[[90m ^[[2m❯^[[22m Object.setValues packages/core/src/runtime/project-runtime.ts:^[[2m422:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9468695Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-animated-values.test.ts:^[[2m192:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9469069Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9469313Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/16]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9469548Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9469584Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9470072Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m159 passed^[[39m^[[22m^[[90m (162)^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9471473Z ^[[2m      Tests ^[[22m ^[[1m^[[31m16 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m768 passed^[[39m^[[22m^[[90m (784)^[[39m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9472223Z ^[[2m   Start at ^[[22m 13:43:58
quality (node 24)	Run npm test	2026-08-30T13:44:15.9473027Z ^[[2m   Duration ^[[22m 17.16s^[[2m (transform 2.25s, setup 1.09s, import 8.61s, tests 13.07s, environment 26ms)^[[22m
quality (node 24)	Run npm test	2026-08-30T13:44:15.9473746Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9473762Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9501229Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:196:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9510118Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9514342Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:213:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9516556Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9519855Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:226:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9521372Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9523628Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:237:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9525282Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9529470Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:249:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9531660Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9534432Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:257:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9536769Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9539066Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:273:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9540435Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9542855Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:279:24
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9544323Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9546687Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:296:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9548340Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9550599Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:312:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9552353Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9555323Z ##[error]AssertionError: expected 'undefined' to be 'function' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "function"
quality (node 24)	Run npm test	Received: "undefined"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ patchable packages/core/test/contract/gsap-patch-key.test.ts:39:37
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-key.test.ts:335:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9557676Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9565817Z ##[error]LiveValueKeyError: Key "rotation" of track "hero/arm" is animated and cannot carry a live value.
quality (node 24)	Run npm test	 ❯ Track.#acceptedValues packages/core/src/domain/track.ts:232:15
quality (node 24)	Run npm test	 ❯ Track.overrideValues packages/core/src/domain/track.ts:210:25
quality (node 24)	Run npm test	 ❯ ProjectRuntime.#overrideValues packages/core/src/engine.ts:406:65
quality (node 24)	Run npm test	 ❯ ProjectRuntime.#writeValues packages/core/src/runtime/project-runtime.ts:500:10
quality (node 24)	Run npm test	 ❯ Object.setValues packages/core/src/runtime/project-runtime.ts:422:17
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/live-animated-values.test.ts:78:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
quality (node 24)	Run npm test	Serialized Error: { ruleId: 'live-value-key', nodeId: 'hero/arm', key: 'rotation', reason: 'animated' }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9570726Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9573792Z ##[error]AssertionError: expected 'animated' to be 'kind' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "kind"
quality (node 24)	Run npm test	Received: "animated"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-animated-values.test.ts:130:79
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9575921Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9584839Z ##[error]LiveValueKeyError: Key "rotation" of track "hero/arm" is animated and cannot carry a live value.
quality (node 24)	Run npm test	 ❯ Track.#acceptedValues packages/core/src/domain/track.ts:232:15
quality (node 24)	Run npm test	 ❯ Track.overrideValues packages/core/src/domain/track.ts:210:25
quality (node 24)	Run npm test	 ❯ ProjectRuntime.#overrideValues packages/core/src/engine.ts:406:65
quality (node 24)	Run npm test	 ❯ ProjectRuntime.#writeValues packages/core/src/runtime/project-runtime.ts:500:10
quality (node 24)	Run npm test	 ❯ Object.setValues packages/core/src/runtime/project-runtime.ts:422:17
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-animated-values.test.ts:150:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
quality (node 24)	Run npm test	Serialized Error: { ruleId: 'live-value-key', nodeId: 'hero/arm', key: 'rotation', reason: 'animated' }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9590182Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9593573Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ published packages/core/test/unit/runtime/live-animated-values.test.ts:79:17
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-animated-values.test.ts:167:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9595872Z 
quality (node 24)	Run npm test	2026-08-30T13:44:15.9604490Z ##[error]LiveValueKeyError: Key "rotation" of track "hero/arm" is animated and cannot carry a live value.
quality (node 24)	Run npm test	 ❯ Track.#acceptedValues packages/core/src/domain/track.ts:232:15
quality (node 24)	Run npm test	 ❯ Track.overrideValues packages/core/src/domain/track.ts:210:25
quality (node 24)	Run npm test	 ❯ ProjectRuntime.#overrideValues packages/core/src/engine.ts:406:65
quality (node 24)	Run npm test	 ❯ ProjectRuntime.#writeValues packages/core/src/runtime/project-runtime.ts:500:10
quality (node 24)	Run npm test	 ❯ Object.setValues packages/core/src/runtime/project-runtime.ts:422:17
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-animated-values.test.ts:192:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
quality (node 24)	Run npm test	Serialized Error: { ruleId: 'live-value-key', nodeId: 'hero/arm', key: 'rotation', reason: 'animated' }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T13:44:15.9956207Z ##[error]Process completed with exit code 1.
```
