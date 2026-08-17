# CI log archive: 32036837861

- Workflow: CI
- Conclusion: failure
- Head branch: feat/option-c-motion-track-resolution
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32036837861
- Captured: 2026-08-17T13:50:27Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-17T13:50:08.9398250Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:08.9398607Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:08.9437569Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:08.9437845Z env:
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:08.9438036Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:08.9438242Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:09.0497598Z 
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:09.0498142Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:09.0498709Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:09.0498911Z 
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:11.9062150Z ##[error]packages/core/test/integration/motion-trigger-lifecycle.test.ts(26,29): error TS2353: Object literal may only specify known properties, and 'track' does not exist in type 'MotionTrackEntry'.
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:11.9073196Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(23,33): error TS2353: Object literal may only specify known properties, and 'track' does not exist in type 'MotionTrackEntry'.
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:11.9077567Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(45,31): error TS2353: Object literal may only specify known properties, and 'track' does not exist in type 'MotionTrackEntry'.
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:11.9081544Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(69,31): error TS2353: Object literal may only specify known properties, and 'track' does not exist in type 'MotionTrackEntry'.
quality (node 24)	Run npm run typecheck	2026-08-17T13:50:11.9437254Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-17T13:50:07.9884093Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:07.9884452Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:07.9909585Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:07.9910066Z env:
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:07.9910297Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:07.9910516Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.0635731Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.0636366Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.0636879Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.0637134Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.3090399Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.3093089Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.3093733Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.6249800Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.6335792Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.7149734Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.7163458Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.7165406Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.7166434Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.7168086Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.7176182Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.7704211Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.7929787Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.8899698Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.9574050Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:08.9713704Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.0639498Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.1128727Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.1183504Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.2402698Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.2607713Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.2708580Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.3832448Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.4106848Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.4226673Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.5209228Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.5683671Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.5750506Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.6776182Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.7262579Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.7321947Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.8165396Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.8612518Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.8737386Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.9661106Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.9662661Z ^[[31m     ^[[31m×^[[31m manual signals use the same scheduled progress path^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.9663786Z ^[[31m     ^[[31m×^[[31m scroll signals use the same scheduled progress path^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.9664707Z ^[[31m     ^[[31m×^[[31m time signals use the same scheduled progress path^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.9665814Z ^[[31m     ^[[31m×^[[31m advances from the one injected clock and rejects control after disposal^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:09.9667009Z ^[[31m     ^[[31m×^[[31m cancels queued trigger work when paused and does not duplicate on remount^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.0060778Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.0098030Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.1119040Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.1361314Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.1403492Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.2304112Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.2932882Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.3892890Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.4009439Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.4413674Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.5169144Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.5170626Z ^[[31m     ^[[31m×^[[31m routes trigger progress through Track and invalidates the owning runtime^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.5363179Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.5881649Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.6449398Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7126510Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7357984Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7638801Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7659398Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7660227Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 6 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7660809Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7663754Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-lifecycle.test.ts^[[2m > ^[[22mMotion and trigger lifecycle^[[2m > ^[[22mroutes trigger progress through Track and invalidates the owning runtime
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7667581Z ^[[31m^[[1mTypeError^[[22m: Motion requires a resolveTrack function.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7668619Z ^[[36m ^[[2m❯^[[22m new Motion packages/core/src/domain/motion.ts:^[[2m49:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7707038Z     ^[[90m 47|^[[39m   ^[[34mconstructor^[[39m(options^[[33m:^[[39m ^[[33mMotionOptions^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7708050Z     ^[[90m 48|^[[39m     ^[[35mif^[[39m (^[[35mtypeof^[[39m options^[[33m.^[[39mresolveTrack ^[[33m!==^[[39m ^[[32m"function"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7709107Z     ^[[90m 49|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m"Motion requires a resolveTrack function."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7709839Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7710576Z     ^[[90m 50|^[[39m     ^[[35mthis^[[39m^[[33m.^[[39m#resolveTrack ^[[33m=^[[39m options^[[33m.^[[39mresolveTrack^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7711455Z     ^[[90m 51|^[[39m     if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? …
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7712394Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-lifecycle.test.ts:^[[2m21:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7712812Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7713108Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7713365Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7714262Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mmanual signals use the same scheduled progress path
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7716425Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mscroll signals use the same scheduled progress path
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7718052Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mtime signals use the same scheduled progress path
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7718960Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7723224Z ^[[31m^[[1mTypeError^[[22m: Motion requires a resolveTrack function.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7724074Z ^[[36m ^[[2m❯^[[22m new Motion packages/core/src/domain/motion.ts:^[[2m49:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7724849Z     ^[[90m 47|^[[39m   ^[[34mconstructor^[[39m(options^[[33m:^[[39m ^[[33mMotionOptions^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7725656Z     ^[[90m 48|^[[39m     ^[[35mif^[[39m (^[[35mtypeof^[[39m options^[[33m.^[[39mresolveTrack ^[[33m!==^[[39m ^[[32m"function"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7726618Z     ^[[90m 49|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m"Motion requires a resolveTrack function."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7727503Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7728360Z     ^[[90m 50|^[[39m     ^[[35mthis^[[39m^[[33m.^[[39m#resolveTrack ^[[33m=^[[39m options^[[33m.^[[39mresolveTrack^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7729271Z     ^[[90m 51|^[[39m     if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? …
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7730053Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m19:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7730434Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7730732Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7730990Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7731932Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22madvances from the one injected clock and rejects control after disposal
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7733008Z ^[[31m^[[1mTypeError^[[22m: Motion requires a resolveTrack function.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7733717Z ^[[36m ^[[2m❯^[[22m new Motion packages/core/src/domain/motion.ts:^[[2m49:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7734385Z     ^[[90m 47|^[[39m   ^[[34mconstructor^[[39m(options^[[33m:^[[39m ^[[33mMotionOptions^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7735204Z     ^[[90m 48|^[[39m     ^[[35mif^[[39m (^[[35mtypeof^[[39m options^[[33m.^[[39mresolveTrack ^[[33m!==^[[39m ^[[32m"function"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7736131Z     ^[[90m 49|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m"Motion requires a resolveTrack function."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7736738Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7737439Z     ^[[90m 50|^[[39m     ^[[35mthis^[[39m^[[33m.^[[39m#resolveTrack ^[[33m=^[[39m options^[[33m.^[[39mresolveTrack^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7738541Z     ^[[90m 51|^[[39m     if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? …
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7739348Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m42:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7739773Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7740012Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7740253Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7741279Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mcancels queued trigger work when paused and does not duplicate on remount
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7742362Z ^[[31m^[[1mTypeError^[[22m: Motion requires a resolveTrack function.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7743041Z ^[[36m ^[[2m❯^[[22m new Motion packages/core/src/domain/motion.ts:^[[2m49:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7743837Z     ^[[90m 47|^[[39m   ^[[34mconstructor^[[39m(options^[[33m:^[[39m ^[[33mMotionOptions^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7744625Z     ^[[90m 48|^[[39m     ^[[35mif^[[39m (^[[35mtypeof^[[39m options^[[33m.^[[39mresolveTrack ^[[33m!==^[[39m ^[[32m"function"^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7745592Z     ^[[90m 49|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m"Motion requires a resolveTrack function."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7746275Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7746941Z     ^[[90m 50|^[[39m     ^[[35mthis^[[39m^[[33m.^[[39m#resolveTrack ^[[33m=^[[39m options^[[33m.^[[39mresolveTrack^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7747712Z     ^[[90m 51|^[[39m     if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? …
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7748893Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m65:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7749341Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7749641Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7749857Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7750355Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m42 passed^[[39m^[[22m^[[90m (44)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7751127Z ^[[2m      Tests ^[[22m ^[[1m^[[31m6 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m158 passed^[[39m^[[22m^[[90m (164)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7751746Z ^[[2m   Start at ^[[22m 13:50:08
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7752386Z ^[[2m   Duration ^[[22m 2.44s^[[2m (transform 743ms, setup 0ms, import 2.14s, tests 463ms, environment 3ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7752827Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7753059Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7775454Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-lifecycle.test.ts:21:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7784244Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7786619Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:19:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7788360Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7790188Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:19:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7791373Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7792730Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:19:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7793971Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7795676Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:42:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7796552Z 
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.7797995Z ##[error]TypeError: Motion requires a resolveTrack function.
integration (node 24)	Run npm run test:integration	 ❯ new Motion packages/core/src/domain/motion.ts:49:13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:65:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T13:50:10.8168701Z ##[error]Process completed with exit code 1.
```
