# CI log archive: 33359996321

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-27-handle-base
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33359996321
- Captured: 2026-08-31T05:17:51Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-31T05:17:26.8278620Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.8279142Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.8327224Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.8327850Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.8328168Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.8328520Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.9476931Z 
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.9477614Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.9478292Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:26.9478621Z 
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1083519Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(102,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1093322Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(117,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1095549Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(131,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1097631Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(147,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1099578Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(41,21): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1101454Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(42,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1103874Z ##[error]packages/core/test/unit/runtime/live-value-animated.test.ts(90,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1106805Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(117,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1109805Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(181,18): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1112946Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(182,18): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1115833Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(209,16): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1118804Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(267,24): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1121717Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(277,16): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1124911Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(145,42): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1128030Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(162,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1130925Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(216,19): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1134106Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(219,19): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1137110Z ##[error]packages/core/test/unit/runtime/structural-commit-path.test.ts(109,46): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1140097Z ##[error]packages/core/test/unit/runtime/structural-commit-path.test.ts(243,36): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1143318Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(107,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1146392Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(126,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1149778Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(142,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:17:31.1539558Z ##[error]Process completed with exit code 2.
boundaries (node 24)	Run npm run test:boundaries	﻿2026-08-31T05:17:29.5557928Z ##[group]Run npm run test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.5558557Z ^[[36;1mnpm run test:boundaries^[[0m
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.5598713Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.5599016Z env:
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.5599251Z   NODE_VERSION: 24
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.5599494Z ##[endgroup]
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.6757283Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.6758087Z > motion5@0.0.0 test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.6759383Z > node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.6760180Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.7299637Z packages/core/src/index.ts: public export StaleHandleError is not allow-listed
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.7300684Z packages/core/src/index.ts: public export Handle is not allow-listed
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.7301552Z packages/core/src/index.ts: public export RequireView is not allow-listed
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.7302508Z packages/core/src/index.ts: public export StaleMotionHandleError is not allow-listed
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.7303636Z packages/core/src/index.ts: public export MotionHandle is not allow-listed
boundaries (node 24)	Run npm run test:boundaries	2026-08-31T05:17:29.7437361Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-31T05:17:27.1317387Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.1318005Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.1357147Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.1357433Z env:
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.1357632Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.1357843Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.2461115Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.2462207Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.2463361Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.2463997Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.6117140Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.6148282Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:27.6156168Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.3194219Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.3506008Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 70^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5262903Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5287172Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5320644Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5346189Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5406968Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5428821Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5456417Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5466777Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5491596Z });
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5516823Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5518467Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 144^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5532718Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5534866Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.5630279Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.6663130Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.7168587Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.8916404Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:28.9378156Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:29.0962345Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 71^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:29.4190217Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:29.4317773Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:29.4366488Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:29.7378088Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:29.7538327Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:29.7688453Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.0392200Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.0578142Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.0957302Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.0979137Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.1028191Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.1057650Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.1088561Z ^[[31m     ^[[31m×^[[31m U-4 changes nothing when the candidate graph refuses a derived observation^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.3590527Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.4076376Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.4387780Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.6878140Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.7128151Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.7692802Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.9688243Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:30.9747972Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.1044196Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.2646350Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.2920858Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.4077902Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.4080816Z ^[[31m     ^[[31m×^[[31m ingests authored tracks into the removable store without auto-mounting^[[39m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.4082981Z      ^[[32m✓^[[39m returns a capability handle and refuses stale ABA handles^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.4084837Z      ^[[32m✓^[[39m replaces a track non-destructively and preserves subscriber identity^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.4087075Z      ^[[32m✓^[[39m reads dependants from the committed graph and rejects source removal^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.4088972Z      ^[[32m✓^[[39m treats observation changes as replacement of the observer track^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.5451073Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.5599376Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.6412004Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.8008120Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.8178218Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:31.8988236Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.0389031Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.1195420Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.1530742Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.2920089Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.3958124Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.4100463Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.5178175Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.6349480Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.6635223Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.7183859Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.8483142Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.8807886Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:32.9744621Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.0386205Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.1528784Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.1735997Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.3132349Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.3667315Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.4078374Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.5922993Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.6116800Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.6188002Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.8268302Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.8508381Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:33.8567230Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0085210Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0220773Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0255319Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0256278Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0256599Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0260423Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0271716Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0272595Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0273256Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0273940Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0274583Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0275567Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0276456Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0277041Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0277593Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0278196Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0278771Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0279317Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0279873Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0280618Z         "v": 100,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0281268Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0281879Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0282469Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0283062Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0283590Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0284149Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0284887Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0285371Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0287119Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m102:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0318368Z     ^[[90m100|^[[39m     // the next flush resolved nothing and published a composition fai…
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0320373Z     ^[[90m101|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0321935Z     ^[[90m102|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m100^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0322941Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0323421Z     ^[[90m103|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0323946Z     ^[[90m104|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0324405Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0324781Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0325129Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0327171Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0329106Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0329774Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0330185Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0330606Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0330922Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0331271Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0331581Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0331772Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0331963Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0332162Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0332361Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0332541Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0333029Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0333378Z         "v": 200,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0333575Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0333751Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0333930Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0334108Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0334205Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0334520Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0334882Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0335013Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0335596Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m117:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0336535Z     ^[[90m115|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0337324Z     ^[[90m116|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0338649Z     ^[[90m117|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0339735Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0340156Z     ^[[90m118|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0340535Z     ^[[90m119|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0340798Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0341039Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0341252Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0342343Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0343569Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0343922Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0344068Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0344286Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0344469Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0344667Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0344890Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0345143Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0345348Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0345930Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0346164Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0346364Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0346559Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0346769Z         "v": 100,
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0346967Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0347153Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0347438Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0347728Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0347837Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0348102Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0348538Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0348746Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0349741Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m131:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0351315Z     ^[[90m129|^[[39m     // all moved to a definition the Motion then refused, so the handl…
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0352558Z     ^[[90m130|^[[39m     // never took effect and the node composed values nothing had acce…
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0354848Z     ^[[90m131|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m100^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0356820Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0358494Z     ^[[90m132|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0359753Z     ^[[90m133|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0359988Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0360439Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0360832Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0363024Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-4 changes nothing when the candidate graph refuses a derived observation
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0365445Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'observes')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0367537Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m147:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0369045Z     ^[[90m145|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0369913Z     ^[[90m146|^[[39m     expect((thrown as Error).message).toMatch(/^observation-unknown-so…
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0371818Z     ^[[90m147|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack^[[33m.^[[39mobserves)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0373267Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0374858Z     ^[[90m148|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0376546Z     ^[[90m149|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0376799Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0377248Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0377636Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0379616Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mingests authored tracks into the removable store without auto-mounting
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0381779Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'id')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0383263Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m41:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0384883Z     ^[[90m 39|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"scene/arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0386697Z     ^[[90m 40|^[[39m     ^[[35mconst^[[39m free ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"~/free"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0388310Z     ^[[90m 41|^[[39m     ^[[34mexpect^[[39m(authored^[[33m.^[[39mtrack^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0389490Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0390748Z     ^[[90m 42|^[[39m     ^[[34mexpect^[[39m(free^[[33m.^[[39mtrack^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"free"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0392682Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m handle^[[33m.^[[39m^[[34mmount^[[39m(^[[32m"scene/arm"^[[39m))^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0393636Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0394095Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0394469Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0394508Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0396155Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m60 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0397886Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m253 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0398974Z ^[[2m   Start at ^[[22m 05:17:27
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0400342Z ^[[2m   Duration ^[[22m 6.39s^[[2m (transform 1.74s, setup 472ms, import 5.46s, tests 1.82s, environment 10ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0401453Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0401565Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0431710Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "id": "arm",
integration (node 24)	Run npm run test:integration	  "keyframes": {
integration (node 24)	Run npm run test:integration	    "x": [
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 0,
integration (node 24)	Run npm run test:integration	        "v": 0,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 1,
integration (node 24)	Run npm run test:integration	        "v": 100,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	    ],
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:102:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0443134Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0448389Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "id": "arm",
integration (node 24)	Run npm run test:integration	  "keyframes": {
integration (node 24)	Run npm run test:integration	    "x": [
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 0,
integration (node 24)	Run npm run test:integration	        "v": 0,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 1,
integration (node 24)	Run npm run test:integration	        "v": 200,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	    ],
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:117:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0451198Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0455909Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "id": "arm",
integration (node 24)	Run npm run test:integration	  "keyframes": {
integration (node 24)	Run npm run test:integration	    "x": [
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 0,
integration (node 24)	Run npm run test:integration	        "v": 0,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 1,
integration (node 24)	Run npm run test:integration	        "v": 100,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	    ],
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:131:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0459114Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0461980Z ##[error]TypeError: Cannot read properties of undefined (reading 'observes')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:147:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0463859Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0466733Z ##[error]TypeError: Cannot read properties of undefined (reading 'id')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:41:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:17:34.0803946Z ##[error]Process completed with exit code 1.
```
