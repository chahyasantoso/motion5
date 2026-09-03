# CI log archive: 33779070807

- Workflow: CI
- Conclusion: failure
- Head branch: chore/262-one-spelling-for-dependants
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33779070807
- Captured: 2026-09-03T16:31:39Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-09-03T16:31:01.1936976Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.1937276Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.1977218Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.1977464Z env:
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.1977645Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.1977864Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.2778843Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.2779327Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.2779694Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.2780059Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.5382261Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.5385462Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.5386139Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:01.9923980Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.0148613Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1080463Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1087812Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1090651Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1117245Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1126496Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1129108Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1130989Z act(() => {
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1131530Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1132115Z });
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1132578Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1132954Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1133855Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1134698Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1281437Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 94^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.1884934Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.2580162Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.3311805Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.3667531Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.4810245Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.6468150Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.6763613Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.6991998Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.8508000Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.8748629Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:02.9042873Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.0671548Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.0790917Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.0942137Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.2714810Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.2867697Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.3472168Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.4812464Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.4887086Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.5504481Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.6659162Z  ^[[31m❯^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.6661328Z      ^[[32m✓^[[39m preserves the last known good values when a node publishes error^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.6662872Z ^[[31m     ^[[31m×^[[31m derives source revisions from the upstream patches consumed in the flush^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.6664391Z ^[[31m     ^[[31m×^[[31m reports a pending reference instead of silently composing with an input hole^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.6666001Z ^[[31m     ^[[31m×^[[31m chooses the blocked upstream deterministically by edge key, not authored edge order^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.6667510Z      ^[[32m✓^[[39m rejects host objects from interpolator state at the renderer edge^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.6669278Z      ^[[32m✓^[[39m kills a timeline exactly once when a Track is disposed repeatedly^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.6810632Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.7639449Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.8390728Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.9135119Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:03.9677557Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.0229727Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.1300410Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.1549708Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.2246840Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.2866342Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.3657949Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.3922906Z  ^[[31m❯^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.3941592Z ^[[31m     ^[[31m×^[[31m a same-flush requirement consumer sees the source's merged value^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.3951426Z ^[[31m     ^[[31m×^[[31m a later flush resolves the source's merged value via registry fallback^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.4879175Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.5845728Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.5897619Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.6641784Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.7718908Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.8017206Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.8160036Z  ^[[31m❯^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.8162636Z ^[[31m     ^[[31m×^[[31m I-5 composes a shared ancestor once and publishes one whole batch^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.8164337Z ^[[31m     ^[[31m×^[[31m I-9 publishes an error and blocks the downstream closure while unrelated branches continue^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.8166418Z      ^[[32m✓^[[39m does not expose topology mutation methods^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.9521677Z  ^[[31m❯^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.9522588Z ^[[31m     ^[[31m×^[[31m merges output source values over the composed patch^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.9523224Z ^[[31m     ^[[31m×^[[31m uses canonical edge order when output sources collide^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.9736173Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:04.9989184Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.0991988Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.1644830Z  ^[[31m❯^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.1671710Z ^[[31m     ^[[31m×^[[31m uses the last published value for an unseeded requirement source^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.1752019Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.2801645Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.3233648Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.3834989Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.4421632Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.4707815Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.5868787Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.6031084Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.6793360Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.7254817Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.7732546Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.8615233Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9015603Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9175328Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9201525Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9202194Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 10 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9202547Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9205382Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/flush-output-merge.test.ts^[[2m > ^[[22mGraphPublisher output edges^[[2m > ^[[22mmerges output source values over the composed patch
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9209094Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9210427Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/flush-output-merge.test.ts:^[[2m14:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9239542Z     ^[[90m 12|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9240677Z     ^[[90m 13|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9241796Z     ^[[90m 14|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9242576Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9243734Z     ^[[90m 15|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9245148Z     ^[[90m 16|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9246307Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/flush-output-merge.test.ts:^[[2m48:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9246770Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9247106Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9247390Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9248570Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/flush-output-merge.test.ts^[[2m > ^[[22mGraphPublisher output edges^[[2m > ^[[22muses canonical edge order when output sources collide
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9250018Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9251027Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/flush-output-merge.test.ts:^[[2m14:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9251765Z     ^[[90m 12|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9252469Z     ^[[90m 13|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9253325Z     ^[[90m 14|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9253942Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9254887Z     ^[[90m 15|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9256467Z     ^[[90m 16|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9257518Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/flush-output-merge.test.ts:^[[2m77:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9257993Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9258338Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9258612Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9259732Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/graph-publisher.test.ts^[[2m > ^[[22mGraphPublisher^[[2m > ^[[22mI-5 composes a shared ancestor once and publishes one whole batch
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9261293Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9262269Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/graph-publisher.test.ts:^[[2m34:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9263003Z     ^[[90m 32|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9263683Z     ^[[90m 33|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9264551Z     ^[[90m 34|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9265157Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9266090Z     ^[[90m 35|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9267146Z     ^[[90m 36|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9268132Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/graph-publisher.test.ts:^[[2m55:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9268586Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9268879Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9269142Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9270566Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/graph-publisher.test.ts^[[2m > ^[[22mGraphPublisher^[[2m > ^[[22mI-9 publishes an error and blocks the downstream closure while unrelated branches continue
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9271911Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9272849Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/graph-publisher.test.ts:^[[2m34:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9273548Z     ^[[90m 32|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9274237Z     ^[[90m 33|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9275075Z     ^[[90m 34|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9275700Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9276633Z     ^[[90m 35|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9277736Z     ^[[90m 36|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9278744Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/graph-publisher.test.ts:^[[2m81:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9279234Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9279565Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9281548Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9282930Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/p2-runtime-smells.test.ts^[[2m > ^[[22mP2 runtime smell hardening^[[2m > ^[[22mderives source revisions from the upstream patches consumed in the flush
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9284270Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9285258Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m28:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9286004Z     ^[[90m 26|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9286690Z     ^[[90m 27|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((entry) => [ent…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9287582Z     ^[[90m 28|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9288188Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9289397Z     ^[[90m 29|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9290824Z     ^[[90m 30|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9291849Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m75:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9292329Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9292631Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9292906Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9294218Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/p2-runtime-smells.test.ts^[[2m > ^[[22mP2 runtime smell hardening^[[2m > ^[[22mreports a pending reference instead of silently composing with an input hole
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9295573Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9296554Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m28:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9297298Z     ^[[90m 26|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9297986Z     ^[[90m 27|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((entry) => [ent…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9298790Z     ^[[90m 28|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9299407Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9300607Z     ^[[90m 29|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9301621Z     ^[[90m 30|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9302564Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m87:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9303040Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9303361Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9303628Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9304978Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/p2-runtime-smells.test.ts^[[2m > ^[[22mP2 runtime smell hardening^[[2m > ^[[22mchooses the blocked upstream deterministically by edge key, not authored edge order
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9306321Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9307261Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m28:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9307970Z     ^[[90m 26|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9308663Z     ^[[90m 27|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((entry) => [ent…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9309507Z     ^[[90m 28|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9310284Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9311201Z     ^[[90m 29|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9312291Z     ^[[90m 30|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9313300Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m106:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9313878Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9314212Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9314482Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9315875Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/partial-seed-inputs.test.ts^[[2m > ^[[22mGraphPublisher partial-seed requirement inputs^[[2m > ^[[22muses the last published value for an unseeded requirement source
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9317301Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9318276Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/partial-seed-inputs.test.ts:^[[2m14:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9319007Z     ^[[90m 12|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9319650Z     ^[[90m 13|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9320922Z     ^[[90m 14|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9321671Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9322580Z     ^[[90m 15|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9323667Z     ^[[90m 16|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9324709Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/partial-seed-inputs.test.ts:^[[2m74:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9325187Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9325517Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9325786Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9327344Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/publisher-output-merge-consistency.test.ts^[[2m > ^[[22mGraphPublisher: memo/registry consistency (recovery A1)^[[2m > ^[[22ma same-flush requirement consumer sees the source's merged value
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9329094Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9330438Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m24:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9331312Z     ^[[90m 22|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9332053Z     ^[[90m 23|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((n) => [n.id, n…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9332930Z     ^[[90m 24|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9333559Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9334504Z     ^[[90m 25|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9335610Z     ^[[90m 26|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9336802Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m57:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9337402Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9337753Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9338018Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9339638Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/publisher-output-merge-consistency.test.ts^[[2m > ^[[22mGraphPublisher: memo/registry consistency (recovery A1)^[[2m > ^[[22ma later flush resolves the source's merged value via registry fallback
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9341472Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9342619Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m24:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9343472Z     ^[[90m 22|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9344148Z     ^[[90m 23|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((n) => [n.id, n…
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9344988Z     ^[[90m 24|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9345598Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9346531Z     ^[[90m 25|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9347521Z     ^[[90m 26|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9348596Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m86:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9349145Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9349438Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9349696Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9349732Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9350526Z ^[[2m Test Files ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m57 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9351568Z ^[[2m      Tests ^[[22m ^[[1m^[[31m10 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m248 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9352194Z ^[[2m   Start at ^[[22m 16:31:01
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9353183Z ^[[2m   Duration ^[[22m 4.36s^[[2m (transform 1.20s, setup 300ms, import 3.99s, tests 1.11s, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9353868Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9353900Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9376792Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/flush-output-merge.test.ts:14:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/flush-output-merge.test.ts:48:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9385086Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9387804Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/flush-output-merge.test.ts:14:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/flush-output-merge.test.ts:77:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9389349Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9391791Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/graph-publisher.test.ts:34:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/graph-publisher.test.ts:55:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9393208Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9395523Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/graph-publisher.test.ts:34:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/graph-publisher.test.ts:81:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9396967Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9399133Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/p2-runtime-smells.test.ts:28:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/p2-runtime-smells.test.ts:75:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9400708Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9402322Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/p2-runtime-smells.test.ts:28:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/p2-runtime-smells.test.ts:87:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9403693Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9405942Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/p2-runtime-smells.test.ts:28:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/p2-runtime-smells.test.ts:106:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9406969Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9408422Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/partial-seed-inputs.test.ts:14:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/partial-seed-inputs.test.ts:74:19
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9409370Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9411136Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/publisher-output-merge-consistency.test.ts:24:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/publisher-output-merge-consistency.test.ts:57:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9412111Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9413604Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/publisher-output-merge-consistency.test.ts:24:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/publisher-output-merge-consistency.test.ts:86:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:31:05.9759309Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-09-03T16:31:01.5354765Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:01.5355209Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:01.5379519Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:01.5379920Z env:
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:01.5380185Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:01.5380463Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:01.6256055Z 
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9710351Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9711212Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9711493Z 
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9737293Z ##[error]packages/core/test/integration/flush-output-merge.test.ts(3,24): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9749060Z ##[error]packages/core/test/integration/flush-output-merge.test.ts(14,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9751423Z ##[error]packages/core/test/integration/graph-publisher.test.ts(2,10): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9753751Z ##[error]packages/core/test/integration/graph-publisher.test.ts(34,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9755771Z ##[error]packages/core/test/integration/p2-runtime-smells.test.ts(2,10): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9757979Z ##[error]packages/core/test/integration/p2-runtime-smells.test.ts(28,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9760247Z ##[error]packages/core/test/integration/partial-seed-inputs.test.ts(2,10): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9762377Z ##[error]packages/core/test/integration/partial-seed-inputs.test.ts(14,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9764613Z ##[error]packages/core/test/integration/publisher-output-merge-consistency.test.ts(2,10): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9766904Z ##[error]packages/core/test/integration/publisher-output-merge-consistency.test.ts(24,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9769058Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(72,25): error TS2339: Property 'dependents' does not exist on type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9770709Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(114,23): error TS2339: Property 'dependents' does not exist on type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9772958Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(122,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9775171Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(130,38): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9777486Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(135,30): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9779501Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(148,74): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9781619Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(149,59): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9784016Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(4,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9786852Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(31,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9789440Z ##[error]packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts(110,32): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9791735Z ##[error]packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts(111,32): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9793947Z ##[error]packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts(128,32): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9796317Z ##[error]packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts(8,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9799239Z ##[error]packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts(25,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9801972Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(3,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9804549Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(42,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9806993Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(2,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9809742Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(30,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9812236Z ##[error]packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts(128,20): error TS2551: Property 'dependents' does not exist on type 'PublisherSnapshot'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9814356Z ##[error]packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts(128,51): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9816669Z ##[error]packages/core/test/unit/runtime/publisher-solver-members.test.ts(2,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:04.9819379Z ##[error]packages/core/test/unit/runtime/publisher-solver-members.test.ts(79,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:05.0001710Z ##[error]Process completed with exit code 2.
```
