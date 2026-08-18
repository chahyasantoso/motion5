# CI log archive: 32148713472

- Workflow: CI
- Conclusion: failure
- Head branch: fix/motion-track-mutation-atomicity
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32148713472
- Captured: 2026-08-18T14:30:52Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-18T14:30:28.7497095Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-18T14:30:28.7497373Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-18T14:30:28.7538150Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-18T14:30:28.7538446Z env:
quality (node 24)	Run npm test	2026-08-18T14:30:28.7538648Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-18T14:30:28.7538869Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-18T14:30:28.8641052Z 
quality (node 24)	Run npm test	2026-08-18T14:30:28.8641447Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-18T14:30:28.8641864Z > vitest run
quality (node 24)	Run npm test	2026-08-18T14:30:28.8642057Z 
quality (node 24)	Run npm test	2026-08-18T14:30:29.1601731Z 
quality (node 24)	Run npm test	2026-08-18T14:30:29.1624318Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:29.1643005Z 
quality (node 24)	Run npm test	2026-08-18T14:30:29.6149928Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:29.6304494Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:29.7084431Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-18T14:30:29.7087018Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T14:30:29.7107296Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T14:30:29.7108697Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T14:30:29.7109494Z 
quality (node 24)	Run npm test	2026-08-18T14:30:29.7148633Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:29.8355767Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:29.8523946Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:29.9363895Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.0727825Z  ^[[31m❯^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.0730237Z ^[[31m     ^[[31m×^[[31m M-1 leaves nothing committed when addTrack cannot seed a resolvable Track^[[39m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.0733180Z ^[[31m     ^[[31m×^[[31m M-2 preserves the prior entry when replaceTrack cannot seed the replacement^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.0735030Z ^[[31m     ^[[31m×^[[31m M-3 rejects a repeated addTrack identically instead of as a duplicate id^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.0737130Z ^[[31m     ^[[31m×^[[31m M-4 keeps entry identity across repeated replaceTrack failures^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.0744850Z ^[[31m     ^[[31m×^[[31m M-5 is atomic when the seed fails inside injected interpolator code^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.0747169Z      ^[[32m✓^[[39m M-6 seeds the same progress it always did, staggered and with per-entry durations^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.1172810Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.1814753Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.2750237Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.4730138Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.4789522Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.4967395Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.6909896Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.7534806Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.9277067Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:30.9643277Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:31.1714621Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:31.1890621Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:31.3847538Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:31.4704806Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:31.6231361Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:31.7286935Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:31.9004866Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.0224793Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.1356178Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.2200486Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.4166941Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.5114651Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.7032269Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 73^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.7654593Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.9249389Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:32.9898111Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.1774374Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.1977594Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.3354425Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2678^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.3364710Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2675^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.3824607Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.4081160Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.5210794Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.5814401Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.6146862Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.7112937Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.8236177Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.8340067Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:33.9328919Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.0240192Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.0402096Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.1383323Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.2334727Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.2543226Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.3079630Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.4734078Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.4911564Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.4969209Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.6411696Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.6891390Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.7372794Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.8611617Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.9006651Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:34.9320871Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.0905473Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.1240376Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.1322625Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.2985460Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.3101338Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.3864672Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.4936195Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.5130366Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.5847964Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.6887180Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.7387692Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.7633464Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.8886137Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.9216859Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:35.9508278Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.0847753Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.1257319Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.1382590Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.2870956Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-18T14:30:36.2884162Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T14:30:36.2893105Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T14:30:36.2894031Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T14:30:36.2894940Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T14:30:36.2895990Z 
quality (node 24)	Run npm test	2026-08-18T14:30:36.2897032Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.3258717Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.3417755Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.4823849Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.4993792Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.5552271Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.6650476Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.7320545Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.7597499Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.8465232Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.9572698Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:36.9720716Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.0714408Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.1338360Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.1744122Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.2673893Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.3185622Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.3396157Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.4249492Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.5124326Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.5314020Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.6062167Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.7145974Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.7334347Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.7642635Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.9309013Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.9534678Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.9634304Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-18T14:30:37.9639391Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:37.9714811Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T14:30:37.9715993Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T14:30:37.9733332Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T14:30:37.9734612Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T14:30:37.9736225Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.1581900Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.1629968Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.1835613Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3509260Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3528859Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3692155Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3735349Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3736289Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3736806Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3738776Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts^[[2m > ^[[22mMotion single-track mutation atomicity^[[2m > ^[[22mM-1 leaves nothing committed when addTrack cannot seed a resolvable Track
quality (node 24)	Run npm test	2026-08-18T14:30:38.3744565Z ^[[31m^[[1mAssertionError^[[22m: expected [ { id: 'arm' } ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3745157Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3745426Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3745850Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3746118Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3746299Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3746644Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3775416Z ^[[31m+   {^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3775895Z ^[[31m+     "id": "arm",^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3776335Z ^[[31m+   },^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3776727Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3776923Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3777853Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:^[[2m63:27^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3791827Z     ^[[90m 61|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m motion^[[33m.^[[39m^[[34maddTrack^[[39m({ id^[[33m:^[[39m ^[[32m"arm"^[[39m }))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mDISPOSED^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3793618Z     ^[[90m 62|^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3795097Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mtracks)^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3796399Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3797725Z     ^[[90m 64|^[[39m     // The retry is the point. A caller told the operation was refused…
quality (node 24)	Run npm test	2026-08-18T14:30:38.3799646Z     ^[[90m 65|^[[39m     // once the Track is live; a committed ghost turns that retry into…
quality (node 24)	Run npm test	2026-08-18T14:30:38.3800442Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3801063Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3801617Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3804029Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts^[[2m > ^[[22mMotion single-track mutation atomicity^[[2m > ^[[22mM-2 preserves the prior entry when replaceTrack cannot seed the replacement
quality (node 24)	Run npm test	2026-08-18T14:30:38.3807153Z ^[[31m^[[1mAssertionError^[[22m: expected { id: 'arm', duration: 200 } to be { id: 'arm' } // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3808045Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3808575Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3809341Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3809574Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3809747Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3810065Z ^[[31m+   "duration": 200,^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3810385Z ^[[2m    "id": "arm",^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3810648Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3810761Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3811332Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:^[[2m80:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3811900Z     ^[[90m 78|^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3812629Z     ^[[90m 79|^[[39m     // By identity, not by shape: the live entry object itself must st…
quality (node 24)	Run npm test	2026-08-18T14:30:38.3813738Z     ^[[90m 80|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mtracks[^[[34m0^[[39m])^[[33m.^[[39m^[[34mtoBe^[[39m(before)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3814390Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3815614Z     ^[[90m 81|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mtracks[^[[34m0^[[39m]^[[33m?.^[[39mduration)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3816330Z     ^[[90m 82|^[[39m     ^[[34mregister^[[39m(^[[32m"arm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3816573Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3816828Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3817044Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3818349Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts^[[2m > ^[[22mMotion single-track mutation atomicity^[[2m > ^[[22mM-3 rejects a repeated addTrack identically instead of as a duplicate id
quality (node 24)	Run npm test	2026-08-18T14:30:38.3819811Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error including 'Track is disposed.' but got 'Duplicate Motion track id: arm.'^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3820450Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3820684Z Expected: ^[[32m"^[[7mTrack is disposed^[[27m."^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3821183Z Received: ^[[31m"^[[7mDuplicate Motion track id: arm^[[27m."^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3821435Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3821952Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:^[[2m95:50^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3822679Z     ^[[90m 93|^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3823587Z     ^[[90m 94|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m motion^[[33m.^[[39m^[[34maddTrack^[[39m({ id^[[33m:^[[39m ^[[32m"arm"^[[39m }))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mDISPOSED^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3824744Z     ^[[90m 95|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m motion^[[33m.^[[39m^[[34maddTrack^[[39m({ id^[[33m:^[[39m ^[[32m"arm"^[[39m }))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mDISPOSED^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3825519Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3825886Z     ^[[90m 96|^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3826700Z     ^[[90m 97|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mtracks)^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3827290Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3827572Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3827775Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3829275Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts^[[2m > ^[[22mMotion single-track mutation atomicity^[[2m > ^[[22mM-4 keeps entry identity across repeated replaceTrack failures
quality (node 24)	Run npm test	2026-08-18T14:30:38.3831491Z ^[[31m^[[1mAssertionError^[[22m: expected { id: 'arm', duration: 300 } to be { id: 'arm' } // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3832185Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3832753Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3833192Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3833397Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3833612Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3833933Z ^[[31m+   "duration": 300,^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3834230Z ^[[2m    "id": "arm",^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3834498Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3834617Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3835393Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:^[[2m109:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3836168Z     ^[[90m107|^[[39m     expect(() => motion.replaceTrack({ id: "arm", duration: 300 })).to…
quality (node 24)	Run npm test	2026-08-18T14:30:38.3836602Z     ^[[90m108|^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3837180Z     ^[[90m109|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mtracks[^[[34m0^[[39m])^[[33m.^[[39m^[[34mtoBe^[[39m(before)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3837769Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3838522Z     ^[[90m110|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mtracks[^[[34m0^[[39m]^[[33m?.^[[39mduration)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3839110Z     ^[[90m111|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3839282Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3839679Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3839952Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3842136Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts^[[2m > ^[[22mMotion single-track mutation atomicity^[[2m > ^[[22mM-5 is atomic when the seed fails inside injected interpolator code
quality (node 24)	Run npm test	2026-08-18T14:30:38.3844437Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'arm', 'leg' ] to deeply equal [ 'arm' ]^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3844965Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3845123Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3845394Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3845521Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3845635Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3846030Z ^[[2m    "arm",^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3846459Z ^[[31m+   "leg",^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3846751Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3846867Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3847425Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:^[[2m124:47^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3848214Z     ^[[90m122|^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3848974Z     ^[[90m123|^[[39m     expect(() => motion.addTrack({ id: "leg" })).toThrow(TIMELINE_FAIL…
quality (node 24)	Run npm test	2026-08-18T14:30:38.3850572Z     ^[[90m124|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mtracks^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"arm"^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3851795Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3852161Z     ^[[90m125|^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3852952Z     ^[[90m126|^[[39m     ^[[34mregister^[[39m(^[[32m"arm"^[[39m^[[33m,^[[39m ^[[34mthrowingInterpolator^[[39m())^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3853322Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3853579Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3853795Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3853809Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3854267Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m111 passed^[[39m^[[22m^[[90m (112)^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3855361Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m470 passed^[[39m^[[22m^[[90m (475)^[[39m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3856182Z ^[[2m   Start at ^[[22m 14:30:29
quality (node 24)	Run npm test	2026-08-18T14:30:38.3857297Z ^[[2m   Duration ^[[22m 9.19s^[[2m (transform 1.61s, setup 0ms, import 5.39s, tests 4.26s, environment 14ms)^[[22m
quality (node 24)	Run npm test	2026-08-18T14:30:38.3858154Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3858166Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3879740Z ##[error]AssertionError: expected [ { id: 'arm' } ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   {
quality (node 24)	Run npm test	+     "id": "arm",
quality (node 24)	Run npm test	+   },
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:63:27
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T14:30:38.3887872Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3890171Z ##[error]AssertionError: expected { id: 'arm', duration: 200 } to be { id: 'arm' } // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	+   "duration": 200,
quality (node 24)	Run npm test	    "id": "arm",
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:80:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T14:30:38.3891455Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3894793Z ##[error]AssertionError: expected [Function] to throw error including 'Track is disposed.' but got 'Duplicate Motion track id: arm.'
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "Track is disposed."
quality (node 24)	Run npm test	Received: "Duplicate Motion track id: arm."
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:95:50
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T14:30:38.3897500Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3900833Z ##[error]AssertionError: expected { id: 'arm', duration: 300 } to be { id: 'arm' } // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	+   "duration": 300,
quality (node 24)	Run npm test	    "id": "arm",
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:109:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T14:30:38.3902970Z 
quality (node 24)	Run npm test	2026-08-18T14:30:38.3905731Z ##[error]AssertionError: expected [ 'arm', 'leg' ] to deeply equal [ 'arm' ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "arm",
quality (node 24)	Run npm test	+   "leg",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts:124:47
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T14:30:38.4232108Z ##[error]Process completed with exit code 1.
```
