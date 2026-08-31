# CI log archive: 33360281114

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-27-handle-base
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33360281114
- Captured: 2026-08-31T05:22:33Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-31T05:22:09.4323728Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.4324127Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.4363566Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.4363855Z env:
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.4364064Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.4364279Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.5383197Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.5384028Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.5384773Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.5385152Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.8738093Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.8747785Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:09.8748709Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.4637661Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.4968203Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 59^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6449271Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6476320Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6477895Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6478649Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6481874Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6482913Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6485036Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6486137Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6486705Z });
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6487140Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6487425Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6488517Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6489508Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.6788586Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 129^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.7708210Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.8178227Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:10.9515468Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.0159586Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.1332117Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.3844871Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.4008348Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.4710320Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.6248445Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.6763635Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.7881263Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.9127940Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.9382816Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.9385470Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.9387718Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.9389781Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:11.9391889Z ^[[31m     ^[[31m×^[[31m U-4 changes nothing when the candidate graph refuses a derived observation^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.0643681Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.2139627Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.2406248Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.3491678Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.5021387Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.5317988Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.6088258Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.7554324Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.7741377Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:12.9015084Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.0072488Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.0826640Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.1683439Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.1686682Z ^[[31m     ^[[31m×^[[31m ingests authored tracks into the removable store without auto-mounting^[[39m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.1688853Z      ^[[32m✓^[[39m returns a capability handle and refuses stale ABA handles^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.1690988Z      ^[[32m✓^[[39m replaces a track non-destructively and preserves subscriber identity^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.1692937Z      ^[[32m✓^[[39m reads dependants from the committed graph and rejects source removal^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.1694905Z      ^[[32m✓^[[39m treats observation changes as replacement of the observer track^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.2693940Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.3698875Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.4253172Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.5168183Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.6029098Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.6877709Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.7579442Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.8968896Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:13.9737864Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.0011847Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.1486459Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.2289132Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.2406610Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.3798425Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.4603207Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.4657342Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.6117201Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.6909798Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.7287750Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.8170006Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.9312346Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:14.9870031Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.0528070Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.1558690Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.2038277Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.3483425Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.4018095Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.4468672Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.5714672Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.6274550Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.6650894Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.7953511Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8127020Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8160772Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8161816Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8162348Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8167338Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8172237Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8172861Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8173112Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8173490Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8173791Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8174124Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8174457Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8174765Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8175071Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8175396Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8175935Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8176234Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8176538Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8176871Z         "v": 100,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8177196Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8177493Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8177785Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8178080Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8178263Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8178509Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8179181Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8179582Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8180753Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m102:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8219164Z     ^[[90m100|^[[39m     // the next flush resolved nothing and published a composition fai…
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8220741Z     ^[[90m101|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8223052Z     ^[[90m102|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m100^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8223998Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8224640Z     ^[[90m103|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8225296Z     ^[[90m104|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8225979Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8226476Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8226852Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8228676Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8230783Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8231164Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8231312Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8231534Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8231730Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8231974Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8232303Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8232502Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8232857Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8233105Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8233294Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8233488Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8234188Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8234398Z         "v": 200,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8234750Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8234928Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8235104Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8235279Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8235422Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8237141Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8237417Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8237534Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8238477Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m117:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8239269Z     ^[[90m115|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8240074Z     ^[[90m116|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8241377Z     ^[[90m117|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8242859Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8243410Z     ^[[90m118|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8243816Z     ^[[90m119|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8244078Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8244331Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8244548Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8245929Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8247238Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8247605Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8247738Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8247975Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8248168Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8248374Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8248608Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8248900Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8249103Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8249447Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8249804Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8250122Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8250445Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8250807Z         "v": 100,
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8251158Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8251455Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8251759Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8252066Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8252244Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8252525Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8252918Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8253118Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8254118Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m131:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8255818Z     ^[[90m129|^[[39m     // all moved to a definition the Motion then refused, so the handl…
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8257125Z     ^[[90m130|^[[39m     // never took effect and the node composed values nothing had acce…
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8259143Z     ^[[90m131|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m100^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8260792Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8262400Z     ^[[90m132|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8263577Z     ^[[90m133|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8263808Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8264251Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8264622Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8267156Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-4 changes nothing when the candidate graph refuses a derived observation
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8269418Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'observes')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8270988Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m147:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8272426Z     ^[[90m145|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8273280Z     ^[[90m146|^[[39m     expect((thrown as Error).message).toMatch(/^observation-unknown-so…
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8275074Z     ^[[90m147|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack^[[33m.^[[39mobserves)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8276928Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8278488Z     ^[[90m148|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8279652Z     ^[[90m149|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8279877Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8280305Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8280704Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8282651Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mingests authored tracks into the removable store without auto-mounting
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8284767Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'id')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8286481Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m41:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8288087Z     ^[[90m 39|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"scene/arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8289605Z     ^[[90m 40|^[[39m     ^[[35mconst^[[39m free ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"~/free"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8291174Z     ^[[90m 41|^[[39m     ^[[34mexpect^[[39m(authored^[[33m.^[[39mtrack^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8292279Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8293495Z     ^[[90m 42|^[[39m     ^[[34mexpect^[[39m(free^[[33m.^[[39mtrack^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"free"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8295346Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m handle^[[33m.^[[39m^[[34mmount^[[39m(^[[32m"scene/arm"^[[39m))^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8296494Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8296952Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8297335Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8297373Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8298191Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m60 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8299602Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m253 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8300503Z ^[[2m   Start at ^[[22m 05:22:09
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8301666Z ^[[2m   Duration ^[[22m 5.92s^[[2m (transform 1.55s, setup 446ms, import 4.93s, tests 1.64s, environment 10ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8302359Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8302375Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8333407Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
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
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8344972Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8349961Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
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
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8352649Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8357158Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
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
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8360236Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8363065Z ##[error]TypeError: Cannot read properties of undefined (reading 'observes')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:147:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8364887Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8367494Z ##[error]TypeError: Cannot read properties of undefined (reading 'id')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:41:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:22:15.8699861Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-31T05:22:07.3830304Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.3830675Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.3870654Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.3871174Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.3871403Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.3871641Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.4911616Z 
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.4912473Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.4913241Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:07.4913672Z 
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6374002Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(102,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6387077Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(117,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6391011Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(131,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6394711Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(147,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6398471Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(41,21): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6401836Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(42,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6405368Z ##[error]packages/core/test/unit/runtime/live-value-animated.test.ts(90,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6408973Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(117,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6412386Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(181,18): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6415739Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(182,18): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6419389Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(209,16): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6422518Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(267,24): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6425725Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(277,16): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6429247Z ##[error]packages/core/test/unit/runtime/structural-commit-path.test.ts(109,46): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6432553Z ##[error]packages/core/test/unit/runtime/structural-commit-path.test.ts(243,36): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6435802Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(107,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6439370Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(126,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6442521Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(142,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:22:11.6913628Z ##[error]Process completed with exit code 2.
```
