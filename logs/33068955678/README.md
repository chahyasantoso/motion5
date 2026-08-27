# CI log archive: 33068955678

- Workflow: CI
- Conclusion: failure
- Head branch: feat/c3-ik-plugins-runtime
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33068955678
- Captured: 2026-08-27T11:48:38Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-27T11:48:05.8821256Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.8821654Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.8860373Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.8860900Z env:
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.8861147Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.8861396Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.9977408Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.9978474Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.9979096Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:05.9979390Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:06.4445723Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:06.4452008Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:06.4452819Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:06.9828529Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:06.9971343Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.0210371Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3083392Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3243560Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3730817Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3732710Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3759324Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3759869Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3760590Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3761289Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3761460Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3761904Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3762431Z });
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3762841Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3763149Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3764203Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3765105Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.3768028Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 69^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.5125378Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.7187373Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.7994610Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.8021833Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows without IK awareness^[[39m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.8023751Z      ^[[32m✓^[[39m IK-14 solver throws -> arm-solve errors, members get blocked-upstream, and hand is blocked^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.8025164Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.8026365Z      ^[[32m✓^[[39m IK-16 DOM adapter skips nested rotations record and contributes zero writes for solver node^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.8027643Z ^[[31m     ^[[31m×^[[31m IK-17 handle.get for solver node returns solved rotations record^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.8122329Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:07.9857799Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.0852084Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.0926148Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.2492259Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.3368484Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.3451002Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.5010929Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.6534971Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.6613033Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.7391127Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.9254731Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.9594891Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:08.9887505Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.1882312Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.1946670Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.2673397Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.4260053Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.4380919Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.5197914Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.7175480Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.7277525Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.7643398Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.9650424Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:09.9821944Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.0958357Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.2193349Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.2624936Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.3349440Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.4420582Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.5122827Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.5740524Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.6473772Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.7332129Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.8157043Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:10.8755016Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.0183887Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.0238781Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.1060953Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.2450241Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.2530453Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.3831059Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.4242043Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.5171921Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.6120210Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.6500879Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8043934Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8291716Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8540823Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8571875Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8572824Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8573288Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8576694Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows without IK awareness
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8581138Z ^[[31m^[[1mAssertionError^[[22m: expected 'blocked' to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8582140Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8582925Z Expected: ^[[32m"ready"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8583459Z Received: ^[[31m"blocked"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8583751Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8584517Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m104:33^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8640043Z     ^[[90m102|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8640960Z     ^[[90m103|^[[39m     ^[[35mconst^[[39m solverPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8642562Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(solverPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8643919Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8644544Z     ^[[90m105|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8645748Z     ^[[90m106|^[[39m     ^[[35mconst^[[39m forearmPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/forearm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8646608Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8647116Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8647499Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8649682Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8651644Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8652891Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m231:16^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8654352Z     ^[[90m229|^[[39m     ^[[35mconst^[[39m x1 ^[[33m=^[[39m forearmPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8655319Z     ^[[90m230|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8656291Z     ^[[90m231|^[[39m     ^[[34mexpect^[[39m(x0)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8657306Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8658639Z     ^[[90m232|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8659980Z     ^[[90m233|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(x0)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8663208Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8663757Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8664349Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8666080Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-17 handle.get for solver node returns solved rotations record
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8667982Z ^[[31m^[[1mAssertionError^[[22m: expected {} to have property "rotations"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8669553Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m266:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8671115Z     ^[[90m264|^[[39m     ^[[35mconst^[[39m solverHandle ^[[33m=^[[39m runtime^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8672608Z     ^[[90m265|^[[39m     ^[[34mexpect^[[39m(solverHandle)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8674280Z     ^[[90m266|^[[39m     ^[[34mexpect^[[39m(solverHandle^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoHaveProperty^[[39m(^[[32m"rotations"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8675399Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8675849Z     ^[[90m267|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8676197Z     ^[[90m268|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8676383Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8676641Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8676881Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8676911Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8677410Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m57 passed^[[39m^[[22m^[[90m (58)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8679094Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m243 passed^[[39m^[[22m^[[90m (246)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8680671Z ^[[2m   Start at ^[[22m 11:48:06
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8681967Z ^[[2m   Duration ^[[22m 5.39s^[[2m (transform 1.32s, setup 425ms, import 4.23s, tests 1.30s, environment 9ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8683117Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8690893Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8718421Z ##[error]AssertionError: expected 'blocked' to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Expected: "ready"
integration (node 24)	Run npm run test:integration	Received: "blocked"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:104:33
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8727540Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8729651Z ##[error]AssertionError: expected undefined to be defined
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:231:16
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8730751Z 
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.8732409Z ##[error]AssertionError: expected {} to have property "rotations"
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:266:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-27T11:48:11.9117898Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-27T11:48:09.9878453Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-27T11:48:09.9878739Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-27T11:48:09.9919948Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-27T11:48:09.9920251Z env:
quality (node 24)	Run npm test	2026-08-27T11:48:09.9920468Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-27T11:48:09.9920693Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-27T11:48:10.1152544Z 
quality (node 24)	Run npm test	2026-08-27T11:48:10.1153357Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-27T11:48:10.1153793Z > vitest run
quality (node 24)	Run npm test	2026-08-27T11:48:10.1153970Z 
quality (node 24)	Run npm test	2026-08-27T11:48:10.4222713Z 
quality (node 24)	Run npm test	2026-08-27T11:48:10.4226857Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:10.4227625Z 
quality (node 24)	Run npm test	2026-08-27T11:48:10.9368771Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:10.9459492Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:10.9722645Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.1705493Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.2305305Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.2653533Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.5066485Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.5608218Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-27T11:48:11.5610437Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T11:48:11.5611518Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T11:48:11.5612518Z 
quality (node 24)	Run npm test	2026-08-27T11:48:11.5613097Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T11:48:11.5614928Z 
quality (node 24)	Run npm test	2026-08-27T11:48:11.5615145Z act(() => {
quality (node 24)	Run npm test	2026-08-27T11:48:11.5615578Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T11:48:11.5616034Z });
quality (node 24)	Run npm test	2026-08-27T11:48:11.5616419Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T11:48:11.5617004Z 
quality (node 24)	Run npm test	2026-08-27T11:48:11.5617920Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T11:48:11.5618738Z 
quality (node 24)	Run npm test	2026-08-27T11:48:11.5656360Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 69^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.6122963Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 136^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.7167929Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.7763334Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.8310165Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.9538916Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.9541702Z ^[[31m     ^[[31m×^[[31m IK-9 members arrives under solving plugin scope root-most first and is frozen^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.9543690Z ^[[31m     ^[[31m×^[[31m IK-10 solver whose member exposes no interpolated function fails loudly^[[39m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.9546355Z ^[[31m     ^[[31m×^[[31m IK-11 dirty check re-solves when member interpolated length changes but not when identical^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:11.9548449Z ^[[31m     ^[[31m×^[[31m IK-12 seed rule marks solver when only its member is invalidated^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.0237296Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.2349356Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.2350786Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows without IK awareness^[[39m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.2351905Z      ^[[32m✓^[[39m IK-14 solver throws -> arm-solve errors, members get blocked-upstream, and hand is blocked^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.2353076Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.2354132Z      ^[[32m✓^[[39m IK-16 DOM adapter skips nested rotations record and contributes zero writes for solver node^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.2355396Z ^[[31m     ^[[31m×^[[31m IK-17 handle.get for solver node returns solved rotations record^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.2428826Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.2718544Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.4266483Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.4899738Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.5027024Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.6839289Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.6911965Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.7836325Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.8779968Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:12.9354424Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.0209042Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.1258166Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.1402072Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.2209385Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.3539038Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.3593056Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.4210762Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.5392759Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.6329807Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.7449256Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:13.8320211Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.0159050Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.0291676Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.1985363Z  ^[[31m❯^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.1987440Z ^[[31m     ^[[31m×^[[31m IK-1 solveTwoBone against worked numbers reaches the target tip^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.1989363Z ^[[31m     ^[[31m×^[[31m IK-2 unreachable target produces finite output fully extended toward target without NaN^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.1991696Z ^[[31m     ^[[31m×^[[31m IK-3 flip: true mirrors the elbow solution and still reaches target^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.2000751Z ^[[31m     ^[[31m×^[[31m IK-4 degenerate target distance or zero-length member produces finite angles without NaN^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.2002508Z ^[[31m     ^[[31m×^[[31m IK-5 readMembers throws when inputs.members is absent^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.2838983Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.4111565Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.5116403Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.6750844Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.7819010Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:14.9779548Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:15.0221726Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:15.2531488Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:15.3023654Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:15.4857016Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:15.5208771Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:15.7335938Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:15.7500768Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:15.9529644Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.0299003Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.2418796Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.2828507Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.4326021Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2835^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.4330105Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2832^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.4709759Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.4880694Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.6667504Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.6669817Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.7613471Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.8614841Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.8829094Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:16.9807388Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:17.1061798Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:17.1524253Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:17.3577323Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:17.3926171Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:17.6063982Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:17.6091826Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:17.8156946Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:17.8658574Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.0279490Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.1190855Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.2855641Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.3510877Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.5028041Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.6303838Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.7741404Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.8858703Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:18.9718229Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:19.1173836Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:19.2519669Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-27T11:48:19.2521688Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T11:48:19.2522714Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T11:48:19.2523114Z 
quality (node 24)	Run npm test	2026-08-27T11:48:19.2523650Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T11:48:19.2524177Z 
quality (node 24)	Run npm test	2026-08-27T11:48:19.2524321Z act(() => {
quality (node 24)	Run npm test	2026-08-27T11:48:19.2524728Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T11:48:19.2525148Z });
quality (node 24)	Run npm test	2026-08-27T11:48:19.2525492Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T11:48:19.2525752Z 
quality (node 24)	Run npm test	2026-08-27T11:48:19.2526875Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T11:48:19.2527736Z 
quality (node 24)	Run npm test	2026-08-27T11:48:19.2636353Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-27T11:48:19.2638580Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T11:48:19.2639580Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T11:48:19.2639998Z 
quality (node 24)	Run npm test	2026-08-27T11:48:19.2640662Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T11:48:19.2641553Z 
quality (node 24)	Run npm test	2026-08-27T11:48:19.2668070Z act(() => {
quality (node 24)	Run npm test	2026-08-27T11:48:19.2668559Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T11:48:19.2669019Z });
quality (node 24)	Run npm test	2026-08-27T11:48:19.2669372Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T11:48:19.2669639Z 
quality (node 24)	Run npm test	2026-08-27T11:48:19.2670529Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T11:48:19.2688065Z 
quality (node 24)	Run npm test	2026-08-27T11:48:19.2689046Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:19.3178217Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:19.5343344Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:19.5823992Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:19.7750067Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:19.8059364Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:19.9903307Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.0328911Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.2208539Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.2599149Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.4599334Z  ^[[31m❯^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.4601966Z ^[[31m     ^[[31m×^[[31m IK-6 solver slot is declared and unbound composition is byte-identical across matrix^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.4615232Z      ^[[32m✓^[[39m IK-7 solver bound but nodeId absent from rotations falls back to authored rotation^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.4618350Z ^[[31m     ^[[31m×^[[31m IK-8 solved rotation composes through the authored pivot offset^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.5369103Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.6918996Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.7929270Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:20.9119060Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.0772353Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.1198234Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.2959026Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.3258880Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.4711905Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.5570097Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.6729124Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.7344850Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.8608047Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.9739934Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-27T11:48:21.9748282Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T11:48:21.9759055Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T11:48:21.9764589Z 
quality (node 24)	Run npm test	2026-08-27T11:48:21.9765468Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T11:48:21.9767279Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:21.9768933Z 
quality (node 24)	Run npm test	2026-08-27T11:48:21.9769338Z act(() => {
quality (node 24)	Run npm test	2026-08-27T11:48:21.9769982Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T11:48:21.9770681Z });
quality (node 24)	Run npm test	2026-08-27T11:48:21.9771254Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T11:48:21.9771733Z 
quality (node 24)	Run npm test	2026-08-27T11:48:21.9772880Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T11:48:21.9773952Z 
quality (node 24)	Run npm test	2026-08-27T11:48:22.0889318Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:22.2077252Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:22.3235456Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:22.4429126Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:22.5332656Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:22.6579218Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:22.7451394Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:22.9293515Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:22.9349844Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.1081664Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6058^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.1083761Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1671^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.1085766Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1702^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.1158343Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.1650699Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.2977081Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.3245043Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.3855656Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.4792925Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.5123418Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.5742131Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.6651166Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.6833385Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.7639199Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.8477487Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.8862512Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:23.9443101Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.0594465Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.1091557Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.1646306Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.2765766Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.3230959Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.3913288Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.4553467Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.4917271Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.4962772Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.4963691Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 14 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.4964345Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.4969406Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows without IK awareness
quality (node 24)	Run npm test	2026-08-27T11:48:24.4973070Z ^[[31m^[[1mAssertionError^[[22m: expected 'blocked' to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.4973777Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.4974521Z Expected: ^[[32m"ready"^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.4975042Z Received: ^[[31m"blocked"^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.4975321Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.4976099Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m104:33^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5027727Z     ^[[90m102|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5028925Z     ^[[90m103|^[[39m     ^[[35mconst^[[39m solverPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5030507Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(solverPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5031569Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5032153Z     ^[[90m105|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5033262Z     ^[[90m106|^[[39m     ^[[35mconst^[[39m forearmPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/forearm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5034444Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5034951Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5035332Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5037247Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
quality (node 24)	Run npm test	2026-08-27T11:48:24.5039034Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5040227Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m231:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5041620Z     ^[[90m229|^[[39m     ^[[35mconst^[[39m x1 ^[[33m=^[[39m forearmPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5042503Z     ^[[90m230|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5043263Z     ^[[90m231|^[[39m     ^[[34mexpect^[[39m(x0)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5044326Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5045169Z     ^[[90m232|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5046259Z     ^[[90m233|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(x0)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5047162Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5047600Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5047953Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5049479Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-17 handle.get for solver node returns solved rotations record
quality (node 24)	Run npm test	2026-08-27T11:48:24.5051194Z ^[[31m^[[1mAssertionError^[[22m: expected {} to have property "rotations"^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5052367Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m266:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5053864Z     ^[[90m264|^[[39m     ^[[35mconst^[[39m solverHandle ^[[33m=^[[39m runtime^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5055240Z     ^[[90m265|^[[39m     ^[[34mexpect^[[39m(solverHandle)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5058838Z     ^[[90m266|^[[39m     ^[[34mexpect^[[39m(solverHandle^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoHaveProperty^[[39m(^[[32m"rotations"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5060139Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5060796Z     ^[[90m267|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5061290Z     ^[[90m268|^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5061574Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5062003Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5062380Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5064173Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/fk-solver-override.test.ts^[[2m > ^[[22mfkPlugin solver override (Slice C3)^[[2m > ^[[22mIK-6 solver slot is declared and unbound composition is byte-identical across matrix
quality (node 24)	Run npm test	2026-08-27T11:48:24.5066231Z ^[[31m^[[1mAssertionError^[[22m: expected { Object (base) } to have property "solver"^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5067952Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/fk-solver-override.test.ts:^[[2m13:35^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5069177Z     ^[[90m 11|^[[39m   it("IK-6 solver slot is declared and unbound composition is byte-ide…
quality (node 24)	Run npm test	2026-08-27T11:48:24.5070151Z     ^[[90m 12|^[[39m     ^[[90m// Assert requirement slot declared^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5071451Z     ^[[90m 13|^[[39m     ^[[34mexpect^[[39m(fkPlugin^[[33m.^[[39mrequirements)^[[33m.^[[39m^[[34mtoHaveProperty^[[39m(^[[32m"solver"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5072611Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5073184Z     ^[[90m 14|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5073904Z     ^[[90m 15|^[[39m     ^[[90m// Matrix of parent frames and local properties^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5074398Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5074810Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5075161Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5076985Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/fk-solver-override.test.ts^[[2m > ^[[22mfkPlugin solver override (Slice C3)^[[2m > ^[[22mIK-8 solved rotation composes through the authored pivot offset
quality (node 24)	Run npm test	2026-08-27T11:48:24.5079296Z ^[[31m^[[1mAssertionError^[[22m: expected +0 to be 90 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5079750Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5079977Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5080419Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5080640Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5080840Z ^[[32m- 90^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5081229Z ^[[31m+ 0^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5081422Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5082181Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/fk-solver-override.test.ts:^[[2m68:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5083298Z     ^[[90m 66|^[[39m     ^[[90m// dx = 50 * cos(90) = 0, dy = 50 * sin(90) = 50^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5084224Z     ^[[90m 67|^[[39m     ^[[90m// Tip x = 110, Tip y = 120 + 50 = 170, rotation = 90^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5085369Z     ^[[90m 68|^[[39m     ^[[34mexpect^[[39m(output^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m90^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5086534Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5088248Z     ^[[90m 69|^[[39m     ^[[34mexpect^[[39m(output^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m110^[[39m^[[33m,^[[39m ^[[34m5^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5090742Z     ^[[90m 70|^[[39m     ^[[34mexpect^[[39m(output^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m170^[[39m^[[33m,^[[39m ^[[34m5^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5091459Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5091870Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5092219Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5093720Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/ik-solve.test.ts^[[2m > ^[[22mikPlugin and solveTwoBone (Slice C3)^[[2m > ^[[22mIK-1 solveTwoBone against worked numbers reaches the target tip
quality (node 24)	Run npm test	2026-08-27T11:48:24.5095359Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5096457Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/ik-solve.test.ts:^[[2m59:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5097990Z     ^[[90m 57|^[[39m ^[[34mdescribe^[[39m(^[[32m"ikPlugin and solveTwoBone (Slice C3)"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
quality (node 24)	Run npm test	2026-08-27T11:48:24.5099254Z     ^[[90m 58|^[[39m   it("IK-1 solveTwoBone against worked numbers reaches the target tip"…
quality (node 24)	Run npm test	2026-08-27T11:48:24.5100484Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(seam^[[33m.^[[39msolveTwoBone)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5101590Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5103179Z     ^[[90m 60|^[[39m     ^[[35mconst^[[39m root^[[33m:^[[39m ^[[33mBaseFrame^[[39m ^[[33m=^[[39m { x^[[33m:^[[39m ^[[34m200^[[39m^[[33m,^[[39m y^[[33m:^[[39m ^[[34m300^[[39m^[[33m,^[[39m rotation^[[33m:^[[39m ^[[34m0^[[39m }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5105379Z     ^[[90m 61|^[[39m     ^[[35mconst^[[39m target^[[33m:^[[39m ^[[33mBaseFrame^[[39m ^[[33m=^[[39m { x^[[33m:^[[39m ^[[34m320^[[39m^[[33m,^[[39m y^[[33m:^[[39m ^[[34m340^[[39m^[[33m,^[[39m rotation^[[33m:^[[39m ^[[34m0^[[39m }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5106301Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5106946Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5107321Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5109087Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/ik-solve.test.ts^[[2m > ^[[22mikPlugin and solveTwoBone (Slice C3)^[[2m > ^[[22mIK-2 unreachable target produces finite output fully extended toward target without NaN
quality (node 24)	Run npm test	2026-08-27T11:48:24.5110863Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5111994Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/ik-solve.test.ts:^[[2m80:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5112769Z     ^[[90m 78|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5116475Z     ^[[90m 79|^[[39m   it("IK-2 unreachable target produces finite output fully extended to…
quality (node 24)	Run npm test	2026-08-27T11:48:24.5118135Z     ^[[90m 80|^[[39m     ^[[34mexpect^[[39m(seam^[[33m.^[[39msolveTwoBone)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5119158Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5120772Z     ^[[90m 81|^[[39m     ^[[35mconst^[[39m root^[[33m:^[[39m ^[[33mBaseFrame^[[39m ^[[33m=^[[39m { x^[[33m:^[[39m ^[[34m200^[[39m^[[33m,^[[39m y^[[33m:^[[39m ^[[34m300^[[39m^[[33m,^[[39m rotation^[[33m:^[[39m ^[[34m0^[[39m }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5122531Z     ^[[90m 82|^[[39m     ^[[90m// Target is 200 units away; max reach is 80 + 60 = 140^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5123028Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5123444Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5123826Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5125648Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/ik-solve.test.ts^[[2m > ^[[22mikPlugin and solveTwoBone (Slice C3)^[[2m > ^[[22mIK-3 flip: true mirrors the elbow solution and still reaches target
quality (node 24)	Run npm test	2026-08-27T11:48:24.5127510Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5128670Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/ik-solve.test.ts:^[[2m102:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5129427Z     ^[[90m100|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5130452Z     ^[[90m101|^[[39m   it("IK-3 flip: true mirrors the elbow solution and still reaches tar…
quality (node 24)	Run npm test	2026-08-27T11:48:24.5131746Z     ^[[90m102|^[[39m     ^[[34mexpect^[[39m(seam^[[33m.^[[39msolveTwoBone)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5132752Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5134340Z     ^[[90m103|^[[39m     ^[[35mconst^[[39m root^[[33m:^[[39m ^[[33mBaseFrame^[[39m ^[[33m=^[[39m { x^[[33m:^[[39m ^[[34m200^[[39m^[[33m,^[[39m y^[[33m:^[[39m ^[[34m300^[[39m^[[33m,^[[39m rotation^[[33m:^[[39m ^[[34m0^[[39m }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5138412Z     ^[[90m104|^[[39m     ^[[35mconst^[[39m target^[[33m:^[[39m ^[[33mBaseFrame^[[39m ^[[33m=^[[39m { x^[[33m:^[[39m ^[[34m300^[[39m^[[33m,^[[39m y^[[33m:^[[39m ^[[34m350^[[39m^[[33m,^[[39m rotation^[[33m:^[[39m ^[[34m0^[[39m }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5139456Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5139934Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5140298Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5143392Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/ik-solve.test.ts^[[2m > ^[[22mikPlugin and solveTwoBone (Slice C3)^[[2m > ^[[22mIK-4 degenerate target distance or zero-length member produces finite angles without NaN
quality (node 24)	Run npm test	2026-08-27T11:48:24.5145518Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5146871Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/ik-solve.test.ts:^[[2m127:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5147679Z     ^[[90m125|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5148526Z     ^[[90m126|^[[39m   it("IK-4 degenerate target distance or zero-length member produces f…
quality (node 24)	Run npm test	2026-08-27T11:48:24.5149805Z     ^[[90m127|^[[39m     ^[[34mexpect^[[39m(seam^[[33m.^[[39msolveTwoBone)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5150806Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5152397Z     ^[[90m128|^[[39m     ^[[35mconst^[[39m root^[[33m:^[[39m ^[[33mBaseFrame^[[39m ^[[33m=^[[39m { x^[[33m:^[[39m ^[[34m200^[[39m^[[33m,^[[39m y^[[33m:^[[39m ^[[34m300^[[39m^[[33m,^[[39m rotation^[[33m:^[[39m ^[[34m0^[[39m }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5154638Z     ^[[90m129|^[[39m     ^[[35mconst^[[39m samePointTarget^[[33m:^[[39m ^[[33mBaseFrame^[[39m ^[[33m=^[[39m { x^[[33m:^[[39m ^[[34m200^[[39m^[[33m,^[[39m y^[[33m:^[[39m ^[[34m300^[[39m^[[33m,^[[39m rotation^[[33m:^[[39m ^[[34m0^[[39m }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5155668Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5156079Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5156417Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5157839Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/ik-solve.test.ts^[[2m > ^[[22mikPlugin and solveTwoBone (Slice C3)^[[2m > ^[[22mIK-5 readMembers throws when inputs.members is absent
quality (node 24)	Run npm test	2026-08-27T11:48:24.5158844Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5159559Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/ik-solve.test.ts:^[[2m148:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5160051Z     ^[[90m146|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5160746Z     ^[[90m147|^[[39m   ^[[34mit^[[39m(^[[32m"IK-5 readMembers throws when inputs.members is absent"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
quality (node 24)	Run npm test	2026-08-27T11:48:24.5161632Z     ^[[90m148|^[[39m     ^[[34mexpect^[[39m(seam^[[33m.^[[39mreadMembers)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5162438Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5163239Z     ^[[90m149|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m seam^[[33m.^[[39m^[[34mreadMembers^[[39m^[[33m!^[[39m(undefined))^[[33m.^[[39m^[[34mtoThrow^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5164243Z     ^[[90m150|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m seam^[[33m.^[[39m^[[34mreadMembers^[[39m^[[33m!^[[39m({}))^[[33m.^[[39m^[[34mtoThrow^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5164689Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5164940Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5165156Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5166238Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/publisher-solver-members.test.ts^[[2m > ^[[22mPublisher solver member inputs (Slice C3)^[[2m > ^[[22mIK-9 members arrives under solving plugin scope root-most first and is frozen
quality (node 24)	Run npm test	2026-08-27T11:48:24.5168276Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5169108Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/publisher-solver-members.test.ts:^[[2m148:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5170499Z     ^[[90m146|^[[39m     publisher^[[33m.^[[39m^[[34mflush^[[39m(snap^[[33m,^[[39m snap^[[33m.^[[39morder^[[33m,^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5171051Z     ^[[90m147|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5171799Z     ^[[90m148|^[[39m     ^[[34mexpect^[[39m(capturedMembers)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5172694Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5173685Z     ^[[90m149|^[[39m     ^[[35mconst^[[39m membersList ^[[33m=^[[39m capturedMembers ^[[35mas^[[39m readonly ^[[33mMemberState^[[39m[]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5174827Z     ^[[90m150|^[[39m     ^[[34mexpect^[[39m(membersList)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5175337Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5175709Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5176058Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5177705Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/publisher-solver-members.test.ts^[[2m > ^[[22mPublisher solver member inputs (Slice C3)^[[2m > ^[[22mIK-10 solver whose member exposes no interpolated function fails loudly
quality (node 24)	Run npm test	2026-08-27T11:48:24.5179276Z ^[[31m^[[1mAssertionError^[[22m: expected 'ready' to be 'error' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5179819Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5180062Z Expected: ^[[32m"error"^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5180386Z Received: ^[[31m"ready"^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5180546Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5181103Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/publisher-solver-members.test.ts:^[[2m192:33^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5182316Z     ^[[90m190|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m publisher^[[33m.^[[39m^[[34mflush^[[39m(snap^[[33m,^[[39m snap^[[33m.^[[39morder^[[33m,^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5183179Z     ^[[90m191|^[[39m     const solverPatch = batch.patches.find((p) => p.nodeId === "walker…
quality (node 24)	Run npm test	2026-08-27T11:48:24.5184146Z     ^[[90m192|^[[39m     ^[[34mexpect^[[39m(solverPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"error"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5184917Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5185306Z     ^[[90m193|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5185611Z     ^[[90m194|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5185754Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5186132Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5186431Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5188237Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/publisher-solver-members.test.ts^[[2m > ^[[22mPublisher solver member inputs (Slice C3)^[[2m > ^[[22mIK-11 dirty check re-solves when member interpolated length changes but not when identical
quality (node 24)	Run npm test	2026-08-27T11:48:24.5189777Z ^[[31m^[[1mAssertionError^[[22m: expected 2 to be 1 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5190096Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5190252Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5190673Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5190911Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5191092Z ^[[32m- 1^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5191457Z ^[[31m+ 2^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5191852Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5192559Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/publisher-solver-members.test.ts:^[[2m243:24^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5193573Z     ^[[90m241|^[[39m     ^[[90m// Tick 2: nothing changed -> memoized, no re-solve^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5194747Z     ^[[90m242|^[[39m     publisher^[[33m.^[[39m^[[34mflush^[[39m(snap^[[33m,^[[39m snap^[[33m.^[[39morder^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5195638Z     ^[[90m243|^[[39m     ^[[34mexpect^[[39m(solveCount)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5196176Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5196518Z     ^[[90m244|^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5197184Z     ^[[90m245|^[[39m     ^[[90m// Tick 3: member length changes -> solver re-solves^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5197479Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5197736Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5198104Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5199112Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/publisher-solver-members.test.ts^[[2m > ^[[22mPublisher solver member inputs (Slice C3)^[[2m > ^[[22mIK-12 seed rule marks solver when only its member is invalidated
quality (node 24)	Run npm test	2026-08-27T11:48:24.5200227Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5200545Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5200695Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5200974Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5201120Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5201246Z ^[[32m- true^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5201511Z ^[[31m+ false^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5201652Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5202138Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/publisher-solver-members.test.ts:^[[2m296:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5202796Z     ^[[90m294|^[[39m     ^[[90m// Invalidate ONLY upper-arm^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5203557Z     ^[[90m295|^[[39m     publisher^[[33m.^[[39m^[[34mflush^[[39m(snap^[[33m,^[[39m [^[[32m"walker/upper-arm"^[[39m]^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5204409Z     ^[[90m296|^[[39m     ^[[34mexpect^[[39m(solverComposed)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5204977Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5205349Z     ^[[90m297|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5205682Z     ^[[90m298|^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5205847Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5206084Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/14]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5206384Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5206415Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5207069Z ^[[2m Test Files ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m136 passed^[[39m^[[22m^[[90m (140)^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5207864Z ^[[2m      Tests ^[[22m ^[[1m^[[31m14 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m642 passed^[[39m^[[22m^[[90m (656)^[[39m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5208379Z ^[[2m   Start at ^[[22m 11:48:10
quality (node 24)	Run npm test	2026-08-27T11:48:24.5209045Z ^[[2m   Duration ^[[22m 14.05s^[[2m (transform 1.85s, setup 849ms, import 6.69s, tests 11.24s, environment 18ms)^[[22m
quality (node 24)	Run npm test	2026-08-27T11:48:24.5209446Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5209453Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5230962Z ##[error]AssertionError: expected 'blocked' to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "ready"
quality (node 24)	Run npm test	Received: "blocked"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-two-bone.test.ts:104:33
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5240691Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5243219Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-two-bone.test.ts:231:16
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5244744Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5247056Z ##[error]AssertionError: expected {} to have property "rotations"
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-two-bone.test.ts:266:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5248451Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5250740Z ##[error]AssertionError: expected { Object (base) } to have property "solver"
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/fk-solver-override.test.ts:13:35
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5252215Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5254702Z ##[error]AssertionError: expected +0 to be 90 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 90
quality (node 24)	Run npm test	+ 0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/fk-solver-override.test.ts:68:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5256788Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5258681Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/ik-solve.test.ts:59:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5260069Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5261847Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/ik-solve.test.ts:80:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5263148Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5264884Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/ik-solve.test.ts:102:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5266168Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5268139Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/ik-solve.test.ts:127:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5269509Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5271275Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/ik-solve.test.ts:148:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5272581Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5274584Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/publisher-solver-members.test.ts:148:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5276019Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5278776Z ##[error]AssertionError: expected 'ready' to be 'error' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "error"
quality (node 24)	Run npm test	Received: "ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/publisher-solver-members.test.ts:192:33
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5280602Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5283071Z ##[error]AssertionError: expected 2 to be 1 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 1
quality (node 24)	Run npm test	+ 2
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/publisher-solver-members.test.ts:243:24
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5284720Z 
quality (node 24)	Run npm test	2026-08-27T11:48:24.5287027Z ##[error]AssertionError: expected false to be true // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- true
quality (node 24)	Run npm test	+ false
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/publisher-solver-members.test.ts:296:28
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T11:48:24.5598780Z ##[error]Process completed with exit code 1.
```
