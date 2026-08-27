# CI log archive: 33026028790

- Workflow: CI
- Conclusion: failure
- Head branch: feat/fo-fk-pivot-offsets
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33026028790
- Captured: 2026-08-27T00:12:49Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-27T00:12:22.0457652Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-27T00:12:22.0458120Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-27T00:12:22.0492111Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-27T00:12:22.0492363Z env:
quality (node 24)	Run npm test	2026-08-27T00:12:22.0492530Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-27T00:12:22.0492707Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-27T00:12:22.1408154Z 
quality (node 24)	Run npm test	2026-08-27T00:12:22.1408756Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-27T00:12:22.1409074Z > vitest run
quality (node 24)	Run npm test	2026-08-27T00:12:22.1409197Z 
quality (node 24)	Run npm test	2026-08-27T00:12:22.3886653Z 
quality (node 24)	Run npm test	2026-08-27T00:12:22.3900313Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:22.3901157Z 
quality (node 24)	Run npm test	2026-08-27T00:12:22.7873950Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:22.7935766Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:22.8140005Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:22.9722398Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.0174818Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.0902285Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-27T00:12:23.0904310Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T00:12:23.0905310Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T00:12:23.0905790Z 
quality (node 24)	Run npm test	2026-08-27T00:12:23.0906407Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T00:12:23.0906977Z 
quality (node 24)	Run npm test	2026-08-27T00:12:23.0907268Z act(() => {
quality (node 24)	Run npm test	2026-08-27T00:12:23.0907727Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T00:12:23.0908413Z });
quality (node 24)	Run npm test	2026-08-27T00:12:23.0908823Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T00:12:23.0909167Z 
quality (node 24)	Run npm test	2026-08-27T00:12:23.0910028Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T00:12:23.0910887Z 
quality (node 24)	Run npm test	2026-08-27T00:12:23.0949366Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.1773496Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.1920182Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.3206351Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 93^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.3720172Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.3789844Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.5030524Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.5626066Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.5865307Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.6852228Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.7474884Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.7667030Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.8824255Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.9266737Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:23.9643613Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.0845817Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.0951914Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.1434454Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.2685273Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.3040119Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.3256417Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.4521843Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.4889909Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.5088929Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.7242767Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.7374097Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.9213947Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:24.9469664Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.0756629Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.0989232Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.2912644Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.3034560Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.4945648Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.5330403Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.7543612Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.7910419Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.9897456Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.9909489Z      ^[[32m✓^[[39m rejects destroying a source without changing graph state or the observation wire^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.9911026Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:25.9912228Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.0219639Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.2039934Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.2282499Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.3856293Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.3955046Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.6115708Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.6209964Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.7999058Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.8690243Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.9221633Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2256^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.9223561Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2254^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:26.9739981Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.0891014Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.0949423Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.1690183Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.2509971Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.2728654Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.3480432Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.4589328Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.4958458Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.6607361Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.6834614Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.9011450Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:27.9058199Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.0897686Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.1301624Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.2630023Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.3513914Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.5239904Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.5242124Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.7214320Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.7453749Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.9507296Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:28.9632849Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.1289810Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.1374470Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.3144747Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.3645984Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-27T00:12:29.3659803Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T00:12:29.3660647Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T00:12:29.3660972Z 
quality (node 24)	Run npm test	2026-08-27T00:12:29.3661415Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T00:12:29.3668203Z 
quality (node 24)	Run npm test	2026-08-27T00:12:29.3668436Z act(() => {
quality (node 24)	Run npm test	2026-08-27T00:12:29.3668800Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T00:12:29.3669162Z });
quality (node 24)	Run npm test	2026-08-27T00:12:29.3669449Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T00:12:29.3669644Z 
quality (node 24)	Run npm test	2026-08-27T00:12:29.3670350Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T00:12:29.3671026Z 
quality (node 24)	Run npm test	2026-08-27T00:12:29.3757402Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-27T00:12:29.3759380Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T00:12:29.3760528Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T00:12:29.3761250Z 
quality (node 24)	Run npm test	2026-08-27T00:12:29.3762335Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T00:12:29.3762922Z 
quality (node 24)	Run npm test	2026-08-27T00:12:29.3763199Z act(() => {
quality (node 24)	Run npm test	2026-08-27T00:12:29.3763674Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T00:12:29.3764155Z });
quality (node 24)	Run npm test	2026-08-27T00:12:29.3764589Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T00:12:29.3764943Z 
quality (node 24)	Run npm test	2026-08-27T00:12:29.3765803Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T00:12:29.3766586Z 
quality (node 24)	Run npm test	2026-08-27T00:12:29.3819687Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.5307467Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.5798229Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.7145030Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.7472076Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.9046637Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:29.9199265Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.0971725Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.1140665Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.2889949Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.3183401Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.5061020Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.5152725Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.6576019Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.7260226Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.8067501Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:30.9175938Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.0043437Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.0712638Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.1537204Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.2563377Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.3500596Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-27T00:12:31.3502927Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T00:12:31.3509620Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T00:12:31.3510121Z 
quality (node 24)	Run npm test	2026-08-27T00:12:31.3510763Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T00:12:31.3511528Z 
quality (node 24)	Run npm test	2026-08-27T00:12:31.3511856Z act(() => {
quality (node 24)	Run npm test	2026-08-27T00:12:31.3514024Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T00:12:31.3514601Z });
quality (node 24)	Run npm test	2026-08-27T00:12:31.3517032Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T00:12:31.3518419Z 
quality (node 24)	Run npm test	2026-08-27T00:12:31.3519428Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T00:12:31.3521679Z 
quality (node 24)	Run npm test	2026-08-27T00:12:31.3567292Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.4243908Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.5420000Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.6173465Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.7178944Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.8313528Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:31.9190005Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.0350042Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.1490138Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.1986774Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.2890596Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 4902^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.2892367Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1374^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.2893643Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1286^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.3504455Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.3535305Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.4393266Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.5311212Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.5410115Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.6015941Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.6891443Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.7049610Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.7457326Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.8415175Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.8703823Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:32.8984645Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.0046609Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.0159884Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.0989412Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.1715685Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.2039473Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.2832849Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.3578901Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.3859274Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4369659Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4852647Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4893981Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4894992Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4895384Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4897501Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
quality (node 24)	Run npm test	2026-08-27T00:12:33.4902246Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'plugin-ambiguous-key at ~/child.keyfr…'^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4903012Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4903181Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4903508Z /observation-unknown-source/
quality (node 24)	Run npm test	2026-08-27T00:12:33.4903712Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4903876Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4904830Z "plugin-ambiguous-key at ~/child.keyframes.x: Authored key \"x\" is claimed by plugins \"fk\" and \"transform\". Author it inside a plugin-named group to name one."
quality (node 24)	Run npm test	2026-08-27T00:12:33.4905841Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4906558Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m116:48^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4939455Z     ^[[90m114|^[[39m     }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4939894Z     ^[[90m115|^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4940549Z     ^[[90m116|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-un…
quality (node 24)	Run npm test	2026-08-27T00:12:33.4941284Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4941739Z     ^[[90m117|^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4944343Z     ^[[90m118|^[[39m     const replacement = handle.adopt({ id: "child", keyframes: { x: ra…
quality (node 24)	Run npm test	2026-08-27T00:12:33.4944747Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4945241Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4945513Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4946635Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
quality (node 24)	Run npm test	2026-08-27T00:12:33.4948894Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-self-reference/ but got 'plugin-ambiguous-key at ~/self.keyfra…'^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4949385Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4949510Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4949737Z /observation-self-reference/
quality (node 24)	Run npm test	2026-08-27T00:12:33.4949884Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4949995Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4950666Z "plugin-ambiguous-key at ~/self.keyframes.x: Authored key \"x\" is claimed by plugins \"fk\" and \"transform\". Author it inside a plugin-named group to name one."
quality (node 24)	Run npm test	2026-08-27T00:12:33.4951223Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4951632Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m138:48^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4952088Z     ^[[90m136|^[[39m     }^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4952324Z     ^[[90m137|^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4952721Z     ^[[90m138|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-se…
quality (node 24)	Run npm test	2026-08-27T00:12:33.4953205Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4953656Z     ^[[90m139|^[[39m     const replacement = handle.adopt({ id: "self", keyframes: { x: ram…
quality (node 24)	Run npm test	2026-08-27T00:12:33.4954255Z     ^[[90m140|^[[39m     ^[[34mexpect^[[39m(replacement^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"~/self"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4954562Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4954766Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4954927Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4955325Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4956188Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m131 passed^[[39m^[[22m^[[90m (132)^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4959305Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m618 passed^[[39m^[[22m^[[90m (620)^[[39m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4960000Z ^[[2m   Start at ^[[22m 00:12:22
quality (node 24)	Run npm test	2026-08-27T00:12:33.4961863Z ^[[2m   Duration ^[[22m 11.08s^[[2m (transform 1.61s, setup 694ms, import 5.44s, tests 8.84s, environment 14ms)^[[22m
quality (node 24)	Run npm test	2026-08-27T00:12:33.4963300Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.4980307Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.5000344Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'plugin-ambiguous-key at ~/child.keyfr…'
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	/observation-unknown-source/
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	"plugin-ambiguous-key at ~/child.keyframes.x: Authored key \"x\" is claimed by plugins \"fk\" and \"transform\". Author it inside a plugin-named group to name one."
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:116:48
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T00:12:33.5007228Z 
quality (node 24)	Run npm test	2026-08-27T00:12:33.5010637Z ##[error]AssertionError: expected [Function] to throw error matching /observation-self-reference/ but got 'plugin-ambiguous-key at ~/self.keyfra…'
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	/observation-self-reference/
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	"plugin-ambiguous-key at ~/self.keyframes.x: Authored key \"x\" is claimed by plugins \"fk\" and \"transform\". Author it inside a plugin-named group to name one."
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:138:48
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T00:12:33.5526874Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-27T00:12:28.1154962Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.1155331Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.1194048Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.1194329Z env:
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.1194521Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.1194728Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.2210993Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.2211682Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.2212189Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:28.2212426Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:29.0250346Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:29.0253816Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:29.0254356Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.0368472Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.0598903Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.0790644Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 59^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.3452160Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.3692132Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4140238Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4168237Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4222790Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4224616Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4262000Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4277927Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4294431Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4294857Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4295477Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4296214Z });
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4297022Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4297524Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4298825Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.4300067Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.5592816Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.6580075Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.6858322Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.8278643Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.9161692Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:30.9379439Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.0679728Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.1517141Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.2155977Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.3104803Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.4278670Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.4606048Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.5689169Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.7037936Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.7073990Z      ^[[32m✓^[[39m rejects destroying a source without changing graph state or the observation wire^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.7118157Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.7128162Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.7140384Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.7850535Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.9532024Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:31.9608778Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.0410120Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.1573783Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.2098359Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.2674085Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.4188342Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.4682316Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.5143377Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.6599217Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.6949102Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.7489328Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.8954771Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.9052145Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:32.9873077Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.0810877Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.1527746Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.1994031Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.2890048Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.3630420Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.4444220Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.4908887Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.6228334Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.6412286Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.7299496Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.8050137Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:33.8633462Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.0817295Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.0819570Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.1120752Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.2919160Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.3059355Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.3668982Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4911983Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4918714Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4952802Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4953650Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4954347Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4958392Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4964835Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'plugin-ambiguous-key at ~/child.keyfr…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4965933Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4966152Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4966426Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4966853Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4967002Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4967832Z "plugin-ambiguous-key at ~/child.keyframes.x: Authored key \"x\" is claimed by plugins \"fk\" and \"transform\". Author it inside a plugin-named group to name one."
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4968803Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.4969323Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m116:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5006845Z     ^[[90m114|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5007864Z     ^[[90m115|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5009242Z     ^[[90m116|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-un…
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5010373Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5011037Z     ^[[90m117|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5011953Z     ^[[90m118|^[[39m     const replacement = handle.adopt({ id: "child", keyframes: { x: ra…
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5012596Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5013080Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5013452Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5015257Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5018332Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-self-reference/ but got 'plugin-ambiguous-key at ~/self.keyfra…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5019420Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5019698Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5020158Z /observation-self-reference/
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5020467Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5020704Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5022163Z "plugin-ambiguous-key at ~/self.keyframes.x: Authored key \"x\" is claimed by plugins \"fk\" and \"transform\". Author it inside a plugin-named group to name one."
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5023220Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5024138Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m138:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5025174Z     ^[[90m136|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5025719Z     ^[[90m137|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5026850Z     ^[[90m138|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-se…
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5027931Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5028859Z     ^[[90m139|^[[39m     const replacement = handle.adopt({ id: "self", keyframes: { x: ram…
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5030016Z     ^[[90m140|^[[39m     ^[[34mexpect^[[39m(replacement^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"~/self"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5030444Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5030696Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5030905Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5030933Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5031752Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m56 passed^[[39m^[[22m^[[90m (57)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5032647Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m239 passed^[[39m^[[22m^[[90m (241)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5033154Z ^[[2m   Start at ^[[22m 00:12:29
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5033800Z ^[[2m   Duration ^[[22m 5.45s^[[2m (transform 2.50s, setup 1.61s, import 3.80s, tests 1.26s, environment 8ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5034218Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5046029Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5069191Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'plugin-ambiguous-key at ~/child.keyfr…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"plugin-ambiguous-key at ~/child.keyframes.x: Authored key \"x\" is claimed by plugins \"fk\" and \"transform\". Author it inside a plugin-named group to name one."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:116:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5078138Z 
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5083126Z ##[error]AssertionError: expected [Function] to throw error matching /observation-self-reference/ but got 'plugin-ambiguous-key at ~/self.keyfra…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-self-reference/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"plugin-ambiguous-key at ~/self.keyframes.x: Authored key \"x\" is claimed by plugins \"fk\" and \"transform\". Author it inside a plugin-named group to name one."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:138:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-27T00:12:34.5455845Z ##[error]Process completed with exit code 1.
```
