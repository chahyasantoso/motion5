# CI log archive: 33025829876

- Workflow: CI
- Conclusion: failure
- Head branch: feat/fo-fk-pivot-offsets
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33025829876
- Captured: 2026-08-27T00:09:28Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-27T00:08:58.4613904Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-27T00:08:58.4614198Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-27T00:08:58.4654921Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-27T00:08:58.4655220Z env:
quality (node 24)	Run npm test	2026-08-27T00:08:58.4655432Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-27T00:08:58.4655656Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-27T00:08:58.5694919Z 
quality (node 24)	Run npm test	2026-08-27T00:08:58.5695366Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-27T00:08:58.5695813Z > vitest run
quality (node 24)	Run npm test	2026-08-27T00:08:58.5696089Z 
quality (node 24)	Run npm test	2026-08-27T00:08:58.8698599Z 
quality (node 24)	Run npm test	2026-08-27T00:08:58.8702634Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-27T00:08:58.8703398Z 
quality (node 24)	Run npm test	2026-08-27T00:08:59.4532379Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:08:59.4652415Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:08:59.4812087Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:08:59.6867182Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:08:59.7591257Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:08:59.8732005Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-27T00:08:59.8738031Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T00:08:59.8739670Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T00:08:59.8740147Z 
quality (node 24)	Run npm test	2026-08-27T00:08:59.8740739Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T00:08:59.8741326Z 
quality (node 24)	Run npm test	2026-08-27T00:08:59.8741537Z act(() => {
quality (node 24)	Run npm test	2026-08-27T00:08:59.8741955Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T00:08:59.8742405Z });
quality (node 24)	Run npm test	2026-08-27T00:08:59.8742811Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T00:08:59.8743069Z 
quality (node 24)	Run npm test	2026-08-27T00:08:59.8744071Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T00:08:59.8745022Z 
quality (node 24)	Run npm test	2026-08-27T00:08:59.8805447Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 76^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:08:59.9441083Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:08:59.9779439Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.1801628Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.1931673Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.2197928Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 126^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.4137688Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.4454358Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.4648922Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.6696075Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.6751672Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.6839863Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.9026118Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.9091376Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:00.9724115Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.0993928Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.1596149Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.1726381Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.3390884Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.4058424Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.4120632Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.5735124Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.6387148Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.6720263Z  ^[[31m❯^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.6750373Z      ^[[32m✓^[[39m FO-1 composes the parent-tip frame it always did when no offset is authored^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.6752615Z ^[[31m     ^[[31m×^[[31m FO-2 offsets the pivot in the parent's rotated space, not in world space^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.6754500Z ^[[31m     ^[[31m×^[[31m FO-3 displaces the pivot without turning the bone^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.6756502Z ^[[31m     ^[[31m×^[[31m FO-4 is the pivot then the extension for every frame, not one fused formula^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.6758454Z ^[[31m     ^[[31m×^[[31m FO-5 claims the offset keys, so a grouped offset resolves under fk^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.6760507Z ^[[31m     ^[[31m×^[[31m FO-6 refuses the flat spelling of an offset key both plugins now claim^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.9409743Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:01.9591798Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:02.1681970Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:02.2103589Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:02.3701973Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:02.4338272Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:02.6657306Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:02.6734397Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:02.9397618Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:02.9771554Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:03.2342196Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:03.2697017Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:03.5166892Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:03.5270376Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:03.7571549Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:03.8133264Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:03.9759886Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.0821326Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.2865774Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.3901341Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.5524252Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.6764501Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.7280732Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2862^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.7282618Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2859^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.7569443Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.9261331Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:04.9435154Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.0403193Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.0988408Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.1639518Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.2656310Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.3807320Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.4623697Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.6425742Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.7131630Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.8932642Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:05.9724395Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:06.1271551Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:06.2561764Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:06.3745892Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:06.5661600Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:06.6850062Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:06.7959684Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:06.9186784Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:07.0597671Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:07.2026457Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:07.3090850Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:07.4202360Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:07.5418906Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:07.7237868Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-27T00:09:07.7240799Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T00:09:07.7242785Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T00:09:07.7243515Z 
quality (node 24)	Run npm test	2026-08-27T00:09:07.7244263Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T00:09:07.7244995Z 
quality (node 24)	Run npm test	2026-08-27T00:09:07.7245321Z act(() => {
quality (node 24)	Run npm test	2026-08-27T00:09:07.7245924Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T00:09:07.7249264Z });
quality (node 24)	Run npm test	2026-08-27T00:09:07.7249892Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T00:09:07.7250364Z 
quality (node 24)	Run npm test	2026-08-27T00:09:07.7251522Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T00:09:07.7252632Z 
quality (node 24)	Run npm test	2026-08-27T00:09:07.7279910Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:07.7401180Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-27T00:09:07.7422576Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T00:09:07.7437434Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:07.7463651Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T00:09:07.7464439Z 
quality (node 24)	Run npm test	2026-08-27T00:09:07.7465236Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T00:09:07.7466122Z 
quality (node 24)	Run npm test	2026-08-27T00:09:07.7466449Z act(() => {
quality (node 24)	Run npm test	2026-08-27T00:09:07.7467037Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T00:09:07.7467691Z });
quality (node 24)	Run npm test	2026-08-27T00:09:07.7468190Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T00:09:07.7468629Z 
quality (node 24)	Run npm test	2026-08-27T00:09:07.7469986Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T00:09:07.7471219Z 
quality (node 24)	Run npm test	2026-08-27T00:09:07.9724538Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.0206232Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.1959855Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.2368987Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.4334788Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.4415796Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.6510581Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.7001786Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.9044414Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:08.9329932Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:09.1551556Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:09.1921539Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:09.4075850Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:09.4477603Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:09.6358508Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:09.6812317Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:09.8815372Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:09.9078839Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.1112985Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.1240139Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.2988390Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.3403978Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-27T00:09:10.3421039Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-27T00:09:10.3425799Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-27T00:09:10.3426473Z 
quality (node 24)	Run npm test	2026-08-27T00:09:10.3427279Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-27T00:09:10.3451108Z 
quality (node 24)	Run npm test	2026-08-27T00:09:10.3452020Z act(() => {
quality (node 24)	Run npm test	2026-08-27T00:09:10.3454470Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-27T00:09:10.3455931Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.3457028Z });
quality (node 24)	Run npm test	2026-08-27T00:09:10.3457547Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-27T00:09:10.3457957Z 
quality (node 24)	Run npm test	2026-08-27T00:09:10.3459009Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-27T00:09:10.3460426Z 
quality (node 24)	Run npm test	2026-08-27T00:09:10.5161652Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.5952179Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.7319330Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.8312732Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:10.9679889Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.0948810Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.2771510Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.2971009Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.5552035Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.5751502Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.6844851Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6407^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.6847070Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1804^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.6848744Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1819^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.7638461Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.7740935Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.9276252Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.9708998Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:11.9791299Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.1192758Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.1629623Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.1781511Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.3154858Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.3543034Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.3849721Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.4891605Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.5971076Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.6034666Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.6892152Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.8308336Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.8571496Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:12.9172147Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0101151Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0229438Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0280522Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0281964Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0282617Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0285749Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/fk-pivot-offset.test.ts^[[2m > ^[[22mfk pivot offsets^[[2m > ^[[22mFO-2 offsets the pivot in the parent's rotated space, not in world space
quality (node 24)	Run npm test	2026-08-27T00:09:13.0292087Z ^[[31m^[[1mAssertionError^[[22m: expected 5 to be close to 15, received difference is 10, but expected 5e-13^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0293876Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/fk-pivot-offset.test.ts:^[[2m87:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0340546Z     ^[[90m 85|^[[39m     const frame = bone({ x: 10, y: 0, length: 5, rotation: 0 }, { x: 0…
quality (node 24)	Run npm test	2026-08-27T00:09:13.0341943Z     ^[[90m 86|^[[39m     ^[[34mexpect^[[39m(frame^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0343333Z     ^[[90m 87|^[[39m     ^[[34mexpect^[[39m(frame^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m15^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0344217Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0345269Z     ^[[90m 88|^[[39m     ^[[34mexpect^[[39m(frame^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m90^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0345958Z     ^[[90m 89|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0346498Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0346765Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0347009Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0348061Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/fk-pivot-offset.test.ts^[[2m > ^[[22mfk pivot offsets^[[2m > ^[[22mFO-3 displaces the pivot without turning the bone
quality (node 24)	Run npm test	2026-08-27T00:09:13.0349383Z ^[[31m^[[1mAssertionError^[[22m: expected +0 to be close to 8, received difference is 8, but expected 5e-13^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0350265Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/fk-pivot-offset.test.ts:^[[2m98:32^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0351292Z     ^[[90m 96|^[[39m     ^[[34mexpect^[[39m(offset^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(plain^[[33m.^[[39mrotation^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0352416Z     ^[[90m 97|^[[39m     ^[[34mexpect^[[39m(offset^[[33m.^[[39mx ^[[33m-^[[39m plain^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0353519Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(offset^[[33m.^[[39my ^[[33m-^[[39m plain^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m8^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0354699Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0355199Z     ^[[90m 99|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0355505Z     ^[[90m100|^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0355640Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0355889Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0356104Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0357007Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/fk-pivot-offset.test.ts^[[2m > ^[[22mfk pivot offsets^[[2m > ^[[22mFO-4 is the pivot then the extension for every frame, not one fused formula
quality (node 24)	Run npm test	2026-08-27T00:09:13.0359573Z ^[[31m^[[1mAssertionError^[[22m: expected 29.726539554219745 to be close to 35.82461576557306, received difference is 6.0980762113533125, but expected 5e-13^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0361980Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/fk-pivot-offset.test.ts:^[[2m110:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0362906Z     ^[[90m108|^[[39m       ^[[35mconst^[[39m expected ^[[33m=^[[39m ^[[34mpivotThenExtend^[[39m(base^[[33m,^[[39m values)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0363852Z     ^[[90m109|^[[39m       ^[[35mconst^[[39m frame ^[[33m=^[[39m ^[[34mbone^[[39m(values^[[33m,^[[39m base)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0365196Z     ^[[90m110|^[[39m       ^[[34mexpect^[[39m(frame^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(expected^[[33m.^[[39mx^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0366039Z     ^[[90m   |^[[39m                       ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0366903Z     ^[[90m111|^[[39m       ^[[34mexpect^[[39m(frame^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(expected^[[33m.^[[39my^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0368521Z     ^[[90m112|^[[39m       ^[[34mexpect^[[39m(frame^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(expected^[[33m.^[[39mrotation^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0369043Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0369500Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0369738Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0370818Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/fk-pivot-offset.test.ts^[[2m > ^[[22mfk pivot offsets^[[2m > ^[[22mFO-5 claims the offset keys, so a grouped offset resolves under fk
quality (node 24)	Run npm test	2026-08-27T00:09:13.0372569Z ^[[31m^[[1mAssertionError^[[22m: expected [ { …(5) }, { …(5) } ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0372915Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0373060Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0373496Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0373712Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0373919Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0374285Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0374646Z ^[[31m+   {^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0375070Z ^[[31m+     "ids": [^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0375521Z ^[[31m+       "fk",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0375936Z ^[[31m+       "x",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0376354Z ^[[31m+     ],^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0377123Z ^[[31m+     "message": "Plugin \"fk\" does not claim authored key \"x\".",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0378566Z ^[[31m+     "path": "keyframes.fk.values.x",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0379028Z ^[[31m+     "ruleId": "plugin-unknown-key",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0379783Z ^[[31m+     "severity": "error",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0380086Z ^[[31m+   },^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0380320Z ^[[31m+   {^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0380578Z ^[[31m+     "ids": [^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0380860Z ^[[31m+       "fk",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0381129Z ^[[31m+       "y",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0381394Z ^[[31m+     ],^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0381859Z ^[[31m+     "message": "Plugin \"fk\" does not claim authored key \"y\".",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0382363Z ^[[31m+     "path": "keyframes.fk.values.y",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0382781Z ^[[31m+     "ruleId": "plugin-unknown-key",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0383171Z ^[[31m+     "severity": "error",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0383455Z ^[[31m+   },^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0383674Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0383801Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0384265Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/fk-pivot-offset.test.ts:^[[2m120:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0385019Z     ^[[90m118|^[[39m       fk: { values: { x: 4, y: -2, length: 10, rotation: 0 }, requires…
quality (node 24)	Run npm test	2026-08-27T00:09:13.0385482Z     ^[[90m119|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0386097Z     ^[[90m120|^[[39m     ^[[34mexpect^[[39m(resolved^[[33m.^[[39mdiagnostics)^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0386718Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0388182Z     ^[[90m121|^[[39m     ^[[34mexpect^[[39m(resolved^[[33m.^[[39mplugins^[[33m.^[[39m^[[34mmap^[[39m(({ name }) ^[[33m=>^[[39m name))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"fk"^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0388983Z     ^[[90m122|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0389409Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0389658Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0389935Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0391278Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/plugins/fk-pivot-offset.test.ts^[[2m > ^[[22mfk pivot offsets^[[2m > ^[[22mFO-6 refuses the flat spelling of an offset key both plugins now claim
quality (node 24)	Run npm test	2026-08-27T00:09:13.0392799Z ^[[31m^[[1mAssertionError^[[22m: expected [] to deeply equal [ 'plugin-ambiguous-key' ]^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0393174Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0393316Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0393751Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0393967Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0394143Z ^[[32m- [^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0394625Z ^[[32m-   "plugin-ambiguous-key",^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0395060Z ^[[32m- ]^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0395284Z ^[[31m+ []^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0395410Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0395855Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/plugins/fk-pivot-offset.test.ts:^[[2m129:62^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0396525Z     ^[[90m127|^[[39m     ^[[90m// owner by authoring inside a group. See ADR-043.^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0397729Z     ^[[90m128|^[[39m     ^[[35mconst^[[39m resolved ^[[33m=^[[39m ^[[34mregistry^[[39m()^[[33m.^[[39m^[[34mresolveForKeyframes^[[39m({ x^[[33m:^[[39m ^[[34m4^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0398829Z     ^[[90m129|^[[39m     expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toEqual([…
quality (node 24)	Run npm test	2026-08-27T00:09:13.0399851Z     ^[[90m   |^[[39m                                                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0400897Z     ^[[90m130|^[[39m     expect(resolved.diagnostics[0]?.message).toContain('"fk" and "tran…
quality (node 24)	Run npm test	2026-08-27T00:09:13.0401496Z     ^[[90m131|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0401677Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0401915Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0402137Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0402170Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0402645Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m131 passed^[[39m^[[22m^[[90m (132)^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0403481Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m615 passed^[[39m^[[22m^[[90m (620)^[[39m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0404141Z ^[[2m   Start at ^[[22m 00:08:58
quality (node 24)	Run npm test	2026-08-27T00:09:13.0404825Z ^[[2m   Duration ^[[22m 14.14s^[[2m (transform 2.08s, setup 897ms, import 7.07s, tests 11.48s, environment 18ms)^[[22m
quality (node 24)	Run npm test	2026-08-27T00:09:13.0405418Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0405427Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0427154Z ##[error]AssertionError: expected 5 to be close to 15, received difference is 10, but expected 5e-13
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/fk-pivot-offset.test.ts:87:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T00:09:13.0434736Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0436651Z ##[error]AssertionError: expected +0 to be close to 8, received difference is 8, but expected 5e-13
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/fk-pivot-offset.test.ts:98:32
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T00:09:13.0437723Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0439725Z ##[error]AssertionError: expected 29.726539554219745 to be close to 35.82461576557306, received difference is 6.0980762113533125, but expected 5e-13
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/fk-pivot-offset.test.ts:110:23
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T00:09:13.0440940Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0447626Z ##[error]AssertionError: expected [ { …(5) }, { …(5) } ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   {
quality (node 24)	Run npm test	+     "ids": [
quality (node 24)	Run npm test	+       "fk",
quality (node 24)	Run npm test	+       "x",
quality (node 24)	Run npm test	+     ],
quality (node 24)	Run npm test	+     "message": "Plugin \"fk\" does not claim authored key \"x\".",
quality (node 24)	Run npm test	+     "path": "keyframes.fk.values.x",
quality (node 24)	Run npm test	+     "ruleId": "plugin-unknown-key",
quality (node 24)	Run npm test	+     "severity": "error",
quality (node 24)	Run npm test	+   },
quality (node 24)	Run npm test	+   {
quality (node 24)	Run npm test	+     "ids": [
quality (node 24)	Run npm test	+       "fk",
quality (node 24)	Run npm test	+       "y",
quality (node 24)	Run npm test	+     ],
quality (node 24)	Run npm test	+     "message": "Plugin \"fk\" does not claim authored key \"y\".",
quality (node 24)	Run npm test	+     "path": "keyframes.fk.values.y",
quality (node 24)	Run npm test	+     "ruleId": "plugin-unknown-key",
quality (node 24)	Run npm test	+     "severity": "error",
quality (node 24)	Run npm test	+   },
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/fk-pivot-offset.test.ts:120:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T00:09:13.0451381Z 
quality (node 24)	Run npm test	2026-08-27T00:09:13.0454471Z ##[error]AssertionError: expected [] to deeply equal [ 'plugin-ambiguous-key' ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- [
quality (node 24)	Run npm test	-   "plugin-ambiguous-key",
quality (node 24)	Run npm test	- ]
quality (node 24)	Run npm test	+ []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/plugins/fk-pivot-offset.test.ts:129:62
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-27T00:09:13.0906980Z ##[error]Process completed with exit code 1.
```
