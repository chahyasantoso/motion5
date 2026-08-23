# CI log archive: 32607494826

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lf-bare-authored-leaf
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32607494826
- Captured: 2026-08-23T00:18:49Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-23T00:18:24.5117948Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.5118344Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.5157702Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.5158257Z env:
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.5158505Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.5158757Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.6143928Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.6144700Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.6145325Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.6145655Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.9354164Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.9373391Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:24.9374605Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4502654Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4868341Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4871187Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4873790Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4875800Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4877862Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4879845Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4881822Z ^[[31m     ^[[31m×^[[31m T-6 rolls the Motion back when the candidate graph rejects it^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.4884127Z ^[[31m     ^[[31m×^[[31m T-7 keeps one clock subscription when a Motion is created at runtime^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5384389Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 85^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5414653Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5423076Z      ^[[32m✓^[[39m LF-6 publishes a bare static value and holds it at every progress^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5444803Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5470920Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5486910Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5488806Z ^[[31m     ^[[31m×^[[31m LF-10 closes the static domain instead of leaving it open^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5490476Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5492016Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5493777Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5495520Z ^[[31m     ^[[31m×^[[31m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5497314Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.5499334Z ^[[31m     ^[[31m×^[[31m LF-16 leaves no authored schema in the repository on the retired form^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.7996588Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m8 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.7998136Z      ^[[32m✓^[[39m L-11 accepts the loop fields and names each loop rule by id^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.7999730Z      ^[[32m✓^[[39m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8001133Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8002483Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8004268Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8005764Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8007119Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8008463Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8009750Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8011020Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8012146Z      ^[[32m✓^[[39m L-21 keeps loop time running while its Motion is paused^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8142943Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8145771Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8150959Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8152966Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8155297Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8157112Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8159032Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8160929Z ^[[31m     ^[[31m×^[[31m Y-7 cites the section in a diagnostic about a leaf inside it^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8162767Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8164833Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8166642Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8168307Z      ^[[32m✓^[[39m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8170016Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8172357Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8875712Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8913900Z ^[[31m     ^[[31m×^[[31m 1. Load valid walker project through Engine with plugin registry^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8915956Z ^[[31m     ^[[31m×^[[31m 2. Render walker nodes through createDomPatchAdapter^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8917954Z ^[[31m     ^[[31m×^[[31m 3. Demonstrate time playback using single injected browser clock^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8920420Z ^[[31m     ^[[31m×^[[31m 4. Demonstrate progress through TriggerPort and manual signals^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8925848Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8928125Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8930434Z ^[[31m     ^[[31m×^[[31m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8932550Z ^[[31m     ^[[31m×^[[31m 8. Show blocked/pending/error diagnostics without crashing the app^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8934748Z ^[[31m     ^[[31m×^[[31m 9. Use React usePatch hook at the React boundary^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:25.8936214Z ^[[31m     ^[[31m×^[[31m 10. Automated end-to-end integration test passes clean^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.0635921Z  ^[[31m❯^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.0638688Z ^[[31m     ^[[31m×^[[31m LF-1 answers the leaf shape question from one module^[[39m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.0640407Z      ^[[32m✓^[[39m LF-2 leaves no consumer holding a second copy of the check^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.0642345Z ^[[31m     ^[[31m×^[[31m LF-3 makes the compiler and the fake interpolator agree on what a leaf publishes^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.0644629Z ^[[31m     ^[[31m×^[[31m LF-4 moves no diagnostic while the five sites are consolidated^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.0739211Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.1672797Z  ^[[31m❯^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.1676817Z ^[[31m     ^[[31m×^[[31m 1. Engine time playback: project clock tick advances time motion playhead^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.1679344Z ^[[31m     ^[[31m×^[[31m 2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.1681962Z ^[[31m     ^[[31m×^[[31m 3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.1684892Z ^[[31m     ^[[31m×^[[31m 4. Stale scheduled write: paused Motion cancels pending write before scheduler flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.1687225Z ^[[31m     ^[[31m×^[[31m 5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.2870545Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.2873546Z ^[[31m     ^[[31m×^[[31m T-11 gives each trigger type its own input path instead of the manual one^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.2875870Z ^[[31m     ^[[31m×^[[31m T-12 lets seek scrub a driver-backed node and lets the driver overwrite it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.2877703Z      ^[[32m✓^[[39m advances from the one injected clock and rejects control after disposal^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.2879279Z      ^[[32m✓^[[39m cancels queued trigger work when paused and does not duplicate on remount^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.3897583Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.3904651Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.3907214Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.3909241Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.3911132Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.3913096Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.3915164Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.4764388Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.4766853Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.4770483Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.4773008Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.4775214Z ^[[31m     ^[[31m×^[[31m U-4 changes nothing when the candidate graph refuses a derived observation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.5225265Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.5227374Z      ^[[32m✓^[[39m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.5229334Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.5231483Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.5233565Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.5235373Z      ^[[32m✓^[[39m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.5237297Z ^[[31m     ^[[31m×^[[31m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6427627Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6429422Z      ^[[32m✓^[[39m adopts a free track under ~/id and publishes through the ordinary graph path^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6430369Z      ^[[32m✓^[[39m rejects duplicate adopted ids instead of silently replacing membership^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6431358Z      ^[[32m✓^[[39m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6432424Z      ^[[32m✓^[[39m keeps every adopted track independently addressable across sequential adopt and destroy calls^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6433800Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-finite stop positions^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6435017Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-monotonic stop positions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6435865Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with duplicate stop positions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6436626Z      ^[[32m✓^[[39m adopts a track into an existing motion under motionId/trackId^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6437307Z      ^[[32m✓^[[39m rejects adopting into a non-existent motion^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.6438306Z      ^[[32m✓^[[39m destroys a motion-adopted track and invokes removeMotionTrack^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7663355Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7665552Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7668031Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7669775Z ^[[31m     ^[[31m×^[[31m rejects external signals without changing progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7671578Z ^[[31m     ^[[31m×^[[31m coalesces rapid driver ticks to the latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7673566Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7675463Z ^[[31m     ^[[31m×^[[31m keeps manual signals working and preserves range validation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7677566Z ^[[31m     ^[[31m×^[[31m isolates a throwing clock consumer while preserving other Motion progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7922799Z  ^[[31m❯^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7924524Z ^[[31m     ^[[31m×^[[31m passes contribution context and creates the prepared timeline at load^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7926378Z ^[[31m     ^[[31m×^[[31m selects one predicate contributor through Engine.load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7927395Z ^[[31m     ^[[31m×^[[31m rejects malformed contributions during Engine.load^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7928437Z ^[[31m     ^[[31m×^[[31m rejects authored ease collisions before any timeline is created^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.7929602Z ^[[31m     ^[[31m×^[[31m merges contributed keyframes into compiler diagnostics before timeline creation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.9230843Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.9233977Z ^[[31m     ^[[31m×^[[31m 3.1 drives progress from an injected source and clamps out-of-range emissions^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.9236277Z ^[[31m     ^[[31m×^[[31m 3.2 subscribes to the injected source once and unsubscribes exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.9238311Z      ^[[32m✓^[[39m 3.3 rejects a missing source with a trigger-driver-unavailable diagnostic^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.9240447Z ^[[31m     ^[[31m×^[[31m 3.4 unsubscribes an already resolved source when a later Motion cannot resolve^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.9242454Z ^[[31m     ^[[31m×^[[31m registers no clock consumer for a push-driven scroll Motion^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:26.9244570Z ^[[31m     ^[[31m×^[[31m rejects external signals for scroll Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0426908Z  ^[[31m❯^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0454953Z      ^[[32m✓^[[39m 1. Port lifecycle: subscribe, emit, unsubscribe, and resubscribe cleanly^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0514623Z      ^[[32m✓^[[39m 2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0545071Z ^[[31m     ^[[31m×^[[31m 3. Manual and custom trigger ports operate without DOM imports in core^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0596705Z ^[[31m     ^[[31m×^[[31m 4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0634779Z      ^[[32m✓^[[39m 5. Idempotent teardown: pause, unmount, and dispose cleanly detach ports without leaks^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0715399Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0735684Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0737554Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0739051Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.0740086Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.1781622Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.1784863Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.1787279Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.1789247Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.3203750Z  ^[[31m❯^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.3206381Z ^[[31m     ^[[31m×^[[31m C-9 keeps a motion-owned track live through replacement^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.3208356Z ^[[31m     ^[[31m×^[[31m C-10 preserves the array index and stagger timing across a replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.3209890Z ^[[31m     ^[[31m×^[[31m C-11 keeps the observation replacement path resolvable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.3211288Z ^[[31m     ^[[31m×^[[31m C-12 disposes every compiled timeline exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.3213466Z ^[[31m     ^[[31m×^[[31m C-13 keeps runtime add and remove in step with the resolver^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.3260350Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.4360376Z  ^[[31m❯^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.4375046Z ^[[31m     ^[[31m×^[[31m 1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.4377163Z ^[[31m     ^[[31m×^[[31m 2. Pause cancels pending scheduled write and prevents Track mutation on flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.4379001Z      ^[[32m✓^[[39m 3. Remount does not duplicate subscriptions or schedule parallel jobs^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.4387337Z      ^[[32m✓^[[39m 4. Clock and trigger paths both retain cancellation behavior on pause^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.4389055Z ^[[31m     ^[[31m×^[[31m 5. Burst signals produce exactly 1 published patch batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5820049Z  ^[[31m❯^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5832421Z ^[[31m     ^[[31m×^[[31m creates a motion, attaches a track, and signals progress from an empty project^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5834410Z ^[[31m     ^[[31m×^[[31m rejects motion destruction while it still owns tracks, then allows empty destruction^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5836074Z ^[[31m     ^[[31m×^[[31m keeps two runtime motions independently signalable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5837923Z      ^[[32m✓^[[39m rejects duplicate and malformed motion ids without poisoning retries^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5839541Z      ^[[32m✓^[[39m rejects non-empty authored motions without deleting their schema tracks^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5841013Z      ^[[32m✓^[[39m rejects addMotion with pre-populated tracks instead of dropping them^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5994606Z  ^[[31m❯^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5997090Z ^[[31m     ^[[31m×^[[31m covers source spelling across an add and its matching remove^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.5999019Z ^[[31m     ^[[31m×^[[31m deduplicates equivalent observations and preserves no-op sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.6001106Z ^[[31m     ^[[31m×^[[31m rejects an invalid free-track observation with stable diagnostics^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.6003415Z ^[[31m     ^[[31m×^[[31m V-7 refuses an authored target through addObserve on either role^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.6005350Z ^[[31m     ^[[31m×^[[31m J-7 refuses an authored role or projection through addObserve^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.6705256Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.8185376Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.8436949Z  ^[[31m❯^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.8442045Z ^[[31m     ^[[31m×^[[31m does not drive the disposed Track after direct replacement^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.8444495Z ^[[31m     ^[[31m×^[[31m preserves current progress when replacing^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.8449338Z ^[[31m     ^[[31m×^[[31m preserves the original array index and stagger timing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.8451254Z ^[[31m     ^[[31m×^[[31m keeps sibling progress healthy after replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.8452974Z ^[[31m     ^[[31m×^[[31m keeps the observation replacement path live^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.9432171Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.9464895Z ^[[31m     ^[[31m×^[[31m ingests authored tracks into the removable store without auto-mounting^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.9476416Z ^[[31m     ^[[31m×^[[31m returns a capability handle and makes stale ABA handles inert^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.9483010Z ^[[31m     ^[[31m×^[[31m replaces a track non-destructively and preserves subscriber identity^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.9485508Z ^[[31m     ^[[31m×^[[31m reads dependants from the committed graph and rejects source removal^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:27.9487688Z ^[[31m     ^[[31m×^[[31m treats observation changes as replacement of the observer track^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.0685667Z  ^[[31m❯^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.0688088Z ^[[31m     ^[[31m×^[[31m re-registers the compiled Track without throwing on the next Motion update^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.0690186Z ^[[31m     ^[[31m×^[[31m preserves the replaced Track index and stagger timing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.0692169Z ^[[31m     ^[[31m×^[[31m updates a Motion-owned Track through observation mutations^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.1256245Z  ^[[31m❯^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.1259381Z ^[[31m     ^[[31m×^[[31m returns a deeply frozen runtime-owned definition^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.1261349Z ^[[31m     ^[[31m×^[[31m isolates caller mutation from the frozen graph definition^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.1263749Z ^[[31m     ^[[31m×^[[31m uses the authored validation owner for malformed runtime track structure^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.1265912Z ^[[31m     ^[[31m×^[[31m keeps the existing same-source destroy and readopt path working^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.2267258Z  ^[[31m❯^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.2270725Z ^[[31m     ^[[31m×^[[31m F-10 interpolates grouped leaves without renaming the owning plugin^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.2272725Z ^[[31m     ^[[31m×^[[31m F-11 interpolates a grouped track when the Engine has no plugin registry^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.2274893Z ^[[31m     ^[[31m×^[[31m F-12 publishes identical values for the flat and grouped spellings^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3421723Z  ^[[31m❯^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3424485Z ^[[31m     ^[[31m×^[[31m publishes a progress change through the public project handle^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3426140Z ^[[31m     ^[[31m×^[[31m keeps one clock owner while clock progress publishes once^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3432646Z ^[[31m     ^[[31m×^[[31m still resolves authored-key plugins during progress updates^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3434832Z ^[[31m     ^[[31m×^[[31m routes a manual trigger through the public handle into a published patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3560197Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3562600Z ^[[31m     ^[[31m×^[[31m H-1 keeps a namespaced derived key out of every published surface^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3567156Z ^[[31m     ^[[31m×^[[31m H-2 keeps a declared unprefixed internal key out of the patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.3569098Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.4475695Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.6003943Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.6184890Z  ^[[31m❯^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.6187002Z      ^[[32m✓^[[39m adopts a free track and publishes a ready patch via seek^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.6189359Z      ^[[32m✓^[[39m destroyAdopted removes the node from the graph^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.6190842Z ^[[31m     ^[[31m×^[[31m rejects adoption of a track with malformed keyframes^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.6192421Z ^[[31m     ^[[31m×^[[31m adopts a track into an existing motion and receives motion signals^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.6712016Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.8237397Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.8342267Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:28.8727182Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.0730203Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.1311134Z  ^[[31m❯^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.1314175Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before constructing a runtime^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.1335266Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before any timeline is created^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.1336986Z ^[[31m     ^[[31m×^[[31m resolves authored plugin ownership during load, not on the first seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.1338548Z ^[[31m     ^[[31m×^[[31m accepts a valid project and creates its timelines during load^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.1503215Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.1506161Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.2669856Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.3315209Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.4225355Z  ^[[31m❯^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.4238856Z ^[[31m     ^[[31m×^[[31m tells subscribers the node was destroyed and reaches them again after re-adoption^[[39m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.4730054Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.7015334Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.7125686Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.7163997Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.7166260Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.8876647Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.9460523Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:29.9515379Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1402824Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1509036Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1616264Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1657513Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1658373Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 128 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1659299Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1674272Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopt-destroy-readopt.test.ts^[[2m > ^[[22madopt -> destroy -> re-adopt lifecycle on the wire (D1)^[[2m > ^[[22mtells subscribers the node was destroyed and reaches them again after re-adoption
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1680278Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1682491Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1759482Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1761378Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1763888Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1765447Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1766713Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1768428Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1770388Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1772091Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1774177Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopt-destroy-readopt.test.ts:^[[2m40:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1775208Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1775901Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1776504Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1778623Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mreturns a deeply frozen runtime-owned definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1781694Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1784223Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1785869Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1787568Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1789586Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1790992Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1792306Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1794438Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1796251Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1797973Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1799779Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m33:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1800707Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1801349Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1801932Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1804337Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22misolates caller mutation from the frozen graph definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1807938Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1810455Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1812151Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1814080Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1816154Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1817578Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1818743Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1820333Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1822226Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1823919Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1825735Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m56:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1826742Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1827439Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1828069Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1830414Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22muses the authored validation owner for malformed runtime track structure
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1833908Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1834945Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1835291Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1835712Z undefined
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1835931Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1836204Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1837607Z "TypeError: property-stops-wrapper at addTrack(broken).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1838637Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1839624Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m79:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1840596Z     ^[[90m 77|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1841441Z     ^[[90m 78|^[[39m     expect(() => handle.adopt(malformed, owner)).toThrow(/observes-sha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1842612Z     ^[[90m 79|^[[39m     expect(() => handle.adopt({ id: "broken", keyframes: { x: ramp(0, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1844098Z     ^[[90m   |^[[39m                                                                                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1844857Z     ^[[90m 80|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1845551Z     ^[[90m 81|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1846011Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1846448Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1846827Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1848846Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mkeeps the existing same-source destroy and readopt path working
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1851818Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1854145Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1855583Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1857508Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1859528Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1860836Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1861879Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1863634Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1865347Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1866838Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1868448Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m89:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1869318Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1869835Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1870232Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1871793Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-finite stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1874543Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1875553Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1875816Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1876242Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1876466Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1876713Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1878023Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1878970Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1879712Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m79:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1911104Z     ^[[90m 77|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1912143Z     ^[[90m 78|^[[39m       runtime.adopt({ id: "bad", keyframes: { x: { stops: [{ p: Number…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1913657Z     ^[[90m 79|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1914586Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1915427Z     ^[[90m 80|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1916153Z     ^[[90m 81|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1917466Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1918352Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1918771Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1920404Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-monotonic stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1922958Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1924210Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1924480Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1924899Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1925140Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1925387Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1926678Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1927629Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1928361Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m100:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1929257Z     ^[[90m 98|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1929809Z     ^[[90m 99|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1930732Z     ^[[90m100|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1931573Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1932738Z     ^[[90m101|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1933737Z     ^[[90m102|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1934298Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1934753Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1935127Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1936644Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with duplicate stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1939047Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1940038Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1940295Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1940706Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1940939Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1941196Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1942482Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1943680Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1944417Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m121:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1945360Z     ^[[90m119|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1945968Z     ^[[90m120|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1946892Z     ^[[90m121|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1947730Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1948508Z     ^[[90m122|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1949240Z     ^[[90m123|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1949548Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1949982Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1950345Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1952098Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/authored-leaf-reader.test.ts^[[2m > ^[[22mone owner for the authored leaf shape^[[2m > ^[[22mLF-1 answers the leaf shape question from one module
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1954628Z ^[[31m^[[1mAssertionError^[[22m: expected { kind: 'wrapper' } to deeply equal { kind: 'animated', stops: [ …(2) ] }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1955528Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1955775Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1956249Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1956472Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1956661Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1957156Z ^[[32m-   "kind": "animated",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1957692Z ^[[32m-   "stops": [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1958174Z ^[[32m-     {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1958684Z ^[[32m-       "p": 0,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1959238Z ^[[32m-       "v": 0,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1959777Z ^[[32m-     },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1960224Z ^[[32m-     {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1960739Z ^[[32m-       "p": 1,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1961278Z ^[[32m-       "v": 10,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1961730Z ^[[32m-     },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1962113Z ^[[32m-   ],^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1962680Z ^[[31m+   "kind": "wrapper",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1963473Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1963733Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1964658Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/authored-leaf-reader.test.ts:^[[2m193:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1966043Z     ^[[90m191|^[[39m     // array the author wrote rather than a filtered copy, because val…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1967117Z     ^[[90m192|^[[39m     ^[[90m// report a bad position at all.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1968262Z     ^[[90m193|^[[39m     expect(leaf.readAuthoredLeaf({ stops: RAMP })).toEqual({ kind: "an…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1969380Z     ^[[90m   |^[[39m                                                    ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1970015Z     ^[[90m194|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1970881Z     ^[[90m195|^[[39m     // `{}` is a deliberately accepted no-op property that `Y-6` alrea…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1971478Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1971960Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1972345Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1974661Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/authored-leaf-reader.test.ts^[[2m > ^[[22mone owner for the authored leaf shape^[[2m > ^[[22mLF-3 makes the compiler and the fake interpolator agree on what a leaf publishes
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1977733Z ^[[31m^[[1mAssertionError^[[22m: compiler, a well formed animated property: expected [] to deeply equal [ 'x' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1978543Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1978800Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1979281Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1979524Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1979726Z ^[[32m- [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1980152Z ^[[32m-   "x",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1980633Z ^[[32m- ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1981020Z ^[[31m+ []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1981233Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1982111Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/authored-leaf-reader.test.ts:^[[2m226:59^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1983683Z     ^[[90m224|^[[39m   it("LF-3 makes the compiler and the fake interpolator agree on what …
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1985354Z     ^[[90m225|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m { what^[[33m,^[[39m authored^[[33m,^[[39m published } ^[[35mof^[[39m ^[[33mPUBLICATION^[[39m) {
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1986958Z     ^[[90m226|^[[39m       expect(compiledKeys(authored), `compiler, ${what}`).toEqual(publ…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1988150Z     ^[[90m   |^[[39m                                                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1989299Z     ^[[90m227|^[[39m       // Red on the parent for the two malformed stops. The compiler f…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1990564Z     ^[[90m228|^[[39m       // unparseable position or no value; the fake keeps it and publi…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1991159Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1991596Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1991974Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1994067Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/authored-leaf-reader.test.ts^[[2m > ^[[22mone owner for the authored leaf shape^[[2m > ^[[22mLF-4 moves no diagnostic while the five sites are consolidated
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1996599Z ^[[31m^[[1mAssertionError^[[22m: a leaf that is not a record: expected [] to deeply equal [ 'stops-shape at keyframes.x.stops' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1997521Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1997833Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1998322Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1998574Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1998751Z ^[[32m- [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.1999391Z ^[[32m-   "stops-shape at keyframes.x.stops",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2000024Z ^[[32m- ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2000467Z ^[[31m+ []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2000697Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2001625Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/authored-leaf-reader.test.ts:^[[2m238:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2003011Z     ^[[90m236|^[[39m     // than behavior, so the case that would catch it changing behavio…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2004792Z     ^[[90m237|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m { what^[[33m,^[[39m authored^[[33m,^[[39m expected } ^[[35mof^[[39m ^[[33mPARITY^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2006586Z     ^[[90m238|^[[39m       ^[[34mexpect^[[39m(^[[34mruleIdsAndPaths^[[39m(authored)^[[33m,^[[39m what)^[[33m.^[[39m^[[34mtoEqual^[[39m(expected)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2007907Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2008608Z     ^[[90m239|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2009181Z     ^[[90m240|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2009471Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2009895Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2010255Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2011886Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-10 closes the static domain instead of leaving it open
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2014305Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2015159Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2015445Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2015966Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2016225Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2016444Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2016961Z ^[[32m-   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2017680Z ^[[31m+   "keyframes-missing-values-section",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2018625Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2018862Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2019736Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m260:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2021465Z     ^[[90m258|^[[39m     expect(ruleIds({ x: Number.POSITIVE_INFINITY })).toEqual(["stops-s…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2023528Z     ^[[90m259|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m () ^[[33m=>^[[39m ^[[34m1^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2025650Z     ^[[90m260|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m { hold^[[33m:^[[39m ^[[34m1^[[39m } }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2027001Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2028040Z     ^[[90m261|^[[39m     // The shape error cites the property the author wrote, not a `.st…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2029077Z     ^[[90m262|^[[39m     ^[[90m// exists anywhere in the document.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2029562Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2030023Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2030431Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2032156Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-14 refuses a static leaf on a prepare-stage contributor's key
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2034482Z ^[[31m^[[1mAssertionError^[[22m: expected [] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2035177Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2035489Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2035963Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2036365Z   "path": "keyframes.length",
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2036986Z   "ruleId": "plugin-contribution-static-unsupported",
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2037594Z }
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2037788Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2038083Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2038491Z []
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2038682Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2039580Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m310:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2040967Z     ^[[90m308|^[[39m     // compilation, so there is no percent grid for a contribution to …
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2042306Z     ^[[90m309|^[[39m     const resolved = registry(contributor).resolveForKeyframes({ lengt…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2043981Z     ^[[90m310|^[[39m     ^[[34mexpect^[[39m(resolved^[[33m.^[[39mdiagnostics)^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2045104Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2046035Z     ^[[90m311|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2047311Z     ^[[90m312|^[[39m         ruleId^[[33m:^[[39m ^[[32m"plugin-contribution-static-unsupported"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2048011Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2048466Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2048839Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2050591Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-16 leaves no authored schema in the repository on the retired form
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2053048Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(60) ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2053830Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2054137Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2054655Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2054913Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2055125Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2055549Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2056259Z ^[[31m+   "apps/react-demo/src/full-body-project.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2057176Z ^[[31m+   "packages/core/src/contract/authored-leaf.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2058054Z ^[[31m+   "packages/core/src/contract/v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2058946Z ^[[31m+   "packages/core/src/contract/validate-v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2059929Z ^[[31m+   "packages/core/test/contract/adapters.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2061030Z ^[[31m+   "packages/core/test/contract/graph-builder-incremental.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2062296Z ^[[31m+   "packages/core/test/contract/gsap-absolute-stops.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2063772Z ^[[31m+   "packages/core/test/contract/gsap-authored-duration.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2064945Z ^[[31m+   "packages/core/test/contract/gsap-equivalence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2066108Z ^[[31m+   "packages/core/test/contract/gsap-multi-stop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2067246Z ^[[31m+   "packages/core/test/contract/gsap-one-tween.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2068366Z ^[[31m+   "packages/core/test/contract/gsap-paused-timeline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2069610Z ^[[31m+   "packages/core/test/contract/gsap-sparse-percent-map.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2070727Z ^[[31m+   "packages/core/test/contract/ports.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2071830Z ^[[31m+   "packages/core/test/contract/s4-validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2072864Z ^[[31m+   "packages/core/test/contract/v5-validator.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2074087Z ^[[31m+   "packages/core/test/contract/validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2075285Z ^[[31m+   "packages/core/test/integration/adopt-destroy-readopt.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2076568Z ^[[31m+   "packages/core/test/integration/adopted-track-immutability.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2077775Z ^[[31m+   "packages/core/test/integration/adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2078951Z ^[[31m+   "packages/core/test/integration/authored-leaf-reader.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2080067Z ^[[31m+   "packages/core/test/integration/end-to-end.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2081191Z ^[[31m+   "packages/core/test/integration/engine-headless.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2082445Z ^[[31m+   "packages/core/test/integration/engine-load-validation.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2083947Z ^[[31m+   "packages/core/test/integration/engine-x3-contribution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2085183Z ^[[31m+   "packages/core/test/integration/handle-adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2086390Z ^[[31m+   "packages/core/test/integration/internal-key-strip.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2087756Z ^[[31m+   "packages/core/test/integration/issue-114-motion-track-regressions.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2089108Z ^[[31m+   "packages/core/test/integration/keyframe-groups.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2090293Z ^[[31m+   "packages/core/test/integration/motion-trigger-types.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2091607Z ^[[31m+   "packages/core/test/integration/mutation-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2092963Z ^[[31m+   "packages/core/test/integration/observation-identity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2094541Z ^[[31m+   "packages/core/test/integration/option-c-track-resolution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2095836Z ^[[31m+   "packages/core/test/integration/per-plugin-key-ownership.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2097056Z ^[[31m+   "packages/core/test/integration/phase0-red-baseline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2098298Z ^[[31m+   "packages/core/test/integration/phase2-motion-scheduling.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2099819Z ^[[31m+   "packages/core/test/integration/phase3-trigger-port.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2101243Z ^[[31m+   "packages/core/test/integration/phase4-dynamic-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2102456Z ^[[31m+   "packages/core/test/integration/phase7-walker-demo.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2103932Z ^[[31m+   "packages/core/test/integration/plugin-group-values-section.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2105328Z ^[[31m+   "packages/core/test/integration/plugin-owned-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2106662Z ^[[31m+   "packages/core/test/integration/replace-motion-track.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2108031Z ^[[31m+   "packages/core/test/integration/replace-track-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2109394Z ^[[31m+   "packages/core/test/integration/runtime-motion-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2110682Z ^[[31m+   "packages/core/test/integration/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2112005Z ^[[31m+   "packages/core/test/integration/t4-runtime-motion-parity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2113390Z ^[[31m+   "packages/core/test/integration/trigger-scroll.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2114622Z ^[[31m+   "packages/core/test/integration/trigger-time-loop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2115785Z ^[[31m+   "packages/core/test/integration/trigger-time.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2116970Z ^[[31m+   "packages/core/test/integration/unified-mutation-surface.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2118418Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-completeness.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2119846Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-contract.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2121232Z ^[[31m+   "packages/core/test/unit/domain/plugin-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2122364Z ^[[31m+   "packages/core/test/unit/domain/plugins.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2123708Z ^[[31m+   "packages/core/test/unit/domain/s7-plugin-evidence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2124925Z ^[[31m+   "packages/core/test/unit/graph/incremental-cache.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2126271Z ^[[31m+   "packages/core/test/unit/graph/requirement-edge-construction.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2127553Z ^[[31m+   "packages/core/test/unit/graph/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2128856Z ^[[31m+   "packages/core/test/unit/runtime/composition-output-shape.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2130048Z ^[[31m+   "packages/react/test/public-hook-render.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2130724Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2130930Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2131782Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m344:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2133374Z     ^[[90m342|^[[39m     // be red for a fixture that authors the retired form, but a fixtu…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2134616Z     ^[[90m343|^[[39m     // and that is the one that reads as an accepted second shape late…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2136079Z     ^[[90m344|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2137278Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2137943Z     ^[[90m345|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2138506Z     ^[[90m346|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2138812Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2139279Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2139667Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2141390Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2144547Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2146513Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2148353Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2150107Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2151375Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2152145Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2153349Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2154499Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2155660Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2156914Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2157554Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2158019Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2158438Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2159970Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mpublishes a progress change through the public project handle
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2162752Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2164982Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2166274Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2167816Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2169149Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2169896Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2170894Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2172078Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2173507Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2174868Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m38:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2175546Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2176017Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2176377Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2177832Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mkeeps one clock owner while clock progress publishes once
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2180572Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2182587Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2184124Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2185725Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2187036Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2187864Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2188868Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2190004Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2191207Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2192535Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m60:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2193697Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2194196Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2194605Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2196254Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mstill resolves authored-key plugins during progress updates
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2198987Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2200938Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2202217Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2204038Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2205323Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2206117Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2207076Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2208230Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2209426Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2210732Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m79:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2211371Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2211803Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2212175Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2213955Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mroutes a manual trigger through the public handle into a published patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2216769Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2218716Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2219975Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2221536Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2222897Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2223995Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2224959Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2226129Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2227307Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2228644Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m94:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2229331Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2229805Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2230173Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2232130Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before constructing a runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2235183Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2236173Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2236460Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2236895Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2237141Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2237408Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2238802Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2240097Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2241025Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m31:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2242637Z     ^[[90m 29|^[[39m     const invalid = projectWith({ opacity: { stops: [{ p: Number.NaN, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2243737Z     ^[[90m 30|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2244627Z     ^[[90m 31|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2245673Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2246904Z     ^[[90m 32|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2247886Z     ^[[90m 33|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2248180Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2248623Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2249018Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2251033Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2254138Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2255197Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2255496Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2255963Z /stop-position-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2256236Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2256511Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2257976Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2258997Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2259905Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m48:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2260888Z     ^[[90m 46|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2261404Z     ^[[90m 47|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2262265Z     ^[[90m 48|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2263547Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2264764Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2265713Z     ^[[90m 50|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2266019Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2266437Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2266810Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2268851Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mresolves authored plugin ownership during load, not on the first seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2271674Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2272714Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2272960Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2273603Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2273866Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2274120Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2275536Z "property-stops-wrapper at motions[0].tracks[0].keyframes.unknown: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2276577Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2277454Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m65:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2278498Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2279567Z     ^[[90m 64|^[[39m       engine.load(projectWith({ unknown: { stops: [{ p: 0, v: 0 }] } }…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2280827Z     ^[[90m 65|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-unknown-key/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2281735Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2282843Z     ^[[90m 66|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2284304Z     ^[[90m 67|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2284635Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2285347Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2285745Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2287717Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22maccepts a valid project and creates its timelines during load
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2290801Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2292811Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2294373Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2295900Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2297172Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2297950Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2298924Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2300042Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2301171Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2302564Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m74:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2303482Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2303930Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2304315Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2306358Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mpasses contribution context and creates the prepared timeline at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2309428Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2311372Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2312675Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2314466Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2315803Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2316614Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2317621Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2318755Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2319985Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2321505Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m38:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2322227Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2322702Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2323086Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2325234Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mselects one predicate contributor through Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2328222Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2330161Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2331760Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2333869Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2335185Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2335976Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2337021Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2338195Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2339362Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2340817Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m75:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2341511Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2341966Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2342355Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2344454Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects malformed contributions during Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2347382Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2348532Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2348809Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2349353Z /plugin-contribution-stop-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2349703Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2349979Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2351361Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2352351Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2353492Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m108:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2355159Z     ^[[90m106|^[[39m         ^[[34mprojectWith^[[39m({ x^[[33m:^[[39m ^[[34mproperty^[[39m(^[[34m1^[[39m) }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2356215Z     ^[[90m107|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2357327Z     ^[[90m108|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-stop-order/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2358369Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2359434Z     ^[[90m109|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2360415Z     ^[[90m110|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2360738Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2361202Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2361589Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2363887Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects authored ease collisions before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2366940Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2368152Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2368454Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2369031Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2369387Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2369638Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2372179Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2374317Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2375264Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2376381Z     ^[[90m131|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2377333Z     ^[[90m132|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2378438Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2379610Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2380687Z     ^[[90m134|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2381633Z     ^[[90m135|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2381939Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2382361Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2382723Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2385101Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mmerges contributed keyframes into compiler diagnostics before timeline creation
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2388245Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2389419Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2389730Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2390305Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2390684Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2390964Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2392359Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2393567Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2394494Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m170:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2395591Z     ^[[90m168|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2396331Z     ^[[90m169|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2397435Z     ^[[90m170|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2398408Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2399477Z     ^[[90m171|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2400434Z     ^[[90m172|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2400750Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2401174Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2401541Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2403472Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22mrejects adoption of a track with malformed keyframes
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2406036Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2407037Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2407296Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2407702Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2407937Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2408173Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2409477Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2410426Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2411221Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m57:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2412151Z     ^[[90m 55|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2412740Z     ^[[90m 56|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2414439Z     ^[[90m 57|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m handle^[[33m.^[[39m^[[34madopt^[[39m(bad^[[33m,^[[39m owner))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2415862Z     ^[[90m   |^[[39m                                            ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2416800Z     ^[[90m 58|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2417555Z     ^[[90m 59|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2417852Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2418275Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2418650Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2420517Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22madopts a track into an existing motion and receives motion signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2424034Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2425928Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2427317Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2428666Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2430477Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2431711Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2432767Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2434433Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2436062Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2437482Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2438807Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m69:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2439493Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2439966Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2440333Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2442315Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-1 keeps a namespaced derived key out of every published surface
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2445584Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2447510Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2448816Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2450335Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2451640Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2452445Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2453627Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2454821Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2456025Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2457431Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2459008Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m42:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2459690Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2460137Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2460528Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2462503Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-2 keeps a declared unprefixed internal key out of the patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2465714Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2467664Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2469195Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2470982Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2472272Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2473091Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2474326Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2475463Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2476618Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2478052Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2479589Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2480211Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2480649Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2480984Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2482820Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2485920Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2487620Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2488852Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2490394Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2491681Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2492518Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2493586Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2494683Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2495906Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2497341Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2498935Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m84:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2499633Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2500095Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2500490Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2502533Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mdoes not drive the disposed Track after direct replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2506314Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2508164Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2509396Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2510889Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2512188Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2512984Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2514137Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2515307Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2516485Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2518033Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2519950Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m41:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2520863Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2521377Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2521768Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2523939Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves current progress when replacing
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2526978Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2528966Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2530342Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2531976Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2533561Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2534433Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2535453Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2536648Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2537893Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2539593Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2541549Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m56:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2542400Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2542913Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2543556Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2545628Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves the original array index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2551408Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2555842Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2557201Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2558788Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2560157Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2560992Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2562023Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2563478Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2564732Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2566426Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2568365Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m72:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2569208Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2569713Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2570108Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2572097Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps sibling progress healthy after replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2576746Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2579643Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2581020Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2582607Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2584221Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2585080Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2586144Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2587368Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2588610Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2590282Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2592202Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m86:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2593037Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2593802Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2594193Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2596143Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps the observation replacement path live
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2600534Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2603641Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2605258Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2607122Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2608472Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2609310Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2610331Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2611523Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2612616Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2614334Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2616006Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m103:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2616821Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2617241Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2617567Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2619254Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-10 interpolates grouped leaves without renaming the owning plugin
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2623907Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2626422Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2627136Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2627984Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2628811Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2629255Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2629930Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2630552Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2631181Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2631936Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2632706Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m56:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2633298Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2633648Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2634013Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2635728Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-11 interpolates a grouped track when the Engine has no plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2638910Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2641063Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2642414Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2644320Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2645986Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2646798Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2648112Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2649297Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2650511Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2651972Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2653761Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m70:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2654444Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2654938Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2655346Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2657272Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-12 publishes identical values for the flat and grouped spellings
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2660423Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2662535Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2664149Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2665746Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2667099Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2667922Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2668959Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2670171Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2671410Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2672855Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2674740Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m81:18^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2675427Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2675922Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2676323Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2678363Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-11 gives each trigger type its own input path instead of the manual one
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2681463Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2683711Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2685106Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2686677Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2688027Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2688851Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2689884Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2691066Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2692286Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2694064Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2696117Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m104:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2697113Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2697617Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2698025Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2700059Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-12 lets seek scrub a driver-backed node and lets the driver overwrite it
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2703405Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2705424Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2706776Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2708405Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2710122Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2711160Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2712530Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2714264Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2715706Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2717673Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2719568Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m123:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2720548Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2721203Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2721746Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2724273Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2730917Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2754031Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2755474Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2756932Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2758653Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2759835Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2760677Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2762000Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2763607Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2764721Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2766479Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2767194Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2767796Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2768182Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2769866Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2772362Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2773604Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2773799Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2774132Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2774445Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2774687Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2775796Z "property-stops-wrapper at addTrack(child).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2776729Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2777492Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m118:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2778494Z     ^[[90m116|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2778921Z     ^[[90m117|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2779765Z     ^[[90m118|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-un…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2780701Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2781328Z     ^[[90m119|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2782190Z     ^[[90m120|^[[39m     const replacement = handle.adopt({ id: "child", keyframes: { x: ra…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2782825Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2783535Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2783940Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2785764Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2788111Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2789232Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2789517Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2789977Z /observation-self-reference/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2790279Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2790475Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2791685Z "property-stops-wrapper at addTrack(self).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2792499Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2793633Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m140:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2794650Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2795062Z     ^[[90m139|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2795828Z     ^[[90m140|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-se…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2796736Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2797810Z     ^[[90m141|^[[39m     const replacement = handle.adopt({ id: "self", keyframes: { x: ram…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2799130Z     ^[[90m142|^[[39m     ^[[34mexpect^[[39m(replacement^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"~/self"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2799808Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2800253Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2800603Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2802101Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mcovers source spelling across an add and its matching remove
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2805813Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2808636Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2810124Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2811501Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2812744Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2813690Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2814669Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2815810Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2816988Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2818403Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2819938Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2820601Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2821022Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2821374Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2823027Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mdeduplicates equivalent observations and preserves no-op sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2827518Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2830223Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2830984Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2831821Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2832524Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2832949Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2833693Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2834307Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2834931Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2835729Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2836571Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m75:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2836956Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2837191Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2837413Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2838327Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mrejects an invalid free-track observation with stable diagnostics
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2841191Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2843258Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2844183Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2845144Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2845834Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2846248Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2846770Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2847366Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2848315Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2849887Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2851199Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m89:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2851610Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2851849Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2852070Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2852976Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mV-7 refuses an authored target through addObserve on either role
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2855683Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2857596Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2858301Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2859134Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2860169Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2860906Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2861622Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2862485Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2863698Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2865204Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2866838Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2867565Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2868042Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2868422Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2870138Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mJ-7 refuses an authored role or projection through addObserve
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2874412Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2877081Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2878295Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2879750Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2881192Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2881955Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2883323Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2884459Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2885561Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2887013Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2888582Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2889143Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2889409Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2889631Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2890736Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-9 keeps a motion-owned track live through replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2892790Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2894066Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2894750Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2895554Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2896239Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2896652Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2897173Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2897776Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2898390Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2899849Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2900762Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m60:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2901159Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2901386Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2901591Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2902778Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-10 preserves the array index and stagger timing across a replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2907059Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2909150Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2909885Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2910717Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2911408Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2911822Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2912606Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2913527Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2914339Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2915166Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2916073Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m73:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2916505Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2916737Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2916970Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2918178Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-11 keeps the observation replacement path resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2922182Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2925691Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2927147Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2928850Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2930377Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2931327Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2932457Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2933826Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2934533Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2935428Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2936381Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m88:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2936816Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2937071Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2937287Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2938438Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-12 disposes every compiled timeline exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2940878Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2942788Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2943802Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2944681Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2945413Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2945854Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2946420Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2947071Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2947731Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2948567Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2949500Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m104:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2949930Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2950157Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2950382Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2951596Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-13 keeps runtime add and remove in step with the resolver
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2953541Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2954643Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2955380Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2956273Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2956998Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2957461Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2958020Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2958667Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2959337Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2960165Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2961123Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m113:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2961537Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2961805Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2962039Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2963267Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2968463Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2972384Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2973328Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2974241Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2975016Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2975461Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2976033Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2976692Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2977378Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2978217Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2979155Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2979572Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2979826Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2980058Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2981096Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2982622Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2983445Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2983623Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2983912Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2984080Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2984235Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2988055Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2993734Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2994850Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m123:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2996823Z     ^[[90m121|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2997618Z     ^[[90m122|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2998319Z     ^[[90m123|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2998933Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.2999548Z     ^[[90m124|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3000060Z     ^[[90m125|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3000253Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3000501Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[58/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3000966Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3002017Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3007550Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3011090Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3011857Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3012739Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3013719Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3014198Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3014776Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3015435Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3016103Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3016965Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3017922Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m128:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3018354Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3018610Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[59/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3018841Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3020030Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m1. Engine time playback: project clock tick advances time motion playhead
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3021818Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3022914Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3023901Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3024797Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3025542Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3026006Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3026574Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3027214Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3027865Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3028643Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m40:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3029035Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3029280Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[60/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3029676Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3031014Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3033945Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3035578Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3036334Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3037214Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3037937Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3038387Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3038907Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3039523Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3040197Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3042772Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m98:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3043462Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3043773Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[61/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3043998Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3045222Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3046992Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3048142Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3048918Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3049713Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3050694Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3051757Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3052646Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3053814Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3054709Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3055542Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m142:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3055910Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3056142Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[62/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3056343Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3057512Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m4. Stale scheduled write: paused Motion cancels pending write before scheduler flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3059167Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3060453Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3061832Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3063544Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3064601Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3065042Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3065574Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3066173Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3066791Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3067537Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m199:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3067921Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3068159Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[63/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3068372Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3069576Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3071283Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3072269Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3072942Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3074080Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3074802Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3075236Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3075769Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3076363Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3076974Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3077716Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m245:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3078092Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3078325Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[64/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3078534Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3079660Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3081324Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3082325Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3083001Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3084055Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3084739Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3085161Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3085674Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3086460Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3087072Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3087967Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3088358Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3088586Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[65/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3088794Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3089868Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m2. Pause cancels pending scheduled write and prevents Track mutation on flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3091466Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3092450Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3093500Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3094369Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3095059Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3095476Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3096003Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3096595Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3097206Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3097963Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m78:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3098350Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3098589Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[66/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3098792Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3099753Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m5. Burst signals produce exactly 1 published patch batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3101291Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3102268Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3102937Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3104009Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3104699Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3105147Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3105664Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3106258Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3106890Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3107722Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m168:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3108378Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3108786Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[67/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3109179Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3110473Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m3. Manual and custom trigger ports operate without DOM imports in core
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3112116Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3113712Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3114443Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3115246Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3115926Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3116335Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3116846Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3117447Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3118055Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3118782Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m109:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3119389Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3119743Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[68/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3120031Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3121244Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3122940Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3124449Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3125143Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3125968Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3126660Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3127078Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3127596Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3128186Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3128794Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3129520Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m136:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3129894Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3130117Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[69/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3130325Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3131494Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3133339Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3133947Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3134103Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3134372Z /stop-position|monoton/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3134530Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3134657Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3135354Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3135867Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3136429Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m172:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3137396Z     ^[[90m170|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3137757Z     ^[[90m171|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3138437Z     ^[[90m172|^[[39m     expect(() => runtime.adopt(badTrack, {})).toThrow(/stop-position|m…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3139122Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3139484Z     ^[[90m173|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3139924Z     ^[[90m174|^[[39m     ^[[90m// Graph state byte-identical after failed adoption^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3140240Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3140471Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[70/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3140677Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3142319Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m1. Load valid walker project through Engine with plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3154124Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3162259Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3163660Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3165135Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3166337Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3167058Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3167975Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3169075Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3170186Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3171477Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m145:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3172114Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3172508Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[71/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3172835Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3174618Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m2. Render walker nodes through createDomPatchAdapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3186343Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3194932Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3196153Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3197234Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3197920Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3198360Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3198900Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3199992Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3200991Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3201732Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m164:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3202100Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3202334Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[72/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3202549Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3204176Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m3. Demonstrate time playback using single injected browser clock
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3210657Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3215509Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3216232Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3217042Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3217313Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3217479Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3217818Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3218100Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3218446Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3218899Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m199:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3219082Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3219440Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[73/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3219451Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3220441Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m4. Demonstrate progress through TriggerPort and manual signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3227986Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3228725Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3229262Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3229989Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3230371Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3230608Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3231109Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3231513Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3232009Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3232648Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m219:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3232660Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3232992Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[74/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3233003Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3234745Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3242216Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3242818Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3243457Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3244038Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3244339Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3244519Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3244902Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3245213Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3245613Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3246107Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m243:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3246123Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3246370Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[75/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3246385Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3247620Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3253734Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3254189Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3254554Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3255211Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3255598Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3255757Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3256108Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3256391Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3256736Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3257188Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m269:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3257198Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3257436Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[76/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3257445Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3258477Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m7. Mount, unmount, remount, and dispose without duplicate subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3264811Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3265302Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3265661Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3266157Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3266424Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3266583Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3266922Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3267209Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3267560Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3267991Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m305:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3268000Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3268220Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[77/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3268235Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3269208Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m8. Show blocked/pending/error diagnostics without crashing the app
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3275076Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3275774Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3276135Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3276627Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3276897Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3277057Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3277401Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3277677Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3278017Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3278447Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m330:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3278456Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3278691Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[78/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3278700Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3279602Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3285377Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3285789Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3286155Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3286637Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3286904Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3287198Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3287544Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3287935Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3288277Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3288712Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m351:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3288720Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3288937Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[79/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3288952Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3289866Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m10. Automated end-to-end integration test passes clean
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3296488Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3296973Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3297341Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3297832Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3298097Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3298251Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3298642Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3298930Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3299268Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3299698Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m387:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3299714Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3299943Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[80/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3299957Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3301093Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3301999Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3302375Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3302724Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3303464Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3303944Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3304214Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3304562Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3304844Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3305187Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3305697Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3306186Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m147:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3306195Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3306422Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[81/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3306431Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3307488Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-7 cites the section in a diagnostic about a leaf inside it
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3307951Z ^[[31m^[[1mAssertionError^[[22m: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3307960Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308105Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308216Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308399Z   "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308531Z   "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308617Z }
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308625Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308756Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308833Z [
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3308923Z   {
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3309260Z     "message": "The { stops: [...] } wrapper is retired; author the stops array directly as the value.",
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3309410Z     "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3309554Z     "ruleId": "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3309656Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3309745Z   },
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3309825Z ]
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3309833Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3310334Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m214:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3310687Z     ^[[90m212|^[[39m   it("Y-7 cites the section in a diagnostic about a leaf inside it", (…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3311024Z     ^[[90m213|^[[39m     const authored = { fk: { values: { length: { stops: [{ p: 2, v: 1 …
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3311416Z     ^[[90m214|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3311630Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3311896Z     ^[[90m215|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3312218Z     ^[[90m216|^[[39m         ruleId^[[33m:^[[39m ^[[32m"stop-position-range"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3312235Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3312462Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[82/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3312478Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3313729Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314167Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'property-stops-wrapper' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314177Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314306Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314430Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314437Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314545Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314655Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314841Z ^[[31m+   "property-stops-wrapper",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314949Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3314957Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3315452Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m228:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3315931Z     ^[[90m226|^[[39m     // a property called `values` that `fk` claims, and nothing about …
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3316699Z     ^[[90m227|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m { fk^[[33m:^[[39m { values^[[33m:^[[39m { values^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } } }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3317119Z     ^[[90m228|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m(authored))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3317329Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3317451Z     ^[[90m229|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3317794Z     ^[[90m230|^[[39m     const resolved = registry(passthrough).resolveForKeyframes(authore…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3317808Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3318032Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[83/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3318041Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3319133Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3324959Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3325368Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3325720Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3326211Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3326472Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3326632Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3326977Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3327265Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3327610Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3328126Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3328612Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m278:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3328622Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3328843Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[84/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3328857Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3329911Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3334184Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3334884Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3335238Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3335733Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3335996Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3336154Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3336497Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3336772Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3337105Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3337601Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3338079Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3338088Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3338312Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[85/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3338328Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3339423Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3344013Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3344457Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3344813Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3345300Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3345561Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3345715Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3346055Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3346328Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3346661Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3347305Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3347894Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3347904Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3348131Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[86/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3348140Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3349119Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3349881Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3349891Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3350025Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3350156Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3350173Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3350296Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3354132Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3354164Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3354676Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m146:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3354845Z     ^[[90m144|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3355003Z     ^[[90m145|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3355340Z     ^[[90m146|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3355590Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3355740Z     ^[[90m147|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3355854Z     ^[[90m148|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3355862Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3356085Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[87/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3356099Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3357162Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3360487Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3360888Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3361240Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3361740Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3362151Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3362432Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3362783Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3363057Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3363578Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3364083Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3364558Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m162:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3364567Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3364789Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[88/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3364805Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3365849Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3369964Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3370353Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3370706Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3371194Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3371448Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3371607Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3371946Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3372219Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3372549Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3373043Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3373649Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m192:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3373665Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3373892Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[89/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3373900Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3374909Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3375668Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3375677Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3375812Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3375945Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3375953Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3376076Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3379724Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3379846Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3380447Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m213:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3380619Z     ^[[90m211|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3380780Z     ^[[90m212|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3381112Z     ^[[90m213|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3381365Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3381514Z     ^[[90m214|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3381660Z     ^[[90m215|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3381668Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3381885Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[90/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3381894Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3382899Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mre-registers the compiled Track without throwing on the next Motion update
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3383881Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3384360Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3384882Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3385398Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3385670Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3385834Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3386177Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3386457Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3386800Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3387242Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m27:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3387258Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3387478Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[91/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3387493Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3388401Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mpreserves the replaced Track index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3390609Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3390990Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3391497Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3392106Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3392370Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3392540Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3392885Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3393303Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3393656Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3394096Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m64:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3394105Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3394330Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[92/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3394345Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3395263Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mupdates a Motion-owned Track through observation mutations
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3396778Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3397156Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3397500Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3397986Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3398255Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3398449Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3398800Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3399070Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3399409Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3399848Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m91:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3399856Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3400080Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[93/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3400088Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3401148Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3402105Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3402594Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3402952Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3403578Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3403848Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3404007Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3404354Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3404625Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3404970Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3405499Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3406009Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3406018Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3406237Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[94/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3406244Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3407351Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3408162Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3408537Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3408884Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3409379Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3409645Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3409802Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3410137Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3410412Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3410744Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3411266Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3411771Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m113:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3411790Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3412008Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[95/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3412017Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3413208Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3414028Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3414400Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3414744Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3415235Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3415735Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3415890Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3416226Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3416497Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3416828Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3417340Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3417842Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3417851Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3418070Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[96/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3418084Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3419197Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-4 changes nothing when the candidate graph refuses a derived observation
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3420004Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3420375Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3420717Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3421195Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3421452Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3421607Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3421945Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3422221Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3422546Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3423243Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3423764Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m143:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3423774Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3423998Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[97/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3424006Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3425036Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mcreates a motion, attaches a track, and signals progress from an empty project
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3425836Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3426338Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3426697Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3427161Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3427736Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3427902Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3428256Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3428813Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3429398Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3429739Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3430205Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m42:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3430214Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3430439Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[98/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3430447Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3431503Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mrejects motion destruction while it still owns tracks, then allows empty destruction
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3432287Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3432789Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3433337Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3433811Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3434395Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3434560Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3434914Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3435321Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3435810Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3436153Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3436616Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m58:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3436625Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3436841Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[99/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3436856Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3437736Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mkeeps two runtime motions independently signalable
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3438515Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3439008Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3439361Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3439827Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3440404Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3440567Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3440917Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3441317Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3441802Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3442137Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3442758Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m74:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3442909Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3443265Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[100/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3443276Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3444339Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3448436Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3448841Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3449194Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3449675Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3449937Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3450096Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3450446Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3450722Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3451062Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3451527Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m45:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3451964Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m52:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3451973Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3452191Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[101/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3452199Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3453401Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3454224Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3454653Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3455031Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3455588Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3456040Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3456252Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3456663Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3457001Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3457530Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3458111Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m153:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3458822Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m175:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3458833Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3459122Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[102/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3459130Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3460225Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-6 rolls the Motion back when the candidate graph rejects it
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3461023Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3461656Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3462090Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3462624Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3463443Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3463767Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3464214Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3464694Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3465258Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3465621Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3466222Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m360:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3466240Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3466529Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[103/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3466539Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3467665Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-7 keeps one clock subscription when a Motion is created at runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3468508Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3469100Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3469536Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3470072Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3470685Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3470899Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3471377Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3471856Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3472379Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3472825Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3473606Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m397:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3473760Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3474100Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[104/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3474217Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3475206Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.1 drives progress from an injected source and clamps out-of-range emissions
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3476055Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3476488Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3476966Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3477566Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3477868Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3489463Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3490116Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3490438Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3490805Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3491258Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3491678Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m76:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3491690Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3491924Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[105/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3491934Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3492824Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.2 subscribes to the injected source once and unsubscribes exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3493820Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3494246Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3494611Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3495096Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3495360Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3495519Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3495863Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3496142Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3496491Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3496935Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3497336Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m99:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3497349Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3497574Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[106/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3497583Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3498542Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.4 unsubscribes an already resolved source when a later Motion cannot resolve
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3499310Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3499500Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3499650Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3499782Z /trigger-driver-unavailable/
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3499927Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3500062Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3501276Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3501286Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3501694Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3501902Z     ^[[90m131|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3502236Z     ^[[90m132|^[[39m       load(resolve, [scrollMotion("hero", "hero"), scrollMotion("orpha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3502616Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/trigger-driver-unavailable/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3502773Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3502884Z     ^[[90m134|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3503533Z     ^[[90m135|^[[39m     ^[[34mexpect^[[39m(hero^[[33m.^[[39msubscriptions)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3503554Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3503791Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[107/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3503800Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3504623Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mregisters no clock consumer for a push-driven scroll Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3505428Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3505806Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3506154Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3506647Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3506912Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3507068Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3507406Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3507678Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3508017Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3508436Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3508838Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m141:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3508848Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3509071Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[108/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3509085Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3509814Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mrejects external signals for scroll Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3510625Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3510997Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3511338Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3511821Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3512081Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3512235Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3512725Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3513296Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3513656Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3514084Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3514487Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m163:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3514495Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3514711Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[109/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3514719Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3515527Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3515898Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3515916Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3516046Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3516177Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3516184Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3516296Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3516421Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3516428Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3516847Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3517173Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3517329Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3517755Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3517946Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3518290Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3518444Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3518458Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3518686Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[110/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3518702Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3519600Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3520417Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3520798Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3521150Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3521634Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3521905Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3522067Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3522420Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3522690Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3523033Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3523619Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3524043Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3524052Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3524272Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[111/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3524285Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3525162Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3526125Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3526617Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3526962Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3527452Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3527714Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3527873Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3528207Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3528485Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3528827Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3529278Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3529694Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3529709Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3529928Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[112/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3529937Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3530821Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3532324Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3532711Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3533054Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3533670Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3533933Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3534092Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3534430Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3534704Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3535038Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3535481Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3535910Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3535918Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3536139Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[113/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3536147Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3536997Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3537804Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3538174Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3538521Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3539152Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3539528Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3539683Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3540022Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3540297Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3540626Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3541051Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3541059Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3541284Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[114/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3541292Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3542168Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3542991Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3543555Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3543910Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3544394Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3544654Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3544808Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3545148Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3545425Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3545761Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3546196Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3546615Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3546623Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3546843Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[115/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3546851Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3547662Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3548461Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3548972Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3549424Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3549905Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3550158Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3550316Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3550653Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3550922Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3551249Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3551689Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3552113Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3552126Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3552341Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[116/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3552355Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3553343Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3554862Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3555235Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3555587Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3556071Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3556336Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3556497Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3556847Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3557126Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3557461Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3557909Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3558330Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3558343Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3558563Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[117/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3558577Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3559379Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3560183Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3560557Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3560898Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3561386Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3561780Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3561940Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3562386Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3562667Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3563002Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3563614Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3564003Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m39:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3564012Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3564239Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[118/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3564247Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3564994Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3565813Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3566191Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3566536Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3567020Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3567280Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3567436Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3567773Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3568047Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3568385Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3568860Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3569248Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3569256Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3569481Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[119/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3569489Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3570296Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mrejects external signals without changing progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3571098Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3571478Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3571831Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3572321Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3572576Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3572734Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3573186Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3573466Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3573796Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3574269Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3574655Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m66:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3574792Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3575169Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[120/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3575179Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3575992Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mcoalesces rapid driver ticks to the latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3576807Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3577186Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3577534Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3578012Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3578282Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3578448Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3578792Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3579062Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3579401Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3579879Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3580264Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m78:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3580280Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3580500Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[121/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3580508Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3581370Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mkeeps manual signals working and preserves range validation
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3582192Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3582565Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3582904Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3583576Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3583845Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3584009Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3584346Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3584629Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3584973Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3585367Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m113:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3585382Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3585597Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[122/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3585605Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3586537Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22misolates a throwing clock consumer while preserving other Motion progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3587346Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3587717Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3588196Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3588789Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3589048Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3589208Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3589541Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3589813Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3590145Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3590541Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m152:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3590549Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3590765Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[123/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3590779Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3591805Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mingests authored tracks into the removable store without auto-mounting
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3593444Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3593832Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3594171Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3594652Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3594918Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3595080Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3595414Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3595686Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3596019Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3596540Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m28:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3596995Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m33:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3597004Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3597230Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[124/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3597238Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3598216Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreturns a capability handle and makes stale ABA handles inert
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3599051Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3599548Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3599905Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3600370Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3600955Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3601122Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3601605Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3602126Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3602627Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3602975Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3603577Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m53:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3603588Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3603816Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[125/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3603825Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3604843Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreplaces a track non-destructively and preserves subscriber identity
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3605634Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3606130Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3606482Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3606938Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3607514Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3607674Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3608025Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3608440Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3608935Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3609279Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3609739Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m64:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3609748Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3609967Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[126/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3609975Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3610988Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreads dependants from the committed graph and rejects source removal
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3611773Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3612271Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3612631Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3613201Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3613786Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3613950Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3614303Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3614714Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3615332Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3615796Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3616259Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3616268Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3616492Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[127/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3616500Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3617503Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mtreats observation changes as replacement of the observer track
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3618283Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3618780Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3619141Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3619608Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3620179Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3620341Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3620689Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3621097Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3621583Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3621936Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3622400Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m90:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3622415Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3622637Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[128/128]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3622645Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3622656Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3623276Z ^[[2m Test Files ^[[22m ^[[1m^[[31m34 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m23 passed^[[39m^[[22m^[[90m (57)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3623742Z ^[[2m      Tests ^[[22m ^[[1m^[[31m128 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m113 passed^[[39m^[[22m^[[90m (241)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3623926Z ^[[2m   Start at ^[[22m 00:18:24
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3624423Z ^[[2m   Duration ^[[22m 5.21s^[[2m (transform 1.29s, setup 407ms, import 4.02s, tests 1.09s, environment 9ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3624431Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3624437Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3646311Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopt-destroy-readopt.test.ts:40:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3653802Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3657579Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:33:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3658077Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3661548Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:56:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3662313Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3665716Z ##[error]AssertionError: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3666175Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3669589Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:89:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3670022Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3672966Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3673672Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3676633Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3677085Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3679989Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3680449Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3682858Z ##[error]AssertionError: expected { kind: 'wrapper' } to deeply equal { kind: 'animated', stops: [ …(2) ] }
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3683500Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3685306Z ##[error]AssertionError: compiler, a well formed animated property: expected [] to deeply equal [ 'x' ]
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3685769Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3687862Z ##[error]AssertionError: a leaf that is not a record: expected [] to deeply equal [ 'stops-shape at keyframes.x.stops' ]
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3688299Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3690430Z ##[error]AssertionError: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3690870Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3693310Z ##[error]AssertionError: expected [] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.length",
integration (node 24)	Run npm run test:integration	  "ruleId": "plugin-contribution-static-unsupported",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:310:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3694103Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3723524Z ##[error]AssertionError: expected [ …(60) ] to deeply equal []
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3724464Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3727165Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3727639Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3730317Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:38:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3730782Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3733557Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:60:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3734042Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3736681Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:79:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3737126Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3739746Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:94:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3740199Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3743436Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3743915Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3747115Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3747569Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3751245Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3751844Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3754888Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:74:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3755702Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3758487Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:38:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3759191Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3761866Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:75:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3762309Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3765925Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3766430Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3770845Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3771290Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3774853Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3775342Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3778365Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3778806Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3782110Z ##[error]TypeError: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/handle-adoption.test.ts:69:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3782587Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3785879Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:42:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3786338Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3789486Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3790218Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3793554Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:84:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3794036Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3797477Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:41:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3797936Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3801387Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:56:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3801831Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3807342Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:72:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3807828Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3812218Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:86:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3812673Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3817212Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:103:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3817681Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3822115Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:56:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3822855Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3826293Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:70:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3826757Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3829914Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:81:18
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3830374Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3833734Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:104:44
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3834202Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3837419Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:123:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3837874Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3843851Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3844512Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3847883Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3848484Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3851814Z ##[error]AssertionError: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3852269Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3856630Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3857110Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3861326Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:75:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3861798Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3867059Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:89:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3867538Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3871762Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3872211Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3877086Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3877935Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3881328Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:60:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3881790Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3887174Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:73:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3887662Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3891914Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:88:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3892365Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3896733Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:104:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3897192Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3900520Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:113:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3900975Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3908997Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3909749Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3917738Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3918246Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3926328Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:128:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3926828Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3929532Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:40:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3929975Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3933747Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:98:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3934228Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3937353Z ##[error]TypeError: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:142:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3937799Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3940453Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:199:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3941213Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3944023Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:245:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3944482Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3947168Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3947621Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3950278Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:78:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3950708Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3953511Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:168:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3953962Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3956606Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:109:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3957050Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3959698Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:136:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3960135Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3963471Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3963949Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3973585Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:145:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3974363Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3984039Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:164:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3984545Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3994162Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:199:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.3994661Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4004481Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:219:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4005288Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4015036Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:243:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4015550Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4025163Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:269:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4025659Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4035372Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:305:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4036127Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4045800Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:330:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4046313Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4055941Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:351:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4056439Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4066066Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:387:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4066838Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4070349Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:147:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4070811Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4074737Z ##[error]AssertionError: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4075210Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4077140Z ##[error]AssertionError: expected [ 'property-stops-wrapper' ] to deeply equal []
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4077594Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4087914Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:278:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4088409Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4096494Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4097268Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4105436Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4105945Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4114038Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4114541Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4121402Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:162:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4122025Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4130925Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:192:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4135688Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4144003Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4148485Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4151206Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:27:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4152839Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4157620Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:64:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4160239Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4164021Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:91:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4166362Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4169758Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4171865Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4175420Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:113:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4177407Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4180810Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4182776Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4186301Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:143:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4188285Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4191679Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:42:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4193810Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4197792Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:58:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4199919Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4203677Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:74:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4205729Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4213957Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:45:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:52:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4218828Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4222206Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/t4-runtime-motion-parity.test.ts:153:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:175:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4224329Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4227800Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:360:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4229823Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4233418Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:397:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4235448Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4238525Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:76:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4240370Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4243677Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:99:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4245559Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4249784Z ##[error]AssertionError: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4252154Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4255358Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:141:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4257218Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4260511Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:163:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4262499Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4264239Z ##[error]AssertionError: expected false to be true // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4265361Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4268516Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4270399Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4273643Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4275515Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4279617Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4281956Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4284699Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4286325Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4289447Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4291313Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4294535Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4296409Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4300560Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4303201Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4306515Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:39:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4308407Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4311488Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:59:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4313497Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4316609Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:66:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4318460Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4321534Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:78:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4323518Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4326102Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:113:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4327682Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4330230Z ##[error]TypeError: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:152:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4331816Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4336179Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:28:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:33:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4338609Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4342043Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:53:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4344173Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4347585Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:64:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4349914Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4354107Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4356316Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4359882Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:90:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:18:30.4364951Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-23T00:18:24.7123902Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.7124496Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.7173835Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.7174346Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.7174566Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.7174797Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.8219668Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.8220477Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.8220950Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:24.8221158Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1414809Z ##[error]apps/react-demo/src/full-body-project.ts(34,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1424342Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1425525Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1426580Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1427233Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1429973Z ##[error]apps/react-demo/src/full-body-project.ts(65,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1434402Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1435987Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1436903Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1437578Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1439761Z ##[error]apps/react-demo/src/full-body-project.ts(96,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1441211Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1442181Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1443027Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1443698Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1446003Z ##[error]apps/react-demo/src/full-body-project.ts(127,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1447658Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1448611Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1449489Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1450136Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1452127Z ##[error]apps/react-demo/src/full-body-project.ts(160,13): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1455736Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1457556Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1459111Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1460163Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1463538Z ##[error]apps/react-demo/src/full-body-project.ts(200,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1466063Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1467689Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1469153Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1470169Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1473396Z ##[error]apps/react-demo/src/full-body-project.ts(227,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1475897Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1477491Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1478942Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1479942Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1483209Z ##[error]apps/react-demo/src/full-body-project.ts(254,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1485888Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1487575Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1489084Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1490121Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1493521Z ##[error]apps/react-demo/src/full-body-project.ts(285,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1496029Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1497684Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1499175Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1500485Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1504185Z ##[error]apps/react-demo/src/full-body-project.ts(316,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1506562Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1508122Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1509547Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1510547Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1513780Z ##[error]apps/react-demo/src/full-body-project.ts(347,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1516215Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1518157Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1519580Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1520571Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1523986Z ##[error]apps/react-demo/src/full-body-project.ts(378,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1526553Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1528195Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1529675Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1530699Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1534173Z ##[error]apps/react-demo/src/full-body-project.ts(409,13): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1536535Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1538181Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1539649Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1540656Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1544424Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(20,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1548795Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(35,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1553389Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(68,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1557999Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(40,34): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1560310Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1561352Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1562339Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1563210Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1566237Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(62,36): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1568536Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1569544Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1570519Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1571382Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1573629Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(30,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1577005Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(42,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1578863Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1580571Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(43,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1582426Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1584535Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(54,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1587715Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(60,15): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1589684Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1591641Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(79,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1595563Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(87,63): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1599569Z ##[error]packages/core/test/integration/adoption.test.ts(78,52): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1603693Z ##[error]packages/core/test/integration/adoption.test.ts(91,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1607992Z ##[error]packages/core/test/integration/adoption.test.ts(112,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1612497Z ##[error]packages/core/test/integration/end-to-end.test.ts(21,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1616822Z ##[error]packages/core/test/integration/engine-headless.test.ts(19,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1621528Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(34,70): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1624718Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1626636Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1627971Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1629109Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1630176Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1631078Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1633821Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(62,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1636656Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1638284Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1639458Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1640614Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1641686Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1642595Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1645615Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(69,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1648395Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1649927Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1651113Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1652281Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1653374Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1654442Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1657056Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(89,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1660274Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1661452Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1662603Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1663671Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1664754Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1668023Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(142,7): error TS2322: Type '() => { keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1671506Z   Call signature return types '{ keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1672936Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1674580Z       Type '{ derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1675931Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1677164Z           Type '{ stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1680383Z ##[error]packages/core/test/integration/handle-adoption.test.ts(57,31): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1682646Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1683687Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1684830Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1685696Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1688502Z ##[error]packages/core/test/integration/handle-adoption.test.ts(74,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1692098Z ##[error]packages/core/test/integration/internal-key-strip.test.ts(28,44): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1695635Z ##[error]packages/core/test/integration/issue-114-motion-track-regressions.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1698728Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(56,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1700186Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1701213Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1702591Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1703811Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1704541Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1706057Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(70,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1707314Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1708146Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1708909Z       Types of property 'boneLength' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1709488Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1710816Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(81,33): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1712987Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(83,36): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1714354Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1715173Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1716181Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1716854Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1717411Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1718912Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(50,34): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1720167Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1720776Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1721361Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1721886Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1723824Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(49,5): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1725411Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1726460Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1727371Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1727915Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1729930Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(61,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1731715Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1732656Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1733510Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1734179Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1735544Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(114,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1737547Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(120,66): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1739552Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(136,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1741512Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(141,65): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1743851Z ##[error]packages/core/test/integration/observation-identity.test.ts(35,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1746111Z ##[error]packages/core/test/integration/option-c-track-resolution.test.ts(17,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1748720Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(38,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1750141Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1751085Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1751937Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1752484Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1754569Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(53,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1756070Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1757132Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1758041Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1758573Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1760232Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(116,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1761885Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1762663Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1763391Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1763918Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1765351Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(117,9): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1767662Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(24,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1770042Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(71,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1772431Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(82,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1774882Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(147,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1777253Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(183,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1779604Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(229,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1781965Z ##[error]packages/core/test/integration/phase2-motion-scheduling.test.ts(25,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1784442Z ##[error]packages/core/test/integration/phase3-trigger-port.test.ts(27,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1786826Z ##[error]packages/core/test/integration/phase4-dynamic-lifecycle.test.ts(164,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1789548Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(37,21): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1790952Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1791980Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1792896Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1793493Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1795567Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(64,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1797274Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1798215Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1799070Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1799684Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1801733Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(86,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1803163Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1804195Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1805039Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1805631Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1807613Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(60,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1809043Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1809962Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1810791Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1811334Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1813293Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(75,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1814829Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1816346Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1817293Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1817816Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1819657Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(123,20): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1853901Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1855324Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1856674Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1857264Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1859444Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(140,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1861210Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1862778Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1863838Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1864602Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1866575Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(153,9): error TS2322: Type '{ values: { weight: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; destination: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1868077Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1868915Z     Type '{ weight: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1869655Z       Types of property 'weight' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1870208Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1872251Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(184,17): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1874160Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1875651Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1876662Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1877201Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1879270Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(207,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { debug: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1880783Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1881726Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1882586Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1883137Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1884654Z ##[error]packages/core/test/integration/replace-motion-track.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1886701Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(32,36): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1889251Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(46,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1890526Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1891629Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1892746Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1893458Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1895071Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(52,16): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1898027Z ##[error]packages/core/test/integration/runtime-motion-lifecycle.test.ts(31,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1901967Z ##[error]packages/core/test/integration/single-input-channel.test.ts(23,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1903516Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1904924Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1906332Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1907177Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1909805Z ##[error]packages/core/test/integration/single-input-channel.test.ts(28,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1911370Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1912321Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1913177Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1913730Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1917170Z ##[error]packages/core/test/integration/t4-runtime-motion-parity.test.ts(126,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1921174Z ##[error]packages/core/test/integration/trigger-scroll.test.ts(70,67): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1923223Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1924367Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1925349Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1926218Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1929023Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(104,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1931337Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1932337Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1933316Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1934301Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1936695Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(123,69): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1938696Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1939666Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1940578Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1941413Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1944256Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(127,29): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1946534Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1947554Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1948530Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1949390Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1951928Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,16): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1954147Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1955151Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1956046Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1956895Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1958729Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,30): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1960014Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1961167Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1962055Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1962884Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1964672Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(182,47): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1966029Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1966645Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1967233Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1967977Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1969605Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(196,68): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1970857Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1971454Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1972043Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1972546Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1973984Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(198,62): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1975438Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1976026Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1976598Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1977120Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1978578Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(214,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1979806Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1980396Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1980994Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1981516Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1982951Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(228,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1985088Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1985734Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1986322Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1986838Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1988357Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(229,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1989626Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1990229Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1990807Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1991321Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1992761Z ##[error]packages/core/test/integration/trigger-time.test.ts(31,79): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1993976Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1994895Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1995791Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1996290Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1997759Z ##[error]packages/core/test/integration/trigger-time.test.ts(115,77): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1999019Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.1999611Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2000186Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2000698Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2002151Z ##[error]packages/core/test/integration/trigger-time.test.ts(156,75): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2003376Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2003979Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2005074Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2005636Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2006970Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(21,29): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2009458Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(20,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2011070Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2011761Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2012445Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2013084Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2013636Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2015390Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(51,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2017018Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2017713Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2018375Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2019003Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2019542Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2021060Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(58,7): error TS2322: Type '() => { keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2022630Z   Call signature return types '{ keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2023650Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2024578Z       Type '{ second: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2025222Z         Property 'second' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2025768Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2027660Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(105,7): error TS2322: Type '() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2029583Z   Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2030432Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2031149Z       Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2031820Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2032422Z           Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2034620Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(128,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2036541Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2037740Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2038568Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2039295Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2039965Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2040562Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2042562Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(135,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2044697Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2045892Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2046723Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2047455Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2048133Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2048746Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2050548Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(154,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2052322Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2053007Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2053690Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2054535Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2055088Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2056513Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(28,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2058421Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(52,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2060268Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(72,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2062090Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(92,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2063910Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(94,47): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2065857Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(95,46): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2067707Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(124,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2069535Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(137,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2071394Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(138,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2073655Z ##[error]packages/core/test/unit/graph/requirement-edge-construction.test.ts(53,37): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2075092Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2075904Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2076645Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2077269Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2078951Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(59,39): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2080220Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2080997Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2082036Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2082670Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2084805Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(58,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2087396Z ##[error]packages/react/test/public-hook-render.test.ts(69,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:18:28.2092216Z ##[error]Process completed with exit code 2.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	﻿2026-08-23T00:18:26.1129896Z ##[group]Run npx vitest run packages/core/test/integration/end-to-end.test.ts
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:26.1130539Z ^[[36;1mnpx vitest run packages/core/test/integration/end-to-end.test.ts^[[0m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:26.1175598Z shell: /usr/bin/bash -e {0}
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:26.1175880Z env:
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:26.1176108Z   NODE_VERSION: 24
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:26.1176338Z ##[endgroup]
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:26.7482625Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:26.7495103Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:26.7513934Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3084332Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3086697Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 6^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3110803Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3111877Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3112873Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3117328Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3124330Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3129200Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3220061Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3221656Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3222959Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3224062Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3225064Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3226192Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3227599Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3228175Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3229016Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3229696Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3230222Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3231135Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3232068Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3232911Z ^[[2m   Start at ^[[22m 00:18:26
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3233311Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3264599Z ^[[2m   Duration ^[[22m 535ms^[[2m (transform 310ms, setup 17ms, import 372ms, tests 8ms, environment 0ms)^[[22m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3265540Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3293700Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3337169Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ assertValidProject packages/core/src/engine.ts:101:11
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ Engine.load packages/core/src/engine.ts:170:29
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:18:27.3699904Z ##[error]Process completed with exit code 1.
```
