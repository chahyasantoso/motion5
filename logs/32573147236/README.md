# CI log archive: 32573147236

- Workflow: CI
- Conclusion: failure
- Head branch: feat/plugin-group-values-section
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32573147236
- Captured: 2026-08-22T12:30:33Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-22T12:30:13.4321001Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.4321570Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.4354769Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.4355764Z env:
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.4356140Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.4356498Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.5405728Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.5406435Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.5407205Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.5407531Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.9771604Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.9774470Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:13.9775394Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.5440786Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.5597196Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6272004Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6277679Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6281198Z ^[[31m     ^[[31m×^[[31m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6282868Z ^[[31m     ^[[31m×^[[31m Y-3 reports an unknown section once and names both legal sections^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6284534Z ^[[31m     ^[[31m×^[[31m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6286473Z ^[[31m     ^[[31m×^[[31m Y-5 refuses a malformed or an empty values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6288323Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6290064Z ^[[31m     ^[[31m×^[[31m Y-7 cites the section in a diagnostic about a leaf inside it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6291793Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6293673Z ^[[31m     ^[[31m×^[[31m Y-9 keeps the perspective warning for 3D content inside the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6295665Z ^[[31m     ^[[31m×^[[31m Y-10 refuses one compiled key authored under two groups' values sections^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6297292Z      ^[[32m✓^[[39m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6318682Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.6348274Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.8039795Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9151599Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9153840Z ^[[31m     ^[[31m×^[[31m 1. Load valid walker project through Engine with plugin registry^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9155681Z ^[[31m     ^[[31m×^[[31m 2. Render walker nodes through createDomPatchAdapter^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9157507Z ^[[31m     ^[[31m×^[[31m 3. Demonstrate time playback using single injected browser clock^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9159001Z ^[[31m     ^[[31m×^[[31m 4. Demonstrate progress through TriggerPort and manual signals^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9160840Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9163098Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9165285Z ^[[31m     ^[[31m×^[[31m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9167040Z ^[[31m     ^[[31m×^[[31m 8. Show blocked/pending/error diagnostics without crashing the app^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9168423Z ^[[31m     ^[[31m×^[[31m 9. Use React usePatch hook at the React boundary^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9169712Z ^[[31m     ^[[31m×^[[31m 10. Automated end-to-end integration test passes clean^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:14.9220306Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.0500720Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.1971044Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.1973138Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.1975071Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.1976756Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.1979978Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.1981564Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.1983631Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.2029594Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.2877550Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.4564884Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.4567944Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.4569632Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.4571273Z      ^[[32m✓^[[39m U-3 changes nothing when the owning Motion refuses the replacement^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.4573002Z      ^[[32m✓^[[39m U-4 changes nothing when the candidate graph refuses a derived observation^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.4598405Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.5767323Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.7106444Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.7263715Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.8208697Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.9670832Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.9674056Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.9675950Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.9677560Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.9679022Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.9942138Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:15.9997531Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.0028335Z      ^[[32m✓^[[39m leaves a rejected unknown-source adoption retryable^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.0066510Z      ^[[32m✓^[[39m leaves a rejected self-reference adoption retryable^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.0840124Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.2050474Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.2428469Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.3530705Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.4584873Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.4668055Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.6219417Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.6713326Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.7282223Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.8687042Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.9307028Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:16.9768850Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.1255323Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.1899929Z  ^[[31m❯^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.1902121Z ^[[31m     ^[[31m×^[[31m F-10 interpolates grouped leaves without renaming the owning plugin^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.1904092Z ^[[31m     ^[[31m×^[[31m F-11 interpolates a grouped track when the Engine has no plugin registry^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.1906086Z ^[[31m     ^[[31m×^[[31m F-12 publishes identical values for the flat and grouped spellings^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.2055263Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.3618214Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.4021164Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.4309419Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.5747378Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.6328580Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.6430340Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.8198227Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.8379571Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:17.8559643Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.0328922Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.0618636Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.0620962Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.0952260Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.2407428Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.2992935Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.4965785Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.5026594Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.5088898Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.7073067Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.7388189Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.7454660Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9009399Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9036376Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9074140Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9075839Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 36 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9077379Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9080753Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-10 interpolates grouped leaves without renaming the owning plugin
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9088436Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.fk.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9090129Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9163641Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9165816Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9167144Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9168086Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9169205Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9170500Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9171902Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9173266Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9175715Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m56:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9176458Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9177068Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9177530Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9179320Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-11 interpolates a grouped track when the Engine has no plugin registry
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9181762Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.fk.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9183431Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9184963Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9186683Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9188065Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9188985Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9190084Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9191338Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9192534Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9194029Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9195637Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m70:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9196535Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9197177Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9197656Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9199201Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-12 publishes identical values for the flat and grouped spellings
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9201546Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.fk.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9203200Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9204462Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9206297Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9208351Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9209361Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9210459Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9211725Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9213052Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9214424Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9216296Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m82:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9217045Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9217742Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9218399Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9220170Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9223059Z ^[[31m^[[1mTypeError^[[22m: stops-shape at addTrack(root).keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9224990Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9240471Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9242340Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9244305Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9245853Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9248729Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9250126Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9251866Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9253336Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9254777Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m75:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9255742Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9256325Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9256774Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9258457Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9261051Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9262966Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9264497Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9267565Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9268997Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9269986Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9270982Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9272955Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9274835Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9276642Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m71:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9278365Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m90:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9279142Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9279671Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9280054Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9281610Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9284053Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'stops-shape at motions[0].tracks[0].k…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9284991Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9285295Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9286092Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9286467Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9286746Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9288639Z "stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9289401Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9290246Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m118:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9291696Z     ^[[90m116|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9292846Z     ^[[90m117|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9294126Z     ^[[90m118|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9295181Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9296321Z     ^[[90m119|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9297403Z     ^[[90m120|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9297709Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9298203Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9298822Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9300327Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9302549Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9304135Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9305446Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9307243Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9308521Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9309412Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9310403Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9311521Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9312771Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9314142Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m71:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9315833Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m123:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9316495Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9317007Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9317464Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9319008Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m1. Load valid walker project through Engine with plugin registry
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9321935Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9323665Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9325036Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9326605Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9327830Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9328707Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9329588Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9330642Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9331720Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9332864Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m136:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9333465Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9333901Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9334231Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9335798Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m2. Render walker nodes through createDomPatchAdapter
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9337939Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9339453Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9340596Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9342010Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9343157Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9343915Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9344916Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9346086Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9347221Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9348448Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m155:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9349197Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9349611Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9350005Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9351631Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m3. Demonstrate time playback using single injected browser clock
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9353964Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9355424Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9357013Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9358385Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9359716Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9360522Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9361484Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9363162Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9364445Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9366067Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m190:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9366773Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9367287Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9367654Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9369178Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m4. Demonstrate progress through TriggerPort and manual signals
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9371294Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9372707Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9374183Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9375874Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9377052Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9377825Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9378781Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9379773Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9381033Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9382350Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m210:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9383029Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9383518Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9383981Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9385953Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9388086Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9389665Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9390812Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9392182Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9393257Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9394030Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9394838Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9396084Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9397153Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9398387Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m234:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9399016Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9399440Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9399801Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9401173Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9403327Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9405116Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9406701Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9407915Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9409043Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9409869Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9410784Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9411788Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9412906Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9414115Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m260:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9414815Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9415257Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9415943Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9417487Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m7. Mount, unmount, remount, and dispose without duplicate subscriptions
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9419673Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9421092Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9422296Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9423688Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9424872Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9425801Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9426652Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9427665Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9428683Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9429870Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m296:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9430436Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9430804Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9431193Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9432642Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m8. Show blocked/pending/error diagnostics without crashing the app
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9434640Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9436331Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9437521Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9438818Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9440025Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9440801Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9441646Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9442776Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9443805Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9445754Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m321:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9446619Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9447108Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9447478Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9448903Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9451143Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9452688Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9454062Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9455402Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9456889Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9457676Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9458669Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9459770Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9460859Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9462048Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m342:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9462703Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9463150Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9463657Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9465102Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m10. Automated end-to-end integration test passes clean
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9467539Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9469212Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9470407Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9471885Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9473083Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9473909Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9474876Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9476076Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9477708Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9478978Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m378:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9479822Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9480272Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9480671Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9482453Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9485030Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[1].keyframes.fk.values.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9486791Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9488144Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9489547Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9490818Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9491610Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9492566Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9493662Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9494742Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9496588Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m134:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9498139Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m148:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9498824Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9499369Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9499808Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9501613Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-2 refuses the legacy leaf form by name rather than as a missing stops array
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9504030Z ^[[31m^[[1mAssertionError^[[22m: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9504882Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9505175Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9505766Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9506322Z   "path": "keyframes.fk",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9506899Z   "ruleId": "keyframes-missing-values-section",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9507461Z }
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9507698Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9507940Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9508442Z [
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9508810Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9509344Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9510151Z     "path": "keyframes.fk.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9510671Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9511211Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9511701Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9512088Z ]
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9512384Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9513214Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m168:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9514500Z     ^[[90m166|^[[39m   it("Y-2 refuses the legacy leaf form by name rather than as a missin…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9516324Z     ^[[90m167|^[[39m     ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mdiagnose^[[39m({ fk^[[33m:^[[39m { length^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9517739Z     ^[[90m168|^[[39m     ^[[34mexpect^[[39m(diagnostics)^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9518689Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9519396Z     ^[[90m169|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9520705Z     ^[[90m170|^[[39m         ruleId^[[33m:^[[39m ^[[32m"keyframes-missing-values-section"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9521473Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9521891Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9522306Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9523913Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-3 reports an unknown section once and names both legal sections
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9526096Z ^[[31m^[[1mAssertionError^[[22m: expected [] to have a length of 1 but got +0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9526612Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9526915Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9527413Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9527744Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9528021Z ^[[32m- 1^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9528457Z ^[[31m+ 0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9528740Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9529508Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m184:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9530928Z     ^[[90m182|^[[39m       ({ ruleId }) ^[[33m=>^[[39m ruleId ^[[33m===^[[39m ^[[32m"keyframes-unknown-section"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9531856Z     ^[[90m183|^[[39m     )^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9532863Z     ^[[90m184|^[[39m     ^[[34mexpect^[[39m(unknown)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9533753Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9534992Z     ^[[90m185|^[[39m     ^[[34mexpect^[[39m(unknown[^[[34m0^[[39m]^[[33m?.^[[39mpath)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"keyframes.fk.typo"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9536641Z     ^[[90m186|^[[39m     ^[[34mexpect^[[39m(unknown[^[[34m0^[[39m]^[[33m?.^[[39mmessage)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"'requires'"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9537346Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9537736Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9538124Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9539746Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-4 reserves a top-level values under the rule id a top-level requires gets
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9541721Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'stops-shape' ] to deeply equal [ 'keyframes-reserved-section' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9542303Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9542526Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9543036Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9543386Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9543617Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9544183Z ^[[32m-   "keyframes-reserved-section",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9544936Z ^[[31m+   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9545604Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9545877Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9546580Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m193:57^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9547842Z     ^[[90m191|^[[39m     // A top-level section name addresses no plugin, so nothing writte…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9548943Z     ^[[90m192|^[[39m     // owner. One reservation, one rule id, for both members of a grou…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9549971Z     ^[[90m193|^[[39m     expect(ruleIds({ values: { length: ramp(0, 1) } })).toEqual(["keyf…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9550705Z     ^[[90m   |^[[39m                                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9551697Z     ^[[90m194|^[[39m     expect(ruleIds({ requires: { base: "hero/root" } })).toEqual(["key…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9552564Z     ^[[90m195|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9552838Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9553238Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9553652Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9554913Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-5 refuses a malformed or an empty values section
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9556922Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'stops-shape' ] to deeply equal [ 'keyframes-values-shape' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9557950Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9558182Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9558680Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9559040Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9559289Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9559848Z ^[[32m-   "keyframes-values-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9560489Z ^[[31m+   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9561057Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9561309Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9562071Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m198:45^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9563036Z     ^[[90m196|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9563988Z     ^[[90m197|^[[39m   ^[[34mit^[[39m(^[[32m"Y-5 refuses a malformed or an empty values section"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9565265Z     ^[[90m198|^[[39m     expect(ruleIds({ fk: { values: [] } })).toEqual(["keyframes-values…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9566502Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9567511Z     ^[[90m199|^[[39m     expect(ruleIds({ fk: { values: "x" } })).toEqual(["keyframes-value…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9568661Z     ^[[90m200|^[[39m     expect(ruleIds({ fk: { values: 3 } })).toEqual(["keyframes-values-…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9569113Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9569582Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9569957Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9571531Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-7 cites the section in a diagnostic about a leaf inside it
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9573482Z ^[[31m^[[1mAssertionError^[[22m: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9574170Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9574340Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9574736Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9575215Z   "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9576077Z   "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9576586Z }
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9576813Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9577121Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9577561Z [
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9577977Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9578585Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9579271Z     "path": "keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9579831Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9580353Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9580734Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9581118Z ]
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9581344Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9582187Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m215:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9583391Z     ^[[90m213|^[[39m   it("Y-7 cites the section in a diagnostic about a leaf inside it", (…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9584393Z     ^[[90m214|^[[39m     const authored = { fk: { values: { length: { stops: [{ p: 2, v: 1 …
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9585448Z     ^[[90m215|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9586475Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9587177Z     ^[[90m216|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9587921Z     ^[[90m217|^[[39m         ruleId^[[33m:^[[39m ^[[32m"stop-position-range"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9588356Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9588693Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9589008Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9590276Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9591743Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'stops-shape' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9592239Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9592510Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9592991Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9593254Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9594602Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9596171Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9597081Z ^[[31m+   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9598961Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9600373Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9601863Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m229:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9603402Z     ^[[90m227|^[[39m     // a property called `values` that `fk` claims, and nothing about …
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9604870Z     ^[[90m228|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m { fk^[[33m:^[[39m { values^[[33m:^[[39m { values^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } } }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9606469Z     ^[[90m229|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m(authored))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9607457Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9608015Z     ^[[90m230|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9608792Z     ^[[90m231|^[[39m     const resolved = registry(passthrough).resolveForKeyframes(authore…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9609347Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9609715Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9610047Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9611654Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-9 keeps the perspective warning for 3D content inside the values section
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9613805Z ^[[31m^[[1mAssertionError^[[22m: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9614527Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9614815Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9615427Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9616152Z   "ruleId": "perspective-usage",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9616561Z   "severity": "warning",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9616985Z }
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9617124Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9617377Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9617837Z [
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9618224Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9618660Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9619217Z     "path": "motions[0].tracks[0].keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9619691Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9620080Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9620424Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9620766Z ]
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9620896Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9621479Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m238:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9622276Z     ^[[90m236|^[[39m   it("Y-9 keeps the perspective warning for 3D content inside the valu…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9623084Z     ^[[90m237|^[[39m     const result = validateV5(project({ fk: { values: { rotationY: ram…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9623888Z     ^[[90m238|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mdiagnostics)^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9624620Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9625410Z     ^[[90m239|^[[39m       expect.objectContaining({ ruleId: "perspective-usage", severity:…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9626369Z     ^[[90m240|^[[39m     )^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9626648Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9627019Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9627282Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9628376Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-10 refuses one compiled key authored under two groups' values sections
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9629915Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(3) ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9630386Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9630673Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9631186Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9631709Z   "path": "keyframes.ik.values.length",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9632303Z   "ruleId": "keyframes-duplicate-key",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9632740Z }
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9632971Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9633574Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9634246Z [
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9634600Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9635070Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9635959Z     "path": "keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9636384Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9636787Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9637150Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9637560Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9638088Z     "message": "Keyframe key 'values' is already authored at 'keyframes.fk.values'.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9638768Z     "path": "keyframes.ik.values",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9639237Z     "ruleId": "keyframes-duplicate-key",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9639747Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9640234Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9640617Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9641148Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9641761Z     "path": "keyframes.ik.values.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9642168Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9642748Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9643264Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9643874Z ]
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9644122Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9644811Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m248:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9646291Z     ^[[90m246|^[[39m       ik^[[33m:^[[39m { values^[[33m:^[[39m { length^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m2^[[39m) } }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9647081Z     ^[[90m247|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9647883Z     ^[[90m248|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9648728Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9649436Z     ^[[90m249|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9650254Z     ^[[90m250|^[[39m         ruleId^[[33m:^[[39m ^[[32m"keyframes-duplicate-key"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9650742Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9651121Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9651524Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9652706Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9656321Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.values.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[1].keyframes.fk.values.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[2].keyframes.fk.values.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9658155Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9659189Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9660287Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9661245Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9661985Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9662731Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9663614Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9664564Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9665764Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m134:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9666990Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m279:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9667475Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9667881Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9668442Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9669628Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9671424Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9672570Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9673525Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9674616Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9675684Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9676401Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9677222Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9678041Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9679011Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9680019Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9681152Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m99:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9681689Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9682055Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9682402Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9683596Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9686111Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[1].keyframes.fk.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9687543Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9688531Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9689590Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9690537Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9691261Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9692033Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9692916Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9693805Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9694880Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9696213Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m121:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9696708Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9697100Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9697442Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9698548Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9700265Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'stops-shape at motions[0].tracks[0].k…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9701056Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9701430Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9701928Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9702173Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9702496Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9703375Z "stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9704003Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9704649Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9705432Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9706255Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9707097Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9707913Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9708537Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9709180Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9709390Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9709770Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9710144Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9711351Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9712979Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9714136Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9715054Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9716261Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9717252Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9717905Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9718680Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9719525Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9720387Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9721406Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9722564Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m155:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9723040Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9723412Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9723755Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9724875Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9726846Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9727986Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9728933Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9730112Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9731052Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9731662Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9732369Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9733086Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9733816Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9737082Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9738690Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m183:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9739229Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9739714Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9739962Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9740984Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9742462Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'stops-shape at motions[0].tracks[0].k…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9743124Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9743326Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9743695Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9743962Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9744173Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9744809Z "stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9745278Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9746039Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m201:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9746743Z     ^[[90m199|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9747149Z     ^[[90m200|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9747771Z     ^[[90m201|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9748469Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9748960Z     ^[[90m202|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9749431Z     ^[[90m203|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9749666Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9749964Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9750216Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9751295Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9752724Z ^[[31m^[[1mAssertionError^[[22m: expected 'stops-shape at replaceTrack(scene/arm…' to match /^plugin-unknown-key at /^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9753207Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9753415Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9753767Z /^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9753976Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9754206Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9754822Z "stops-shape at replaceTrack(scene/arm).keyframes.nope.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9755296Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9755924Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9756818Z     ^[[90m 94|^[[39m     const thrown = thrownBy(() => handle.track(NODE_ID).replace(UNRESO…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9757330Z     ^[[90m 95|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9757929Z     ^[[90m 96|^[[39m     expect((thrown as Error).message).toMatch(/^plugin-unknown-key at …
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9758692Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9759579Z     ^[[90m 97|^[[39m     // Red on the parent: the graph was already replaced and the live …
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9760615Z     ^[[90m 98|^[[39m     // the next flush resolved nothing and published a composition fai…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9760988Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9761293Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9761863Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9762912Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9764487Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'stops-shape at replaceTrack(scene/arm…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9765279Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9765617Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9766114Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9766295Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9766503Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9767156Z "stops-shape at replaceTrack(scene/arm).keyframes.nope.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9767599Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9768190Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m111:63^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9769042Z     ^[[90m109|^[[39m     ^[[35mconst^[[39m handle ^[[33m=^[[39m ^[[34mload^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9769526Z     ^[[90m110|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9770140Z     ^[[90m111|^[[39m     expect(() => handle.track(NODE_ID).replace(UNRESOLVABLE)).toThrow(…
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9770784Z     ^[[90m   |^[[39m                                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9771769Z     ^[[90m112|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9772463Z     ^[[90m113|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9772653Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9772901Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9773165Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9774242Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9775742Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9776936Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9777726Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9778576Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9779424Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9779934Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9780562Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9781272Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9782038Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9782926Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m45:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9783759Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m52:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9784201Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9784452Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/36]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9784827Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9784860Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9785376Z ^[[2m Test Files ^[[22m ^[[1m^[[31m8 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m47 passed^[[39m^[[22m^[[90m (55)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9786581Z ^[[2m      Tests ^[[22m ^[[1m^[[31m36 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m189 passed^[[39m^[[22m^[[90m (225)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9787227Z ^[[2m   Start at ^[[22m 12:30:13
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9787962Z ^[[2m   Duration ^[[22m 4.91s^[[2m (transform 1.48s, setup 0ms, import 4.37s, tests 1.02s, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9788397Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9788403Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9816565Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.fk.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:56:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9830315Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9836223Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.fk.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:70:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9839032Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9843588Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.fk.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:82:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9846578Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9851660Z ##[error]TypeError: stops-shape at addTrack(root).keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:75:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9854573Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9859431Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:71:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:90:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9861887Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9865030Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'stops-shape at motions[0].tracks[0].k…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:118:58
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9867195Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9870351Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:71:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:123:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9872187Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9874690Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:136:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9876559Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9879125Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:155:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9881172Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9884280Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:190:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9886646Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9889283Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:210:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9890843Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9893294Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:234:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9894864Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9897767Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:260:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9899346Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9901807Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:296:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9903378Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9906115Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:321:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9907721Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9910222Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:342:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9911778Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9914227Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:378:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9915980Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9919162Z ##[error]TypeError: stops-shape at motions[0].tracks[1].keyframes.fk.values.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:134:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:148:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9921004Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9924524Z ##[error]AssertionError: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.fk",
integration (node 24)	Run npm run test:integration	  "ruleId": "keyframes-missing-values-section",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:168:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9927148Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9928932Z ##[error]AssertionError: expected [] to have a length of 1 but got +0
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- 1
integration (node 24)	Run npm run test:integration	+ 0
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:184:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9930332Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9932590Z ##[error]AssertionError: expected [ 'stops-shape' ] to deeply equal [ 'keyframes-reserved-section' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	-   "keyframes-reserved-section",
integration (node 24)	Run npm run test:integration	+   "stops-shape",
integration (node 24)	Run npm run test:integration	  ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:193:57
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9934006Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9936357Z ##[error]AssertionError: expected [ 'stops-shape' ] to deeply equal [ 'keyframes-values-shape' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	-   "keyframes-values-shape",
integration (node 24)	Run npm run test:integration	+   "stops-shape",
integration (node 24)	Run npm run test:integration	  ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:198:45
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9937851Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9941476Z ##[error]AssertionError: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	  "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:215:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9943592Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9945650Z ##[error]AssertionError: expected [ 'stops-shape' ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "stops-shape",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:229:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9947055Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9950454Z ##[error]AssertionError: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "ruleId": "perspective-usage",
integration (node 24)	Run npm run test:integration	  "severity": "warning",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "motions[0].tracks[0].keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:238:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9952736Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9958153Z ##[error]AssertionError: expected [ …(3) ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.ik.values.length",
integration (node 24)	Run npm run test:integration	  "ruleId": "keyframes-duplicate-key",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Keyframe key 'values' is already authored at 'keyframes.fk.values'.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.ik.values",
integration (node 24)	Run npm run test:integration	    "ruleId": "keyframes-duplicate-key",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.ik.values.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:248:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9960999Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9965674Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.values.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[1].keyframes.fk.values.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[2].keyframes.fk.values.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:134:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:279:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9968201Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9971206Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:99:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9973255Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9977022Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[1].keyframes.fk.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:121:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9979195Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9982239Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'stops-shape at motions[0].tracks[0].k…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:139:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9983981Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9987676Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:155:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9989721Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9992788Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:183:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9994581Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9997801Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'stops-shape at motions[0].tracks[0].k…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:201:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:18.9999696Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:19.0002502Z ##[error]AssertionError: expected 'stops-shape at replaceTrack(scene/arm…' to match /^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"stops-shape at replaceTrack(scene/arm).keyframes.nope.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:19.0004101Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:19.0007167Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'stops-shape at replaceTrack(scene/arm…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"stops-shape at replaceTrack(scene/arm).keyframes.nope.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:111:63
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:19.0009004Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:19.0011926Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:45:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:52:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:30:19.0017731Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-22T12:30:09.8686786Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.8687140Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.8728226Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.8728701Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.8728931Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.8729157Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.9764903Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.9765972Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.9766702Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:09.9767033Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6545523Z ##[error]apps/react-demo/src/full-body-project.ts(27,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6556972Z ##[error]apps/react-demo/src/full-body-project.ts(56,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6560959Z ##[error]apps/react-demo/src/full-body-project.ts(85,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6564549Z ##[error]apps/react-demo/src/full-body-project.ts(114,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6567975Z ##[error]apps/react-demo/src/full-body-project.ts(145,9): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6571654Z ##[error]apps/react-demo/src/full-body-project.ts(183,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6575265Z ##[error]apps/react-demo/src/full-body-project.ts(208,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6578927Z ##[error]apps/react-demo/src/full-body-project.ts(233,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6582565Z ##[error]apps/react-demo/src/full-body-project.ts(262,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6586040Z ##[error]apps/react-demo/src/full-body-project.ts(291,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6589596Z ##[error]apps/react-demo/src/full-body-project.ts(320,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6593054Z ##[error]apps/react-demo/src/full-body-project.ts(349,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6596400Z ##[error]apps/react-demo/src/full-body-project.ts(378,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6601856Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(56,33): error TS2345: Argument of type '{ fk: { boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6604597Z   Property 'fk' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6605933Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6608945Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(70,41): error TS2353: Object literal may only specify known properties, and 'boneLength' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6612926Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(82,42): error TS2353: Object literal may only specify known properties, and 'boneLength' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6617162Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(50,7): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6621466Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(60,7): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6625362Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(36,22): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6629292Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(49,39): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6633012Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(111,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6636650Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(32,17): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6640421Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(57,17): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6644067Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(77,17): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6648001Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(58,11): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6651976Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(72,39): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6655817Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(119,26): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6659787Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(136,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6663599Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(147,11): error TS2353: Object literal may only specify known properties, and 'weight' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6667342Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(176,41): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6670219Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(198,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6672454Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(42,24): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6674744Z ##[error]packages/core/test/integration/single-input-channel.test.ts(23,29): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6676948Z ##[error]packages/core/test/integration/single-input-channel.test.ts(28,11): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6680068Z ##[error]packages/core/test/unit/graph/requirement-edge-construction.test.ts(54,13): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6682557Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(59,19): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:30:13.6998505Z ##[error]Process completed with exit code 2.
```
