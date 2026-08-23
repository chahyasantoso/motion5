# CI log archive: 32607576897

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lf-bare-authored-leaf
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32607576897
- Captured: 2026-08-23T00:20:40Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-23T00:20:21.6202421Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.6202801Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.6245870Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.6246399Z env:
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.6246632Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.6246861Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.7289643Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.7290439Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.7290957Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:21.7291215Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.1261924Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.1265862Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.1266296Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6299100Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6526766Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6529395Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6531263Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6532797Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6534523Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6536202Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6537886Z ^[[31m     ^[[31m×^[[31m T-6 rolls the Motion back when the candidate graph rejects it^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6539576Z ^[[31m     ^[[31m×^[[31m T-7 keeps one clock subscription when a Motion is created at runtime^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6891164Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 65^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6902334Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6904403Z      ^[[32m✓^[[39m LF-6 publishes a bare static value and holds it at every progress^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6906329Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6915253Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6936984Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6946253Z ^[[31m     ^[[31m×^[[31m LF-10 closes the static domain instead of leaving it open^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6947969Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6949325Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6950708Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6952196Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6953856Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.6955907Z ^[[31m     ^[[31m×^[[31m LF-16 leaves no authored schema in the repository on the retired form^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9358691Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9360814Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9362817Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9364536Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9365422Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9366192Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9367039Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9367918Z ^[[31m     ^[[31m×^[[31m Y-7 cites the section in a diagnostic about a leaf inside it^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9368821Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9369682Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9370516Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9371360Z      ^[[32m✓^[[39m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9372190Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:22.9373088Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0209419Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m8 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0211250Z      ^[[32m✓^[[39m L-11 accepts the loop fields and names each loop rule by id^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0212565Z      ^[[32m✓^[[39m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0213875Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0215597Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0217143Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0218614Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0219996Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0221372Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0222750Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0224317Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0225575Z      ^[[32m✓^[[39m L-21 keeps loop time running while its Motion is paused^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0505716Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0523201Z ^[[31m     ^[[31m×^[[31m 1. Load valid walker project through Engine with plugin registry^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0525280Z ^[[31m     ^[[31m×^[[31m 2. Render walker nodes through createDomPatchAdapter^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0527142Z ^[[31m     ^[[31m×^[[31m 3. Demonstrate time playback using single injected browser clock^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0529272Z ^[[31m     ^[[31m×^[[31m 4. Demonstrate progress through TriggerPort and manual signals^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0530950Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0536640Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0538473Z ^[[31m     ^[[31m×^[[31m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0540187Z ^[[31m     ^[[31m×^[[31m 8. Show blocked/pending/error diagnostics without crashing the app^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0541701Z ^[[31m     ^[[31m×^[[31m 9. Use React usePatch hook at the React boundary^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.0543180Z ^[[31m     ^[[31m×^[[31m 10. Automated end-to-end integration test passes clean^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.1777075Z  ^[[31m❯^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.1789977Z ^[[31m     ^[[31m×^[[31m LF-1 answers the leaf shape question from one module^[[39m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.1791739Z      ^[[32m✓^[[39m LF-2 leaves no consumer holding a second copy of the check^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.1826808Z ^[[31m     ^[[31m×^[[31m LF-3 makes the compiler and the fake interpolator agree on what a leaf publishes^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.1828930Z ^[[31m     ^[[31m×^[[31m LF-4 moves no diagnostic while the five sites are consolidated^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.2876390Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.3201615Z  ^[[31m❯^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.3207109Z ^[[31m     ^[[31m×^[[31m 1. Engine time playback: project clock tick advances time motion playhead^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.3209374Z ^[[31m     ^[[31m×^[[31m 2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.3211610Z ^[[31m     ^[[31m×^[[31m 3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.3213624Z ^[[31m     ^[[31m×^[[31m 4. Stale scheduled write: paused Motion cancels pending write before scheduler flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.3215972Z ^[[31m     ^[[31m×^[[31m 5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.4213236Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.4233794Z ^[[31m     ^[[31m×^[[31m T-11 gives each trigger type its own input path instead of the manual one^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.4272248Z ^[[31m     ^[[31m×^[[31m T-12 lets seek scrub a driver-backed node and lets the driver overwrite it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.4297227Z      ^[[32m✓^[[39m advances from the one injected clock and rejects control after disposal^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.4308284Z      ^[[32m✓^[[39m cancels queued trigger work when paused and does not duplicate on remount^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.5554273Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.5555760Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.5557334Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.5558484Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.5559461Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.5560458Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.5561415Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.5999025Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6001213Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6002830Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6005066Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6010371Z ^[[31m     ^[[31m×^[[31m U-4 changes nothing when the candidate graph refuses a derived observation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6756803Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6787971Z      ^[[32m✓^[[39m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6797275Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6825330Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6830005Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6831789Z      ^[[32m✓^[[39m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.6834110Z ^[[31m     ^[[31m×^[[31m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[39m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8432352Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8434456Z      ^[[32m✓^[[39m adopts a free track under ~/id and publishes through the ordinary graph path^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8435910Z      ^[[32m✓^[[39m rejects duplicate adopted ids instead of silently replacing membership^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8437494Z      ^[[32m✓^[[39m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8439199Z      ^[[32m✓^[[39m keeps every adopted track independently addressable across sequential adopt and destroy calls^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8440690Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-finite stop positions^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8441932Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-monotonic stop positions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8443154Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with duplicate stop positions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8444606Z      ^[[32m✓^[[39m adopts a track into an existing motion under motionId/trackId^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8445691Z      ^[[32m✓^[[39m rejects adopting into a non-existent motion^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8447208Z      ^[[32m✓^[[39m destroys a motion-adopted track and invokes removeMotionTrack^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8988588Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8990390Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8991550Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8992615Z ^[[31m     ^[[31m×^[[31m rejects external signals without changing progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.8993897Z ^[[31m     ^[[31m×^[[31m coalesces rapid driver ticks to the latest progress^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9005875Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9007515Z ^[[31m     ^[[31m×^[[31m keeps manual signals working and preserves range validation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9025671Z ^[[31m     ^[[31m×^[[31m isolates a throwing clock consumer while preserving other Motion progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9921146Z  ^[[31m❯^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9945441Z ^[[31m     ^[[31m×^[[31m passes contribution context and creates the prepared timeline at load^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9947161Z ^[[31m     ^[[31m×^[[31m selects one predicate contributor through Engine.load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9948741Z ^[[31m     ^[[31m×^[[31m rejects malformed contributions during Engine.load^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9950408Z ^[[31m     ^[[31m×^[[31m rejects authored ease collisions before any timeline is created^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:23.9952312Z ^[[31m     ^[[31m×^[[31m merges contributed keyframes into compiler diagnostics before timeline creation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1079838Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1085517Z ^[[31m     ^[[31m×^[[31m 3.1 drives progress from an injected source and clamps out-of-range emissions^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1087597Z ^[[31m     ^[[31m×^[[31m 3.2 subscribes to the injected source once and unsubscribes exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1089470Z      ^[[32m✓^[[39m 3.3 rejects a missing source with a trigger-driver-unavailable diagnostic^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1091453Z ^[[31m     ^[[31m×^[[31m 3.4 unsubscribes an already resolved source when a later Motion cannot resolve^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1095057Z ^[[31m     ^[[31m×^[[31m registers no clock consumer for a push-driven scroll Motion^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1096785Z ^[[31m     ^[[31m×^[[31m rejects external signals for scroll Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1683363Z  ^[[31m❯^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1685554Z      ^[[32m✓^[[39m 1. Port lifecycle: subscribe, emit, unsubscribe, and resubscribe cleanly^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1687193Z      ^[[32m✓^[[39m 2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1688864Z ^[[31m     ^[[31m×^[[31m 3. Manual and custom trigger ports operate without DOM imports in core^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1690673Z ^[[31m     ^[[31m×^[[31m 4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.1692597Z      ^[[32m✓^[[39m 5. Idempotent teardown: pause, unmount, and dispose cleanly detach ports without leaks^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.2605651Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.2621320Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.2623473Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.2625716Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.2627340Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.3540034Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.3542641Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.3544979Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.3546728Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.4386721Z  ^[[31m❯^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.4397531Z ^[[31m     ^[[31m×^[[31m C-9 keeps a motion-owned track live through replacement^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.4415755Z ^[[31m     ^[[31m×^[[31m C-10 preserves the array index and stagger timing across a replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.4417782Z ^[[31m     ^[[31m×^[[31m C-11 keeps the observation replacement path resolvable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.4475522Z ^[[31m     ^[[31m×^[[31m C-12 disposes every compiled timeline exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.4495798Z ^[[31m     ^[[31m×^[[31m C-13 keeps runtime add and remove in step with the resolver^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.4745456Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.6111610Z  ^[[31m❯^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.6129398Z ^[[31m     ^[[31m×^[[31m 1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.6131313Z ^[[31m     ^[[31m×^[[31m 2. Pause cancels pending scheduled write and prevents Track mutation on flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.6133304Z      ^[[32m✓^[[39m 3. Remount does not duplicate subscriptions or schedule parallel jobs^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.6135060Z      ^[[32m✓^[[39m 4. Clock and trigger paths both retain cancellation behavior on pause^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.6136553Z ^[[31m     ^[[31m×^[[31m 5. Burst signals produce exactly 1 published patch batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7224171Z  ^[[31m❯^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7226312Z ^[[31m     ^[[31m×^[[31m creates a motion, attaches a track, and signals progress from an empty project^[[39m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7227676Z ^[[31m     ^[[31m×^[[31m rejects motion destruction while it still owns tracks, then allows empty destruction^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7229039Z ^[[31m     ^[[31m×^[[31m keeps two runtime motions independently signalable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7231044Z      ^[[32m✓^[[39m rejects duplicate and malformed motion ids without poisoning retries^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7232757Z      ^[[32m✓^[[39m rejects non-empty authored motions without deleting their schema tracks^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7233837Z      ^[[32m✓^[[39m rejects addMotion with pre-populated tracks instead of dropping them^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7394447Z  ^[[31m❯^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7396750Z ^[[31m     ^[[31m×^[[31m covers source spelling across an add and its matching remove^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7398702Z ^[[31m     ^[[31m×^[[31m deduplicates equivalent observations and preserves no-op sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7400539Z ^[[31m     ^[[31m×^[[31m rejects an invalid free-track observation with stable diagnostics^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7402487Z ^[[31m     ^[[31m×^[[31m V-7 refuses an authored target through addObserve on either role^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.7404535Z ^[[31m     ^[[31m×^[[31m J-7 refuses an authored role or projection through addObserve^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.8155503Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.9687067Z  ^[[31m❯^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.9689730Z ^[[31m     ^[[31m×^[[31m does not drive the disposed Track after direct replacement^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.9707346Z ^[[31m     ^[[31m×^[[31m preserves current progress when replacing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.9708470Z ^[[31m     ^[[31m×^[[31m preserves the original array index and stagger timing^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.9709606Z ^[[31m     ^[[31m×^[[31m keeps sibling progress healthy after replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.9710634Z ^[[31m     ^[[31m×^[[31m keeps the observation replacement path live^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:24.9712118Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.0909223Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.0921289Z ^[[31m     ^[[31m×^[[31m ingests authored tracks into the removable store without auto-mounting^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.0923438Z ^[[31m     ^[[31m×^[[31m returns a capability handle and makes stale ABA handles inert^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.0925334Z ^[[31m     ^[[31m×^[[31m replaces a track non-destructively and preserves subscriber identity^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.0927064Z ^[[31m     ^[[31m×^[[31m reads dependants from the committed graph and rejects source removal^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.0928834Z ^[[31m     ^[[31m×^[[31m treats observation changes as replacement of the observer track^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2305416Z  ^[[31m❯^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2307211Z ^[[31m     ^[[31m×^[[31m returns a deeply frozen runtime-owned definition^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2308289Z ^[[31m     ^[[31m×^[[31m isolates caller mutation from the frozen graph definition^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2309210Z ^[[31m     ^[[31m×^[[31m uses the authored validation owner for malformed runtime track structure^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2310575Z ^[[31m     ^[[31m×^[[31m keeps the existing same-source destroy and readopt path working^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2363596Z  ^[[31m❯^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2366176Z ^[[31m     ^[[31m×^[[31m re-registers the compiled Track without throwing on the next Motion update^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2368116Z ^[[31m     ^[[31m×^[[31m preserves the replaced Track index and stagger timing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.2369967Z ^[[31m     ^[[31m×^[[31m updates a Motion-owned Track through observation mutations^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.3346598Z  ^[[31m❯^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.3352864Z ^[[31m     ^[[31m×^[[31m F-10 interpolates grouped leaves without renaming the owning plugin^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.3355282Z ^[[31m     ^[[31m×^[[31m F-11 interpolates a grouped track when the Engine has no plugin registry^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.3357278Z ^[[31m     ^[[31m×^[[31m F-12 publishes identical values for the flat and grouped spellings^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.4632530Z  ^[[31m❯^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.4650819Z ^[[31m     ^[[31m×^[[31m publishes a progress change through the public project handle^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.4652310Z ^[[31m     ^[[31m×^[[31m keeps one clock owner while clock progress publishes once^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.4653789Z ^[[31m     ^[[31m×^[[31m still resolves authored-key plugins during progress updates^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.4655816Z ^[[31m     ^[[31m×^[[31m routes a manual trigger through the public handle into a published patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.5059681Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.5062306Z ^[[31m     ^[[31m×^[[31m H-1 keeps a namespaced derived key out of every published surface^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.5066207Z ^[[31m     ^[[31m×^[[31m H-2 keeps a declared unprefixed internal key out of the patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.5068075Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.5656300Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.6809773Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.7506166Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.7705854Z  ^[[31m❯^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.7738430Z      ^[[32m✓^[[39m adopts a free track and publishes a ready patch via seek^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.7746387Z      ^[[32m✓^[[39m destroyAdopted removes the node from the graph^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.7748343Z ^[[31m     ^[[31m×^[[31m rejects adoption of a track with malformed keyframes^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.7780271Z ^[[31m     ^[[31m×^[[31m adopts a track into an existing motion and receives motion signals^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.9065020Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.9746702Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:25.9826841Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.1818573Z  ^[[31m❯^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.1820485Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before constructing a runtime^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.1821988Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before any timeline is created^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.1823562Z ^[[31m     ^[[31m×^[[31m resolves authored plugin ownership during load, not on the first seek^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.1829527Z ^[[31m     ^[[31m×^[[31m accepts a valid project and creates its timelines during load^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.1859169Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.2267874Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.2269822Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.3699568Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.3806347Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.4752095Z  ^[[31m❯^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.4759840Z ^[[31m     ^[[31m×^[[31m tells subscribers the node was destroyed and reaches them again after re-adoption^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.5801661Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.7597070Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.7676385Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.7683421Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.8249613Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:26.9514774Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.0016243Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.0339176Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.1748267Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2134863Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2176036Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2214691Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2216075Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 127 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2216559Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2227853Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopt-destroy-readopt.test.ts^[[2m > ^[[22madopt -> destroy -> re-adopt lifecycle on the wire (D1)^[[2m > ^[[22mtells subscribers the node was destroyed and reaches them again after re-adoption
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2233897Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2236259Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2310634Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2312402Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2314759Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2316217Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2317366Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2318839Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2320642Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2322136Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2323609Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopt-destroy-readopt.test.ts:^[[2m40:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2324696Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2325277Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2325650Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2327408Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mreturns a deeply frozen runtime-owned definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2330040Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2331946Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2333254Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2334854Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2336529Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2337620Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2338527Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2339783Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2341239Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2342477Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2343784Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m33:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2344634Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2345040Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2345378Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2373235Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22misolates caller mutation from the frozen graph definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2376773Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2378849Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2380240Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2381597Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2383251Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2384562Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2385415Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2386667Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2388150Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2389420Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2390695Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m56:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2391380Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2391778Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2392131Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2394210Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22muses the authored validation owner for malformed runtime track structure
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2397055Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2397882Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2398116Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2398493Z undefined
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2398675Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2398899Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2400194Z "TypeError: property-stops-wrapper at addTrack(broken).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2401134Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2401978Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m79:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2402838Z     ^[[90m 77|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2403602Z     ^[[90m 78|^[[39m     expect(() => handle.adopt(malformed, owner)).toThrow(/observes-sha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2425270Z     ^[[90m 79|^[[39m     expect(() => handle.adopt({ id: "broken", keyframes: { x: ramp(0, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2426431Z     ^[[90m   |^[[39m                                                                                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2427164Z     ^[[90m 80|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2427809Z     ^[[90m 81|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2428269Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2428673Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2429044Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2430941Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mkeeps the existing same-source destroy and readopt path working
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2433695Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2435750Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2437040Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2438668Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2440340Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2441028Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2441593Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2442359Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2443303Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2454492Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2455485Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m89:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2455915Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2456176Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2456420Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2457236Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-finite stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2458572Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2459106Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2459260Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2459516Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2459660Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2459795Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2460506Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2460992Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2461404Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m79:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2461939Z     ^[[90m 77|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2462771Z     ^[[90m 78|^[[39m       runtime.adopt({ id: "bad", keyframes: { x: { stops: [{ p: Number…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2489542Z     ^[[90m 79|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2490570Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2491211Z     ^[[90m 80|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2491813Z     ^[[90m 81|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2492051Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2492411Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2492731Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2494150Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-monotonic stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2495620Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2496194Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2496338Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2496746Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2496959Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2497174Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2498349Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2499207Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2499918Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m100:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2500755Z     ^[[90m 98|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2501298Z     ^[[90m 99|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2502141Z     ^[[90m100|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2502900Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2503603Z     ^[[90m101|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2504840Z     ^[[90m102|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2505346Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2505720Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2505938Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2506748Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with duplicate stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2508034Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2508544Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2508689Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2508931Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2509070Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2509205Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2509892Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2510565Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2511215Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m121:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2512079Z     ^[[90m119|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2512492Z     ^[[90m120|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2513010Z     ^[[90m121|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2513469Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2513899Z     ^[[90m122|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2516492Z     ^[[90m123|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2516809Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2517225Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2517548Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2518696Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/authored-leaf-reader.test.ts^[[2m > ^[[22mone owner for the authored leaf shape^[[2m > ^[[22mLF-1 answers the leaf shape question from one module
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2519937Z ^[[31m^[[1mAssertionError^[[22m: expected { kind: 'wrapper' } to deeply equal { kind: 'animated', stops: [ …(2) ] }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2520365Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2520524Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2520790Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2520929Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2521049Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2521341Z ^[[32m-   "kind": "animated",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2521659Z ^[[32m-   "stops": [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2521939Z ^[[32m-     {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2522204Z ^[[32m-       "p": 0,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2522482Z ^[[32m-       "v": 0,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2522741Z ^[[32m-     },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2522996Z ^[[32m-     {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2523252Z ^[[32m-       "p": 1,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2523529Z ^[[32m-       "v": 10,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2523805Z ^[[32m-     },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2524342Z ^[[32m-   ],^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2524642Z ^[[31m+   "kind": "wrapper",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2524928Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2525055Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2525551Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/authored-leaf-reader.test.ts:^[[2m193:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2526372Z     ^[[90m191|^[[39m     // array the author wrote rather than a filtered copy, because val…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2526952Z     ^[[90m192|^[[39m     ^[[90m// report a bad position at all.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2527539Z     ^[[90m193|^[[39m     expect(leaf.readAuthoredLeaf({ stops: RAMP })).toEqual({ kind: "an…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2528114Z     ^[[90m   |^[[39m                                                    ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2528484Z     ^[[90m194|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2528933Z     ^[[90m195|^[[39m     // `{}` is a deliberately accepted no-op property that `Y-6` alrea…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2529234Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2529477Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2529685Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2530754Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/authored-leaf-reader.test.ts^[[2m > ^[[22mone owner for the authored leaf shape^[[2m > ^[[22mLF-3 makes the compiler and the fake interpolator agree on what a leaf publishes
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2532446Z ^[[31m^[[1mAssertionError^[[22m: compiler, a well formed animated property: expected [] to deeply equal [ 'x' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2533233Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2533435Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2533745Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2533880Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2534112Z ^[[32m- [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2534438Z ^[[32m-   "x",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2534794Z ^[[32m- ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2535137Z ^[[31m+ []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2535327Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2536070Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/authored-leaf-reader.test.ts:^[[2m226:59^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2537227Z     ^[[90m224|^[[39m   it("LF-3 makes the compiler and the fake interpolator agree on what …
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2538458Z     ^[[90m225|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m { what^[[33m,^[[39m authored^[[33m,^[[39m published } ^[[35mof^[[39m ^[[33mPUBLICATION^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2539265Z     ^[[90m226|^[[39m       expect(compiledKeys(authored), `compiler, ${what}`).toEqual(publ…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2539850Z     ^[[90m   |^[[39m                                                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2540406Z     ^[[90m227|^[[39m       // Red on the parent for the two malformed stops. The compiler f…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2541030Z     ^[[90m228|^[[39m       // unparseable position or no value; the fake keeps it and publi…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2541333Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2541580Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2541794Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2542738Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/authored-leaf-reader.test.ts^[[2m > ^[[22mone owner for the authored leaf shape^[[2m > ^[[22mLF-4 moves no diagnostic while the five sites are consolidated
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2544214Z ^[[31m^[[1mAssertionError^[[22m: a leaf that is not a record: expected [] to deeply equal [ 'stops-shape at keyframes.x.stops' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2544981Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2545121Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2545447Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2545647Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2545843Z ^[[32m- [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2546207Z ^[[32m-   "stops-shape at keyframes.x.stops",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2546540Z ^[[32m- ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2546773Z ^[[31m+ []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2546900Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2547395Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/authored-leaf-reader.test.ts:^[[2m238:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2548629Z     ^[[90m236|^[[39m     // than behavior, so the case that would catch it changing behavio…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2549661Z     ^[[90m237|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m { what^[[33m,^[[39m authored^[[33m,^[[39m expected } ^[[35mof^[[39m ^[[33mPARITY^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2550617Z     ^[[90m238|^[[39m       ^[[34mexpect^[[39m(^[[34mruleIdsAndPaths^[[39m(authored)^[[33m,^[[39m what)^[[33m.^[[39m^[[34mtoEqual^[[39m(expected)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2551627Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2552177Z     ^[[90m239|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2552553Z     ^[[90m240|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2552843Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2553101Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2553310Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2554275Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-10 closes the static domain instead of leaving it open
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2555950Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2556559Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2556698Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2556974Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2557107Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2557215Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2557487Z ^[[32m-   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2557946Z ^[[31m+   "keyframes-missing-values-section",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2558841Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2559011Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2559478Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m260:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2560868Z     ^[[90m258|^[[39m     expect(ruleIds({ x: Number.POSITIVE_INFINITY })).toEqual(["stops-s…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2562505Z     ^[[90m259|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m () ^[[33m=>^[[39m ^[[34m1^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2564151Z     ^[[90m260|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m { hold^[[33m:^[[39m ^[[34m1^[[39m } }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2564942Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2565597Z     ^[[90m261|^[[39m     // The shape error cites the property the author wrote, not a `.st…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2566563Z     ^[[90m262|^[[39m     ^[[90m// exists anywhere in the document.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2566825Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2567130Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2567457Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2569007Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-16 leaves no authored schema in the repository on the retired form
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2570836Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(60) ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2571334Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2571557Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2571985Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2572198Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2572388Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2572742Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2573366Z ^[[31m+   "apps/react-demo/src/full-body-project.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2574492Z ^[[31m+   "packages/core/src/contract/authored-leaf.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2575302Z ^[[31m+   "packages/core/src/contract/v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2576108Z ^[[31m+   "packages/core/src/contract/validate-v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2576964Z ^[[31m+   "packages/core/test/contract/adapters.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2578007Z ^[[31m+   "packages/core/test/contract/graph-builder-incremental.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2579031Z ^[[31m+   "packages/core/test/contract/gsap-absolute-stops.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2579999Z ^[[31m+   "packages/core/test/contract/gsap-authored-duration.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2580980Z ^[[31m+   "packages/core/test/contract/gsap-equivalence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2581909Z ^[[31m+   "packages/core/test/contract/gsap-multi-stop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2582477Z ^[[31m+   "packages/core/test/contract/gsap-one-tween.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2583059Z ^[[31m+   "packages/core/test/contract/gsap-paused-timeline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2584328Z ^[[31m+   "packages/core/test/contract/gsap-sparse-percent-map.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2584962Z ^[[31m+   "packages/core/test/contract/ports.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2585658Z ^[[31m+   "packages/core/test/contract/s4-validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2586229Z ^[[31m+   "packages/core/test/contract/v5-validator.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2586970Z ^[[31m+   "packages/core/test/contract/validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2587907Z ^[[31m+   "packages/core/test/integration/adopt-destroy-readopt.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2588797Z ^[[31m+   "packages/core/test/integration/adopted-track-immutability.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2589402Z ^[[31m+   "packages/core/test/integration/adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2590003Z ^[[31m+   "packages/core/test/integration/authored-leaf-reader.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2591035Z ^[[31m+   "packages/core/test/integration/end-to-end.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2591719Z ^[[31m+   "packages/core/test/integration/engine-headless.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2592434Z ^[[31m+   "packages/core/test/integration/engine-load-validation.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2593441Z ^[[31m+   "packages/core/test/integration/engine-x3-contribution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2594670Z ^[[31m+   "packages/core/test/integration/handle-adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2595476Z ^[[31m+   "packages/core/test/integration/internal-key-strip.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2596180Z ^[[31m+   "packages/core/test/integration/issue-114-motion-track-regressions.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2596907Z ^[[31m+   "packages/core/test/integration/keyframe-groups.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2597905Z ^[[31m+   "packages/core/test/integration/motion-trigger-types.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2598769Z ^[[31m+   "packages/core/test/integration/mutation-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2599409Z ^[[31m+   "packages/core/test/integration/observation-identity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2600048Z ^[[31m+   "packages/core/test/integration/option-c-track-resolution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2600714Z ^[[31m+   "packages/core/test/integration/per-plugin-key-ownership.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2601343Z ^[[31m+   "packages/core/test/integration/phase0-red-baseline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2601989Z ^[[31m+   "packages/core/test/integration/phase2-motion-scheduling.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2602598Z ^[[31m+   "packages/core/test/integration/phase3-trigger-port.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2603213Z ^[[31m+   "packages/core/test/integration/phase4-dynamic-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2603826Z ^[[31m+   "packages/core/test/integration/phase7-walker-demo.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2605008Z ^[[31m+   "packages/core/test/integration/plugin-group-values-section.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2606148Z ^[[31m+   "packages/core/test/integration/plugin-owned-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2607237Z ^[[31m+   "packages/core/test/integration/replace-motion-track.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2608375Z ^[[31m+   "packages/core/test/integration/replace-track-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2609084Z ^[[31m+   "packages/core/test/integration/runtime-motion-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2610053Z ^[[31m+   "packages/core/test/integration/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2610915Z ^[[31m+   "packages/core/test/integration/t4-runtime-motion-parity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2611629Z ^[[31m+   "packages/core/test/integration/trigger-scroll.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2612411Z ^[[31m+   "packages/core/test/integration/trigger-time-loop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2613198Z ^[[31m+   "packages/core/test/integration/trigger-time.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2613812Z ^[[31m+   "packages/core/test/integration/unified-mutation-surface.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2614714Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-completeness.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2615856Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-contract.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2616668Z ^[[31m+   "packages/core/test/unit/domain/plugin-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2617245Z ^[[31m+   "packages/core/test/unit/domain/plugins.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2617857Z ^[[31m+   "packages/core/test/unit/domain/s7-plugin-evidence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2618859Z ^[[31m+   "packages/core/test/unit/graph/incremental-cache.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2619687Z ^[[31m+   "packages/core/test/unit/graph/requirement-edge-construction.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2620329Z ^[[31m+   "packages/core/test/unit/graph/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2621033Z ^[[31m+   "packages/core/test/unit/runtime/composition-output-shape.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2622043Z ^[[31m+   "packages/react/test/public-hook-render.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2622455Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2622659Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2623154Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m344:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2624212Z     ^[[90m342|^[[39m     // be red for a fixture that authors the retired form, but a fixtu…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2625249Z     ^[[90m343|^[[39m     // and that is the one that reads as an accepted second shape late…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2626577Z     ^[[90m344|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2627512Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2628059Z     ^[[90m345|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2628535Z     ^[[90m346|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2628796Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2629173Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2629491Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2631002Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2633273Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2636406Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2637550Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2638885Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2639975Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2640628Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2641483Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2642435Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2643429Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2644691Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2645231Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2645601Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2645931Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2647261Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mpublishes a progress change through the public project handle
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2649647Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2651314Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2652421Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2653717Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2655216Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2655961Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2656482Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2657073Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2657679Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2658361Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m38:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2658701Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2658936Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2659137Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2659888Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mkeeps one clock owner while clock progress publishes once
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2661602Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2662777Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2663458Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2664916Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2665774Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2666201Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2666743Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2667687Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2668511Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2669233Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m60:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2669653Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2670071Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2670373Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2671303Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mstill resolves authored-key plugins during progress updates
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2672985Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2674728Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2675847Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2677217Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2678377Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2679069Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2679954Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2680953Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2681955Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2683117Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m79:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2683703Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2684322Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2684671Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2686121Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mroutes a manual trigger through the public handle into a published patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2688587Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2689694Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2690813Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2692169Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2693106Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2693781Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2694886Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2695532Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2696181Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2696878Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m94:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2697218Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2697456Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2697667Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2698692Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before constructing a runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2700110Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2700638Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2700780Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2701043Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2701180Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2701326Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2702083Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2702619Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2703090Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m31:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2703807Z     ^[[90m 29|^[[39m     const invalid = projectWith({ opacity: { stops: [{ p: Number.NaN, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2704399Z     ^[[90m 30|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2704849Z     ^[[90m 31|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2705404Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2706056Z     ^[[90m 32|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2706572Z     ^[[90m 33|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2706748Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2706977Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2707201Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2708218Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2709629Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2710162Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2710301Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2710553Z /stop-position-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2710695Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2710822Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2711551Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2712299Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2712810Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m48:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2713834Z     ^[[90m 46|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2714447Z     ^[[90m 47|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2715178Z     ^[[90m 48|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2716067Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2717106Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2717937Z     ^[[90m 50|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2718207Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2718577Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2718921Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2720761Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mresolves authored plugin ownership during load, not on the first seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2723247Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2724375Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2724628Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2725026Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2725263Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2725474Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2726665Z "property-stops-wrapper at motions[0].tracks[0].keyframes.unknown: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2727538Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2728305Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m65:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2729259Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2730161Z     ^[[90m 64|^[[39m       engine.load(projectWith({ unknown: { stops: [{ p: 0, v: 0 }] } }…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2731241Z     ^[[90m 65|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-unknown-key/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2732015Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2732996Z     ^[[90m 66|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2733874Z     ^[[90m 67|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2734645Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2735072Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2735424Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2737153Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22maccepts a valid project and creates its timelines during load
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2739820Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2741490Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2742621Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2744109Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2745204Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2745878Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2746739Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2747713Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2748692Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2749921Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m74:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2750816Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2751193Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2751521Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2753306Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mpasses contribution context and creates the prepared timeline at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2755464Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2756446Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2757129Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2757926Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2758591Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2759018Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2759554Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2760143Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2760741Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2761475Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m38:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2761830Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2762077Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2762285Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2763237Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mselects one predicate contributor through Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2764958Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2765924Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2766615Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2767401Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2768076Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2768500Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2769019Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2769629Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2770239Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2771254Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m75:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2771839Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2772073Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2772291Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2773461Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects malformed contributions during Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2775259Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2775894Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2776139Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2776656Z /plugin-contribution-stop-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2776882Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2777013Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2777938Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2778830Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2779671Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m108:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2780922Z     ^[[90m106|^[[39m         ^[[34mprojectWith^[[39m({ x^[[33m:^[[39m ^[[34mproperty^[[39m(^[[34m1^[[39m) }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2781491Z     ^[[90m107|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2782067Z     ^[[90m108|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-stop-order/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2782572Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2783144Z     ^[[90m109|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2783642Z     ^[[90m110|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2783815Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2784309Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2784636Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2786191Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects authored ease collisions before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2787721Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2788332Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2788476Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2788775Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2788975Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2789110Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2790375Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2791302Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2791757Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2792370Z     ^[[90m131|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2792755Z     ^[[90m132|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2793346Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2793873Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2794564Z     ^[[90m134|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2795072Z     ^[[90m135|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2795237Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2795477Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2795685Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2797013Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mmerges contributed keyframes into compiler diagnostics before timeline creation
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2799163Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2800092Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2800326Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2800628Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2800885Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2801105Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2801814Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2802320Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2803131Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m170:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2804150Z     ^[[90m168|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2804737Z     ^[[90m169|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2805981Z     ^[[90m170|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2806983Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2807838Z     ^[[90m171|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2808504Z     ^[[90m172|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2808709Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2808957Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2809174Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2810261Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22mrejects adoption of a track with malformed keyframes
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2811843Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2812385Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2812629Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2813056Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2813216Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2813354Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2814340Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2814835Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2815271Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m57:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2816100Z     ^[[90m 55|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2816510Z     ^[[90m 56|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2817490Z     ^[[90m 57|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m handle^[[33m.^[[39m^[[34madopt^[[39m(bad^[[33m,^[[39m owner))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2818235Z     ^[[90m   |^[[39m                                            ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2818987Z     ^[[90m 58|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2819528Z     ^[[90m 59|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2819693Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2820084Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2820301Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2821229Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22madopts a track into an existing motion and receives motion signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2823223Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2824675Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2825904Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2827200Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2828814Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2829891Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2830748Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2831959Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2833344Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2834673Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2835832Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m69:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2836393Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2836758Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2837096Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2839152Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-1 keeps a namespaced derived key out of every published surface
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2841995Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2843602Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2844835Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2846144Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2847223Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2847896Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2848757Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2849731Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2850725Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2851944Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2853257Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m42:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2853850Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2854363Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2854695Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2856401Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-2 keeps a declared unprefixed internal key out of the patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2858962Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2860596Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2861687Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2862997Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2864213Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2864893Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2865707Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2866304Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2867196Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2868115Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2868936Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2869293Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2869625Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2869975Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2871281Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2872978Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2874678Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2875780Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2876731Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2877408Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2877824Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2878350Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2878939Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2879534Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2880285Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2881059Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m84:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2881421Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2881644Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2881854Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2882877Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mdoes not drive the disposed Track after direct replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2884533Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2885534Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2886210Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2887011Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2887704Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2888119Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2888645Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2889244Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2889849Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2890672Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2891591Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m41:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2891995Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2892225Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2892432Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2893382Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves current progress when replacing
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2895248Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2896206Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2896883Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2897962Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2898889Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2899318Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2899842Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2900648Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2901455Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2902430Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2903547Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m56:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2904417Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2904784Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2905104Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2906836Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves the original array index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2911709Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2915019Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2916112Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2917410Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2918505Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2919161Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2920001Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2920975Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2921964Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2923296Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2924977Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m72:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2925661Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2926014Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2926344Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2928001Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps sibling progress healthy after replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2931679Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2934532Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2935610Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2936894Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2937984Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2938638Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2939479Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2940459Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2941412Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2942762Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2944433Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m86:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2945102Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2945468Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2945795Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2947418Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps the observation replacement path live
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2951062Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2953414Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2954614Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2955908Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2956994Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2957652Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2958498Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2959469Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2960453Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2961714Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2963139Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m103:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2963801Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2964373Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2964687Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2966331Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-10 interpolates grouped leaves without renaming the owning plugin
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2970518Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2973577Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2975037Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2976402Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2977534Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2978195Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2979040Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2980004Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2980971Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2982143Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2983400Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m56:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2984097Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2984467Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2984793Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2986455Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-11 interpolates a grouped track when the Engine has no plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2989189Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2991026Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2992169Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2993113Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2993815Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2994407Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2994932Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2995898Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2996900Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2998118Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2999367Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m70:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.2999948Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3000322Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3000646Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3002246Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-12 publishes identical values for the flat and grouped spellings
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3005047Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3006566Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3007512Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3008416Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3009470Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3010327Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3011264Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3012045Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3013031Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3014348Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3015201Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m81:18^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3015778Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3016076Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3016280Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3017286Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-11 gives each trigger type its own input path instead of the manual one
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3019383Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3020900Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3021997Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3022968Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3024221Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3024699Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3025520Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3026319Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3027186Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3028162Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3029488Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m104:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3029907Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3030263Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3030587Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3032043Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-12 lets seek scrub a driver-backed node and lets the driver overwrite it
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3034431Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3035954Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3037054Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3038083Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3039033Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3039458Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3039988Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3040592Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3041354Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3042128Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3043233Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m123:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3043736Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3044158Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3044508Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3046321Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3051041Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3053874Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3055317Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3056178Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3057156Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3057800Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3058508Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3059645Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3060990Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3061993Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3062964Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3063354Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3063593Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3064205Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3065300Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3067621Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3068693Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3069128Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3069773Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3070206Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3070440Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3071958Z "property-stops-wrapper at addTrack(child).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3072879Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3073819Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m118:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3075129Z     ^[[90m116|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3075844Z     ^[[90m117|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3095046Z     ^[[90m118|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-un…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3095987Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3096387Z     ^[[90m119|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3096889Z     ^[[90m120|^[[39m     const replacement = handle.adopt({ id: "child", keyframes: { x: ra…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3097402Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3098049Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3098346Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3099704Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3101828Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3102560Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3102790Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3103203Z /observation-self-reference/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3103456Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3103586Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3104587Z "property-stops-wrapper at addTrack(self).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3105097Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3105891Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m140:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3106649Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3107095Z     ^[[90m139|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3107858Z     ^[[90m140|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-se…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3108486Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3109436Z     ^[[90m141|^[[39m     const replacement = handle.adopt({ id: "self", keyframes: { x: ram…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3110316Z     ^[[90m142|^[[39m     ^[[34mexpect^[[39m(replacement^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"~/self"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3110964Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3111331Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3111554Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3112833Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mcovers source spelling across an add and its matching remove
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3115664Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3117682Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3118770Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3119785Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3120818Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3121461Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3122280Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3123169Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3124244Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3125404Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3126740Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3127105Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3127344Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3127554Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3128451Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mdeduplicates equivalent observations and preserves no-op sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3130550Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3132352Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3133028Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3133830Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3134742Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3135162Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3135695Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3136284Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3136904Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3137686Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3138537Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m75:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3138897Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3139125Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3139327Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3140207Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mrejects an invalid free-track observation with stable diagnostics
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3143439Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3145599Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3146299Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3147117Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3147787Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3148209Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3148752Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3149343Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3149956Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3150744Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3151576Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m89:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3151948Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3152277Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3152609Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3154311Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mV-7 refuses an authored target through addObserve on either role
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3156926Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3158571Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3159437Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3160247Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3160925Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3161345Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3161877Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3162507Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3163127Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3163907Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3164981Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3165359Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3165592Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3165801Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3166688Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mJ-7 refuses an authored role or projection through addObserve
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3168783Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3170403Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3171109Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3171915Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3172607Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3173024Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3173539Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3174286Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3174910Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3175678Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3176505Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3176880Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3177119Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3177328Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3178409Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-9 keeps a motion-owned track live through replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3179994Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3181391Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3182150Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3182960Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3183866Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3184557Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3185232Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3185832Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3186717Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3188037Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3189527Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m60:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3190123Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3190384Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3190591Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3191720Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-10 preserves the array index and stagger timing across a replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3194846Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3196650Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3197340Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3198147Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3198828Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3199257Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3199772Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3200358Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3200965Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3201732Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3202571Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m73:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3202946Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3203183Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3203390Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3204639Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-11 keeps the observation replacement path resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3206839Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3208212Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3208881Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3209682Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3210348Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3210990Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3211645Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3212243Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3212849Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3213628Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3214655Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m88:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3215041Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3215286Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3215487Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3216515Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-12 disposes every compiled timeline exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3218679Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3220080Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3220741Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3221530Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3222191Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3222607Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3223137Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3223729Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3224517Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3225299Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3226146Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m104:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3226526Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3226764Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3226965Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3228457Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-13 keeps runtime add and remove in step with the resolver
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3231003Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3232208Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3232895Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3233703Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3234538Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3234961Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3235492Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3236089Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3236702Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3237474Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3238339Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m113:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3238717Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3238948Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3239164Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3240113Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3244800Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3247787Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3248453Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3249247Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3249913Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3250328Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3250870Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3251448Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3252040Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3252789Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3253648Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3254148Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3254379Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3254576Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3255499Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3257056Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3257809Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3257955Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3258216Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3258373Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3258513Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3261815Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3264448Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3264936Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m123:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3265662Z     ^[[90m121|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3266311Z     ^[[90m122|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3266946Z     ^[[90m123|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3267511Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3268074Z     ^[[90m124|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3268533Z     ^[[90m125|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3268719Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3268953Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3269163Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3270159Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3274761Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3277811Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3278490Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3279300Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3279972Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3280399Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3280923Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3281662Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3282390Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3283153Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3284178Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m128:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3284583Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3284820Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[58/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3285019Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3286906Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m1. Engine time playback: project clock tick advances time motion playhead
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3289117Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3290146Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3290844Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3291654Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3292327Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3292746Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3293268Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3293878Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3294638Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3295378Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m40:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3295758Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3296002Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[59/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3296202Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3297394Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3299673Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3301046Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3301729Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3302536Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3303203Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3303627Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3304383Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3304980Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3305600Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3306800Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m98:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3307416Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3307801Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[60/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3308447Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3309920Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3311746Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3312847Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3313612Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3314770Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3315744Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3316399Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3317095Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3317873Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3318707Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3319532Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m142:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3319921Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3320253Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[61/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3320573Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3322058Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m4. Stale scheduled write: paused Motion cancels pending write before scheduler flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3324998Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3326664Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3327819Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3329228Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3330396Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3331069Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3331906Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3332865Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3333856Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3335205Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m199:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3335802Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3336162Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[62/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3336488Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3338507Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3341283Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3342890Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3344348Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3345839Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3346969Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3347643Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3348183Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3348784Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3349403Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3350134Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m245:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3350484Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3350738Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[63/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3350941Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3352032Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3353614Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3354769Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3355438Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3356219Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3356878Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3357304Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3357828Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3358410Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3359013Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3359742Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3360113Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3360341Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[64/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3360557Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3361591Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m2. Pause cancels pending scheduled write and prevents Track mutation on flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3363496Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3364965Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3365674Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3366452Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3367126Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3367540Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3368046Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3368612Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3369477Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3370205Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m78:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3370724Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3370954Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[65/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3371160Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3372145Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m5. Burst signals produce exactly 1 published patch batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3373632Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3374816Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3375488Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3376351Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3377062Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3377482Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3378002Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3378597Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3379197Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3379983Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m168:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3380389Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3380633Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[66/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3380845Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3381876Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m3. Manual and custom trigger ports operate without DOM imports in core
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3383526Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3384789Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3385595Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3386467Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3387176Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3387622Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3388188Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3388823Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3389480Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3390272Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m109:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3390650Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3390877Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[67/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3391105Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3392350Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3394294Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3395548Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3396414Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3397270Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3398076Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3398524Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3399104Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3399776Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3400436Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3401216Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m136:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3401622Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3401891Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[68/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3402138Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3403371Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3405430Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3406044Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3406203Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3406481Z /stop-position|monoton/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3406662Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3406818Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3407552Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3408108Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3408649Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m172:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3409261Z     ^[[90m170|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3409578Z     ^[[90m171|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3410088Z     ^[[90m172|^[[39m     expect(() => runtime.adopt(badTrack, {})).toThrow(/stop-position|m…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3410717Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3411096Z     ^[[90m173|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3411570Z     ^[[90m174|^[[39m     ^[[90m// Graph state byte-identical after failed adoption^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3411898Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3412178Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[69/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3412388Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3413418Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m1. Load valid walker project through Engine with plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3420016Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3424961Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3425712Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3426607Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3427347Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3427803Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3428391Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3429028Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3429721Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3430485Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m145:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3430897Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3431152Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[70/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3431378Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3432471Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m2. Render walker nodes through createDomPatchAdapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3438966Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3444279Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3445154Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3446145Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3446990Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3447540Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3448200Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3448921Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3449686Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3450614Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m164:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3451038Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3451306Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[71/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3451641Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3452769Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m3. Demonstrate time playback using single injected browser clock
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3463630Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3468727Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3469593Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3470499Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3471256Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3471704Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3472282Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3472940Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3473722Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3474834Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m199:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3475223Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3475492Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[72/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3475703Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3476717Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m4. Demonstrate progress through TriggerPort and manual signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3483062Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3487623Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3488625Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3489703Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3490419Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3490880Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3491251Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3491564Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3491950Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3492414Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m219:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3492426Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3492681Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[73/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3492701Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3493699Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3499568Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3499994Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3500371Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3500862Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3501141Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3501303Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3501988Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3502658Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3503240Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3504265Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m243:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3504288Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3504582Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[74/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3504591Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3505676Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3510897Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3511332Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3511701Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3512184Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3512456Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3512614Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3512966Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3513252Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3513618Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3514238Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m269:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3514257Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3514498Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[75/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3514515Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3515490Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m7. Mount, unmount, remount, and dispose without duplicate subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3520725Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3521453Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3521810Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3522286Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3522561Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3522727Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3523077Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3523348Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3523686Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3524468Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m305:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3524482Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3524783Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[76/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3524794Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3526155Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m8. Show blocked/pending/error diagnostics without crashing the app
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3531667Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3532085Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3532434Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3532910Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3533174Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3533328Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3533663Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3554251Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3555215Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3555904Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m330:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3556095Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3556448Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[77/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3556462Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3557861Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3567157Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3567872Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3568459Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3569275Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3569770Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3570034Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3570633Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3571095Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3571677Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3572419Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m351:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3572434Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3572806Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[78/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3572819Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3574544Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m10. Automated end-to-end integration test passes clean
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3583755Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3584871Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3585424Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3586228Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3586667Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3586905Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3587456Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3587953Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3588545Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3589287Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m387:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3589314Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3589712Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[79/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3589726Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3591611Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3593023Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3593415Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3593794Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3594666Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3595062Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3595285Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3595791Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3596192Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3596718Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3597470Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3598261Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m147:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3598293Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3598630Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[80/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3598644Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3600337Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-7 cites the section in a diagnostic about a leaf inside it
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3601124Z ^[[31m^[[1mAssertionError^[[22m: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3601141Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3601353Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3601525Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3601804Z   "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3602018Z   "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3602150Z }
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3602162Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3602378Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3602802Z [
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3602921Z   {
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3603446Z     "message": "The { stops: [...] } wrapper is retired; author the stops array directly as the value.",
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3603859Z     "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3604288Z     "ruleId": "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3604438Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3604578Z   },
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3604711Z ]
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3604724Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3605543Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m214:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3606058Z     ^[[90m212|^[[39m   it("Y-7 cites the section in a diagnostic about a leaf inside it", (…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3606574Z     ^[[90m213|^[[39m     const authored = { fk: { values: { length: { stops: [{ p: 2, v: 1 …
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3607186Z     ^[[90m214|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3607548Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3607971Z     ^[[90m215|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3608528Z     ^[[90m216|^[[39m         ruleId^[[33m:^[[39m ^[[32m"stop-position-range"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3608545Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3608956Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[81/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3608974Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3610733Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3611481Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'property-stops-wrapper' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3611496Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3611697Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3611900Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3611912Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3612067Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3612252Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3612565Z ^[[31m+   "property-stops-wrapper",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3612748Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3612773Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3613561Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m228:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3614612Z     ^[[90m226|^[[39m     // a property called `values` that `fk` claims, and nothing about …
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3615775Z     ^[[90m227|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m { fk^[[33m:^[[39m { values^[[33m:^[[39m { values^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } } }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3616498Z     ^[[90m228|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m(authored))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3616852Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3617044Z     ^[[90m229|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3617630Z     ^[[90m230|^[[39m     const resolved = registry(passthrough).resolveForKeyframes(authore…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3617666Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3618062Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[82/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3618109Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3619906Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3629333Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3630545Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3631107Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3631889Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3632316Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3632547Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3633091Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3633514Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3634324Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3635160Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3636018Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m278:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3636042Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3636440Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[83/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3636456Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3638335Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3645089Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3645757Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3646301Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3647052Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3647443Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3647681Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3648206Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3648640Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3649187Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3650021Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3651077Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3651243Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3651621Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[84/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3651638Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3653512Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3660982Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3661691Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3662272Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3663089Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3663525Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3663789Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3664536Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3665051Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3665632Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3666463Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3667234Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3667259Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3667604Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[85/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3667619Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3669180Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3670460Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3670500Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3670706Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3670889Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3670901Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3671102Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3676687Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3677042Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3677870Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m146:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3678162Z     ^[[90m144|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3678406Z     ^[[90m145|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3678977Z     ^[[90m146|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3679406Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3679639Z     ^[[90m147|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3679821Z     ^[[90m148|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3679834Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3680202Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[86/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3680215Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3681923Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3687439Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3688207Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3688829Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3689670Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3690111Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3690353Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3690909Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3691337Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3691862Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3692616Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3693396Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m162:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3693425Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3693800Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[87/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3693825Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3695780Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3700764Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3701869Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3702503Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3703307Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3703693Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3703863Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3704431Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3704738Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3705098Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3705609Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3706085Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m192:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3706095Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3706336Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[88/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3706346Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3707343Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3708098Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3708117Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3708253Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3708396Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3708411Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3708545Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3711756Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3711781Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3712263Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m213:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3712439Z     ^[[90m211|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3712599Z     ^[[90m212|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3712944Z     ^[[90m213|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3713203Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3713353Z     ^[[90m214|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3713507Z     ^[[90m215|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3713515Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3713745Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[89/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3713754Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3715112Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mre-registers the compiled Track without throwing on the next Motion update
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3716093Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3716673Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3717034Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3717523Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3717787Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3717954Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3718308Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3718591Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3718923Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3719371Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m27:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3719382Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3719611Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[90/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3719620Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3720480Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mpreserves the replaced Track index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3722541Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3722938Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3723285Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3723757Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3724199Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3724358Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3724697Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3724969Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3725290Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3725724Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m64:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3725742Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3725964Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[91/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3725973Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3726859Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mupdates a Motion-owned Track through observation mutations
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3728275Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3728636Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3729128Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3729602Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3729989Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3730144Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3730484Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3730761Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3731088Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3731504Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m91:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3731514Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3731737Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[92/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3731753Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3732779Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3733556Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3733914Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3734419Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3734890Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3735148Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3735301Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3735647Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3735927Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3736251Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3736761Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3737347Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3737361Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3737681Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[93/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3737693Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3738936Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3739904Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3740427Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3740795Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3741284Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3741548Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3741718Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3742064Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3742348Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3742692Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3743228Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3743727Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m113:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3743737Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3744145Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[94/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3744159Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3745618Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3746432Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3746839Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3747203Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3747686Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3747968Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3748135Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3748483Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3748775Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3749130Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3749657Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3750160Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3750176Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3750403Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[95/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3750417Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3751498Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-4 changes nothing when the candidate graph refuses a derived observation
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3752302Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3752680Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3753034Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3753684Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3754285Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3754453Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3754793Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3755074Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3755421Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3755935Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3756418Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m143:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3756440Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3756664Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[96/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3756682Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3757694Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mcreates a motion, attaches a track, and signals progress from an empty project
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3758479Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3758973Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3759328Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3759801Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3760383Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3760572Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3760932Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3761345Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3761824Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3762168Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3762626Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m42:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3762635Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3762870Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[97/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3762878Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3763902Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mrejects motion destruction while it still owns tracks, then allows empty destruction
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3764857Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3765342Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3765698Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3766155Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3766725Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3766892Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3767408Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3767942Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3768410Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3768741Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3769197Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m58:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3769205Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3769435Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[98/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3769443Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3770351Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mkeeps two runtime motions independently signalable
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3771111Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3771607Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3771957Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3772413Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3772984Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3773145Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3773498Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3773897Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3774538Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3774869Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3775324Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m74:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3775334Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3775561Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[99/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3775569Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3776580Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3780375Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3780769Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3781127Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3781614Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3782038Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3782316Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3782671Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3782952Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3783295Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3783745Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m45:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3784376Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m52:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3784388Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3784619Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[100/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3784629Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3785702Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3786501Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3786878Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3787238Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3787716Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3787973Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3788139Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3788490Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3788777Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3789103Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3789588Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m153:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3790044Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m175:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3790054Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3790297Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[101/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3790305Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3791281Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-6 rolls the Motion back when the candidate graph rejects it
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3792057Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3792559Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3792915Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3793366Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3794100Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3794270Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3794629Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3795038Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3795676Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3796146Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3796596Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m360:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3796606Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3796818Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[102/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3796833Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3797838Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-7 keeps one clock subscription when a Motion is created at runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3798590Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3799072Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3799423Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3799936Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3800827Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3801080Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3801470Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3801959Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3802561Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3803015Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3803509Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m397:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3803518Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3803820Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[103/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3803829Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3804990Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.1 drives progress from an injected source and clamps out-of-range emissions
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3805984Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3806409Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3806857Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3807423Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3807809Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3808033Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3808466Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3808828Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3809236Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3809779Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3810296Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m76:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3810464Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3810777Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[104/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3810904Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3811850Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.2 subscribes to the injected source once and unsubscribes exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3812650Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3813178Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3813609Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3814355Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3814662Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3814950Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3815416Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3815785Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3816160Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3816645Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3817194Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m99:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3817204Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3817513Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[105/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3817522Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3832978Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.4 unsubscribes an already resolved source when a later Motion cannot resolve
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3834215Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3834243Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3834412Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3834550Z /trigger-driver-unavailable/
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3834560Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3834697Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3835869Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3835880Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3836326Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3836547Z     ^[[90m131|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3836906Z     ^[[90m132|^[[39m       load(resolve, [scrollMotion("hero", "hero"), scrollMotion("orpha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3837306Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/trigger-driver-unavailable/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3837467Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3837585Z     ^[[90m134|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3838039Z     ^[[90m135|^[[39m     ^[[34mexpect^[[39m(hero^[[33m.^[[39msubscriptions)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3838049Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3838294Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[106/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3838302Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3839116Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mregisters no clock consumer for a push-driven scroll Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3839924Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3840617Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3841142Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3841635Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3841900Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3842069Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3842413Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3842703Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3843040Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3843471Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3843877Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m141:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3843892Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3844238Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[107/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3844253Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3844970Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mrejects external signals for scroll Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3845761Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3846144Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3846501Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3846987Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3847273Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3847446Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3847786Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3848069Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3848417Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3848841Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3849228Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m163:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3849244Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3849461Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[108/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3849469Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3850272Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3850659Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3850667Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3850801Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3850927Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3850934Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3851049Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3851174Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3851182Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3851588Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3851924Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3852087Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3852509Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3852875Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3853228Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3853516Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3853524Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3853757Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[109/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3853765Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3854811Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3855641Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3856031Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3856386Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3856869Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3857145Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3857310Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3857654Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3857926Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3858262Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3858714Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3859129Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3859146Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3859366Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[110/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3859375Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3860237Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3861023Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3861401Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3861742Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3862211Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3862473Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3862642Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3862973Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3863251Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3863580Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3864164Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3864571Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3864579Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3864797Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[111/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3864805Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3865670Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3867283Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3867775Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3868121Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3868592Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3868851Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3869004Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3869340Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3869663Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3869994Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3870420Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3870835Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3870846Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3871065Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[112/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3871074Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3871897Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3872665Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3873038Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3873392Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3873860Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3874214Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3874374Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3874709Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3874975Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3875294Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3875718Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3875728Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3875954Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[113/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3875962Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3876807Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3877567Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3877927Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3878261Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3878723Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3879129Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3879412Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3879750Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3880022Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3880336Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3880767Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3881187Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3881196Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3881415Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[114/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3881423Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3882216Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3883033Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3883414Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3883767Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3884390Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3884659Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3884820Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3885158Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3885443Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3885790Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3886229Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3886644Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3886652Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3886868Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[115/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3886885Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3887718Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3889168Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3889793Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3890134Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3890606Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3890870Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3891034Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3891372Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3891639Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3891974Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3892424Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3892844Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3892859Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3893079Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[116/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3893087Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3893866Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3894785Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3895160Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3895503Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3895990Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3896268Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3896430Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3896762Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3897042Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3897371Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3897839Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3898229Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m39:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3898246Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3898477Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[117/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3898486Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3899217Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3899998Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3900372Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3900720Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3901193Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3901455Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3901758Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3902099Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3902498Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3902824Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3903294Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3903681Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3903690Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3903917Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[118/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3904046Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3904824Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mrejects external signals without changing progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3905611Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3905989Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3906334Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3906795Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3907055Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3907221Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3907555Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3907825Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3908161Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3908627Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3909012Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m66:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3909022Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3909236Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[119/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3909252Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3910029Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mcoalesces rapid driver ticks to the latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3910800Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3911164Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3911506Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3911977Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3912232Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3912389Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3912720Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3912985Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3913303Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3913752Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3914215Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m78:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3914363Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3914579Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[120/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3914706Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3915555Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mkeeps manual signals working and preserves range validation
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3916327Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3916688Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3917032Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3917499Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3917768Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3917921Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3918268Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3918542Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3918870Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3919251Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m113:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3919268Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3919480Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[121/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3919488Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3920400Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22misolates a throwing clock consumer while preserving other Motion progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3921180Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3921552Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3921897Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3922366Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3922626Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3922777Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3923119Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3923396Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3923724Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3924214Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m152:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3924237Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3924453Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[122/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3924461Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3925462Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mingests authored tracks into the removable store without auto-mounting
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3926874Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3927243Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3927720Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3928311Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3928569Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3928731Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3929070Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3929333Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3929661Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3930173Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m28:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3930629Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m33:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3930646Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3930860Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[123/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3930873Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3931816Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreturns a capability handle and makes stale ABA handles inert
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3932567Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3933058Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3933402Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3933866Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3934591Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3934771Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3935121Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3935549Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3936055Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3936407Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3936862Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m53:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3936872Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3937103Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[124/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3937123Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3938117Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreplaces a track non-destructively and preserves subscriber identity
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3938894Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3939376Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3939737Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3940201Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3940776Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3941150Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3941625Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3942030Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3942519Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3942867Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3943315Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m64:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3943325Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3943551Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[125/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3943559Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3944666Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreads dependants from the committed graph and rejects source removal
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3945449Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3945920Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3946268Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3946721Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3947287Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3947450Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3947808Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3948211Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3948699Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3949040Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3949497Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3949506Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3949727Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[126/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3949735Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3950703Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mtreats observation changes as replacement of the observer track
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3951466Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3951948Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3952294Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3952738Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3953288Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3953456Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3953799Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3954309Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3954927Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3955396Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3955856Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m90:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3955865Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3956088Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[127/127]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3956095Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3956116Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3956568Z ^[[2m Test Files ^[[22m ^[[1m^[[31m34 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m23 passed^[[39m^[[22m^[[90m (57)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3957002Z ^[[2m      Tests ^[[22m ^[[1m^[[31m127 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m114 passed^[[39m^[[22m^[[90m (241)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3957190Z ^[[2m   Start at ^[[22m 00:20:22
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3957681Z ^[[2m   Duration ^[[22m 5.08s^[[2m (transform 1.33s, setup 444ms, import 4.04s, tests 1.01s, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3957699Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3957705Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3981027Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopt-destroy-readopt.test.ts:40:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3987277Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3991051Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:33:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3991640Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3995136Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:56:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3995571Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3998555Z ##[error]AssertionError: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"TypeError: property-stops-wrapper at addTrack(broken).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:79:91
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.3998998Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4002188Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:89:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4002612Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4005559Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:79:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4006018Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4008743Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:100:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4009554Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4012234Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:121:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4012670Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4015408Z ##[error]AssertionError: expected { kind: 'wrapper' } to deeply equal { kind: 'animated', stops: [ …(2) ] }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "kind": "animated",
integration (node 24)	Run npm run test:integration	-   "stops": [
integration (node 24)	Run npm run test:integration	-     {
integration (node 24)	Run npm run test:integration	-       "p": 0,
integration (node 24)	Run npm run test:integration	-       "v": 0,
integration (node 24)	Run npm run test:integration	-     },
integration (node 24)	Run npm run test:integration	-     {
integration (node 24)	Run npm run test:integration	-       "p": 1,
integration (node 24)	Run npm run test:integration	-       "v": 10,
integration (node 24)	Run npm run test:integration	-     },
integration (node 24)	Run npm run test:integration	-   ],
integration (node 24)	Run npm run test:integration	+   "kind": "wrapper",
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/authored-leaf-reader.test.ts:193:52
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4016009Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4017779Z ##[error]AssertionError: compiler, a well formed animated property: expected [] to deeply equal [ 'x' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- [
integration (node 24)	Run npm run test:integration	-   "x",
integration (node 24)	Run npm run test:integration	- ]
integration (node 24)	Run npm run test:integration	+ []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/authored-leaf-reader.test.ts:226:59
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4018253Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4020231Z ##[error]AssertionError: a leaf that is not a record: expected [] to deeply equal [ 'stops-shape at keyframes.x.stops' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- [
integration (node 24)	Run npm run test:integration	-   "stops-shape at keyframes.x.stops",
integration (node 24)	Run npm run test:integration	- ]
integration (node 24)	Run npm run test:integration	+ []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/authored-leaf-reader.test.ts:238:47
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4020682Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4022681Z ##[error]AssertionError: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	-   "stops-shape",
integration (node 24)	Run npm run test:integration	+   "keyframes-missing-values-section",
integration (node 24)	Run npm run test:integration	  ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:260:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4023148Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4050369Z ##[error]AssertionError: expected [ …(60) ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "apps/react-demo/src/full-body-project.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/authored-leaf.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/v5.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/validate-v5.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/adapters.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/graph-builder-incremental.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-absolute-stops.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-authored-duration.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-equivalence.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-multi-stop.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-one-tween.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-paused-timeline.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-sparse-percent-map.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/ports.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/s4-validation-owner.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/v5-validator.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/validation-owner.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/adopt-destroy-readopt.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/adopted-track-immutability.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/adoption.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/authored-leaf-reader.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/end-to-end.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/engine-headless.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/engine-load-validation.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/engine-x3-contribution.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/handle-adoption.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/internal-key-strip.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/issue-114-motion-track-regressions.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/keyframe-groups.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/motion-trigger-types.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/mutation-transactionality.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/observation-identity.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/option-c-track-resolution.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/per-plugin-key-ownership.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase0-red-baseline.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase2-motion-scheduling.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase3-trigger-port.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase4-dynamic-lifecycle.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase7-walker-demo.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/plugin-group-values-section.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/plugin-owned-requirements.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/replace-motion-track.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/replace-track-transactionality.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/runtime-motion-lifecycle.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/single-input-channel.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/t4-runtime-motion-parity.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/trigger-scroll.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/trigger-time-loop.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/trigger-time.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/unified-mutation-surface.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/plugin-contribution-completeness.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/plugin-contribution-contract.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/plugin-requirements.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/plugins.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/s7-plugin-evidence.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/graph/incremental-cache.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/graph/requirement-edge-construction.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/graph/single-input-channel.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/runtime/composition-output-shape.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/react/test/public-hook-render.test.ts",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:344:30
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4051308Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4053822Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4054453Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4056889Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:38:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4057362Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4059767Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:60:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4060238Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4062663Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:79:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4063121Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4065680Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:94:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4066437Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4069354Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:31:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4069864Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4072806Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position-order/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:48:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4073290Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4076326Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.unknown: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:65:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4076784Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4079309Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:74:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4079821Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4082295Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:38:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4082846Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4085396Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:75:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4085917Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4089008Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-contribution-stop-order/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:108:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4089484Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4093499Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:133:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4094129Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4097236Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:170:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4098052Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4100755Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/handle-adoption.test.ts:57:44
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4101224Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4104656Z ##[error]TypeError: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/handle-adoption.test.ts:69:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4105159Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4108100Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:42:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4108562Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4111419Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4111886Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4114912Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:84:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4115368Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4118560Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:41:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4119033Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4122206Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:56:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4122668Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4127702Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:72:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4128492Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4132522Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:86:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4133006Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4137227Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:103:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4137710Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4141754Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:56:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4142246Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4145371Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:70:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4145827Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4148736Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:81:18
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4149204Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4152149Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:104:44
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4152600Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4155608Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:123:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4156342Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4161629Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4162096Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4165311Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(child).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:118:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4165781Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4168785Z ##[error]AssertionError: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-self-reference/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(self).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:140:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4169238Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4173159Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4173620Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4177576Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:75:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4178040Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4182700Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:89:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4183150Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4187070Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4187806Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4191622Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4192090Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4195311Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:60:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4195755Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4200486Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:73:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4200969Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4205027Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:88:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4205752Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4209663Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:104:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4210249Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4213247Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:113:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4213706Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4220960Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4221440Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4228534Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:123:58
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4229015Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4237403Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:128:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4241835Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4244551Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:40:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4246123Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4249432Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:98:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4251392Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4254405Z ##[error]TypeError: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:142:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4256141Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4258582Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:199:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4260105Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4262509Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:245:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4264107Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4266542Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4268061Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4270538Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:78:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4272061Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4274601Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:168:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4276113Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4278519Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:109:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4280407Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4282875Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:136:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4284488Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4287476Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position|monoton/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:172:47
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4289222Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4297885Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:145:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4302567Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4311140Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:164:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4315897Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4324486Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:199:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4329518Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4338130Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:219:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4342778Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4351369Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:243:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4356097Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4364843Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:269:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4369765Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4378416Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:305:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4383108Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4391693Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:330:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4396596Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4405200Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:351:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4409983Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4418668Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:387:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4423306Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4426585Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:147:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4428471Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4431959Z ##[error]AssertionError: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}
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
integration (node 24)	Run npm run test:integration	    "message": "The { stops: [...] } wrapper is retired; author the stops array directly as the value.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	    "ruleId": "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:214:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4434031Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4435845Z ##[error]AssertionError: expected [ 'property-stops-wrapper' ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:228:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4437356Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4446666Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:278:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4451624Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4458880Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4462851Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4470136Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4474200Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4481410Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:146:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4485843Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4492065Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:162:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4495586Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4502721Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:192:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4506895Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4514236Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:213:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4518576Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4521058Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:27:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4522608Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4526912Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:64:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4529278Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4532571Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:91:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4534615Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4537721Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4539573Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4542647Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:113:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4544568Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4547634Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4549491Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4552532Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:143:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4554444Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4557630Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:42:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4559952Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4563040Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:58:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4565042Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4568105Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:74:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4569969Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4577186Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:45:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:52:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4581155Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4584266Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/t4-runtime-motion-parity.test.ts:153:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:175:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4586037Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4589240Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:360:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4591131Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4594371Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:397:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4596263Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4599103Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:76:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4601140Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4604083Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:99:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4605809Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4609689Z ##[error]AssertionError: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/trigger-driver-unavailable/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:133:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4611887Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4614847Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:141:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4616550Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4619330Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:163:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4621032Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4622493Z ##[error]AssertionError: expected false to be true // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- true
integration (node 24)	Run npm run test:integration	+ false
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:98:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4623511Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4626488Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4628224Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4631089Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4632820Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4636651Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4638974Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4641530Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4643033Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4645996Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4647709Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4650584Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4652298Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4656109Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4658259Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4661118Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:39:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4662836Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4665746Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:59:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4667453Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4670337Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:66:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4672085Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4675032Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:78:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4676748Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4679105Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:113:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4681014Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4683370Z ##[error]TypeError: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:152:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4684973Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4688840Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:28:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:33:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4691102Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4694359Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:53:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4696218Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4699322Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:64:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4701171Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4704431Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4706285Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4709402Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:90:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:20:27.4714181Z ##[error]Process completed with exit code 1.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	﻿2026-08-23T00:20:20.5279749Z ##[group]Run npx vitest run packages/core/test/integration/end-to-end.test.ts
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:20.5280362Z ^[[36;1mnpx vitest run packages/core/test/integration/end-to-end.test.ts^[[0m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:20.5323407Z shell: /usr/bin/bash -e {0}
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:20.5323694Z env:
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:20.5323930Z   NODE_VERSION: 24
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:20.5324156Z ##[endgroup]
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.1270368Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.1274754Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.1275759Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6224953Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6226906Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 6^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6248689Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6249516Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6250200Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6254311Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6260209Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6262179Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6330481Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6332340Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6334180Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6335239Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6336484Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6337850Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6339420Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6341008Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6341890Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6342649Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6343508Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6344046Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6344917Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6345621Z ^[[2m   Start at ^[[22m 00:20:21
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6346727Z ^[[2m   Duration ^[[22m 474ms^[[2m (transform 275ms, setup 16ms, import 327ms, tests 7ms, environment 0ms)^[[22m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6347622Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6347953Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6358236Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6389914Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ assertValidProject packages/core/src/engine.ts:101:11
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ Engine.load packages/core/src/engine.ts:170:29
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:20:21.6842759Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-23T00:20:20.7835796Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.7836066Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.7870290Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.7870680Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.7870864Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.7871044Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.8675588Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.8676288Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.8676865Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:20.8677138Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4224359Z ##[error]apps/react-demo/src/full-body-project.ts(34,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4234439Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4235903Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4237397Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4238276Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4241204Z ##[error]apps/react-demo/src/full-body-project.ts(65,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4243065Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4244409Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4245678Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4246547Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4250031Z ##[error]apps/react-demo/src/full-body-project.ts(96,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4251901Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4253265Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4254463Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4255304Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4258148Z ##[error]apps/react-demo/src/full-body-project.ts(127,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4259965Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4261302Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4262511Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4263358Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4266165Z ##[error]apps/react-demo/src/full-body-project.ts(160,13): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4268632Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4270095Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4271358Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4272202Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4274967Z ##[error]apps/react-demo/src/full-body-project.ts(200,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4276848Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4278393Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4279599Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4280428Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4283133Z ##[error]apps/react-demo/src/full-body-project.ts(227,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4284981Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4286296Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4287579Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4288406Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4291073Z ##[error]apps/react-demo/src/full-body-project.ts(254,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4292949Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4294261Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4295439Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4296284Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4299101Z ##[error]apps/react-demo/src/full-body-project.ts(285,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4301006Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4302343Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4303523Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4304564Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4307572Z ##[error]apps/react-demo/src/full-body-project.ts(316,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4309479Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4310804Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4311998Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4312827Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4315585Z ##[error]apps/react-demo/src/full-body-project.ts(347,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4317572Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4318897Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4320084Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4320916Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4323615Z ##[error]apps/react-demo/src/full-body-project.ts(378,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4325483Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4326804Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4328101Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4328931Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4331613Z ##[error]apps/react-demo/src/full-body-project.ts(409,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4333548Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4334879Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4336056Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4336876Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4339891Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(20,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4343443Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(35,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4347136Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(68,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4351004Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(40,34): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4352825Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4353670Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4354464Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4355202Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4357653Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(62,36): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4359480Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4360305Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4361085Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4361780Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4363568Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(30,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4366090Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(42,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4367760Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4369171Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(43,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4370686Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4372348Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(54,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4374902Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(60,15): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4376494Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4378284Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(79,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4381119Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(87,63): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4384266Z ##[error]packages/core/test/integration/adoption.test.ts(78,52): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4387631Z ##[error]packages/core/test/integration/adoption.test.ts(91,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4390902Z ##[error]packages/core/test/integration/adoption.test.ts(112,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4394302Z ##[error]packages/core/test/integration/end-to-end.test.ts(21,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4397824Z ##[error]packages/core/test/integration/engine-headless.test.ts(19,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4410486Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(34,70): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4412960Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4414524Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4415617Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4416562Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4417550Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4418308Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4420572Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(62,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4422719Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4423978Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4424902Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4425841Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4426702Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4427553Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4429794Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(69,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4431945Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4433183Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4434137Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4435070Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4435944Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4436681Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4438864Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(89,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4441346Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4442286Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4443204Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4444063Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4444847Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4447665Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(142,7): error TS2322: Type '() => { keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4450410Z   Call signature return types '{ keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4451594Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4452790Z       Type '{ derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4453879Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4454885Z           Type '{ stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4457464Z ##[error]packages/core/test/integration/handle-adoption.test.ts(57,31): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4459281Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4460132Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4460921Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4461609Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4463855Z ##[error]packages/core/test/integration/handle-adoption.test.ts(74,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4466824Z ##[error]packages/core/test/integration/internal-key-strip.test.ts(28,44): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4469729Z ##[error]packages/core/test/integration/issue-114-motion-track-regressions.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4473143Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(56,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4474974Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4476342Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4478282Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4479639Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4480390Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4482385Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(70,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4484039Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4485166Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4486203Z       Types of property 'boneLength' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4486967Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4488866Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(81,33): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4491783Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(83,36): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4493496Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4494624Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4496072Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4497024Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4497915Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4499997Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(50,34): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4501721Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4502545Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4503322Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4504025Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4506733Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(49,5): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4508856Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4510333Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4511613Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4512329Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4515106Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(61,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4517649Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4518972Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4520161Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4520888Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4522741Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(114,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4525476Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(120,66): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4528297Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(136,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4531001Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(141,65): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4534203Z ##[error]packages/core/test/integration/observation-identity.test.ts(35,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4537102Z ##[error]packages/core/test/integration/option-c-track-resolution.test.ts(17,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4541666Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(38,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4543801Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4545174Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4546367Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4547112Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4550081Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(53,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4552076Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4553532Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4554813Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4555531Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4557971Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(116,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4560110Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4561347Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4562356Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4563087Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4564928Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(117,9): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4598786Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(24,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4602409Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(71,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4605796Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(82,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4609338Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(147,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4612769Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(183,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4616147Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(229,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4619666Z ##[error]packages/core/test/integration/phase2-motion-scheduling.test.ts(25,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4623053Z ##[error]packages/core/test/integration/phase3-trigger-port.test.ts(27,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4626462Z ##[error]packages/core/test/integration/phase4-dynamic-lifecycle.test.ts(164,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4630467Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(37,21): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4632400Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4633865Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4635147Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4635963Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4638838Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(64,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4641092Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4642413Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4643591Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4644425Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4647375Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(86,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4649364Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4650700Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4651896Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4652730Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4655592Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(60,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4657723Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4659046Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4660240Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4660975Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4663754Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(75,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4665747Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4667372Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4668686Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4669409Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4671912Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(123,20): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4673811Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4675122Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4676515Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4677469Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4680232Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(140,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4710528Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4711920Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4713115Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4713873Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4716512Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(153,9): error TS2322: Type '{ values: { weight: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; destination: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4718752Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4719854Z     Type '{ weight: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4720876Z       Types of property 'weight' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4721607Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4724399Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(184,17): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4726409Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4727998Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4729279Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4729999Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4732732Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(207,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { debug: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4734704Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4736008Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4737285Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4738017Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4739824Z ##[error]packages/core/test/integration/replace-motion-track.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4742552Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(32,36): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4745863Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(46,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4747669Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4748730Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4749671Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4750387Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4752229Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(52,16): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4754932Z ##[error]packages/core/test/integration/runtime-motion-lifecycle.test.ts(31,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4758665Z ##[error]packages/core/test/integration/single-input-channel.test.ts(23,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4760617Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4762067Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4763338Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4764039Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4766719Z ##[error]packages/core/test/integration/single-input-channel.test.ts(28,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4768848Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4770176Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4771352Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4772089Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4774437Z ##[error]packages/core/test/integration/t4-runtime-motion-parity.test.ts(126,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4777761Z ##[error]packages/core/test/integration/trigger-scroll.test.ts(70,67): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4779436Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4780265Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4781063Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4781762Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.4783981Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(104,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5315177Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5316053Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5316850Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5317740Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5320030Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(123,69): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5321745Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5322615Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5323404Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5324112Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5326371Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(127,29): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5328303Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5329135Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5329916Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5330597Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5332632Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,16): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5334308Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5335132Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5335904Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5336596Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5338725Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,30): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5340414Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5341236Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5342028Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5342720Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5344727Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(182,47): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5346521Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5347458Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5348391Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5349280Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5351440Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(196,68): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5353133Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5353954Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5354738Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5355442Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5357592Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(198,62): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5359297Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5360114Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5360905Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5361587Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5363605Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(214,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5365276Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5366106Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5366882Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5367695Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5369685Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(228,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5371343Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5372147Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5372922Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5373597Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5375593Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(229,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5377361Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5378183Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5378958Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5379639Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5381602Z ##[error]packages/core/test/integration/trigger-time.test.ts(31,79): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5383236Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5384040Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5384961Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5385764Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5387889Z ##[error]packages/core/test/integration/trigger-time.test.ts(115,77): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5389565Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5390394Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5391176Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5391876Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5393852Z ##[error]packages/core/test/integration/trigger-time.test.ts(156,75): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5395504Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5396317Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5397092Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5397924Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5399704Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(21,29): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5403027Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(20,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5405223Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5406151Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5407066Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5408177Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5408918Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5411091Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(51,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5413330Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5414261Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5415178Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5416027Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5416760Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5418994Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(58,7): error TS2322: Type '() => { keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5421187Z   Call signature return types '{ keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5422313Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5423333Z       Type '{ second: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5424172Z         Property 'second' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5424897Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5427636Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(105,7): error TS2322: Type '() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5430303Z   Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5431438Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5432434Z       Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5433347Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5434142Z           Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5436961Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(128,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5439702Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5441370Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5442533Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5443526Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5444442Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5445305Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5448272Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(135,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5450916Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5452587Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5453724Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5454723Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5455644Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5456447Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5458959Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(154,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5461314Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5462232Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5463150Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5464010Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5464747Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5466573Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(28,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5469309Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(52,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5471884Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(72,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5474428Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(92,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5476984Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(94,47): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5479678Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(95,46): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5482251Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(124,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5484816Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(137,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5487484Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(138,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5490635Z ##[error]packages/core/test/unit/graph/requirement-edge-construction.test.ts(53,37): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5492434Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5493531Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5494529Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5495379Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5497839Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(59,39): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5499581Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5500681Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5501847Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5502784Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5505316Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(58,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5508903Z ##[error]packages/react/test/public-hook-render.test.ts(69,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:20:23.5514170Z ##[error]Process completed with exit code 2.
```
