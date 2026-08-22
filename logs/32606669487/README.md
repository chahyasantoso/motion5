# CI log archive: 32606669487

- Workflow: CI
- Conclusion: failure
- Head branch: chore/lf-authored-leaf-reader
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32606669487
- Captured: 2026-08-22T23:59:54Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-22T23:59:16.2448385Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.2448778Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.2488640Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.2489143Z env:
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.2489364Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.2489580Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.3506967Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.3507981Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.3508625Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.3508964Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.6557205Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.6561530Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:16.6562574Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.1449733Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.1512901Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.1724410Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.3899934Z  ^[[31m❯^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.3901525Z      ^[[32m✓^[[39m LF-1 answers the leaf shape question from one module^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.3918401Z ^[[31m     ^[[31m×^[[31m LF-2 leaves no consumer holding a second copy of the check^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.3920179Z      ^[[32m✓^[[39m LF-3 makes the compiler and the fake interpolator agree on what a leaf publishes^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.3922444Z      ^[[32m✓^[[39m LF-4 moves no diagnostic while the five sites are consolidated^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.4491508Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5369960Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5416301Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5418332Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5424322Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5425455Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5426480Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5448449Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 77^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5456405Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5472536Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5473146Z });
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5473623Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5473954Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5474733Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.5475410Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.6478069Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.6829131Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.8191969Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.9244329Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:17.9460914Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.0495334Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.1373349Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.2090618Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.3164028Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.4008949Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.4412546Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.5883382Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.6595462Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.6885697Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.8173783Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.9244465Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:18.9328519Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.0564517Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.1606304Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.1708853Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.2696487Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.4130070Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.4302438Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.5197351Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.6604445Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.6808470Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.7842410Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.8555640Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:19.9087206Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.0563589Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.0920822Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.1603421Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.2838439Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.3058979Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.4023667Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.5209328Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.5738873Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.6400810Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.7317441Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.8197815Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:20.8712753Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.0778557Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.1096136Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.1240899Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.2682038Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.3379512Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.3432133Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5058821Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5436138Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5467100Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5503040Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5503868Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5504534Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5508544Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/authored-leaf-reader.test.ts^[[2m > ^[[22mone owner for the authored leaf shape^[[2m > ^[[22mLF-2 leaves no consumer holding a second copy of the check
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5515417Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(5) ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5516051Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5516379Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5517259Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5517575Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5517807Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5518254Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5519136Z ^[[31m+   "contract/validate-v5.ts never reaches the shared reader",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5520582Z ^[[31m+   "contract/validate-v5.ts still declares an inline array test on the property",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5522244Z ^[[31m+   "domain/plugins.ts never reaches the shared reader",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5523655Z ^[[31m+   "domain/plugins.ts still declares a local readStops declaration",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5525015Z ^[[31m+   "domain/plugins.ts still declares an inline array test on the property",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5525861Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5526070Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5528676Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/authored-leaf-reader.test.ts:^[[2m221:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5563718Z     ^[[90m219|^[[39m         offenders^[[33m.^[[39m^[[34mpush^[[39m(^[[32m`^[[39m^[[36m${^[[39msite^[[36m}^[[39m^[[32m never reaches the shared reader`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5565371Z     ^[[90m220|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5567261Z     ^[[90m221|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5568455Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5569145Z     ^[[90m222|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5569646Z     ^[[90m223|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5569903Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5570410Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5570792Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5571100Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5581040Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m55 passed^[[39m^[[22m^[[90m (56)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5582562Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m228 passed^[[39m^[[22m^[[90m (229)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5583231Z ^[[2m   Start at ^[[22m 23:59:16
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5583921Z ^[[2m   Duration ^[[22m 4.88s^[[2m (transform 1.16s, setup 363ms, import 3.73s, tests 1.20s, environment 8ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5584485Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5598471Z 
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5625685Z ##[error]AssertionError: expected [ …(5) ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "contract/validate-v5.ts never reaches the shared reader",
integration (node 24)	Run npm run test:integration	+   "contract/validate-v5.ts still declares an inline array test on the property",
integration (node 24)	Run npm run test:integration	+   "domain/plugins.ts never reaches the shared reader",
integration (node 24)	Run npm run test:integration	+   "domain/plugins.ts still declares a local readStops declaration",
integration (node 24)	Run npm run test:integration	+   "domain/plugins.ts still declares an inline array test on the property",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/authored-leaf-reader.test.ts:221:30
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T23:59:21.5938186Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-22T23:59:24.8562818Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-22T23:59:24.8563106Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-22T23:59:24.8600860Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-22T23:59:24.8601133Z env:
quality (node 24)	Run npm test	2026-08-22T23:59:24.8601333Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-22T23:59:24.8601543Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-22T23:59:24.9634256Z 
quality (node 24)	Run npm test	2026-08-22T23:59:24.9634686Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-22T23:59:24.9635217Z > vitest run
quality (node 24)	Run npm test	2026-08-22T23:59:24.9635428Z 
quality (node 24)	Run npm test	2026-08-22T23:59:25.2605034Z 
quality (node 24)	Run npm test	2026-08-22T23:59:25.2608496Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:25.2609408Z 
quality (node 24)	Run npm test	2026-08-22T23:59:25.7524118Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:25.7704900Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:25.7834747Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.0035981Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.0574654Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-22T23:59:26.0594115Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-22T23:59:26.0603992Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-22T23:59:26.0627268Z 
quality (node 24)	Run npm test	2026-08-22T23:59:26.0628624Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.0632027Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-22T23:59:26.0665862Z 
quality (node 24)	Run npm test	2026-08-22T23:59:26.0692638Z act(() => {
quality (node 24)	Run npm test	2026-08-22T23:59:26.0718963Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-22T23:59:26.0725613Z });
quality (node 24)	Run npm test	2026-08-22T23:59:26.0757789Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-22T23:59:26.0760038Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.0783987Z 
quality (node 24)	Run npm test	2026-08-22T23:59:26.0798462Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-22T23:59:26.0827381Z 
quality (node 24)	Run npm test	2026-08-22T23:59:26.2048774Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.3225299Z  ^[[31m❯^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.3230287Z      ^[[32m✓^[[39m LF-1 answers the leaf shape question from one module^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.3232461Z ^[[31m     ^[[31m×^[[31m LF-2 leaves no consumer holding a second copy of the check^[[39m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.3234933Z      ^[[32m✓^[[39m LF-3 makes the compiler and the fake interpolator agree on what a leaf publishes^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.3237275Z      ^[[32m✓^[[39m LF-4 moves no diagnostic while the five sites are consolidated^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.4050560Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 122^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.4286154Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.5519767Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.6523892Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.6527165Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.8010543Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.8650786Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:26.8854405Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.0420325Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.0956477Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.1322643Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.2928257Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.3062529Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.5104646Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.5204216Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.5488690Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.7316289Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.7621981Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.7745142Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:27.9789372Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:28.0054195Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:28.2041787Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:28.2559357Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:28.4639209Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:28.4689863Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:28.7029102Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:28.7498395Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:28.9539529Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:29.0043522Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:29.2259205Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:29.2989248Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:29.5049757Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:29.5128482Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:29.7724804Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:29.7857666Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:29.9959530Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.0209059Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.2763979Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.3279674Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.5391549Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.6224368Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.7645185Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2831^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.7647949Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2828^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.7861479Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.8275314Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:30.9942079Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.0125298Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.0415026Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.2050327Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.2107399Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.4020180Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.4128796Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.6599122Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.6829072Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.9399143Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:31.9593857Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:32.1877052Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:32.1943788Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:32.4476604Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:32.4679571Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:32.7118988Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:32.7325355Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:32.9543190Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:33.0261065Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:33.1898712Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:33.2588923Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:33.4493402Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:33.5403641Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-22T23:59:33.5406477Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-22T23:59:33.5408186Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-22T23:59:33.5408692Z 
quality (node 24)	Run npm test	2026-08-22T23:59:33.5409342Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-22T23:59:33.5410021Z 
quality (node 24)	Run npm test	2026-08-22T23:59:33.5410190Z act(() => {
quality (node 24)	Run npm test	2026-08-22T23:59:33.5410644Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-22T23:59:33.5411141Z });
quality (node 24)	Run npm test	2026-08-22T23:59:33.5411525Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-22T23:59:33.5411827Z 
quality (node 24)	Run npm test	2026-08-22T23:59:33.5412925Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-22T23:59:33.5413906Z 
quality (node 24)	Run npm test	2026-08-22T23:59:33.5536773Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-22T23:59:33.5554966Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:33.5556789Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-22T23:59:33.5580540Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-22T23:59:33.5598575Z 
quality (node 24)	Run npm test	2026-08-22T23:59:33.5608064Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-22T23:59:33.5627376Z 
quality (node 24)	Run npm test	2026-08-22T23:59:33.5632874Z act(() => {
quality (node 24)	Run npm test	2026-08-22T23:59:33.5633795Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-22T23:59:33.5634497Z });
quality (node 24)	Run npm test	2026-08-22T23:59:33.5635097Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-22T23:59:33.5651195Z 
quality (node 24)	Run npm test	2026-08-22T23:59:33.5652534Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-22T23:59:33.5653781Z 
quality (node 24)	Run npm test	2026-08-22T23:59:33.7064598Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:33.7887936Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:33.9424409Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:34.0767454Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:34.1621749Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:34.3059082Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:34.4053378Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:34.5065332Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:34.6358887Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:34.7646594Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:34.8943694Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.0029297Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.1231597Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.2849388Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.3625482Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.4892182Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.5483708Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.7039283Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.8079818Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:35.9179034Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.0199505Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.1072559Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.2661675Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-22T23:59:36.2670214Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-22T23:59:36.2678033Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-22T23:59:36.2679130Z 
quality (node 24)	Run npm test	2026-08-22T23:59:36.2680011Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-22T23:59:36.2680892Z 
quality (node 24)	Run npm test	2026-08-22T23:59:36.2681256Z act(() => {
quality (node 24)	Run npm test	2026-08-22T23:59:36.2681936Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-22T23:59:36.2682670Z });
quality (node 24)	Run npm test	2026-08-22T23:59:36.2683275Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-22T23:59:36.2683779Z 
quality (node 24)	Run npm test	2026-08-22T23:59:36.2685038Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-22T23:59:36.2686297Z 
quality (node 24)	Run npm test	2026-08-22T23:59:36.2728366Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.2907747Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.5014475Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.5468079Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.7319483Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.7989166Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:36.9366674Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.1182701Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.1664914Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.3171260Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.4143306Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.5552677Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.6100259Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6374^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.6102637Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1807^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.6104572Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1695^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.6225062Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.7826730Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.8030212Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.8349049Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:37.9674629Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.0085350Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.0218314Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.1759108Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.2228198Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.2769034Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.3811991Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.3888498Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.5157565Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.5728816Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.6250738Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.7387283Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.7815812Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.8574623Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9102630Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9439914Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9485341Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9485856Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9486192Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9491099Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/authored-leaf-reader.test.ts^[[2m > ^[[22mone owner for the authored leaf shape^[[2m > ^[[22mLF-2 leaves no consumer holding a second copy of the check
quality (node 24)	Run npm test	2026-08-22T23:59:38.9497670Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(5) ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9498188Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9498419Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9498853Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9499087Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9499259Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9499626Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9500363Z ^[[31m+   "contract/validate-v5.ts never reaches the shared reader",^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9501607Z ^[[31m+   "contract/validate-v5.ts still declares an inline array test on the property",^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9502800Z ^[[31m+   "domain/plugins.ts never reaches the shared reader",^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9503943Z ^[[31m+   "domain/plugins.ts still declares a local readStops declaration",^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9505509Z ^[[31m+   "domain/plugins.ts still declares an inline array test on the property",^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9506298Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9506491Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9507412Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/authored-leaf-reader.test.ts:^[[2m221:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9551936Z     ^[[90m219|^[[39m         offenders^[[33m.^[[39m^[[34mpush^[[39m(^[[32m`^[[39m^[[36m${^[[39msite^[[36m}^[[39m^[[32m never reaches the shared reader`^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9553864Z     ^[[90m220|^[[39m     }
quality (node 24)	Run npm test	2026-08-22T23:59:38.9555161Z     ^[[90m221|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9556526Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9557154Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9557723Z     ^[[90m222|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9558569Z     ^[[90m223|^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9558794Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9559206Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9559654Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9560423Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m129 passed^[[39m^[[22m^[[90m (130)^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9564059Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m601 passed^[[39m^[[22m^[[90m (602)^[[39m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9565038Z ^[[2m   Start at ^[[22m 23:59:25
quality (node 24)	Run npm test	2026-08-22T23:59:38.9578420Z ^[[2m   Duration ^[[22m 13.66s^[[2m (transform 1.82s, setup 836ms, import 6.35s, tests 11.36s, environment 20ms)^[[22m
quality (node 24)	Run npm test	2026-08-22T23:59:38.9579414Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9588222Z 
quality (node 24)	Run npm test	2026-08-22T23:59:38.9613398Z ##[error]AssertionError: expected [ …(5) ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "contract/validate-v5.ts never reaches the shared reader",
quality (node 24)	Run npm test	+   "contract/validate-v5.ts still declares an inline array test on the property",
quality (node 24)	Run npm test	+   "domain/plugins.ts never reaches the shared reader",
quality (node 24)	Run npm test	+   "domain/plugins.ts still declares a local readStops declaration",
quality (node 24)	Run npm test	+   "domain/plugins.ts still declares an inline array test on the property",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/authored-leaf-reader.test.ts:221:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-22T23:59:39.0074405Z ##[error]Process completed with exit code 1.
```
