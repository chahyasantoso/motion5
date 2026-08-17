# CI log archive: 32036952950

- Workflow: CI
- Conclusion: failure
- Head branch: feat/option-c-motion-track-resolution
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32036952950
- Captured: 2026-08-17T13:52:18Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-17T13:51:56.0550945Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.0551336Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.0574007Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.0574521Z env:
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.0574766Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.0575072Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.1445069Z 
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.1446157Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.1446908Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:56.1447252Z 
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:58.7736437Z ##[error]packages/core/test/integration/motion-trigger-lifecycle.test.ts(26,29): error TS2353: Object literal may only specify known properties, and 'track' does not exist in type 'MotionTrackEntry'.
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:58.7747010Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(23,33): error TS2353: Object literal may only specify known properties, and 'track' does not exist in type 'MotionTrackEntry'.
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:58.7750258Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(45,31): error TS2353: Object literal may only specify known properties, and 'track' does not exist in type 'MotionTrackEntry'.
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:58.7753503Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(69,31): error TS2353: Object literal may only specify known properties, and 'track' does not exist in type 'MotionTrackEntry'.
quality (node 24)	Run npm run typecheck	2026-08-17T13:51:58.7959042Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-17T13:51:58.2086615Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.2086988Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.2127195Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.2127485Z env:
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.2127680Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.2127888Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.3223494Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.3224555Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.3225137Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.3225407Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.6389523Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.6394289Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:58.6395555Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.0892575Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.1081714Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.2113561Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.2116546Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.2141994Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.2143888Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.2145314Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.2177333Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.3309066Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.3945733Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.4829265Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.5786903Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.6625241Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.7357154Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.8625743Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.9314693Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:51:59.9692060Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.0934148Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.1683874Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.1987499Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.3574468Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.4015405Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.4248850Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.6090521Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.6234387Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.6621449Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.8452304Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.8542963Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:00.8919607Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.0762887Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.0836403Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.1032619Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.1035661Z ^[[31m     ^[[31m×^[[31m manual signals use the same scheduled progress path^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.1039345Z ^[[31m     ^[[31m×^[[31m scroll signals use the same scheduled progress path^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.1041290Z ^[[31m     ^[[31m×^[[31m time signals use the same scheduled progress path^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.1043610Z ^[[31m     ^[[31m×^[[31m advances from the one injected clock and rejects control after disposal^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.1046068Z ^[[31m     ^[[31m×^[[31m cancels queued trigger work when paused and does not duplicate on remount^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.2878255Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.3192348Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.3485956Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.4965893Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.5259581Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.5455646Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.7300720Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.7594055Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.9541629Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.9763891Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.9766132Z ^[[31m     ^[[31m×^[[31m routes trigger progress through Track and invalidates the owning runtime^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:01.9783698Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.1680574Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.2276502Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.2346995Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.3894808Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4302242Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4526494Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4559604Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4560410Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 6 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4560769Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4565401Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-lifecycle.test.ts^[[2m > ^[[22mMotion and trigger lifecycle^[[2m > ^[[22mroutes trigger progress through Track and invalidates the owning runtime
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4571153Z ^[[31m^[[1mTypeError^[[22m: Motion requires a resolveTrack function.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4572475Z ^[[36m ^[[2m❯^[[22m new Motion packages/core/src/domain/motion.ts:^[[2m49:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4630395Z     ^[[90m 47|^[[39m   ^[[34mconstructor^[[39m(options^[[33m:^[[39m ^[[33mMotionOptions^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4631975Z     ^[[90m 48|^[[39m     ^[[35mif^[[39m (^[[35mtypeof^[[39m options^[[33m.^[[39mresolveTrack ^[[33m!==^[[39m ^[[32m"function"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4646510Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4649207Z     ^[[90m 49|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m"Motion requires a resolveTrack function."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4650067Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4650750Z     ^[[90m 50|^[[39m     ^[[35mthis^[[39m^[[33m.^[[39m#resolveTrack ^[[33m=^[[39m options^[[33m.^[[39mresolveTrack^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4651514Z     ^[[90m 51|^[[39m     if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? …
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4652770Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-lifecycle.test.ts:^[[2m21:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4653693Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4654018Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4654237Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4655915Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mmanual signals use the same scheduled progress path
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4658088Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mscroll signals use the same scheduled progress path
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4660251Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mtime signals use the same scheduled progress path
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4661272Z ^[[31m^[[1mTypeError^[[22m: Motion requires a resolveTrack function.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4661939Z ^[[36m ^[[2m❯^[[22m new Motion packages/core/src/domain/motion.ts:^[[2m49:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4662581Z     ^[[90m 47|^[[39m   ^[[34mconstructor^[[39m(options^[[33m:^[[39m ^[[33mMotionOptions^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4663702Z     ^[[90m 48|^[[39m     ^[[35mif^[[39m (^[[35mtypeof^[[39m options^[[33m.^[[39mresolveTrack ^[[33m!==^[[39m ^[[32m"function"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4665165Z     ^[[90m 49|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m"Motion requires a resolveTrack function."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4666561Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4667382Z     ^[[90m 50|^[[39m     ^[[35mthis^[[39m^[[33m.^[[39m#resolveTrack ^[[33m=^[[39m options^[[33m.^[[39mresolveTrack^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4668105Z     ^[[90m 51|^[[39m     if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? …
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4668891Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m19:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4669284Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4669528Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4669733Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4670772Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22madvances from the one injected clock and rejects control after disposal
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4671852Z ^[[31m^[[1mTypeError^[[22m: Motion requires a resolveTrack function.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4672494Z ^[[36m ^[[2m❯^[[22m new Motion packages/core/src/domain/motion.ts:^[[2m49:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4673528Z     ^[[90m 47|^[[39m   ^[[34mconstructor^[[39m(options^[[33m:^[[39m ^[[33mMotionOptions^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4674496Z     ^[[90m 48|^[[39m     ^[[35mif^[[39m (^[[35mtypeof^[[39m options^[[33m.^[[39mresolveTrack ^[[33m!==^[[39m ^[[32m"function"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4675844Z     ^[[90m 49|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m"Motion requires a resolveTrack function."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4676455Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4677391Z     ^[[90m 50|^[[39m     ^[[35mthis^[[39m^[[33m.^[[39m#resolveTrack ^[[33m=^[[39m options^[[33m.^[[39mresolveTrack^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4678335Z     ^[[90m 51|^[[39m     if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? …
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4679097Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m42:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4679472Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4679814Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4680217Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4681578Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mcancels queued trigger work when paused and does not duplicate on remount
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4682732Z ^[[31m^[[1mTypeError^[[22m: Motion requires a resolveTrack function.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4684049Z ^[[36m ^[[2m❯^[[22m new Motion packages/core/src/domain/motion.ts:^[[2m49:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4684818Z     ^[[90m 47|^[[39m   ^[[34mconstructor^[[39m(options^[[33m:^[[39m ^[[33mMotionOptions^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4686125Z     ^[[90m 48|^[[39m     ^[[35mif^[[39m (^[[35mtypeof^[[39m options^[[33m.^[[39mresolveTrack ^[[33m!==^[[39m ^[[32m"function"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4687285Z     ^[[90m 49|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m"Motion requires a resolveTrack function."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4687901Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4688574Z     ^[[90m 50|^[[39m     ^[[35mthis^[[39m^[[33m.^[[39m#resolveTrack ^[[33m=^[[39m options^[[33m.^[[39mresolveTrack^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4689810Z     ^[[90m 51|^[[39m     if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? …
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4690599Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m65:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4690974Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4691213Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4691425Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4691926Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m42 passed^[[39m^[[22m^[[90m (44)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4692707Z ^[[2m      Tests ^[[22m ^[[1m^[[31m6 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m158 passed^[[39m^[[22m^[[90m (164)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4693597Z ^[[2m   Start at ^[[22m 13:51:58
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4694262Z ^[[2m   Duration ^[[22m 3.80s^[[2m (transform 1.06s, setup 0ms, import 3.08s, tests 791ms, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4694861Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4694868Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4716621Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-lifecycle.test.ts:21:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4726360Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4729759Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:19:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4731915Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4735381Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:19:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4737520Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4740545Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:19:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4742532Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4745733Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:42:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4747733Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.4750644Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:65:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:52:02.5042294Z ##[error]Process completed with exit code 1.
```
