# CI log archive: 32573614805

- Workflow: CI
- Conclusion: failure
- Head branch: feat/plugin-group-values-section
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32573614805
- Captured: 2026-08-22T12:40:57Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-22T12:40:30.3551626Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.3551973Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.3591651Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.3591946Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.3592146Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.3592371Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.4640519Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.4641217Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.4641778Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:30.4641995Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6924866Z ##[error]apps/react-demo/src/full-body-project.ts(27,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6936863Z ##[error]apps/react-demo/src/full-body-project.ts(56,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6940912Z ##[error]apps/react-demo/src/full-body-project.ts(85,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6944752Z ##[error]apps/react-demo/src/full-body-project.ts(114,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6948533Z ##[error]apps/react-demo/src/full-body-project.ts(145,9): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6952132Z ##[error]apps/react-demo/src/full-body-project.ts(183,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6955727Z ##[error]apps/react-demo/src/full-body-project.ts(208,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6959761Z ##[error]apps/react-demo/src/full-body-project.ts(233,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6963555Z ##[error]apps/react-demo/src/full-body-project.ts(262,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6967313Z ##[error]apps/react-demo/src/full-body-project.ts(291,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6971244Z ##[error]apps/react-demo/src/full-body-project.ts(320,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6974944Z ##[error]apps/react-demo/src/full-body-project.ts(349,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6978783Z ##[error]apps/react-demo/src/full-body-project.ts(378,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.6983085Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(42,24): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:40:33.7311572Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-22T12:40:29.7063085Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.7063484Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.7103177Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.7103462Z env:
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.7103662Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.7103870Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.8200659Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.8201349Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.8202157Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:29.8202611Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:30.2093180Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:30.2097840Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:30.2099487Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:30.7321239Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:30.7444641Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:30.7572058Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.0185391Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.0493376Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.1318180Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.1358642Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.1360750Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.1362201Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.1363187Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.1408044Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 65^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.2885524Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.3405046Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.4052171Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.5444125Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.6036754Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.6711339Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.6714573Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.6740388Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.6770000Z      ^[[32m✓^[[39m U-3 changes nothing when the owning Motion refuses the replacement^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.6788296Z      ^[[32m✓^[[39m U-4 changes nothing when the candidate graph refuses a derived observation^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.8305660Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.8865165Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:31.9207252Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.1014908Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.1730704Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.1804216Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.3502644Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.4143834Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.4190988Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.5856663Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.6450071Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.6900615Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.8381389Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.8882718Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:32.9657981Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.0811015Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.1256203Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.2413763Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.3528639Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.3739287Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.4376872Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.5833880Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.6372376Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.6564759Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.8183274Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.8578294Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:33.8840934Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.0804708Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.0860653Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.1409670Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.2789675Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.2841186Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.4066949Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.4690380Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.6633244Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.7022373Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.7062480Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.8816607Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.9203787Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:34.9499454Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1274194Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1443850Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1483629Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1523927Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1524713Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1525168Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1530398Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1536701Z ^[[31m^[[1mAssertionError^[[22m: expected 'keyframes-missing-values-section at r…' to match /^plugin-unknown-key at /^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1538069Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1542182Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1542725Z /^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1543040Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1543337Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1544887Z "keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1545939Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1547003Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1590924Z     ^[[90m 94|^[[39m     const thrown = thrownBy(() => handle.track(NODE_ID).replace(UNRESO…
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1591842Z     ^[[90m 95|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1592718Z     ^[[90m 96|^[[39m     expect((thrown as Error).message).toMatch(/^plugin-unknown-key at …
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1593685Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1595039Z     ^[[90m 97|^[[39m     // Red on the parent: the graph was already replaced and the live …
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1596398Z     ^[[90m 98|^[[39m     // the next flush resolved nothing and published a composition fai…
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1596971Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1597401Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1597822Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1600059Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1602676Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'keyframes-missing-values-section at r…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1603674Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1603916Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1604327Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1604572Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1604811Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1606316Z "keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1607044Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1607673Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m111:63^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1609307Z     ^[[90m109|^[[39m     ^[[35mconst^[[39m handle ^[[33m=^[[39m ^[[34mload^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1609888Z     ^[[90m110|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1610375Z     ^[[90m111|^[[39m     expect(() => handle.track(NODE_ID).replace(UNRESOLVABLE)).toThrow(…
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1610979Z     ^[[90m   |^[[39m                                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1611887Z     ^[[90m112|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1612590Z     ^[[90m113|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1612834Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1613297Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1613675Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1613718Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1614419Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m54 passed^[[39m^[[22m^[[90m (55)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1615839Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m223 passed^[[39m^[[22m^[[90m (225)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1616390Z ^[[2m   Start at ^[[22m 12:40:30
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1617054Z ^[[2m   Duration ^[[22m 4.92s^[[2m (transform 1.26s, setup 0ms, import 4.22s, tests 1.20s, environment 8ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1617714Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1633999Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1657631Z ##[error]AssertionError: expected 'keyframes-missing-values-section at r…' to match /^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1667372Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1671715Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'keyframes-missing-values-section at r…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:111:63
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:40:35.1993591Z ##[error]Process completed with exit code 1.
```
