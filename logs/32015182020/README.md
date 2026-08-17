# CI log archive: 32015182020

- Workflow: CI
- Conclusion: failure
- Head branch: feat/trigger-drivers-t2
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32015182020
- Captured: 2026-08-17T09:26:46Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-17T09:26:18.8434344Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-17T09:26:18.8434650Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-17T09:26:18.8472404Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-17T09:26:18.8472665Z env:
quality (node 24)	Run npm test	2026-08-17T09:26:18.8472867Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-17T09:26:18.8473095Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-17T09:26:18.9542790Z 
quality (node 24)	Run npm test	2026-08-17T09:26:18.9543473Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-17T09:26:18.9543919Z > vitest run
quality (node 24)	Run npm test	2026-08-17T09:26:18.9544082Z 
quality (node 24)	Run npm test	2026-08-17T09:26:19.2862075Z 
quality (node 24)	Run npm test	2026-08-17T09:26:19.2874276Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:19.2875174Z 
quality (node 24)	Run npm test	2026-08-17T09:26:19.6524463Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:19.7923277Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:19.9231451Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-17T09:26:19.9234386Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:26:19.9235727Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:26:19.9236796Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:26:19.9237364Z 
quality (node 24)	Run npm test	2026-08-17T09:26:19.9247353Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 65^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:20.0444734Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:20.0671183Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:20.1529044Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:20.3034459Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:20.4009448Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:20.5480552Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:20.6611598Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:20.7344533Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0014332Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0016700Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0018578Z      ^[[32m✓^[[39m does not emit before the first tick^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0019843Z      ^[[32m✓^[[39m rejects external signals without changing progress^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0021220Z      ^[[32m✓^[[39m coalesces rapid driver ticks to the latest progress^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0023062Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0025200Z      ^[[32m✓^[[39m keeps manual signals working and preserves range validation^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0027003Z      ^[[32m✓^[[39m isolates a throwing clock consumer while preserving other Motion progress^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.0801812Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.2946546Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.3701607Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.5773581Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.6674468Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.9355007Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 93^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:21.9876845Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:22.2264190Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:22.2840669Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:22.5228642Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:22.5718240Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:22.8659510Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:22.8725403Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.1405416Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.2195961Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.4296766Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.5030606Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.6184422Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3340^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.6207099Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3336^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.7534487Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.7676580Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:23.8768374Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.0074054Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.0516439Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.1458087Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.2614915Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.2836153Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.4216141Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.5343115Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.5633256Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.6385174Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.8107496Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.8665623Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:24.9132969Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.0408887Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.1394172Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.1683900Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.3294208Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.3842817Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.4528843Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.5695673Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.6524538Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.6951398Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.7953977Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.9224206Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:25.9308338Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.0304336Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.1632898Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.1743863Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.2425284Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.3962979Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.4662236Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.4994778Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-17T09:26:26.5026148Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.5075579Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:26:26.5102848Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:26:26.5112810Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:26:26.5124734Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:26:26.5125598Z 
quality (node 24)	Run npm test	2026-08-17T09:26:26.6294138Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.7063692Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.7264111Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.8764100Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:26.9463848Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.0300545Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.1073005Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.1925519Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.2734192Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.3844182Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.4515215Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.4994318Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.6219782Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.6790500Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.7298884Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.8684524Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.8839770Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:27.9534211Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.0764348Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.1045611Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.1924444Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.2974860Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.3085444Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.4898510Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.5669261Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-17T09:26:28.5671787Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.5703278Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:26:28.5732770Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:26:28.5791526Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:26:28.5793918Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.5833021Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:26:28.5853056Z 
quality (node 24)	Run npm test	2026-08-17T09:26:28.7639248Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.8364052Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.8517985Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9533189Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9905114Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9946320Z 
quality (node 24)	Run npm test	2026-08-17T09:26:28.9947499Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9948503Z 
quality (node 24)	Run npm test	2026-08-17T09:26:28.9952304Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
quality (node 24)	Run npm test	2026-08-17T09:26:28.9957427Z ^[[31m^[[1mAssertionError^[[22m: expected [ { x: +0 }, { x: 25 }, { x: 100 } ] to have a length of 2 but got 3^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9958287Z 
quality (node 24)	Run npm test	2026-08-17T09:26:28.9958719Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9959245Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9959472Z 
quality (node 24)	Run npm test	2026-08-17T09:26:28.9959714Z ^[[32m- 2^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9960147Z ^[[31m+ 3^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:28.9960524Z 
quality (node 24)	Run npm test	2026-08-17T09:26:28.9961501Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m30:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0018648Z     ^[[90m 28|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0020715Z     ^[[90m 29|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0024691Z     ^[[90m 30|^[[39m     ^[[34mexpect^[[39m(seen)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0025336Z 
quality (node 24)	Run npm test	2026-08-17T09:26:29.0025676Z     ^[[90m   |^[[39m                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0026860Z     ^[[90m 31|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0027548Z     ^[[90m 32|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0027836Z 
quality (node 24)	Run npm test	2026-08-17T09:26:29.0028247Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0028615Z 
quality (node 24)	Run npm test	2026-08-17T09:26:29.0048275Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m94 passed^[[39m^[[22m^[[90m (95)^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0051618Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m396 passed^[[39m^[[22m^[[90m (397)^[[39m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0052889Z ^[[2m   Start at ^[[22m 09:26:19
quality (node 24)	Run npm test	2026-08-17T09:26:29.0054156Z ^[[2m   Duration ^[[22m 9.69s^[[2m (transform 1.53s, setup 0ms, import 5.32s, tests 4.92s, environment 15ms)^[[22m
quality (node 24)	Run npm test	2026-08-17T09:26:29.0054857Z 
quality (node 24)	Run npm test	2026-08-17T09:26:29.0055115Z 
quality (node 24)	Run npm test	2026-08-17T09:26:29.0084986Z ##[error]AssertionError: expected [ { x: +0 }, { x: 25 }, { x: 100 } ] to have a length of 2 but got 3
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 2
quality (node 24)	Run npm test	+ 3
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time.test.ts:30:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:26:29.0519539Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-17T09:26:13.8176987Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.8177385Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.8221736Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.8222575Z env:
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.8222859Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.8223086Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.9357978Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.9358960Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.9359648Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:13.9359894Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.2573558Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.2577461Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.2578365Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.7149171Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.7460721Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.8370376Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.8373128Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.8377068Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.8378386Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.8379208Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.8450232Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.9457783Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:14.9904864Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.1033970Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.1063570Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.1088817Z      ^[[32m✓^[[39m does not emit before the first tick^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.1090286Z      ^[[32m✓^[[39m rejects external signals without changing progress^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.1093250Z      ^[[32m✓^[[39m coalesces rapid driver ticks to the latest progress^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.1095099Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.1096492Z      ^[[32m✓^[[39m keeps manual signals working and preserves range validation^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.1098028Z      ^[[32m✓^[[39m isolates a throwing clock consumer while preserving other Motion progress^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.2207263Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.2286468Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.3544328Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.4184111Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.4743053Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.5839427Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.6784889Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.6858464Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.8372686Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.8989098Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:15.9064635Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.0661361Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.1488498Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.1551443Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.2981002Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.3784808Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.3840151Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.5090898Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.5849310Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.5920203Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.7429821Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.7994248Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.8150767Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:16.9367384Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.0367494Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.2145369Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.2215062Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.2799116Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.4128156Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.4390990Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.5268620Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.6323618Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.6688570Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7010428Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7046606Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7047686Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7048116Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7051137Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7059413Z ^[[31m^[[1mAssertionError^[[22m: expected [ { x: +0 }, { x: 25 }, { x: 100 } ] to have a length of 2 but got 3^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7060189Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7060591Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7061191Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7061615Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7061933Z ^[[32m- 2^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7062594Z ^[[31m+ 3^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7062944Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7063935Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m30:18^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7116880Z     ^[[90m 28|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7118234Z     ^[[90m 29|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7119693Z     ^[[90m 30|^[[39m     ^[[34mexpect^[[39m(seen)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7120505Z     ^[[90m   |^[[39m                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7121194Z     ^[[90m 31|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7121823Z     ^[[90m 32|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7122095Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7122793Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7123169Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7123209Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7128993Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m39 passed^[[39m^[[22m^[[90m (40)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7130393Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m146 passed^[[39m^[[22m^[[90m (147)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7131254Z ^[[2m   Start at ^[[22m 09:26:14
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7132315Z ^[[2m   Duration ^[[22m 3.43s^[[2m (transform 971ms, setup 0ms, import 2.78s, tests 652ms, environment 5ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7133937Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7150871Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7173191Z ##[error]AssertionError: expected [ { x: +0 }, { x: 25 }, { x: 100 } ] to have a length of 2 but got 3
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- 2
integration (node 24)	Run npm run test:integration	+ 3
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:30:18
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T09:26:17.7606010Z ##[error]Process completed with exit code 1.
```
