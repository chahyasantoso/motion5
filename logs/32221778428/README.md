# CI log archive: 32221778428

- Workflow: CI
- Conclusion: failure
- Head branch: feat/time-loop-semantics
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32221778428
- Captured: 2026-08-19T06:03:45Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-19T06:03:01.6441004Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.6441588Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.6469959Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.6470552Z env:
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.6470887Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.6471297Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.7402094Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.7403060Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.7403996Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:01.7404562Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.0460144Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.0461825Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.0462405Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.4866868Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.4953170Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.5882498Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.5935430Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.5936737Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.5951137Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.5952730Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.5980111Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7514450Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m11 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7516823Z ^[[31m     ^[[31m×^[[31m L-11 accepts the loop fields and names each loop rule by id^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7519111Z ^[[31m     ^[[31m×^[[31m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7520856Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7522286Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7523528Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7524737Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7525978Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7527212Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7528464Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7529806Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7530995Z ^[[31m     ^[[31m×^[[31m L-21 keeps loop time running while its Motion is paused^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.7598072Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.8424326Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.9672542Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:02.9793276Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.0555306Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.1944752Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.2125033Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.2709714Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.4132786Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.4554761Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.5002548Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.6285255Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.6763461Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.6961594Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.8541771Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.8761423Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:03.9113757Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.0417113Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.0856115Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.1442820Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.2381644Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.2928753Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.3782833Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.4605744Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.4941814Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.5691770Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.6487788Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.6983991Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.7499454Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.8291031Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.8704659Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.9196876Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:04.9721320Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.0485526Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.0781717Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.2622255Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.2735184Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.2787029Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.4216962Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.4271871Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.4631664Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.5884972Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6058970Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6124288Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6161505Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6163949Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 11 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6164467Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6165394Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-11 accepts the loop fields and names each loop rule by id
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6169702Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6170269Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6170926Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6171356Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6171609Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6171797Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6172081Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6172476Z ^[[31m+   "trigger-time-repeat-unsupported",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6172834Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6172968Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6173393Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m72:67^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6214118Z     ^[[90m 70|^[[39m     ^[[35mconst^[[39m repeatShape ^[[33m=^[[39m [^[[32m"trigger-time-repeat-shape"^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6215590Z     ^[[90m 71|^[[39m     ^[[34mexpect^[[39m(^[[34mloopRules^[[39m({ type^[[33m:^[[39m ^[[32m"time"^[[39m^[[33m,^[[39m duration^[[33m:^[[39m ^[[34m100^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6216546Z     ^[[90m 72|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 0 })).toEq…
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6217126Z     ^[[90m   |^[[39m                                                                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6217779Z     ^[[90m 73|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: -1, yoyo: …
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6218852Z     ^[[90m 74|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 3, yoyo: f…
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6219385Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6219901Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6220193Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6221244Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-12 refuses a yoyo with no cycle to reverse, at either spelling
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6222886Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal [ 'trigger-time-yoyo-requires-repeat' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6223577Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6223767Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6224233Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6224417Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6224768Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6225148Z ^[[32m-   "trigger-time-yoyo-requires-repeat",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6225628Z ^[[31m+   "trigger-time-repeat-unsupported",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6226004Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6226112Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6226545Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m86:68^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6227195Z     ^[[90m 84|^[[39m     ^[[90m// field accepted and then ignored is exactly what ADR-033 forbids.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6227882Z     ^[[90m 85|^[[39m     ^[[35mconst^[[39m required ^[[33m=^[[39m [^[[32m"trigger-time-yoyo-requires-repeat"^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6228576Z     ^[[90m 86|^[[39m     expect(loopRules({ type: "time", duration: 100, yoyo: true })).toE…
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6229120Z     ^[[90m   |^[[39m                                                                    ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6229824Z     ^[[90m 87|^[[39m     expect(loopRules({ type: "time", duration: 100, yoyo: false })).to…
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6230489Z     ^[[90m 88|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 0, yoyo: t…
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6230757Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6231016Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6231248Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6231888Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6232711Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6233004Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6233178Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6233491Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6233641Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6233773Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6234134Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6234352Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6234917Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6235857Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6236495Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6237415Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6238214Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6238986Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6239875Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6240194Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6240575Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6240850Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6242106Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6244399Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6246354Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6274609Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6276022Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6277268Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6278002Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6278880Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6280036Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6281094Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6282246Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6283530Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6284061Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6284881Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6285312Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6286327Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6287875Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6289407Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6290647Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6291484Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6292377Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6293059Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6293633Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6294264Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6294934Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6295640Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6296413Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6296808Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6297131Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6297410Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6298256Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6299377Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6300749Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6301590Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6302400Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6303003Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6303462Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6304137Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6304671Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6305353Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6306021Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6306696Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6307029Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6307249Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6307468Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6308171Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6311138Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6313347Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6314428Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6315574Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6316555Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6317247Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6318069Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6318942Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6319934Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6321058Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6321563Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6321936Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6322232Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6323430Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6325148Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6326437Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6327385Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6328497Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6329489Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6330273Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6330989Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6331791Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6332677Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6333641Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6334787Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6335302Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6335894Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6336164Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6337216Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6338872Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6340203Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6341255Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6342352Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6343333Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6343960Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6344697Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6345547Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6346413Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6347500Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6348582Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6349084Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6349487Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6350253Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6351414Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6353706Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6355439Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6356279Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6357443Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6358080Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6358546Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6359385Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6360337Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6361280Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6361988Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6362722Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6363032Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6363293Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6363630Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6364320Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-21 keeps loop time running while its Motion is paused
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6365390Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6366230Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6367102Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6367867Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6368656Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6369193Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6369978Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6370647Z     ^[[90m180|^[[39m }
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6371207Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m254:16^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6371537Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6371742Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6372124Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6372164Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6372587Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m47 passed^[[39m^[[22m^[[90m (48)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6373254Z ^[[2m      Tests ^[[22m ^[[1m^[[31m11 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m179 passed^[[39m^[[22m^[[90m (190)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6373892Z ^[[2m   Start at ^[[22m 06:03:02
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6374493Z ^[[2m   Duration ^[[22m 3.55s^[[2m (transform 1.06s, setup 0ms, import 3.05s, tests 710ms, environment 5ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6374815Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6374833Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6395306Z ##[error]AssertionError: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal []
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
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6401767Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6404679Z ##[error]AssertionError: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal [ 'trigger-time-yoyo-requires-repeat' ]
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
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6406077Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6407613Z ##[error]AssertionError: expected false to be true // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6408588Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6412095Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6414408Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6418949Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6420904Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6424152Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6426166Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6429842Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.yoyo: Time trigger yoyo is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6432259Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6435756Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6437414Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6439811Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6441240Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6444371Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:96:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:165:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6446843Z 
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6448816Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
integration (node 24)	Run npm run test:integration	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:254:16
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-19T06:03:05.6618059Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-19T06:03:15.1244111Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-19T06:03:15.1244457Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-19T06:03:15.1282055Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-19T06:03:15.1282327Z env:
quality (node 24)	Run npm test	2026-08-19T06:03:15.1282521Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-19T06:03:15.1282731Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-19T06:03:15.2408972Z 
quality (node 24)	Run npm test	2026-08-19T06:03:15.2409740Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-19T06:03:15.2410205Z > vitest run
quality (node 24)	Run npm test	2026-08-19T06:03:15.2410416Z 
quality (node 24)	Run npm test	2026-08-19T06:03:15.5708815Z 
quality (node 24)	Run npm test	2026-08-19T06:03:15.5715682Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:15.5716356Z 
quality (node 24)	Run npm test	2026-08-19T06:03:16.1758066Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.1860221Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.2795341Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-19T06:03:16.2797626Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:03:16.2869217Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:03:16.2871066Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 75^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.2886983Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:03:16.2908562Z 
quality (node 24)	Run npm test	2026-08-19T06:03:16.4249119Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5405563Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m11 failed^[[39m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5407793Z ^[[31m     ^[[31m×^[[31m L-11 accepts the loop fields and names each loop rule by id^[[39m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5410299Z ^[[31m     ^[[31m×^[[31m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[39m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5423787Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5440224Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5442509Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5445282Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5448008Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5450579Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5452793Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5459989Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5461964Z ^[[31m     ^[[31m×^[[31m L-21 keeps loop time running while its Motion is paused^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.5488535Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.6909955Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.8310284Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.8765776Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:16.9432032Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:17.0840782Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:17.1670681Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:17.2028042Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:17.4900356Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:17.4972503Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:17.5053465Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:17.7390460Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:17.7994960Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:18.0116405Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:18.0414114Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:18.2750563Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:18.3288966Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:18.5163868Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:18.5730610Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:18.8031573Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:18.8232864Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.0645742Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.0982733Z  ^[[31m❯^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m9 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1019593Z      ^[[32m✓^[[39m L-1 keeps a trigger with no loop fields on one pass that latches at 1^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1020843Z ^[[31m     ^[[31m×^[[31m L-2 treats repeat 0 as the default spelled out, value for value^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1021726Z ^[[31m     ^[[31m×^[[31m L-3 runs the initial pass plus repeat more, each ending at 1^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1022634Z ^[[31m     ^[[31m×^[[31m L-4 reverses the odd cycle of a yoyo and finishes where it started^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1023645Z ^[[31m     ^[[31m×^[[31m L-5 finishes a yoyo at the end when its last cycle runs forward^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1024480Z ^[[31m     ^[[31m×^[[31m L-6 reads a boundary tick as the end of the cycle it finished^[[39m^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1025345Z ^[[31m     ^[[31m×^[[31m L-7 never latches an infinite repeat and never repeats one endpoint^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1026440Z ^[[31m     ^[[31m×^[[31m L-8 emits once for a tick that crosses several cycles^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1027225Z ^[[31m     ^[[31m×^[[31m L-9 clamps a delta past the end to the finishing endpoint^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.1028403Z ^[[31m     ^[[31m×^[[31m L-10 keeps an infinite loop advancing after an enormous delta^[[39m^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.3473972Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.3859401Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.6110597Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.6283761Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.8357948Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:19.8889789Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.1220743Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.2005346Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.4014546Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.4700831Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.6413791Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.7256806Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.8199473Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3099^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.8201677Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3096^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:20.8630948Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.0008894Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.0350299Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.0603555Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.2270321Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.2470313Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.4725866Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.4798775Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.6858515Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.7432478Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.9125301Z  ^[[31m❯^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.9131079Z ^[[31m     ^[[31m×^[[31m T-8 reaches the manual port once in the factory, after both driver branches^[[39m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.9133158Z      ^[[32m✓^[[39m T-9 keeps the time driver's own manual port driver-owned rather than a fallback^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.9134892Z      ^[[32m✓^[[39m T-10 leaves no other manual port call site in core^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:21.9823902Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:22.1490638Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:22.2180603Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:22.4247513Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:22.5020877Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:22.6710487Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:22.7168859Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:22.9004741Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:22.9600765Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:23.1617423Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:23.2180063Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:23.3631435Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:23.5000466Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:23.5841513Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:23.7820305Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:23.8011243Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.0089065Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.0858545Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.2239447Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.2710530Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.4220805Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.4743082Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.6743936Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.6844672Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.9079630Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:24.9419707Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:25.1510428Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:25.1766036Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:25.4106669Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:25.4119387Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:25.6100527Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:25.6708473Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-19T06:03:25.6760687Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:03:25.6773367Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:25.6794291Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:03:25.6841468Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:03:25.6842763Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:03:25.6843676Z 
quality (node 24)	Run npm test	2026-08-19T06:03:25.8139069Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:25.8948809Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.0218495Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.0899632Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.1843078Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.3592451Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.4052760Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.5666077Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.6344478Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.7860317Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:26.8980724Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.0011049Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.1264858Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.2085283Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.3410437Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.4276353Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.5577838Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.6378891Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.7173478Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6482^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.7195489Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1828^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.7197463Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1736^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.7625947Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.8271026Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.9106659Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.9614306Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:27.9907948Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.1540236Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.1861202Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.1951231Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-19T06:03:28.1955172Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-19T06:03:28.1956930Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:03:28.1958005Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:03:28.1959400Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-19T06:03:28.1960035Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.1979479Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.3873050Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.4148919Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.4199764Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6070440Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6102055Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6178574Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6220962Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6221811Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 21 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6222396Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6228666Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-11 accepts the loop fields and names each loop rule by id
quality (node 24)	Run npm test	2026-08-19T06:03:28.6234655Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6235481Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6235830Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6236333Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6236587Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6236782Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6237184Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6237815Z ^[[31m+   "trigger-time-repeat-unsupported",^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6238806Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6239048Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6240010Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m72:67^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6313661Z     ^[[90m 70|^[[39m     ^[[35mconst^[[39m repeatShape ^[[33m=^[[39m [^[[32m"trigger-time-repeat-shape"^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6315691Z     ^[[90m 71|^[[39m     ^[[34mexpect^[[39m(^[[34mloopRules^[[39m({ type^[[33m:^[[39m ^[[32m"time"^[[39m^[[33m,^[[39m duration^[[33m:^[[39m ^[[34m100^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6317140Z     ^[[90m 72|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 0 })).toEq…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6318611Z     ^[[90m   |^[[39m                                                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6319927Z     ^[[90m 73|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: -1, yoyo: …
quality (node 24)	Run npm test	2026-08-19T06:03:28.6321091Z     ^[[90m 74|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 3, yoyo: f…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6321650Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6322076Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6322420Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6323995Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-12 refuses a yoyo with no cycle to reverse, at either spelling
quality (node 24)	Run npm test	2026-08-19T06:03:28.6325365Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal [ 'trigger-time-yoyo-requires-repeat' ]^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6325895Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6326034Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6326321Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6326478Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6326588Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6327259Z ^[[32m-   "trigger-time-yoyo-requires-repeat",^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6327713Z ^[[31m+   "trigger-time-repeat-unsupported",^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6328415Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6328563Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6329041Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m86:68^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6329779Z     ^[[90m 84|^[[39m     ^[[90m// field accepted and then ignored is exactly what ADR-033 forbids.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6330558Z     ^[[90m 85|^[[39m     ^[[35mconst^[[39m required ^[[33m=^[[39m [^[[32m"trigger-time-yoyo-requires-repeat"^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6331283Z     ^[[90m 86|^[[39m     expect(loopRules({ type: "time", duration: 100, yoyo: true })).toE…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6331882Z     ^[[90m   |^[[39m                                                                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6332787Z     ^[[90m 87|^[[39m     expect(loopRules({ type: "time", duration: 100, yoyo: false })).to…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6333448Z     ^[[90m 88|^[[39m     expect(loopRules({ type: "time", duration: 100, repeat: 0, yoyo: t…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6333749Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6333983Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6334186Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6334991Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
quality (node 24)	Run npm test	2026-08-19T06:03:28.6335967Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6336276Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6336408Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6336659Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6336805Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6336915Z ^[[32m- true^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6337154Z ^[[31m+ false^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6337275Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6337747Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6338589Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
quality (node 24)	Run npm test	2026-08-19T06:03:28.6339040Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6339647Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6340570Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6341550Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6342479Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6342811Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6343280Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6343672Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6345449Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
quality (node 24)	Run npm test	2026-08-19T06:03:28.6349230Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6351665Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6400575Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6402029Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:03:28.6403232Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:03:28.6403750Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6404399Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6405521Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6406663Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6408478Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6409515Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6410059Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6410479Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6414148Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6415801Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
quality (node 24)	Run npm test	2026-08-19T06:03:28.6419187Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6421619Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6422800Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6424699Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:03:28.6426190Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:03:28.6426954Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6427855Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6429144Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6430254Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6431558Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6432947Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6433579Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6433994Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6434338Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6435907Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
quality (node 24)	Run npm test	2026-08-19T06:03:28.6439067Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6440060Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6440732Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6441555Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:03:28.6442246Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:03:28.6442664Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6443175Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6443761Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6444374Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6445099Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6445896Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6446262Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6446491Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6446697Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6447541Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
quality (node 24)	Run npm test	2026-08-19T06:03:28.6451503Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6453126Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6453805Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6454604Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:03:28.6455925Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:03:28.6456999Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6458026Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6459398Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6460542Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6461904Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6462541Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6462964Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6463537Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6465166Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
quality (node 24)	Run npm test	2026-08-19T06:03:28.6467534Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6469423Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6470679Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6472137Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:03:28.6473367Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:03:28.6474105Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6475042Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6476116Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6477223Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6482125Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6483756Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6484445Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6484890Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6485259Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6486771Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
quality (node 24)	Run npm test	2026-08-19T06:03:28.6489490Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6491179Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6492433Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6493901Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:03:28.6495165Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:03:28.6496225Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6497188Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6498520Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6499674Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6500971Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6502399Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6503045Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6503457Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6503817Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6505397Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
quality (node 24)	Run npm test	2026-08-19T06:03:28.6509137Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6511423Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m96:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6512621Z     ^[[90m 94|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6514064Z     ^[[90m 95|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-19T06:03:28.6515256Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-19T06:03:28.6515979Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6516921Z     ^[[90m 97|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6517984Z     ^[[90m 98|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6519553Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m165:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6520888Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6522349Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6522991Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6523405Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6523810Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6525290Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-21 keeps loop time running while its Motion is paused
quality (node 24)	Run npm test	2026-08-19T06:03:28.6527576Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6529667Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6531127Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6532615Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6534014Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6534976Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6536005Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6536792Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6537812Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m254:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6538684Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6539116Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6539804Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6541459Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-2 treats repeat 0 as the default spelled out, value for value
quality (node 24)	Run npm test	2026-08-19T06:03:28.6543845Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6545691Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6547125Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6548972Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6550428Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6551627Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6552711Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6553531Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6554668Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6556152Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m62:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6556892Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6557335Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6557692Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6559554Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-3 runs the initial pass plus repeat more, each ending at 1
quality (node 24)	Run npm test	2026-08-19T06:03:28.6561972Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6563852Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6565310Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6566868Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6568543Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6569538Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6570587Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6571403Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6572529Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6574035Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m68:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6574735Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6575168Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6575537Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6577241Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-4 reverses the odd cycle of a yoyo and finishes where it started
quality (node 24)	Run npm test	2026-08-19T06:03:28.6580834Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6583398Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6584825Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6586382Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6588077Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6589246Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6590278Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6591067Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6592161Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6593668Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m73:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6594300Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6594710Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6595079Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6596731Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-5 finishes a yoyo at the end when its last cycle runs forward
quality (node 24)	Run npm test	2026-08-19T06:03:28.6600565Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6603082Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6604473Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6606015Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6607443Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6608636Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6609715Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6610507Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6611607Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6613098Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m78:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6613730Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6614158Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6614515Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6616209Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-6 reads a boundary tick as the end of the cycle it finished
quality (node 24)	Run npm test	2026-08-19T06:03:28.6618713Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6620002Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6620942Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6622373Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6623785Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6624366Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6625246Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6626159Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6627001Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6627837Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m85:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6628573Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6629089Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6629318Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6630242Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-7 never latches an infinite repeat and never repeats one endpoint
quality (node 24)	Run npm test	2026-08-19T06:03:28.6631790Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6632808Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6633755Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6634600Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6635364Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6636115Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6636705Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6637156Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6637763Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6638939Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m89:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6639294Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6639526Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6639725Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6640559Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-8 emits once for a tick that crosses several cycles
quality (node 24)	Run npm test	2026-08-19T06:03:28.6642876Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6644550Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6645322Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6646877Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6647710Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6648559Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6649145Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6649635Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6650414Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6651523Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m97:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6652472Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6652967Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6653365Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6655032Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-9 clamps a delta past the end to the finishing endpoint
quality (node 24)	Run npm test	2026-08-19T06:03:28.6657686Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6659462Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6660233Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6661284Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6662082Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6662623Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6663447Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6663915Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6664521Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6665310Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m103:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6665659Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6665889Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6666090Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6666958Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/time-loop-cycle.test.ts^[[2m > ^[[22mtime loop cycle arithmetic^[[2m > ^[[22mL-10 keeps an infinite loop advancing after an enormous delta
quality (node 24)	Run npm test	2026-08-19T06:03:28.6668412Z ^[[31m^[[1mTypeError^[[22m: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6669630Z ^[[36m ^[[2m❯^[[22m resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:^[[2m178:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6670406Z     ^[[90m176|^[[39m export function resolveTriggerDefinition(trigger: unknown, path: strin…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6671219Z     ^[[90m177|^[[39m   ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mvalidateMotionTrigger^[[39m(trigger^[[33m,^[[39m path)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6671978Z     ^[[90m178|^[[39m   if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6672516Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6673070Z     ^[[90m179|^[[39m   ^[[35mreturn^[[39m trigger ^[[35mas^[[39m ^[[33mTriggerDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6673523Z     ^[[90m180|^[[39m }
quality (node 24)	Run npm test	2026-08-19T06:03:28.6674119Z ^[[90m ^[[2m❯^[[22m emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m34:14^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6674907Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/adapters/time-loop-cycle.test.ts:^[[2m109:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6675248Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6675476Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6675678Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6676686Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts^[[2m > ^[[22mT5 no manual trigger fallback^[[2m > ^[[22mT-8 reaches the manual port once in the factory, after both driver branches
quality (node 24)	Run npm test	2026-08-19T06:03:28.6677742Z ^[[31m^[[1mAssertionError^[[22m: expected -1 to be greater than -1^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6679123Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts:^[[2m45:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6679925Z     ^[[90m 43|^[[39m     const scroll = FACTORY_SOURCE.indexOf('if (trigger.type === "scrol…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6680595Z     ^[[90m 44|^[[39m     // Guards the guard: two missing needles would otherwise both be -…
quality (node 24)	Run npm test	2026-08-19T06:03:28.6681513Z     ^[[90m 45|^[[39m     ^[[34mexpect^[[39m(time)^[[33m.^[[39m^[[34mtoBeGreaterThan^[[39m(^[[33m-^[[39m^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6682055Z     ^[[90m   |^[[39m                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6682664Z     ^[[90m 46|^[[39m     ^[[34mexpect^[[39m(scroll)^[[33m.^[[39m^[[34mtoBeGreaterThan^[[39m(^[[33m-^[[39m^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6683696Z     ^[[90m 47|^[[39m     ^[[34mexpect^[[39m(call)^[[33m.^[[39m^[[34mtoBeGreaterThan^[[39m(time)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6684306Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6684762Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6685006Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6685028Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6685913Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m114 passed^[[39m^[[22m^[[90m (117)^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6687492Z ^[[2m      Tests ^[[22m ^[[1m^[[31m21 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m496 passed^[[39m^[[22m^[[90m (517)^[[39m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6688675Z ^[[2m   Start at ^[[22m 06:03:15
quality (node 24)	Run npm test	2026-08-19T06:03:28.6689862Z ^[[2m   Duration ^[[22m 13.02s^[[2m (transform 1.77s, setup 0ms, import 6.21s, tests 11.49s, environment 19ms)^[[22m
quality (node 24)	Run npm test	2026-08-19T06:03:28.6690566Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6690581Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6721983Z ##[error]AssertionError: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal []
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
quality (node 24)	Run npm test	2026-08-19T06:03:28.6732553Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6735436Z ##[error]AssertionError: expected [ 'trigger-time-repeat-unsupported' ] to deeply equal [ 'trigger-time-yoyo-requires-repeat' ]
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
quality (node 24)	Run npm test	2026-08-19T06:03:28.6737064Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6739038Z ##[error]AssertionError: expected false to be true // Object.is equality
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
quality (node 24)	Run npm test	2026-08-19T06:03:28.6740239Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6744480Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6746600Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6750675Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[0].trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6752777Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6755613Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6757362Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6761775Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6764514Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6767642Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6769803Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6772874Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6774974Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6779376Z ##[error]TypeError: trigger-time-repeat-unsupported at motions[0].trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions[1].trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:96:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:165:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6781788Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6784254Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:254:16
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6785822Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6789126Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:62:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6791038Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6794062Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:68:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6795839Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6799780Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:73:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6802037Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6805827Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:78:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6808348Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6811464Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:85:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6813301Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6816523Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:89:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6818593Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6822416Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:97:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6824973Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6829076Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet. trigger-time-repeat-unsupported at motions.loop.trigger.yoyo: Time trigger yoyo is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:103:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6831368Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6834372Z ##[error]TypeError: trigger-time-repeat-unsupported at motions.loop.trigger.repeat: Time trigger repeat is not supported yet.
quality (node 24)	Run npm test	 ❯ resolveTriggerDefinition packages/core/src/contract/validate-v5.ts:178:37
quality (node 24)	Run npm test	 ❯ emissions packages/core/test/unit/adapters/time-loop-cycle.test.ts:34:14
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/time-loop-cycle.test.ts:109:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.6836146Z 
quality (node 24)	Run npm test	2026-08-19T06:03:28.6837521Z ##[error]AssertionError: expected -1 to be greater than -1
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts:45:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-19T06:03:28.7016755Z ##[error]Process completed with exit code 1.
```
