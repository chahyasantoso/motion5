# CI log archive: 32129021992

- Workflow: CI
- Conclusion: failure
- Head branch: test/edge-key-separator-red
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32129021992
- Captured: 2026-08-18T10:54:31Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-18T10:54:08.2402303Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-18T10:54:08.2402577Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-18T10:54:08.2443932Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-18T10:54:08.2444361Z env:
quality (node 24)	Run npm test	2026-08-18T10:54:08.2444576Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-18T10:54:08.2444794Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-18T10:54:08.3489460Z 
quality (node 24)	Run npm test	2026-08-18T10:54:08.3490164Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-18T10:54:08.3490691Z > vitest run
quality (node 24)	Run npm test	2026-08-18T10:54:08.3490904Z 
quality (node 24)	Run npm test	2026-08-18T10:54:08.6467880Z 
quality (node 24)	Run npm test	2026-08-18T10:54:08.6469716Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:08.6470374Z 
quality (node 24)	Run npm test	2026-08-18T10:54:09.0060199Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.1193224Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.2009829Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-18T10:54:09.2038176Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T10:54:09.2057996Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:54:09.2059126Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:54:09.2060816Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.2061725Z 
quality (node 24)	Run npm test	2026-08-18T10:54:09.2120659Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.3400253Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.4100780Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.5820778Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.5907639Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.6209406Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.8012312Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:09.8519493Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:10.0535395Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:10.0890188Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:10.2875000Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:10.3078954Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:10.5084271Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:10.5616460Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:10.7498684Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:10.8259404Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:11.0281013Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:11.0637011Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:11.2785898Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:11.3082181Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:11.5157526Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:11.5602045Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:11.8042945Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:11.8135580Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.0342658Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.0549085Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.2732938Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.2736359Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.3256182Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2564^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.3258939Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2561^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.4649788Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.4923951Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.5384242Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.6853798Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.7068808Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.7558740Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.9116548Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.9347452Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:12.9408371Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.1101606Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.1271250Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.1634048Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.2844376Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.3678789Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.4099176Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.4613960Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.5498773Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.6206525Z  ^[[31m❯^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.6209902Z ^[[31m     ^[[31m×^[[31m E-1 does not report a duplicate edge for two distinct edges^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.6211686Z ^[[31m     ^[[31m×^[[31m E-2 distinguishes a pick key containing the projection separator^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.6213463Z ^[[31m     ^[[31m×^[[31m E-3 distinguishes a map value containing the projection separators^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.6215165Z      ^[[32m✓^[[39m E-5 still reports exactly one duplicate for a genuinely repeated edge^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.6217147Z ^[[31m     ^[[31m×^[[31m E-6 distinguishes an authored empty target from an absent target^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.6982131Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.7881048Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.8369517Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:13.8736530Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.0131554Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.0258855Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.1055959Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.2002988Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.2636071Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.3065009Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.4119109Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.4453289Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.5248573Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.5748228Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.6580169Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.7309140Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.7479023Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.8397686Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.8980411Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:14.9426579Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.0783429Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.0976379Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.1048641Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.2688938Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.2908810Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.2956227Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-18T10:54:15.2958152Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T10:54:15.2978439Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.2980200Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:54:15.3007594Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:54:15.3014739Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:54:15.3067249Z 
quality (node 24)	Run npm test	2026-08-18T10:54:15.4464589Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.4885183Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.5061820Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.6194167Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.6865989Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.7476570Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.7918023Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.8988721Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.9282391Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:15.9988645Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.0842056Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.1288981Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.1882930Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.2753006Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.2965145Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.3668210Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.4551727Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.4690655Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.5408957Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.6486419Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.6590991Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.7540948Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.8644195Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.8695204Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-18T10:54:16.8697399Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T10:54:16.8727590Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:54:16.8747201Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:54:16.8748210Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:16.8749301Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:54:16.8749930Z 
quality (node 24)	Run npm test	2026-08-18T10:54:16.9601986Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.0776118Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.0901391Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.1979768Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2508815Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2535234Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2595544Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2596838Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 4 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2597290Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2600562Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/edge-key-separator.test.ts^[[2m > ^[[22medge identity survives a separator inside an id^[[2m > ^[[22mE-1 does not report a duplicate edge for two distinct edges
quality (node 24)	Run npm test	2026-08-18T10:54:17.2605790Z ^[[31m^[[1mAssertionError^[[22m: expected [ { …(5) } ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2606121Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2606269Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2606547Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2607083Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2607245Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2607572Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2607797Z ^[[31m+   {^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2608046Z ^[[31m+     "ids": [^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2608321Z ^[[31m+       "m/x|m",^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2608590Z ^[[31m+       "y/z",^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2608839Z ^[[31m+     ],^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2609334Z ^[[31m+     "message": "Duplicate observation edge \"m/x|m|y/z|input||\".",^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2609811Z ^[[31m+     "path": "m/x|m",^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2610209Z ^[[31m+     "ruleId": "observation-duplicate",^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2610588Z ^[[31m+     "severity": "error",^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2610875Z ^[[31m+   },^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2611107Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2611218Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2611682Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/edge-key-separator.test.ts:^[[2m55:32^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2641230Z     ^[[90m 53|^[[39m     ^[[90m// project, naming a duplicate edge the author never wrote twice.^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2642714Z     ^[[90m 54|^[[39m     ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mbuildGraphIR^[[39m(^[[33mCOLLIDING^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2644182Z     ^[[90m 55|^[[39m     ^[[34mexpect^[[39m(^[[34mduplicates^[[39m(result))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2644873Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2645718Z     ^[[90m 56|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mgraph^[[33m?.^[[39mnodes)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m4^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2646407Z     ^[[90m 57|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2647023Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2647470Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2647796Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2648816Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/edge-key-separator.test.ts^[[2m > ^[[22medge identity survives a separator inside an id^[[2m > ^[[22mE-2 distinguishes a pick key containing the projection separator
quality (node 24)	Run npm test	2026-08-18T10:54:17.2650548Z ^[[31m^[[1mAssertionError^[[22m: expected 'a/b|c/d|input||pick:a,b' not to be 'a/b|c/d|input||pick:a,b' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2652014Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/edge-key-separator.test.ts:^[[2m60:69^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2674320Z     ^[[90m 58|^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2675094Z     ^[[90m 59|^[[39m   it("E-2 distinguishes a pick key containing the projection separator…
quality (node 24)	Run npm test	2026-08-18T10:54:17.2676039Z     ^[[90m 60|^[[39m     expect(edgeKey({ ...base, projection: { pick: ["a,b"] } })).not.to…
quality (node 24)	Run npm test	2026-08-18T10:54:17.2677161Z     ^[[90m   |^[[39m                                                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2678355Z     ^[[90m 61|^[[39m       ^[[34medgeKey^[[39m({ ^[[33m...^[[39mbase^[[33m,^[[39m projection^[[33m:^[[39m { pick^[[33m:^[[39m [^[[32m"a"^[[39m^[[33m,^[[39m ^[[32m"b"^[[39m] } })^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2678995Z     ^[[90m 62|^[[39m     )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2679181Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2679430Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2679653Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2680692Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/edge-key-separator.test.ts^[[2m > ^[[22medge identity survives a separator inside an id^[[2m > ^[[22mE-3 distinguishes a map value containing the projection separators
quality (node 24)	Run npm test	2026-08-18T10:54:17.2682037Z ^[[31m^[[1mAssertionError^[[22m: expected 'a/b|c/d|input||map:a=x,b=y' not to be 'a/b|c/d|input||map:a=x,b=y' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2682922Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/edge-key-separator.test.ts:^[[2m66:75^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2683556Z     ^[[90m 64|^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2684138Z     ^[[90m 65|^[[39m   it("E-3 distinguishes a map value containing the projection separato…
quality (node 24)	Run npm test	2026-08-18T10:54:17.2685135Z     ^[[90m 66|^[[39m     expect(edgeKey({ ...base, projection: { map: { a: "x,b=y" } } })).…
quality (node 24)	Run npm test	2026-08-18T10:54:17.2685738Z     ^[[90m   |^[[39m                                                                           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2686949Z     ^[[90m 67|^[[39m       ^[[34medgeKey^[[39m({ ^[[33m...^[[39mbase^[[33m,^[[39m projection^[[33m:^[[39m { map^[[33m:^[[39m { a^[[33m:^[[39m ^[[32m"x"^[[39m^[[33m,^[[39m b^[[33m:^[[39m ^[[32m"y"^[[39m } } })^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2687734Z     ^[[90m 68|^[[39m     )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2687918Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2688154Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2688368Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2689365Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/edge-key-separator.test.ts^[[2m > ^[[22medge identity survives a separator inside an id^[[2m > ^[[22mE-6 distinguishes an authored empty target from an absent target
quality (node 24)	Run npm test	2026-08-18T10:54:17.2691135Z ^[[31m^[[1mAssertionError^[[22m: expected 'a/b|c/d|input||' not to be 'a/b|c/d|input||' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2692060Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/edge-key-separator.test.ts:^[[2m80:50^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2692777Z     ^[[90m 78|^[[39m   it("E-6 distinguishes an authored empty target from an absent target…
quality (node 24)	Run npm test	2026-08-18T10:54:17.2693428Z     ^[[90m 79|^[[39m     // Both render as the empty string today, so one edge stands in fo…
quality (node 24)	Run npm test	2026-08-18T10:54:17.2694758Z     ^[[90m 80|^[[39m     ^[[34mexpect^[[39m(^[[34medgeKey^[[39m({ ^[[33m...^[[39mbase^[[33m,^[[39m target^[[33m:^[[39m ^[[32m""^[[39m }))^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34medgeKey^[[39m(base))^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2696162Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2697023Z     ^[[90m 81|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2697557Z     ^[[90m 82|^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2697814Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2698218Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2698563Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2698579Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2699377Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m105 passed^[[39m^[[22m^[[90m (106)^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2700177Z ^[[2m      Tests ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m447 passed^[[39m^[[22m^[[90m (451)^[[39m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2700681Z ^[[2m   Start at ^[[22m 10:54:08
quality (node 24)	Run npm test	2026-08-18T10:54:17.2701335Z ^[[2m   Duration ^[[22m 8.60s^[[2m (transform 1.47s, setup 0ms, import 4.94s, tests 3.98s, environment 13ms)^[[22m
quality (node 24)	Run npm test	2026-08-18T10:54:17.2701740Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2701759Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2722496Z ##[error]AssertionError: expected [ { …(5) } ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   {
quality (node 24)	Run npm test	+     "ids": [
quality (node 24)	Run npm test	+       "m/x|m",
quality (node 24)	Run npm test	+       "y/z",
quality (node 24)	Run npm test	+     ],
quality (node 24)	Run npm test	+     "message": "Duplicate observation edge \"m/x|m|y/z|input||\".",
quality (node 24)	Run npm test	+     "path": "m/x|m",
quality (node 24)	Run npm test	+     "ruleId": "observation-duplicate",
quality (node 24)	Run npm test	+     "severity": "error",
quality (node 24)	Run npm test	+   },
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/edge-key-separator.test.ts:55:32
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:54:17.2731797Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2734671Z ##[error]AssertionError: expected 'a/b|c/d|input||pick:a,b' not to be 'a/b|c/d|input||pick:a,b' // Object.is equality
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/edge-key-separator.test.ts:60:69
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:54:17.2736445Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2739261Z ##[error]AssertionError: expected 'a/b|c/d|input||map:a=x,b=y' not to be 'a/b|c/d|input||map:a=x,b=y' // Object.is equality
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/edge-key-separator.test.ts:66:75
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:54:17.2741005Z 
quality (node 24)	Run npm test	2026-08-18T10:54:17.2743332Z ##[error]AssertionError: expected 'a/b|c/d|input||' not to be 'a/b|c/d|input||' // Object.is equality
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/edge-key-separator.test.ts:80:50
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:54:17.3138111Z ##[error]Process completed with exit code 1.
```
