# CI log archive: 32573228145

- Workflow: CI
- Conclusion: failure
- Head branch: feat/plugin-group-values-section
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32573228145
- Captured: 2026-08-22T12:32:45Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-22T12:31:50.0206412Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.0206782Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.0249151Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.0249420Z env:
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.0249630Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.0249847Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.1229033Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.1229877Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.1230602Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.1230881Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.4810276Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.4814300Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.4814949Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.9595781Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.9743907Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:50.9943746Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.2154165Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.2332700Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.2987857Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.2991545Z ^[[31m     ^[[31m×^[[31m 1. Load valid walker project through Engine with plugin registry^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.2993555Z ^[[31m     ^[[31m×^[[31m 2. Render walker nodes through createDomPatchAdapter^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.2996741Z ^[[31m     ^[[31m×^[[31m 3. Demonstrate time playback using single injected browser clock^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.2998573Z ^[[31m     ^[[31m×^[[31m 4. Demonstrate progress through TriggerPort and manual signals^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.3000165Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.3002182Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.3004055Z ^[[31m     ^[[31m×^[[31m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.3005717Z ^[[31m     ^[[31m×^[[31m 8. Show blocked/pending/error diagnostics without crashing the app^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.3007247Z ^[[31m     ^[[31m×^[[31m 9. Use React usePatch hook at the React boundary^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.3008701Z ^[[31m     ^[[31m×^[[31m 10. Automated end-to-end integration test passes clean^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.4727960Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.4777196Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.5792195Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.5794840Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.5817600Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.5830954Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.5833073Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.5835428Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.5837428Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.6928621Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.7080722Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.8572020Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.8574490Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.8577697Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.8580867Z      ^[[32m✓^[[39m U-3 changes nothing when the owning Motion refuses the replacement^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.8582624Z      ^[[32m✓^[[39m U-4 changes nothing when the candidate graph refuses a derived observation^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.9309250Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:51.9808252Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.1023191Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.1643540Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.2538805Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.2552740Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.2554463Z      ^[[32m✓^[[39m leaves a rejected unknown-source adoption retryable^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.2555980Z      ^[[32m✓^[[39m leaves a rejected self-reference adoption retryable^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.3704040Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.3706541Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.3708535Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.3710259Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.3712388Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.3802246Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.4753199Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.6109654Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.6272831Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.7253049Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.8112719Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.8833400Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:52.9503063Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.0701043Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.1102749Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.1815985Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.3028557Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.3445948Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.4266899Z  ^[[31m❯^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.4271273Z ^[[31m     ^[[31m×^[[31m F-10 interpolates grouped leaves without renaming the owning plugin^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.4272993Z ^[[31m     ^[[31m×^[[31m F-11 interpolates a grouped track when the Engine has no plugin registry^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.4274877Z ^[[31m     ^[[31m×^[[31m F-12 publishes identical values for the flat and grouped spellings^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.5037166Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.5761691Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.6699175Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.6922778Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.8122809Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.8715773Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:53.8900941Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.0323065Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.0707174Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.1054750Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.2506205Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.2571831Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.2574737Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.3475229Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.4406744Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.6274518Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.6307754Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.6859553Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.8077864Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.8614810Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:54.8719953Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0057429Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0499818Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0751186Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0782860Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0783673Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 26 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0784153Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0788996Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-10 interpolates grouped leaves without renaming the owning plugin
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0795278Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0796760Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0860329Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0864245Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0865487Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0866304Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0867211Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0868251Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0869370Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0870905Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0872269Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m56:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0872864Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0873286Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0873640Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0875375Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-11 interpolates a grouped track when the Engine has no plugin registry
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0878426Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0880306Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0881621Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0882970Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0884092Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0884769Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0885627Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0886627Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0887639Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0888859Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0890136Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m70:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0890991Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0891369Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0891700Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0893354Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-12 publishes identical values for the flat and grouped spellings
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0895903Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0897559Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0898732Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0900085Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0901370Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0902066Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0902911Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0903899Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0904904Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0906103Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0907405Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m82:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0908000Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0908385Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0908721Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0910740Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0913665Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at addTrack(root).keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0915659Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0926003Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0927548Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0929979Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0931709Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0932774Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0934209Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0935849Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0937263Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0938687Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m75:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0939458Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0939970Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0940671Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0942457Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0947604Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0951604Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0952934Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0954530Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0955896Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0956693Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0957706Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0958939Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0960209Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0962029Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m71:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0963790Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m90:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0964758Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0965563Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0966013Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0967735Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0970283Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'keyframes-missing-values-section at m…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0971470Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0971719Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0972153Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0972409Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0972639Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0983593Z "keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0985638Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0986556Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m118:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0988029Z     ^[[90m116|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0989134Z     ^[[90m117|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0990220Z     ^[[90m118|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0991426Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0992495Z     ^[[90m119|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0993268Z     ^[[90m120|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0993542Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0993943Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0994299Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.0996002Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1001251Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1004563Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1005712Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1007078Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1008232Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1008931Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1009792Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1010922Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1011933Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1013240Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m71:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1014688Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m123:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1015320Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1015707Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1016045Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1017723Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m1. Load valid walker project through Engine with plugin registry
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1025131Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1029895Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1031524Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1033075Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1034211Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1034887Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1035769Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1036757Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1037778Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1039015Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m136:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1039610Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1040012Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1040367Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1042107Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m2. Render walker nodes through createDomPatchAdapter
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1049081Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1053935Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1055007Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1056288Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1057421Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1058111Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1058960Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1059991Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1061132Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1062370Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m155:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1063010Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1063460Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1063817Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1065507Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m3. Demonstrate time playback using single injected browser clock
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1072815Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1078080Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1079194Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1080733Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1081637Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1082057Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1082584Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1083179Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1083794Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1084550Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m190:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1084928Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1085182Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1085389Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1086345Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m4. Demonstrate progress through TriggerPort and manual signals
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1091285Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1094761Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1095604Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1096409Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1097218Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1097653Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1098171Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1098751Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1099381Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1100772Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m210:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1101410Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1101710Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1101915Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1102865Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1108026Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1112215Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1113355Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1114271Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1114953Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1115504Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1116031Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1116643Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1117284Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1118167Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m234:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1118523Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1118770Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1118981Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1120088Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1124599Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1127549Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1128265Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1129076Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1129827Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1130662Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1131600Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1132252Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1132877Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1134080Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m260:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1134521Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1134765Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1134976Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1136492Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m7. Mount, unmount, remount, and dispose without duplicate subscriptions
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1141814Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1145720Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1146671Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1147789Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1148477Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1149058Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1149607Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1150221Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1151103Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1152178Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m296:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1152785Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1153053Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1153258Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1154432Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m8. Show blocked/pending/error diagnostics without crashing the app
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1158420Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1161310Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1162002Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1162804Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1163489Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1164054Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1164572Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1165156Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1165771Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1166503Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m321:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1166860Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1167098Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1167297Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1168173Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1172461Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1175218Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1175896Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1176701Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1177386Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1177799Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1178314Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1178900Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1179487Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1180195Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m342:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1180645Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1180881Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1181094Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1182001Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m10. Automated end-to-end integration test passes clean
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1185956Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1188554Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1189372Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1190300Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1191291Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1191941Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1192779Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1193839Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1194905Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1196111Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m378:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1196653Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1197032Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1197397Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1199292Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1204548Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1207755Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1208862Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1210185Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1211456Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1212128Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1212975Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1213945Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1214939Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1216232Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1217168Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m99:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1217557Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1217793Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1218005Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1219212Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1221760Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-missing-values-section at motions[0].tracks[1].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1223230Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1223901Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1224729Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1225597Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1226139Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1226657Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1227245Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1227866Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1251660Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1252849Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m121:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1253264Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1253518Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1253731Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1254758Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1256440Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'keyframes-missing-values-section at m…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1257128Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1257316Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1257617Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1257816Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1257950Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1259912Z "keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1261708Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1262237Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1262855Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1263215Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1263767Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1264372Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1264795Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1265095Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1265255Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1265513Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1265739Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1266886Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1269413Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.reach.weight: Keyframe section 'weight' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1271383Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1272126Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1273042Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1273774Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1274236Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1274815Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1275732Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1276546Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1277392Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1278314Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m155:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1278738Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1278981Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1279199Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1280309Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1283571Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1285554Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1286288Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1287159Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1287890Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1288365Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1288927Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1289582Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1290260Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1291249Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1292183Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m183:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1292609Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1292869Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1293085Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1294152Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1295746Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'keyframes-missing-values-section at m…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1296367Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1296539Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1296832Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1297034Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1297191Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1299159Z "keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1300775Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1301305Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m201:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1301980Z     ^[[90m199|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1302385Z     ^[[90m200|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1303220Z     ^[[90m201|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1304093Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1304596Z     ^[[90m202|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1305030Z     ^[[90m203|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1305242Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1305550Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1305816Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1306958Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1308393Z ^[[31m^[[1mAssertionError^[[22m: expected 'keyframes-missing-values-section at r…' to match /^plugin-unknown-key at /^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1308911Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1309070Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1309359Z /^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1309548Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1309699Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1310732Z "keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1311343Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1311926Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1312764Z     ^[[90m 94|^[[39m     const thrown = thrownBy(() => handle.track(NODE_ID).replace(UNRESO…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1313241Z     ^[[90m 95|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1313747Z     ^[[90m 96|^[[39m     expect((thrown as Error).message).toMatch(/^plugin-unknown-key at …
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1314325Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1314905Z     ^[[90m 97|^[[39m     // Red on the parent: the graph was already replaced and the live …
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1315555Z     ^[[90m 98|^[[39m     // the next flush resolved nothing and published a composition fai…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1315888Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1316146Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1316372Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1317527Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1319111Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'keyframes-missing-values-section at r…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1319683Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1319838Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1320094Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1320254Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1320540Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1321357Z "keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1321969Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1322530Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m111:63^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1323318Z     ^[[90m109|^[[39m     ^[[35mconst^[[39m handle ^[[33m=^[[39m ^[[34mload^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1323754Z     ^[[90m110|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1324251Z     ^[[90m111|^[[39m     expect(() => handle.track(NODE_ID).replace(UNRESOLVABLE)).toThrow(…
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1324884Z     ^[[90m   |^[[39m                                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1325836Z     ^[[90m112|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1326504Z     ^[[90m113|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1326653Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1326884Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1327115Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1328198Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1331825Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1333773Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1334524Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1335398Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1336130Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1336602Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1337172Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1337800Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1338431Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1339235Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m45:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1340086Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m52:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1340635Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1340887Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1341109Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1341131Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1341607Z ^[[2m Test Files ^[[22m ^[[1m^[[31m7 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m48 passed^[[39m^[[22m^[[90m (55)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1342467Z ^[[2m      Tests ^[[22m ^[[1m^[[31m26 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m199 passed^[[39m^[[22m^[[90m (225)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1343028Z ^[[2m   Start at ^[[22m 12:31:50
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1343715Z ^[[2m   Duration ^[[22m 4.58s^[[2m (transform 1.14s, setup 0ms, import 3.80s, tests 977ms, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1344112Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1344119Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1369712Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:56:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1377547Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1381574Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:70:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1383497Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1386569Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:82:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1388561Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1393055Z ##[error]TypeError: keyframes-missing-values-section at addTrack(root).keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:75:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1395453Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1400644Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:71:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:90:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1403371Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1407571Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'keyframes-missing-values-section at m…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:118:58
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1409811Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1415009Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:71:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:123:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1417662Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1423870Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:136:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1427064Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1433249Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:155:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1436799Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1443333Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:190:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1448802Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1459152Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:210:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1465151Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1476059Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:234:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1481730Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1488904Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:260:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1492474Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1498464Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:296:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1502283Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1508228Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:321:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1511673Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1517608Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:342:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1521020Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1527149Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:378:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1532001Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1536979Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:99:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1539982Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1544411Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-missing-values-section at motions[0].tracks[1].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:121:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1546738Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1552060Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'keyframes-missing-values-section at m…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:139:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1554826Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1558882Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.reach.weight: Keyframe section 'weight' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:155:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1561401Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1566329Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:183:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1569090Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1574242Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'keyframes-missing-values-section at m…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:201:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1577014Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1579984Z ##[error]AssertionError: expected 'keyframes-missing-values-section at r…' to match /^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1582311Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1585470Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'keyframes-missing-values-section at r…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:111:63
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1587272Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1592248Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:45:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:52:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:31:55.1597732Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-22T12:32:27.7771613Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.7771960Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.7810719Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.7811162Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.7811357Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.7811574Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.8857710Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.8858146Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.8859000Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:27.8859233Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.1994173Z ##[error]apps/react-demo/src/full-body-project.ts(27,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2006281Z ##[error]apps/react-demo/src/full-body-project.ts(56,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2021286Z ##[error]apps/react-demo/src/full-body-project.ts(85,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2031780Z ##[error]apps/react-demo/src/full-body-project.ts(114,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2035644Z ##[error]apps/react-demo/src/full-body-project.ts(145,9): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2039745Z ##[error]apps/react-demo/src/full-body-project.ts(183,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2043646Z ##[error]apps/react-demo/src/full-body-project.ts(208,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2047464Z ##[error]apps/react-demo/src/full-body-project.ts(233,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2052023Z ##[error]apps/react-demo/src/full-body-project.ts(262,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2056198Z ##[error]apps/react-demo/src/full-body-project.ts(291,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2060402Z ##[error]apps/react-demo/src/full-body-project.ts(320,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2064309Z ##[error]apps/react-demo/src/full-body-project.ts(349,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2068152Z ##[error]apps/react-demo/src/full-body-project.ts(378,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2074279Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(56,33): error TS2345: Argument of type '{ fk: { boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2077290Z   Property 'fk' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2078941Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2082244Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(70,41): error TS2353: Object literal may only specify known properties, and 'boneLength' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2086455Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(82,42): error TS2353: Object literal may only specify known properties, and 'boneLength' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2091339Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(50,7): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2095821Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(60,7): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2100318Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(36,22): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2104518Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(49,39): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2108902Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(111,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2113066Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(32,17): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2117154Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(57,17): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2121512Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(77,17): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2125955Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(58,11): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2130339Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(72,39): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2134652Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(119,26): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2139236Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(136,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2143560Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(147,11): error TS2353: Object literal may only specify known properties, and 'weight' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2147786Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(176,41): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2152263Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(198,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2156501Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(42,24): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2160924Z ##[error]packages/core/test/integration/single-input-channel.test.ts(23,29): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2165108Z ##[error]packages/core/test/integration/single-input-channel.test.ts(28,11): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2170156Z ##[error]packages/core/test/unit/graph/requirement-edge-construction.test.ts(54,13): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2174705Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(59,19): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:32:31.2425904Z ##[error]Process completed with exit code 2.
```
