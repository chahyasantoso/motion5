# CI log archive: 32615237167

- Workflow: CI
- Conclusion: failure
- Head branch: main
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32615237167
- Captured: 2026-08-23T03:24:44Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-23T03:24:11.5982095Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-23T03:24:11.5982409Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-23T03:24:11.6020390Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-23T03:24:11.6020834Z env:
quality (node 24)	Run npm test	2026-08-23T03:24:11.6021035Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-23T03:24:11.6021261Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-23T03:24:11.7056973Z 
quality (node 24)	Run npm test	2026-08-23T03:24:11.7058055Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-23T03:24:11.7058536Z > vitest run
quality (node 24)	Run npm test	2026-08-23T03:24:11.7058709Z 
quality (node 24)	Run npm test	2026-08-23T03:24:12.0220835Z 
quality (node 24)	Run npm test	2026-08-23T03:24:12.0222243Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:12.0222868Z 
quality (node 24)	Run npm test	2026-08-23T03:24:12.5617717Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:12.5723928Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:12.5976175Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:12.8028061Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:12.8883179Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:12.9429504Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-23T03:24:12.9461940Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-23T03:24:12.9468112Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-23T03:24:12.9490779Z 
quality (node 24)	Run npm test	2026-08-23T03:24:12.9523637Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:12.9525353Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-23T03:24:12.9543339Z 
quality (node 24)	Run npm test	2026-08-23T03:24:12.9580726Z act(() => {
quality (node 24)	Run npm test	2026-08-23T03:24:12.9581456Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-23T03:24:12.9607664Z });
quality (node 24)	Run npm test	2026-08-23T03:24:12.9640821Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-23T03:24:12.9670538Z 
quality (node 24)	Run npm test	2026-08-23T03:24:12.9672014Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-23T03:24:12.9700685Z 
quality (node 24)	Run npm test	2026-08-23T03:24:13.0889547Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.1335816Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.1338461Z ^[[31m     ^[[31m×^[[31m declares every citation case id exactly once across the suite^[[39m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.1362373Z      ^[[32m✓^[[39m finds the series at all, so a passing run is never an empty scan^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.2824673Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 137^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.2924420Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.3823615Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.5103529Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.5478749Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.6235472Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.7868682Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.8202609Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:13.8262100Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.0522284Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.0581932Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.0714424Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.2633134Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.2896450Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.3039685Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.4898311Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.5485128Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.5708607Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.7330763Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.8765804Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:14.9336238Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:15.1016786Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:15.2193613Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/traceability-scan.test.ts ^[[2m(^[[22m^[[2m16 tests^[[22m^[[2m)^[[22m^[[32m 89^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:15.3522471Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:15.4439166Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:15.5818589Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:15.6692571Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:15.8955938Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:15.9432824Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:16.1875439Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:16.2303443Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:16.4560113Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:16.5244017Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:16.7572064Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:16.7702063Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:16.9930629Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:17.0992424Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:17.2722517Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:17.3531056Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:17.5552498Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:17.6846739Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:17.8319204Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.0045862Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.0763207Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.1782443Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3264^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.1811884Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3260^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.2869925Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.3475668Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.4850798Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.5162380Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.5937869Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.7078193Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.8722430Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:18.9423971Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:19.1589862Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:19.2552963Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:19.4910646Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:19.5262516Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:19.7186394Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:19.8572526Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:19.9742515Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:20.2095442Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:20.3429369Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:20.4935128Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:20.5976300Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:20.7656874Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:20.9803107Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:21.0532658Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:21.2292413Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:21.3052205Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:21.5843114Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-23T03:24:21.5871678Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-23T03:24:21.5901080Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-23T03:24:21.5918052Z 
quality (node 24)	Run npm test	2026-08-23T03:24:21.5932912Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-23T03:24:21.5946784Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:21.5954976Z 
quality (node 24)	Run npm test	2026-08-23T03:24:21.5955345Z act(() => {
quality (node 24)	Run npm test	2026-08-23T03:24:21.5956375Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-23T03:24:21.5956886Z });
quality (node 24)	Run npm test	2026-08-23T03:24:21.5957318Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-23T03:24:21.5957649Z 
quality (node 24)	Run npm test	2026-08-23T03:24:21.5958656Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-23T03:24:21.5959695Z 
quality (node 24)	Run npm test	2026-08-23T03:24:21.6028433Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-23T03:24:21.6033741Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:21.6074152Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-23T03:24:21.6147896Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-23T03:24:21.6161135Z 
quality (node 24)	Run npm test	2026-08-23T03:24:21.6221769Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-23T03:24:21.6263701Z 
quality (node 24)	Run npm test	2026-08-23T03:24:21.6287908Z act(() => {
quality (node 24)	Run npm test	2026-08-23T03:24:21.6321039Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-23T03:24:21.6362596Z });
quality (node 24)	Run npm test	2026-08-23T03:24:21.6390989Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-23T03:24:21.6420561Z 
quality (node 24)	Run npm test	2026-08-23T03:24:21.6481648Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-23T03:24:21.6498837Z 
quality (node 24)	Run npm test	2026-08-23T03:24:21.8701943Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:21.9024426Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:22.1537186Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:22.1671607Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:22.4308833Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:22.4536480Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:22.7058671Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:22.7129027Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:22.9220678Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:23.0224786Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:23.2023036Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:23.2548872Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:23.4842406Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:23.5515671Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:23.7162439Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:23.7920076Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:23.9812732Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.0294629Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.2229566Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.2623277Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.4374048Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-23T03:24:24.4376541Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-23T03:24:24.4378343Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-23T03:24:24.4378984Z 
quality (node 24)	Run npm test	2026-08-23T03:24:24.4380692Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-23T03:24:24.4381353Z 
quality (node 24)	Run npm test	2026-08-23T03:24:24.4381534Z act(() => {
quality (node 24)	Run npm test	2026-08-23T03:24:24.4382001Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-23T03:24:24.4382517Z });
quality (node 24)	Run npm test	2026-08-23T03:24:24.4383277Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-23T03:24:24.4384007Z 
quality (node 24)	Run npm test	2026-08-23T03:24:24.4385266Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-23T03:24:24.4387466Z 
quality (node 24)	Run npm test	2026-08-23T03:24:24.4396088Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.4669094Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.6176024Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.6985469Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.8052559Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:24.9127692Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:25.0582437Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:25.1537420Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:25.3770582Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:25.3892234Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:25.6198928Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:25.6423182Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:25.8457283Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:25.9233125Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.0666686Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.1406851Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 7398^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.1408750Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 2013^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.1410659Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1799^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.1545221Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.2378004Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.3431204Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.3706492Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.4197724Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.5128360Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.5752157Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.6300603Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.7037745Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.8137040Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.8432429Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:26.9512422Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.0448366Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.0726505Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.1832890Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2256706Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2475011Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2523879Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2524904Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2525406Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2528172Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/evidence-case-ids.test.ts^[[2m > ^[[22mevidence case ids^[[2m > ^[[22mdeclares every citation case id exactly once across the suite
quality (node 24)	Run npm test	2026-08-23T03:24:27.2536311Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(12) ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2536946Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2537487Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2538142Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2538644Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2538998Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2539547Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2541255Z ^[[31m+   "T-1 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2543229Z ^[[31m+   "T-10 declared in unit/adapters/trigger-factory-no-fallback.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2544910Z ^[[31m+   "T-11 declared in integration/motion-trigger-types.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2545907Z ^[[31m+   "T-12 declared in integration/motion-trigger-types.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2546932Z ^[[31m+   "T-2 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2547984Z ^[[31m+   "T-3 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2548998Z ^[[31m+   "T-4 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2550007Z ^[[31m+   "T-5 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2551835Z ^[[31m+   "T-6 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2553300Z ^[[31m+   "T-7 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2555290Z ^[[31m+   "T-8 declared in unit/adapters/trigger-factory-no-fallback.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2556460Z ^[[31m+   "T-9 declared in unit/adapters/trigger-factory-no-fallback.test.ts and unit/scripts/traceability-scan.test.ts",^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2557049Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2557174Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2557665Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/evidence-case-ids.test.ts:^[[2m146:24^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2571758Z     ^[[90m144|^[[39m       ^[[33m.^[[39m^[[34mmap^[[39m(([id^[[33m,^[[39m files]) ^[[33m=>^[[39m ^[[32m`^[[39m^[[36m${^[[39mid^[[36m}^[[39m^[[32m declared in ^[[39m^[[36m${^[[39mfiles^[[33m.^[[39m^[[34mjoin^[[39m(^[[32m" and "^[[39m)^[[36m}^[[39m^[[32m`^[[39m)
quality (node 24)	Run npm test	2026-08-23T03:24:27.2573153Z     ^[[90m145|^[[39m       ^[[33m.^[[39m^[[34msort^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2574040Z     ^[[90m146|^[[39m     ^[[34mexpect^[[39m(collisions)^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2574572Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2574950Z     ^[[90m147|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2575234Z     ^[[90m148|^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2575367Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2575609Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2575840Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2575945Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2581657Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m131 passed^[[39m^[[22m^[[90m (132)^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2587850Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m629 passed^[[39m^[[22m^[[90m (630)^[[39m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2610782Z ^[[2m   Start at ^[[22m 03:24:12
quality (node 24)	Run npm test	2026-08-23T03:24:27.2611990Z ^[[2m   Duration ^[[22m 15.21s^[[2m (transform 2.00s, setup 894ms, import 7.04s, tests 13.16s, environment 22ms)^[[22m
quality (node 24)	Run npm test	2026-08-23T03:24:27.2612741Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2612759Z 
quality (node 24)	Run npm test	2026-08-23T03:24:27.2645095Z ##[error]AssertionError: expected [ …(12) ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "T-1 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-10 declared in unit/adapters/trigger-factory-no-fallback.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-11 declared in integration/motion-trigger-types.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-12 declared in integration/motion-trigger-types.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-2 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-3 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-4 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-5 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-6 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-7 declared in integration/t4-runtime-motion-parity.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-8 declared in unit/adapters/trigger-factory-no-fallback.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+   "T-9 declared in unit/adapters/trigger-factory-no-fallback.test.ts and unit/scripts/traceability-scan.test.ts",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/evidence-case-ids.test.ts:146:24
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-23T03:24:27.3132732Z ##[error]Process completed with exit code 1.
```
