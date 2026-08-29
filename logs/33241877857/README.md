# CI log archive: 33241877857

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ik-member-weight-blend
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33241877857
- Captured: 2026-08-29T07:54:17Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-29T07:53:44.1349503Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.1349888Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.1387858Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.1388147Z env:
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.1388354Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.1388577Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.2400503Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.2401520Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.2402116Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.2402402Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.5601970Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.5603944Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:44.5605174Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.0987295Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.1247991Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2664254Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2703757Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2730884Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2742073Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2763791Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2764845Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2765447Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2766291Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2767277Z });
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2768009Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2768676Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2770065Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2771682Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.2845673Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 113^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.3593898Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.4278004Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.5673533Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.5939789Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.8493392Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.8582937Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:45.9453404Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1259576Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1261950Z      ^[[32m✓^[[39m Q-7 derives the input edge from the binding and composes world space from it^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1263739Z      ^[[32m✓^[[39m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1265761Z      ^[[32m✓^[[39m Q-9 refuses a binding whose source is not a node in the graph^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1267620Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1269909Z      ^[[32m✓^[[39m Q-11 keeps an upstream value out of the observer's authored value namespace^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1272340Z      ^[[32m✓^[[39m Q-12 refuses a binding to a slot the plugin never declared, at load^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1307992Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.1977537Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.3753129Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.3760363Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.4576101Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.6591659Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.6925916Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.6982831Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.9413447Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.9521563Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:46.9572865Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.1693658Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.1887366Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.2360887Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.4160926Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.4358664Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.4990883Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.6655080Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.6876617Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.7402045Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.9236454Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:47.9374591Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.0135218Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.1393928Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.1795522Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.2787754Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.3984344Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.4323443Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.5585218Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.5992672Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.6726131Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.7825486Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.8132282Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:48.8810350Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.0002781Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.0492705Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.1382757Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.1688654Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.2852937Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.3581827Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.3843138Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.5425347Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.5860346Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.5942954Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.8044822Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.8088181Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.8286391Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.9669002Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.9903659Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.9935598Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.9936299Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.9936985Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.9940176Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.9946008Z ^[[31m^[[1mTypeError^[[22m: ik-weight-without-solver at walk/span: Node "walk/span" authors weight under reach without binding a solver there; there is no solved rotation to blend.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:49.9948091Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0027927Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0029426Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0030212Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0030784Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0031801Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0032471Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0033139Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0033933Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m91:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0035119Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m155:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0035550Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0035946Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0036332Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0037605Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0043846Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m59 passed^[[39m^[[22m^[[90m (60)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0045283Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m251 passed^[[39m^[[22m^[[90m (252)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0045997Z ^[[2m   Start at ^[[22m 07:53:44
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0046864Z ^[[2m   Duration ^[[22m 5.41s^[[2m (transform 1.39s, setup 390ms, import 4.43s, tests 1.43s, environment 10ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0049347Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0069897Z 
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0094556Z ##[error]TypeError: ik-weight-without-solver at walk/span: Node "walk/span" authors weight under reach without binding a solver there; there is no solved rotation to blend.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:91:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:155:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-29T07:53:50.0433557Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-29T07:53:50.8277245Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-29T07:53:50.8277546Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-29T07:53:50.8318466Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-29T07:53:50.8318771Z env:
quality (node 24)	Run npm test	2026-08-29T07:53:50.8318987Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-29T07:53:50.8319206Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-29T07:53:50.9437133Z 
quality (node 24)	Run npm test	2026-08-29T07:53:50.9437926Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-29T07:53:50.9438447Z > vitest run
quality (node 24)	Run npm test	2026-08-29T07:53:50.9438672Z 
quality (node 24)	Run npm test	2026-08-29T07:53:51.2325997Z 
quality (node 24)	Run npm test	2026-08-29T07:53:51.2331184Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:51.2331941Z 
quality (node 24)	Run npm test	2026-08-29T07:53:51.6685539Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:51.6881512Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:51.8769217Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:51.9712249Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.0111099Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-29T07:53:52.0112906Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-29T07:53:52.0113562Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-29T07:53:52.0113825Z 
quality (node 24)	Run npm test	2026-08-29T07:53:52.0114169Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-29T07:53:52.0114501Z 
quality (node 24)	Run npm test	2026-08-29T07:53:52.0114602Z act(() => {
quality (node 24)	Run npm test	2026-08-29T07:53:52.0115007Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-29T07:53:52.0115424Z });
quality (node 24)	Run npm test	2026-08-29T07:53:52.0115779Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-29T07:53:52.0116080Z 
quality (node 24)	Run npm test	2026-08-29T07:53:52.0117005Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-29T07:53:52.0117737Z 
quality (node 24)	Run npm test	2026-08-29T07:53:52.0376269Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 113^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.1691890Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.1754043Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.3013085Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.3970263Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.4489876Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.5122657Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.6329208Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.7199963Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.8356874Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 128^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.8571062Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:52.9517568Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-slot-claim.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.0203386Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.0650703Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.2654578Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.3855433Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.4474242Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.4781425Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.6151653Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.6727209Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.7330710Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.8236985Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.8945718Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:53.9102048Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.0113244Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.1333164Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.1562687Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.2816202Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.2838111Z      ^[[32m✓^[[39m Q-7 derives the input edge from the binding and composes world space from it^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.2840304Z      ^[[32m✓^[[39m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.2842379Z      ^[[32m✓^[[39m Q-9 refuses a binding whose source is not a node in the graph^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.2848407Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.2852235Z      ^[[32m✓^[[39m Q-11 keeps an upstream value out of the observer's authored value namespace^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.2866704Z      ^[[32m✓^[[39m Q-12 refuses a binding to a slot the plugin never declared, at load^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.3461276Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.3816962Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.4845699Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.5961093Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.6439741Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.6570867Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.8005850Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.8467829Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:54.8771665Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.0352003Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.0415193Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.0830087Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.2813960Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.2861521Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.4824960Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.5437190Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.6964256Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.7368914Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:55.8961317Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:56.0661111Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:56.1121951Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:56.3441548Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:56.3811786Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:56.6208272Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:56.6348902Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:56.9178018Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:56.9271990Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.1286520Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.1371692Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.3593100Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.4013705Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.5847088Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.6241821Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.8512058Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.8564574Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.9796160Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2769^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:57.9811097Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2766^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.0385261Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.1137063Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.1926388Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.2833558Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.2921347Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.4269756Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.5021694Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.5405047Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.6321424Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.6921645Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.7433293Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.9022019Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:58.9238141Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:59.1600836Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:59.1667773Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:59.3930202Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:59.4299110Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:59.6281470Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:59.7047461Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:59.8483958Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:53:59.9881664Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:00.0982437Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:00.2101847Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:00.3258086Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:00.4665485Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:00.5641896Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:00.7131554Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:00.7895429Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:00.9180883Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:01.0648820Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-29T07:54:01.0651087Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-29T07:54:01.0652095Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-29T07:54:01.0652510Z 
quality (node 24)	Run npm test	2026-08-29T07:54:01.0653028Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-29T07:54:01.0653372Z 
quality (node 24)	Run npm test	2026-08-29T07:54:01.0653472Z act(() => {
quality (node 24)	Run npm test	2026-08-29T07:54:01.0653731Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-29T07:54:01.0654000Z });
quality (node 24)	Run npm test	2026-08-29T07:54:01.0654232Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-29T07:54:01.0654393Z 
quality (node 24)	Run npm test	2026-08-29T07:54:01.0654943Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-29T07:54:01.0655431Z 
quality (node 24)	Run npm test	2026-08-29T07:54:01.0709775Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-29T07:54:01.0730740Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-29T07:54:01.0732395Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:01.0739211Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-29T07:54:01.0740628Z 
quality (node 24)	Run npm test	2026-08-29T07:54:01.0741351Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-29T07:54:01.0742112Z 
quality (node 24)	Run npm test	2026-08-29T07:54:01.0742415Z act(() => {
quality (node 24)	Run npm test	2026-08-29T07:54:01.0742956Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-29T07:54:01.0743540Z });
quality (node 24)	Run npm test	2026-08-29T07:54:01.0744023Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-29T07:54:01.0744435Z 
quality (node 24)	Run npm test	2026-08-29T07:54:01.0745503Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-29T07:54:01.0746878Z 
quality (node 24)	Run npm test	2026-08-29T07:54:01.1317538Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:01.3552964Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:01.3860257Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:01.5780108Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:01.5960835Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:01.7816091Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:01.8129006Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.0015707Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.0249944Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.1959814Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.2754684Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.4000620Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.5318277Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.6378160Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.8023350Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:02.8339553Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.0047030Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.0341953Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.2224572Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.2741457Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.4084226Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.4797683Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.5911768Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.7112206Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-29T07:54:03.7137417Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-29T07:54:03.7139940Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.7223077Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-29T07:54:03.7226154Z 
quality (node 24)	Run npm test	2026-08-29T07:54:03.7227758Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-29T07:54:03.7228595Z 
quality (node 24)	Run npm test	2026-08-29T07:54:03.7228964Z act(() => {
quality (node 24)	Run npm test	2026-08-29T07:54:03.7229816Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-29T07:54:03.7230498Z });
quality (node 24)	Run npm test	2026-08-29T07:54:03.7231067Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-29T07:54:03.7233055Z 
quality (node 24)	Run npm test	2026-08-29T07:54:03.7234309Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-29T07:54:03.7259722Z 
quality (node 24)	Run npm test	2026-08-29T07:54:03.7899994Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:03.9163481Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.0098455Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.1416291Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.2633805Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.3686899Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.5156690Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.6584872Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.7267089Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.8856965Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.9291672Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6128^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.9293942Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1700^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.9295925Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1662^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:04.9431178Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.0751695Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.1270522Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.1659205Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.2561160Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.3090564Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.3451896Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.4406990Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.4941822Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.5311254Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.6165904Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.6978080Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.7108894Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.8318814Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.9069768Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:05.9174017Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.0704852Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.1250411Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.1330977Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2212407Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2694039Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2748740Z 
quality (node 24)	Run npm test	2026-08-29T07:54:06.2749534Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2750018Z 
quality (node 24)	Run npm test	2026-08-29T07:54:06.2753322Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
quality (node 24)	Run npm test	2026-08-29T07:54:06.2759915Z ^[[31m^[[1mTypeError^[[22m: ik-weight-without-solver at walk/span: Node "walk/span" authors weight under reach without binding a solver there; there is no solved rotation to blend.^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2761690Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2839428Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2841297Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
quality (node 24)	Run npm test	2026-08-29T07:54:06.2843017Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-29T07:54:06.2844583Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2849523Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2850145Z 
quality (node 24)	Run npm test	2026-08-29T07:54:06.2851072Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2852245Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2853664Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m91:6^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2855197Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m155:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2855899Z 
quality (node 24)	Run npm test	2026-08-29T07:54:06.2856311Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2856675Z 
quality (node 24)	Run npm test	2026-08-29T07:54:06.2860615Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m153 passed^[[39m^[[22m^[[90m (154)^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2862561Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m732 passed^[[39m^[[22m^[[90m (733)^[[39m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2863402Z ^[[2m   Start at ^[[22m 07:53:51
quality (node 24)	Run npm test	2026-08-29T07:54:06.2864680Z ^[[2m   Duration ^[[22m 15.01s^[[2m (transform 2.03s, setup 890ms, import 7.33s, tests 11.47s, environment 20ms)^[[22m
quality (node 24)	Run npm test	2026-08-29T07:54:06.2865378Z 
quality (node 24)	Run npm test	2026-08-29T07:54:06.2889529Z 
quality (node 24)	Run npm test	2026-08-29T07:54:06.2920930Z ##[error]TypeError: ik-weight-without-solver at walk/span: Node "walk/span" authors weight under reach without binding a solver there; there is no solved rotation to blend.
quality (node 24)	Run npm test	 ❯ assertValidProject packages/core/src/engine.ts:101:11
quality (node 24)	Run npm test	 ❯ Engine.load packages/core/src/engine.ts:170:29
quality (node 24)	Run npm test	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:91:6
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:155:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-29T07:54:06.3401512Z ##[error]Process completed with exit code 1.
```
