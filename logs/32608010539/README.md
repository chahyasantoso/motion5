# CI log archive: 32608010539

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lf-bare-authored-leaf
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32608010539
- Captured: 2026-08-23T00:30:42Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-23T00:30:19.6111540Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.6111991Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.6152599Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.6152929Z env:
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.6153173Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.6153436Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.7203174Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.7204145Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.7205197Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:19.7206092Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.1671568Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.1675924Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.1676564Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.6805173Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7017344Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7020156Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7023054Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7025546Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7028536Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7031055Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7033112Z ^[[31m     ^[[31m×^[[31m T-6 rolls the Motion back when the candidate graph rejects it^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7035436Z ^[[31m     ^[[31m×^[[31m T-7 keeps one clock subscription when a Motion is created at runtime^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7431977Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 72^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7433821Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7434692Z      ^[[32m✓^[[39m LF-6 publishes a bare static value and holds it at every progress^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7436090Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7437502Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7438637Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7440030Z ^[[31m     ^[[31m×^[[31m LF-10 closes the static domain instead of leaving it open^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7441288Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7442466Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7443641Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7444889Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7446541Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.7448105Z ^[[31m     ^[[31m×^[[31m LF-16 leaves no authored schema in the repository on the retired form^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9617047Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9619914Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9622388Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9624472Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9626539Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9628254Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9630015Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9631888Z ^[[31m     ^[[31m×^[[31m Y-7 cites the section in a diagnostic about a leaf inside it^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9633712Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9635803Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9637635Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9639390Z      ^[[32m✓^[[39m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9641193Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:20.9643611Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0634192Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m8 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0637220Z      ^[[32m✓^[[39m L-11 accepts the loop fields and names each loop rule by id^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0648099Z      ^[[32m✓^[[39m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0650385Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0652447Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0654209Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0656208Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0658502Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0660416Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0662231Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0664069Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.0665078Z      ^[[32m✓^[[39m L-21 keeps loop time running while its Motion is paused^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1264533Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1267713Z ^[[31m     ^[[31m×^[[31m 1. Load valid walker project through Engine with plugin registry^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1270015Z ^[[31m     ^[[31m×^[[31m 2. Render walker nodes through createDomPatchAdapter^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1272349Z ^[[31m     ^[[31m×^[[31m 3. Demonstrate time playback using single injected browser clock^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1275033Z ^[[31m     ^[[31m×^[[31m 4. Demonstrate progress through TriggerPort and manual signals^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1292467Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1296807Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1298979Z ^[[31m     ^[[31m×^[[31m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1300947Z ^[[31m     ^[[31m×^[[31m 8. Show blocked/pending/error diagnostics without crashing the app^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1302705Z ^[[31m     ^[[31m×^[[31m 9. Use React usePatch hook at the React boundary^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1304371Z ^[[31m     ^[[31m×^[[31m 10. Automated end-to-end integration test passes clean^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.1996396Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.3041213Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4020645Z  ^[[31m❯^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4023519Z ^[[31m     ^[[31m×^[[31m 1. Engine time playback: project clock tick advances time motion playhead^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4029590Z ^[[31m     ^[[31m×^[[31m 2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4032374Z ^[[31m     ^[[31m×^[[31m 3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4035023Z ^[[31m     ^[[31m×^[[31m 4. Stale scheduled write: paused Motion cancels pending write before scheduler flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4037468Z ^[[31m     ^[[31m×^[[31m 5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4792614Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4795367Z ^[[31m     ^[[31m×^[[31m T-11 gives each trigger type its own input path instead of the manual one^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4807299Z ^[[31m     ^[[31m×^[[31m T-12 lets seek scrub a driver-backed node and lets the driver overwrite it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4809183Z      ^[[32m✓^[[39m advances from the one injected clock and rejects control after disposal^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.4810985Z      ^[[32m✓^[[39m cancels queued trigger work when paused and does not duplicate on remount^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.5788065Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.5790568Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.5792599Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.5794422Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.5796379Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.5798069Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.5800269Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.6520478Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.6523229Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.6525861Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.6528118Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.6530281Z ^[[31m     ^[[31m×^[[31m U-4 changes nothing when the candidate graph refuses a derived observation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.7708156Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.7709760Z      ^[[32m✓^[[39m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.7712155Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.7713931Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.7715009Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.7716487Z      ^[[32m✓^[[39m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.7717647Z ^[[31m     ^[[31m×^[[31m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8125783Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8131771Z      ^[[32m✓^[[39m adopts a free track under ~/id and publishes through the ordinary graph path^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8139303Z      ^[[32m✓^[[39m rejects duplicate adopted ids instead of silently replacing membership^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8141255Z      ^[[32m✓^[[39m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8143254Z      ^[[32m✓^[[39m keeps every adopted track independently addressable across sequential adopt and destroy calls^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8145096Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-finite stop positions^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8147040Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-monotonic stop positions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8148746Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with duplicate stop positions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8151794Z      ^[[32m✓^[[39m adopts a track into an existing motion under motionId/trackId^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8153040Z      ^[[32m✓^[[39m rejects adopting into a non-existent motion^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.8154411Z      ^[[32m✓^[[39m destroys a motion-adopted track and invokes removeMotionTrack^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.9354345Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.9357347Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.9359159Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.9361249Z ^[[31m     ^[[31m×^[[31m rejects external signals without changing progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.9364539Z ^[[31m     ^[[31m×^[[31m coalesces rapid driver ticks to the latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.9366790Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.9368629Z ^[[31m     ^[[31m×^[[31m keeps manual signals working and preserves range validation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:21.9370591Z ^[[31m     ^[[31m×^[[31m isolates a throwing clock consumer while preserving other Motion progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0468458Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0480517Z ^[[31m     ^[[31m×^[[31m 3.1 drives progress from an injected source and clamps out-of-range emissions^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0483118Z ^[[31m     ^[[31m×^[[31m 3.2 subscribes to the injected source once and unsubscribes exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0486015Z      ^[[32m✓^[[39m 3.3 rejects a missing source with a trigger-driver-unavailable diagnostic^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0491795Z ^[[31m     ^[[31m×^[[31m 3.4 unsubscribes an already resolved source when a later Motion cannot resolve^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0494067Z ^[[31m     ^[[31m×^[[31m registers no clock consumer for a push-driven scroll Motion^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0496474Z ^[[31m     ^[[31m×^[[31m rejects external signals for scroll Motions^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0767495Z  ^[[31m❯^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0797442Z ^[[31m     ^[[31m×^[[31m passes contribution context and creates the prepared timeline at load^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0817431Z ^[[31m     ^[[31m×^[[31m selects one predicate contributor through Engine.load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0820824Z ^[[31m     ^[[31m×^[[31m rejects malformed contributions during Engine.load^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0823025Z ^[[31m     ^[[31m×^[[31m rejects authored ease collisions before any timeline is created^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.0827831Z ^[[31m     ^[[31m×^[[31m merges contributed keyframes into compiler diagnostics before timeline creation^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.2062669Z  ^[[31m❯^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.2067494Z      ^[[32m✓^[[39m 1. Port lifecycle: subscribe, emit, unsubscribe, and resubscribe cleanly^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.2092708Z      ^[[32m✓^[[39m 2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.2094921Z ^[[31m     ^[[31m×^[[31m 3. Manual and custom trigger ports operate without DOM imports in core^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.2097359Z ^[[31m     ^[[31m×^[[31m 4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.2099372Z      ^[[32m✓^[[39m 5. Idempotent teardown: pause, unmount, and dispose cleanly detach ports without leaks^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3259959Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3287349Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3301447Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3304157Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3313775Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3475902Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3500868Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3503177Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.3504872Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.4620991Z  ^[[31m❯^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.4623686Z ^[[31m     ^[[31m×^[[31m C-9 keeps a motion-owned track live through replacement^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.4626076Z ^[[31m     ^[[31m×^[[31m C-10 preserves the array index and stagger timing across a replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.4628092Z ^[[31m     ^[[31m×^[[31m C-11 keeps the observation replacement path resolvable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.4629857Z ^[[31m     ^[[31m×^[[31m C-12 disposes every compiled timeline exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.4631479Z ^[[31m     ^[[31m×^[[31m C-13 keeps runtime add and remove in step with the resolver^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.5589034Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.5875074Z  ^[[31m❯^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.5878089Z ^[[31m     ^[[31m×^[[31m 1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.5880177Z ^[[31m     ^[[31m×^[[31m 2. Pause cancels pending scheduled write and prevents Track mutation on flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.5881951Z      ^[[32m✓^[[39m 3. Remount does not duplicate subscriptions or schedule parallel jobs^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.5886636Z      ^[[32m✓^[[39m 4. Clock and trigger paths both retain cancellation behavior on pause^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.5888450Z ^[[31m     ^[[31m×^[[31m 5. Burst signals produce exactly 1 published patch batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.7223604Z  ^[[31m❯^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.7237895Z ^[[31m     ^[[31m×^[[31m creates a motion, attaches a track, and signals progress from an empty project^[[39m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.7240429Z ^[[31m     ^[[31m×^[[31m rejects motion destruction while it still owns tracks, then allows empty destruction^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.7242334Z ^[[31m     ^[[31m×^[[31m keeps two runtime motions independently signalable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.7243958Z      ^[[32m✓^[[39m rejects duplicate and malformed motion ids without poisoning retries^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.7245955Z      ^[[32m✓^[[39m rejects non-empty authored motions without deleting their schema tracks^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.7247735Z      ^[[32m✓^[[39m rejects addMotion with pre-populated tracks instead of dropping them^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.8292376Z  ^[[31m❯^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.8330890Z ^[[31m     ^[[31m×^[[31m covers source spelling across an add and its matching remove^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.8337664Z ^[[31m     ^[[31m×^[[31m deduplicates equivalent observations and preserves no-op sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.8366119Z ^[[31m     ^[[31m×^[[31m rejects an invalid free-track observation with stable diagnostics^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.8389283Z ^[[31m     ^[[31m×^[[31m V-7 refuses an authored target through addObserve on either role^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.8392161Z ^[[31m     ^[[31m×^[[31m J-7 refuses an authored role or projection through addObserve^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:22.8394246Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.0069884Z  ^[[31m❯^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.0072589Z ^[[31m     ^[[31m×^[[31m does not drive the disposed Track after direct replacement^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.0074341Z ^[[31m     ^[[31m×^[[31m preserves current progress when replacing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.0076343Z ^[[31m     ^[[31m×^[[31m preserves the original array index and stagger timing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.0078004Z ^[[31m     ^[[31m×^[[31m keeps sibling progress healthy after replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.0082388Z ^[[31m     ^[[31m×^[[31m keeps the observation replacement path live^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.0940178Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.1588659Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.1591628Z ^[[31m     ^[[31m×^[[31m ingests authored tracks into the removable store without auto-mounting^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.1593882Z ^[[31m     ^[[31m×^[[31m returns a capability handle and makes stale ABA handles inert^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.1596373Z ^[[31m     ^[[31m×^[[31m replaces a track non-destructively and preserves subscriber identity^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.1598712Z ^[[31m     ^[[31m×^[[31m reads dependants from the committed graph and rejects source removal^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.1600952Z ^[[31m     ^[[31m×^[[31m treats observation changes as replacement of the observer track^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.2756768Z  ^[[31m❯^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.2759874Z ^[[31m     ^[[31m×^[[31m re-registers the compiled Track without throwing on the next Motion update^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.2762176Z ^[[31m     ^[[31m×^[[31m preserves the replaced Track index and stagger timing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.2764383Z ^[[31m     ^[[31m×^[[31m updates a Motion-owned Track through observation mutations^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.3948150Z  ^[[31m❯^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.3950545Z ^[[31m     ^[[31m×^[[31m returns a deeply frozen runtime-owned definition^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.3952330Z ^[[31m     ^[[31m×^[[31m isolates caller mutation from the frozen graph definition^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.3954284Z ^[[31m     ^[[31m×^[[31m uses the authored validation owner for malformed runtime track structure^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.3961750Z ^[[31m     ^[[31m×^[[31m keeps the existing same-source destroy and readopt path working^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.4314628Z  ^[[31m❯^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.4317547Z ^[[31m     ^[[31m×^[[31m F-10 interpolates grouped leaves without renaming the owning plugin^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.4319939Z ^[[31m     ^[[31m×^[[31m F-11 interpolates a grouped track when the Engine has no plugin registry^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.4322046Z ^[[31m     ^[[31m×^[[31m F-12 publishes identical values for the flat and grouped spellings^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.5658150Z  ^[[31m❯^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.5660807Z ^[[31m     ^[[31m×^[[31m publishes a progress change through the public project handle^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.5662957Z ^[[31m     ^[[31m×^[[31m keeps one clock owner while clock progress publishes once^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.5664730Z ^[[31m     ^[[31m×^[[31m still resolves authored-key plugins during progress updates^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.5666088Z ^[[31m     ^[[31m×^[[31m routes a manual trigger through the public handle into a published patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.6353177Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.6740327Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.6748573Z ^[[31m     ^[[31m×^[[31m H-1 keeps a namespaced derived key out of every published surface^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.6751189Z ^[[31m     ^[[31m×^[[31m H-2 keeps a declared unprefixed internal key out of the patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.6753048Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.8455319Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.8863023Z  ^[[31m❯^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.8866554Z      ^[[32m✓^[[39m adopts a free track and publishes a ready patch via seek^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.8868045Z      ^[[32m✓^[[39m destroyAdopted removes the node from the graph^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.8869689Z ^[[31m     ^[[31m×^[[31m rejects adoption of a track with malformed keyframes^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.8871505Z ^[[31m     ^[[31m×^[[31m adopts a track into an existing motion and receives motion signals^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:23.8873751Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.0581374Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.0999079Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.1407734Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.3264936Z  ^[[31m❯^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.3278853Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before constructing a runtime^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.3282124Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before any timeline is created^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.3330654Z ^[[31m     ^[[31m×^[[31m resolves authored plugin ownership during load, not on the first seek^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.3357635Z ^[[31m     ^[[31m×^[[31m accepts a valid project and creates its timelines during load^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.3366126Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.4426930Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.4429787Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.5460621Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.5786225Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.7194260Z  ^[[31m❯^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.7197264Z ^[[31m     ^[[31m×^[[31m tells subscribers the node was destroyed and reaches them again after re-adoption^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.7687748Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.9647098Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.9801562Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:24.9810222Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.0190762Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.1394871Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.2288019Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.2534755Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.3503995Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4590882Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4644300Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4679822Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4680630Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 124 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4681234Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4692104Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopt-destroy-readopt.test.ts^[[2m > ^[[22madopt -> destroy -> re-adopt lifecycle on the wire (D1)^[[2m > ^[[22mtells subscribers the node was destroyed and reaches them again after re-adoption
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4699240Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4703653Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4776727Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4778781Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4781130Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4782711Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4784060Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4786129Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4788384Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4789925Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4791379Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopt-destroy-readopt.test.ts:^[[2m40:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4792110Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4792568Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4792961Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4794911Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mreturns a deeply frozen runtime-owned definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4798148Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4800350Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4801799Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4803338Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4805249Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4806738Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4807726Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4809131Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4810745Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4812155Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4813675Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m33:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4814471Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4814906Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4826021Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4828237Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22misolates caller mutation from the frozen graph definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4831308Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4834576Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4836446Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4838093Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4840751Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4842067Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4842946Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4843756Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4844700Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4845798Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4846676Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m56:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4847124Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4847375Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4847616Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4848757Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22muses the authored validation owner for malformed runtime track structure
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4850288Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4850816Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4850967Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4851224Z undefined
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4851353Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4851493Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4852320Z "TypeError: property-stops-wrapper at addTrack(broken).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4852920Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4853436Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m79:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4854011Z     ^[[90m 77|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4854509Z     ^[[90m 78|^[[39m     expect(() => handle.adopt(malformed, owner)).toThrow(/observes-sha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4855176Z     ^[[90m 79|^[[39m     expect(() => handle.adopt({ id: "broken", keyframes: { x: ramp(0, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4857085Z     ^[[90m   |^[[39m                                                                                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4857920Z     ^[[90m 80|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4858648Z     ^[[90m 81|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4859137Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4859583Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4859980Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4862111Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mkeeps the existing same-source destroy and readopt path working
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4865265Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4867738Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4869337Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4870905Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4872882Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4874179Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4875214Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4877287Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4879219Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4880765Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4882279Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m89:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4883078Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4883524Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4883910Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4885707Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-finite stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4888274Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4889359Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4889625Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4890073Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4890320Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4890575Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4891893Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4892918Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4895327Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m79:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4899526Z     ^[[90m 77|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4900602Z     ^[[90m 78|^[[39m       runtime.adopt({ id: "bad", keyframes: { x: { stops: [{ p: Number…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4901854Z     ^[[90m 79|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4902778Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4903684Z     ^[[90m 80|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4904536Z     ^[[90m 81|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4904880Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4905331Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4906005Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4907647Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-monotonic stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4910209Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4911259Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4940790Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4941661Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4941925Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4942235Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4943630Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4944635Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4945434Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m100:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4946699Z     ^[[90m 98|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4947330Z     ^[[90m 99|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4948165Z     ^[[90m100|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4948996Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4949798Z     ^[[90m101|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4950616Z     ^[[90m102|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4950961Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4951433Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4951848Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4953433Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with duplicate stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4956347Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4957863Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4958190Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4958647Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4958895Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4959190Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4960550Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4961567Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4962393Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m121:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4963379Z     ^[[90m119|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4963989Z     ^[[90m120|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4964973Z     ^[[90m121|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4966375Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4967281Z     ^[[90m122|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4968085Z     ^[[90m123|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4968410Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4968947Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4969346Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4971052Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-10 closes the static domain instead of leaving it open
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4973384Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4974332Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4974640Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4975189Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4975436Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4976072Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4976641Z ^[[32m-   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4977474Z ^[[31m+   "keyframes-missing-values-section",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4978152Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4978390Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4979319Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m260:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4980824Z     ^[[90m258|^[[39m     expect(ruleIds({ x: Number.POSITIVE_INFINITY })).toEqual(["stops-s…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4982714Z     ^[[90m259|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m () ^[[33m=>^[[39m ^[[34m1^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4984993Z     ^[[90m260|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m { hold^[[33m:^[[39m ^[[34m1^[[39m } }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4986777Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4987927Z     ^[[90m261|^[[39m     // The shape error cites the property the author wrote, not a `.st…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4989022Z     ^[[90m262|^[[39m     ^[[90m// exists anywhere in the document.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4989514Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4990015Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4990457Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4992359Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-16 leaves no authored schema in the repository on the retired form
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4994427Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(58) ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4995009Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4995259Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4996374Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4996643Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4996857Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4997276Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4998010Z ^[[31m+   "packages/core/src/contract/authored-leaf.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4998913Z ^[[31m+   "packages/core/src/contract/v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.4999806Z ^[[31m+   "packages/core/src/contract/validate-v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5000789Z ^[[31m+   "packages/core/test/contract/adapters.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5001983Z ^[[31m+   "packages/core/test/contract/graph-builder-incremental.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5003515Z ^[[31m+   "packages/core/test/contract/gsap-absolute-stops.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5004935Z ^[[31m+   "packages/core/test/contract/gsap-authored-duration.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5006488Z ^[[31m+   "packages/core/test/contract/gsap-equivalence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5007698Z ^[[31m+   "packages/core/test/contract/gsap-multi-stop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5008882Z ^[[31m+   "packages/core/test/contract/gsap-one-tween.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5010146Z ^[[31m+   "packages/core/test/contract/gsap-paused-timeline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5011478Z ^[[31m+   "packages/core/test/contract/gsap-sparse-percent-map.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5012688Z ^[[31m+   "packages/core/test/contract/ports.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5013841Z ^[[31m+   "packages/core/test/contract/s4-validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5014978Z ^[[31m+   "packages/core/test/contract/v5-validator.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5016391Z ^[[31m+   "packages/core/test/contract/validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5017664Z ^[[31m+   "packages/core/test/integration/adopt-destroy-readopt.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5019033Z ^[[31m+   "packages/core/test/integration/adopted-track-immutability.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5020279Z ^[[31m+   "packages/core/test/integration/adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5021445Z ^[[31m+   "packages/core/test/integration/end-to-end.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5022634Z ^[[31m+   "packages/core/test/integration/engine-headless.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5023899Z ^[[31m+   "packages/core/test/integration/engine-load-validation.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5025298Z ^[[31m+   "packages/core/test/integration/engine-x3-contribution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5026867Z ^[[31m+   "packages/core/test/integration/handle-adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5028121Z ^[[31m+   "packages/core/test/integration/internal-key-strip.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5029649Z ^[[31m+   "packages/core/test/integration/issue-114-motion-track-regressions.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5031035Z ^[[31m+   "packages/core/test/integration/keyframe-groups.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5032333Z ^[[31m+   "packages/core/test/integration/motion-trigger-types.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5033767Z ^[[31m+   "packages/core/test/integration/mutation-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5035114Z ^[[31m+   "packages/core/test/integration/observation-identity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5036783Z ^[[31m+   "packages/core/test/integration/option-c-track-resolution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5038243Z ^[[31m+   "packages/core/test/integration/per-plugin-key-ownership.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5039571Z ^[[31m+   "packages/core/test/integration/phase0-red-baseline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5040947Z ^[[31m+   "packages/core/test/integration/phase2-motion-scheduling.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5042272Z ^[[31m+   "packages/core/test/integration/phase3-trigger-port.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5043665Z ^[[31m+   "packages/core/test/integration/phase4-dynamic-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5045033Z ^[[31m+   "packages/core/test/integration/phase7-walker-demo.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5046663Z ^[[31m+   "packages/core/test/integration/plugin-group-values-section.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5048159Z ^[[31m+   "packages/core/test/integration/plugin-owned-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5049594Z ^[[31m+   "packages/core/test/integration/replace-motion-track.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5051011Z ^[[31m+   "packages/core/test/integration/replace-track-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5052505Z ^[[31m+   "packages/core/test/integration/runtime-motion-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5053862Z ^[[31m+   "packages/core/test/integration/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5055238Z ^[[31m+   "packages/core/test/integration/t4-runtime-motion-parity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5057114Z ^[[31m+   "packages/core/test/integration/trigger-scroll.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5058610Z ^[[31m+   "packages/core/test/integration/trigger-time-loop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5059785Z ^[[31m+   "packages/core/test/integration/trigger-time.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5061110Z ^[[31m+   "packages/core/test/integration/unified-mutation-surface.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5062602Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-completeness.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5064109Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-contract.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5065768Z ^[[31m+   "packages/core/test/unit/domain/plugin-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5066921Z ^[[31m+   "packages/core/test/unit/domain/plugins.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5068143Z ^[[31m+   "packages/core/test/unit/domain/s7-plugin-evidence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5069496Z ^[[31m+   "packages/core/test/unit/graph/incremental-cache.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5070874Z ^[[31m+   "packages/core/test/unit/graph/requirement-edge-construction.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5072199Z ^[[31m+   "packages/core/test/unit/graph/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5073487Z ^[[31m+   "packages/core/test/unit/runtime/composition-output-shape.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5074676Z ^[[31m+   "packages/react/test/public-hook-render.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5075441Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5075944Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5076895Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m344:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5078443Z     ^[[90m342|^[[39m     // be red for a fixture that authors the retired form, but a fixtu…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5079771Z     ^[[90m343|^[[39m     // and that is the one that reads as an accepted second shape late…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5081313Z     ^[[90m344|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5082530Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5083307Z     ^[[90m345|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5083973Z     ^[[90m346|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5084297Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5084800Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5085213Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5087301Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5090371Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5092402Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5093732Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5095327Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5096987Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5097875Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5098944Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5100205Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5101407Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5102805Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5103505Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5103973Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5104357Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5106191Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mpublishes a progress change through the public project handle
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5109600Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5111707Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5113099Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5114751Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5116388Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5117267Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5118326Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5119543Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5120824Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5122256Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m38:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5122949Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5123438Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5123861Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5125424Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mkeeps one clock owner while clock progress publishes once
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5128622Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5130697Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5132134Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5134024Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5135653Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5136545Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5137548Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5138798Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5140113Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5141520Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m60:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5142216Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5142660Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5143074Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5144934Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mstill resolves authored-key plugins during progress updates
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5148097Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5150198Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5151603Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5153231Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5154670Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5155715Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5157112Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5158377Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5159581Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5161067Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m79:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5161763Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5162227Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5162619Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5164386Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mroutes a manual trigger through the public handle into a published patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5167700Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5169879Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5171299Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5172920Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5174363Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5175198Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5176571Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5177807Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5179066Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5180440Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m94:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5181182Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5181687Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5182090Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5184244Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before constructing a runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5187479Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5188601Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5188880Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5189321Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5189550Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5189803Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5191270Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5192404Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5193627Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m31:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5195386Z     ^[[90m 29|^[[39m     const invalid = projectWith({ opacity: { stops: [{ p: Number.NaN, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5196592Z     ^[[90m 30|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5197495Z     ^[[90m 31|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5198576Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5199833Z     ^[[90m 32|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5200841Z     ^[[90m 33|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5201179Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5201635Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5202038Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5204169Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5207470Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5208600Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5208864Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5209334Z /stop-position-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5209617Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5209866Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5211361Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5212474Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5213410Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m48:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5214449Z     ^[[90m 46|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5215011Z     ^[[90m 47|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5216198Z     ^[[90m 48|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5217390Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5218677Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5219783Z     ^[[90m 50|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5220138Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5220614Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5221005Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5223236Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mresolves authored plugin ownership during load, not on the first seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5226581Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5227673Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5227985Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5228500Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5228788Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5229076Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5230579Z "property-stops-wrapper at motions[0].tracks[0].keyframes.unknown: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5231727Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5232705Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m65:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5233846Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5234985Z     ^[[90m 64|^[[39m       engine.load(projectWith({ unknown: { stops: [{ p: 0, v: 0 }] } }…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5236508Z     ^[[90m 65|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-unknown-key/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5237476Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5238671Z     ^[[90m 66|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5239677Z     ^[[90m 67|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5240361Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5241073Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5241508Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5243602Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22maccepts a valid project and creates its timelines during load
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5247348Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5249454Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5250868Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5252479Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5253831Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5254661Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5255932Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5257160Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5258357Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5259815Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m74:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5260563Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5261011Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5261403Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5263527Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mpasses contribution context and creates the prepared timeline at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5266956Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5269013Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5270321Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5271889Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5273214Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5274098Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5275119Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5276617Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5277854Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5279361Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m38:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5280155Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5280655Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5281042Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5283037Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mselects one predicate contributor through Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5286385Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5288469Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5289800Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5291825Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5293161Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5293965Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5294969Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5296406Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5297611Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5299065Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m75:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5299812Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5300262Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5300658Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5302650Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects malformed contributions during Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5305967Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5307208Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5307516Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5308057Z /plugin-contribution-stop-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5308432Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5308714Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5310175Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5311262Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5312247Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m108:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5313934Z     ^[[90m106|^[[39m         ^[[34mprojectWith^[[39m({ x^[[33m:^[[39m ^[[34mproperty^[[39m(^[[34m1^[[39m) }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5315147Z     ^[[90m107|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5316541Z     ^[[90m108|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-stop-order/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5317568Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5318728Z     ^[[90m109|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5319746Z     ^[[90m110|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5320058Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5320536Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5320956Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5323027Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects authored ease collisions before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5326459Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5327785Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5328095Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5328678Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5329083Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5329360Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5332066Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5334046Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5335043Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5336500Z     ^[[90m131|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5337198Z     ^[[90m132|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5338708Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5340050Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5341197Z     ^[[90m134|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5342271Z     ^[[90m135|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5342611Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5343086Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5343472Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5346013Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mmerges contributed keyframes into compiler diagnostics before timeline creation
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5349407Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5350658Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5350984Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5351575Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5352006Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5352285Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5353704Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5354781Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5355998Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m170:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5357241Z     ^[[90m168|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5357936Z     ^[[90m169|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5359139Z     ^[[90m170|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5360248Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5361340Z     ^[[90m171|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5362451Z     ^[[90m172|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5362800Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5363276Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5363690Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5365756Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22mrejects adoption of a track with malformed keyframes
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5368627Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5369803Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5370066Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5370497Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5370742Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5370994Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5372395Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5373428Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5374287Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m57:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5375296Z     ^[[90m 55|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5376157Z     ^[[90m 56|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5377741Z     ^[[90m 57|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m handle^[[33m.^[[39m^[[34madopt^[[39m(bad^[[33m,^[[39m owner))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5379354Z     ^[[90m   |^[[39m                                            ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5380295Z     ^[[90m 58|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5381079Z     ^[[90m 59|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5381408Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5381901Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5382311Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5384245Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22madopts a track into an existing motion and receives motion signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5388053Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5390281Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5391803Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5393375Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5395335Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5396908Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5397948Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5399446Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5401151Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5402612Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5404001Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m69:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5404695Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5405145Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5405741Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5407874Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-1 keeps a namespaced derived key out of every published surface
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5411090Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5413163Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5414595Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5416471Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5417889Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5418754Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5419738Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5420992Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5422239Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5423735Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5425407Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m42:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5426353Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5426840Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5427264Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5429380Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-2 keeps a declared unprefixed internal key out of the patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5432636Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5434712Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5436292Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5438411Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5439757Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5440603Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5441671Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5442862Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5444098Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5445857Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5447477Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5448257Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5448756Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5449181Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5451236Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5454390Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5456690Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5458079Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5459694Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5461067Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5461955Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5462990Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5464152Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5465390Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5467130Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5468778Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m84:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5469590Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5470069Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5470456Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5472500Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mdoes not drive the disposed Track after direct replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5475835Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5477846Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5479092Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5480607Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5482029Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5482857Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5483877Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5485046Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5486878Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5488508Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5490345Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m41:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5491165Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5491587Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5491998Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5493973Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves current progress when replacing
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5497444Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5499523Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5500942Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5502599Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5503954Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5504697Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5505888Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5506951Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5508056Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5509667Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5511405Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m56:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5512208Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5512665Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5513058Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5515089Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves the original array index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5521128Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5524876Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5526422Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5528020Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5529414Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5530219Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5531249Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5532453Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5533646Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5535393Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5538229Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m72:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5539122Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5539647Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5540081Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5542164Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps sibling progress healthy after replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5547165Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5550259Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5551728Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5553420Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5554868Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5556030Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5557109Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5558414Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5559699Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5561484Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5563589Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m86:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5564500Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5565026Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5565722Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5567780Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps the observation replacement path live
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5572510Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5575779Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5577221Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5579377Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5580840Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5581706Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5582789Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5584063Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5585359Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5587401Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5589459Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m103:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5590376Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5590922Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5591345Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5593396Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-10 interpolates grouped leaves without renaming the owning plugin
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5598839Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5602311Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5603740Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5605433Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5607170Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5608039Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5609110Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5610382Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5611661Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5613162Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5614786Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m56:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5615721Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5616254Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5616701Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5618779Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-11 interpolates a grouped track when the Engine has no plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5622230Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5624478Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5626144Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5627837Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5629273Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5630532Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5631839Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5633113Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5634375Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5636150Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5637792Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m70:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5638537Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5639039Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5639437Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5641447Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-12 publishes identical values for the flat and grouped spellings
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5644780Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5647222Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5648632Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5650314Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5651733Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5652606Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5653666Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5654904Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5656468Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5658016Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5659629Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m81:18^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5660370Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5660889Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5661300Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5663440Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-11 gives each trigger type its own input path instead of the manual one
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5666941Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5669131Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5670585Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5672274Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5673710Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5674596Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5675937Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5677226Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5678496Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5680137Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5682234Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m104:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5683332Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5683846Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5684280Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5686699Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-12 lets seek scrub a driver-backed node and lets the driver overwrite it
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5689989Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5692074Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5693826Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5695756Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5697257Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5698136Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5699231Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5700475Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5701774Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5703376Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5705152Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m123:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5706183Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5706695Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5707101Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5709395Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5716427Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5721085Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5722715Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5724381Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5726707Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5728126Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5729203Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5730774Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5732566Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5734107Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5735977Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5737105Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5737851Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5738286Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5740309Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5743396Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5744634Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5744950Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5745698Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5746042Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5746341Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5747803Z "property-stops-wrapper at addTrack(child).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5748857Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5749937Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m118:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5751132Z     ^[[90m116|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5751691Z     ^[[90m117|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5752629Z     ^[[90m118|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-un…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5753803Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5754540Z     ^[[90m119|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5755756Z     ^[[90m120|^[[39m     const replacement = handle.adopt({ id: "child", keyframes: { x: ra…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5756449Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5756966Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5757393Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5759384Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5762509Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5763741Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5764058Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5764599Z /observation-self-reference/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5764923Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5765194Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5766852Z "property-stops-wrapper at addTrack(self).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5767920Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5768969Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m140:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5770216Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5770774Z     ^[[90m139|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5771712Z     ^[[90m140|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-se…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5772867Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5774061Z     ^[[90m141|^[[39m     const replacement = handle.adopt({ id: "self", keyframes: { x: ram…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5775946Z     ^[[90m142|^[[39m     ^[[34mexpect^[[39m(replacement^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"~/self"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5776777Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5777282Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5777702Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5779518Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mcovers source spelling across an add and its matching remove
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5783994Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5787559Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5789243Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5790922Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5792349Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5793227Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5794276Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5795765Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5797055Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5798699Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5800535Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5801313Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5801821Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5802247Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5804162Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mdeduplicates equivalent observations and preserves no-op sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5808964Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5812019Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5813419Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5815134Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5816859Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5817708Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5818779Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5820034Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5821295Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5822933Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5824730Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m75:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5825715Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5826241Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5826693Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5828586Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mrejects an invalid free-track observation with stable diagnostics
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5834480Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5838633Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5840035Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5842158Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5843608Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5844901Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5846601Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5848188Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5849634Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5851573Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5853526Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m89:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5854428Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5855051Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5855761Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5857597Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mV-7 refuses an authored target through addObserve on either role
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5862106Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5865405Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5886779Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5888543Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5890014Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5890894Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5891924Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5893270Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5894345Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5895743Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5897556Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5898334Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5898797Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5899140Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5901013Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mJ-7 refuses an authored role or projection through addObserve
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5905747Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5908603Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5909999Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5911618Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5913025Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5914199Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5915697Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5916890Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5918060Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5919536Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5921240Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5921902Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5922325Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5922680Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5923943Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-9 keeps a motion-owned track live through replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5925975Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5927036Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5927756Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5928613Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5929326Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5929772Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5930320Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5930948Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5931633Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5932444Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5933338Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m60:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5933748Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5933993Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5934206Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5935863Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-10 preserves the array index and stagger timing across a replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5939129Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5942461Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5943200Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5944058Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5944772Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5945216Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5946050Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5946914Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5947693Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5948547Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5949455Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m73:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5949889Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5950140Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5950396Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5951515Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-11 keeps the observation replacement path resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5953955Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5955802Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5956603Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5957456Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5958176Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5958640Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5959258Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5959991Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5960725Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5961662Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5962675Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m88:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5963112Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5963361Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5963597Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5964770Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-12 disposes every compiled timeline exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5967543Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5969220Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5969990Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5970900Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5971675Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5972135Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5972718Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5973368Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5974027Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5975103Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5976503Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m104:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5976948Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5977222Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5977454Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5978647Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-13 keeps runtime add and remove in step with the resolver
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5980431Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5981529Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5982292Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5983215Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5983971Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5984466Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5985069Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5986020Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5986705Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5987563Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5988549Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m113:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5989000Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5989272Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5989484Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5990552Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5995937Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.5999480Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6000234Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6001118Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6001879Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6002362Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6002926Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6003608Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6004595Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6005679Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6007195Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6007647Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6007921Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6008161Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6009219Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6010842Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6011470Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6011653Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6011962Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6012135Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6012305Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6016401Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6019466Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6020142Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m123:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6020987Z     ^[[90m121|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6021706Z     ^[[90m122|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6022410Z     ^[[90m123|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6023050Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6023681Z     ^[[90m124|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6024192Z     ^[[90m125|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6024377Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6024644Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6024879Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6026157Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6031710Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6035246Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6036294Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6037187Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6037969Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6038450Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6039019Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6039711Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6040393Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6041266Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6042248Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m128:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6042702Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6042971Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6043197Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6044413Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m1. Engine time playback: project clock tick advances time motion playhead
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6046533Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6047659Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6048444Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6049372Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6050137Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6050626Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6051208Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6051871Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6052553Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6053367Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m40:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6053775Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6054033Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6054269Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6055840Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6058831Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6060447Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6061194Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6062094Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6062861Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6063360Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6063936Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6064613Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6065294Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6066358Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m98:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6066765Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6067044Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6067289Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6068607Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6070541Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6071804Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6072668Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6073556Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6074651Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6075391Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6076247Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6077099Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6078066Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6078993Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m142:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6079405Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6079671Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[58/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6079904Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6081172Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m4. Stale scheduled write: paused Motion cancels pending write before scheduler flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6083017Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6084109Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6085188Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6086391Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6087175Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6087645Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6088247Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6088920Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6089606Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6090449Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m199:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6090894Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6091135Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[59/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6091362Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6092679Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6094628Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6095939Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6096693Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6097555Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6098309Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6099004Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6100163Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6101256Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6102001Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6102770Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m245:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6103157Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6103404Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[60/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6103618Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6104783Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6106832Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6107883Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6108584Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6109428Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6110134Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6110568Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6111112Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6111729Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6112603Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6113556Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6113961Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6114207Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[61/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6114425Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6115784Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m2. Pause cancels pending scheduled write and prevents Track mutation on flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6117507Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6118534Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6119236Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6120094Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6120799Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6121244Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6122115Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6123195Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6123908Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6125086Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m78:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6125794Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6126087Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[62/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6126307Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6127337Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m5. Burst signals produce exactly 1 published patch batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6128935Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6129959Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6130659Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6131508Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6132218Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6132657Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6133210Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6133839Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6134480Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6135312Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m168:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6135953Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6136214Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[63/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6136436Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6137542Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m3. Manual and custom trigger ports operate without DOM imports in core
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6139221Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6140578Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6141282Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6142113Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6142817Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6143258Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6143792Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6144407Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6145043Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6146050Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m109:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6146472Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6146724Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[64/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6146937Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6148165Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6149916Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6150953Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6151643Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6152473Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6153200Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6153642Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6154184Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6154833Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6155722Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6156528Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m136:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6156914Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6157155Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[65/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6157373Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6158561Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6160220Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6160807Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6160951Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6161239Z /stop-position|monoton/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6161397Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6161541Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6162265Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6162799Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6163300Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m172:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6163874Z     ^[[90m170|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6164179Z     ^[[90m171|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6164668Z     ^[[90m172|^[[39m     expect(() => runtime.adopt(badTrack, {})).toThrow(/stop-position|m…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6165837Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6166474Z     ^[[90m173|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6166946Z     ^[[90m174|^[[39m     ^[[90m// Graph state byte-identical after failed adoption^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6167257Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6167507Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[66/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6167724Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6168719Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m1. Load valid walker project through Engine with plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6175300Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6181241Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6181995Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6182863Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6183575Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6184025Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6184564Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6185183Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6186198Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6186971Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m145:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6187370Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6187614Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[67/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6187855Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6188817Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m2. Render walker nodes through createDomPatchAdapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6195271Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6200483Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6201198Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6202036Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6202750Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6203187Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6203742Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6204383Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6205020Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6206128Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m164:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6206546Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6206808Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[68/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6207025Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6208043Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m3. Demonstrate time playback using single injected browser clock
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6216382Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6221638Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6222379Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6223236Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6223962Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6224408Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6224964Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6225828Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6226496Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6227445Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m199:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6228052Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6228332Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[69/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6228686Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6229707Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m4. Demonstrate progress through TriggerPort and manual signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6236548Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6241321Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6242037Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6242962Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6243697Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6244163Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6244725Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6245356Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6246499Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6247273Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m219:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6247696Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6247946Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[70/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6248171Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6249179Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6255942Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6260981Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6261702Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6262562Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6263683Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6264462Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6265407Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6266409Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6267084Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6267861Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m243:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6268259Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6268505Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[71/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6268722Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6269872Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6277652Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6286969Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6288368Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6289977Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6291365Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6292216Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6293223Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6294129Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6294810Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6295856Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m269:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6296274Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6296540Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[72/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6296769Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6297829Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m7. Mount, unmount, remount, and dispose without duplicate subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6304720Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6309645Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6310376Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6311224Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6311945Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6312398Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6312948Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6313590Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6314248Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6314999Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m305:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6315383Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6315851Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[73/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6316073Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6317111Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m8. Show blocked/pending/error diagnostics without crashing the app
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6323634Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6328856Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6329592Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6330448Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6331171Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6331615Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6332160Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6332796Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6333433Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6334190Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m330:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6334580Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6334826Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[74/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6335058Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6336255Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6342785Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6347720Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6348433Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6349282Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6349995Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6350437Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6351236Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6352003Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6352645Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6353404Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m351:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6353785Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6354026Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[75/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6354246Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6355205Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m10. Automated end-to-end integration test passes clean
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6361932Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6366824Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6367546Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6368396Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6369121Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6369615Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6370157Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6370779Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6371414Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6372156Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m387:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6372553Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6372788Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[76/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6373012Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6374179Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6376223Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6377358Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6378058Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6378900Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6379803Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6380376Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6380948Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6381582Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6382225Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6383061Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6384032Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m147:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6384460Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6384725Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[77/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6384970Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6386322Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-7 cites the section in a diagnostic about a leaf inside it
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6387666Z ^[[31m^[[1mAssertionError^[[22m: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6388063Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6388209Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6388488Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6388818Z   "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6389207Z   "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6389493Z }
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6389610Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6389755Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6389988Z [
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6390181Z   {
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6390647Z     "message": "The { stops: [...] } wrapper is retired; author the stops array directly as the value.",
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6391180Z     "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6391533Z     "ruleId": "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6391856Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6392107Z   },
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6392306Z ]
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6392422Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6392950Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m214:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6393736Z     ^[[90m212|^[[39m   it("Y-7 cites the section in a diagnostic about a leaf inside it", (…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6394420Z     ^[[90m213|^[[39m     const authored = { fk: { values: { length: { stops: [{ p: 2, v: 1 …
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6395160Z     ^[[90m214|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6396010Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6396508Z     ^[[90m215|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6397103Z     ^[[90m216|^[[39m         ruleId^[[33m:^[[39m ^[[32m"stop-position-range"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6397424Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6397661Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[78/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6397897Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6399050Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6400351Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'property-stops-wrapper' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6400738Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6400873Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6401158Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6401298Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6401418Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6401662Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6402004Z ^[[31m+   "property-stops-wrapper",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6402325Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6402456Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6402979Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m228:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6403777Z     ^[[90m226|^[[39m     // a property called `values` that `fk` claims, and nothing about …
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6405070Z     ^[[90m227|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m { fk^[[33m:^[[39m { values^[[33m:^[[39m { values^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } } }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6406307Z     ^[[90m228|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m(authored))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6406927Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6407276Z     ^[[90m229|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6407773Z     ^[[90m230|^[[39m     const resolved = registry(passthrough).resolveForKeyframes(authore…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6408133Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6408380Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[79/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6408599Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6409727Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6416644Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6421317Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6422026Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6422877Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6423589Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6424027Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6424577Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6425202Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6426086Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6426939Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6427883Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m278:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6428314Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6428558Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[80/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6428769Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6429865Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6434887Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6438852Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6439575Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6440438Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6441175Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6441618Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6442156Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6442778Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6443416Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6444226Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6445148Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6445828Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6446091Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[81/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6446315Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6447459Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6452530Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6456152Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6456869Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6457712Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6458434Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6458876Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6459419Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6460053Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6460689Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6461682Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6462728Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6463142Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6463385Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[82/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6463603Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6464624Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6466397Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6467019Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6467161Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6467449Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6467629Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6467772Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6471572Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6474463Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6474962Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m146:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6475817Z     ^[[90m144|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6476184Z     ^[[90m145|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6476707Z     ^[[90m146|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6477309Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6477724Z     ^[[90m147|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6478019Z     ^[[90m148|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6478158Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6478404Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[83/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6478624Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6479739Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6483996Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6486976Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6487692Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6488546Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6489256Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6489978Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6490536Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6491164Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6491810Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6492630Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6493546Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m162:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6493966Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6494211Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[84/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6494433Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6495780Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6500870Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6504227Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6504953Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6505992Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6506739Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6507183Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6507725Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6508364Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6509008Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6509827Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6510763Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m192:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6511193Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6511429Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[85/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6511649Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6512710Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6514286Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6514905Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6515061Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6515355Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6515806Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6515967Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6519724Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6522864Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6523385Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m213:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6523983Z     ^[[90m211|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6524326Z     ^[[90m212|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6524855Z     ^[[90m213|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6525660Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6526183Z     ^[[90m214|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6526515Z     ^[[90m215|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6526687Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6526930Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[86/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6527148Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6528201Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mre-registers the compiled Track without throwing on the next Motion update
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6529834Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6530880Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6531605Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6532455Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6533169Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6533617Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6534166Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6534789Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6535639Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6536491Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m27:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6536884Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6537151Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[87/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6537382Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6538310Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mpreserves the replaced Track index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6541300Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6543309Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6544015Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6545018Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6546083Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6546537Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6547082Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6547715Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6548351Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6549218Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m64:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6549826Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6550120Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[88/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6550411Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6551453Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mupdates a Motion-owned Track through observation mutations
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6553907Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6555858Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6556721Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6557788Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6558604Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6559206Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6559928Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6560683Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6561441Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6562319Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m91:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6562787Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6563120Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[89/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6563437Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6564609Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6566606Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6567778Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6568653Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6569688Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6570521Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6571124Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6571766Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6572564Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6573339Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6574451Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6588096Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6588569Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6588836Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[90/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6589059Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6590193Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6591887Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6592910Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6593629Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6594473Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6595177Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6595917Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6596471Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6597096Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6597728Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6598562Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6599553Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m113:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6600009Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6600253Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[91/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6600472Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6601580Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6603242Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6604273Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6604986Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6605967Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6606697Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6607139Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6607679Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6608298Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6608929Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6609770Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6610726Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6611163Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6611399Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[92/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6611610Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6612755Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-4 changes nothing when the candidate graph refuses a derived observation
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6614771Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6616098Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6616810Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6617659Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6618373Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6618806Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6619360Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6620002Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6620653Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6621501Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6622473Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m143:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6622918Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6623164Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[93/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6623382Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6624446Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mcreates a motion, attaches a track, and signals progress from an empty project
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6626234Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6627414Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6628220Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6629056Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6630069Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6630762Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6631325Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6632099Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6633280Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6634055Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6634839Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m42:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6635251Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6635744Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[94/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6635979Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6637090Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mrejects motion destruction while it still owns tracks, then allows empty destruction
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6638708Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6639863Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6640667Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6641500Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6642515Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6643202Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6643768Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6644533Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6645414Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6646344Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6647131Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m58:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6647548Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6647784Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[95/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6648003Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6648924Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mkeeps two runtime motions independently signalable
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6650416Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6651550Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6652345Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6653194Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6654216Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6654905Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6655692Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6656499Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6657386Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6658153Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6659097Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m74:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6659629Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6659871Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[96/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6660090Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6661164Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6666307Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6669680Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6670386Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6671235Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6671945Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6672389Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6672938Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6673577Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6674213Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6674988Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m45:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6676104Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m52:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6676504Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6676750Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[97/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6676965Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6678081Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6679756Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6680808Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6681503Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6682349Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6683064Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6683507Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6684061Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6684693Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6685336Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6686640Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m153:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6687675Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m175:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6688083Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6688327Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[98/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6688545Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6689619Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-6 rolls the Motion back when the candidate graph rejects it
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6691239Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6692401Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6693204Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6694051Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6695083Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6695923Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6696497Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6697274Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6698176Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6698972Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6699780Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m360:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6700199Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6700436Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[99/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6700654Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6701748Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-7 keeps one clock subscription when a Motion is created at runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6703387Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6704541Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6705342Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6706460Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6707529Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6708643Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6709236Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6710013Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6710930Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6711730Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6712532Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m397:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6713148Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6713394Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[100/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6713735Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6714676Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.1 drives progress from an injected source and clamps out-of-range emissions
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6716705Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6718108Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6718835Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6719695Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6720428Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6720886Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6721442Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6722081Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6722730Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6723511Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6724309Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m76:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6724675Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6724916Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[101/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6725141Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6726212Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.2 subscribes to the injected source once and unsubscribes exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6727757Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6728799Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6729525Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6730370Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6731091Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6731537Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6732086Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6732720Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6733364Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6734116Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6734905Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m99:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6735261Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6735626Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[102/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6735851Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6736786Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.4 unsubscribes an already resolved source when a later Motion cannot resolve
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6738291Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6738908Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6739051Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6739512Z /trigger-driver-unavailable/
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6739695Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6739954Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6741356Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6742397Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6742832Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6743415Z     ^[[90m131|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6743985Z     ^[[90m132|^[[39m       load(resolve, [scrollMotion("hero", "hero"), scrollMotion("orpha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6744716Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/trigger-driver-unavailable/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6745244Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6745882Z     ^[[90m134|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6746496Z     ^[[90m135|^[[39m     ^[[34mexpect^[[39m(hero^[[33m.^[[39msubscriptions)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6746927Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6747165Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[103/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6747387Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6748236Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mregisters no clock consumer for a push-driven scroll Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6749711Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6750740Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6751454Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6752297Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6753036Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6753475Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6754017Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6754647Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6755280Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6756322Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6757125Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m141:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6757486Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6757728Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[104/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6757947Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6758718Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mrejects external signals for scroll Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6760156Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6761177Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6761879Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6762716Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6763418Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6763855Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6764395Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6765287Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6766078Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6766820Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6767613Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m163:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6767979Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6768215Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[105/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6768425Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6769299Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6770319Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6770653Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6770808Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6771085Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6771240Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6771361Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6771618Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6771750Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6772185Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6772896Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6773372Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6773986Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6774591Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6775164Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6775795Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6775975Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6776214Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[106/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6776446Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6777387Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6778927Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6779957Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6780656Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6781501Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6782209Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6782659Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6783219Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6783844Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6784475Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6785245Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6786201Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6786581Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6786815Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[107/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6787036Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6787943Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6789612Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6790780Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6791474Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6792310Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6793025Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6793455Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6793992Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6794617Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6795258Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6796170Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6796997Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6797375Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6797606Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[108/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6797823Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6798742Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6800984Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6802505Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6803203Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6804038Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6804758Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6805189Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6805850Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6806481Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6807113Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6807887Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6808738Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6809115Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6809345Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[109/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6809560Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6810443Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6811943Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6812963Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6813662Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6814501Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6815588Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6816048Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6816589Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6817217Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6817844Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6818590Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6818972Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6819209Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[110/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6819421Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6820327Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6821875Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6822906Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6823597Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6824434Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6825138Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6825695Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6826240Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6826865Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6827506Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6828275Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6829101Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6829480Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6829713Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[111/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6829931Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6830775Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6832242Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6833283Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6833984Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6834822Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6835656Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6836106Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6836649Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6837275Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6837907Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6838676Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6839650Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6840142Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6840380Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[112/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6840595Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6841494Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6843720Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6845228Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6845715Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6846249Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6846525Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6846686Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6847041Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6847329Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6847681Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6848144Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6848590Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6848608Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6848845Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[113/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6848862Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6849695Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6850523Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6850913Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6851273Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6851778Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6852043Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6852368Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6852854Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6853146Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6853490Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6853996Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6854414Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m39:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6854423Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6854664Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[114/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6854673Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6855562Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6856424Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6856826Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6857190Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6857686Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6857965Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6858140Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6858500Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6858784Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6859144Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6859650Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6860061Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6860070Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6860303Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[115/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6860311Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6861147Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mrejects external signals without changing progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6861979Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6862369Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6862729Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6863242Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6863511Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6863678Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6864028Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6864318Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6864670Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6865159Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6865680Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m66:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6865860Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6866114Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[116/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6866272Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6867136Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mcoalesces rapid driver ticks to the latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6867976Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6868365Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6868726Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6869275Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6869552Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6869724Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6870098Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6870388Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6870743Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6871232Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6871640Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m78:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6871649Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6871882Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[117/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6871889Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6872776Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mkeeps manual signals working and preserves range validation
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6873615Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6874013Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6874378Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6874880Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6875147Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6875313Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6875799Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6876093Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6876444Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6876867Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m113:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6876876Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6877110Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[118/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6877118Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6878076Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22misolates a throwing clock consumer while preserving other Motion progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6878910Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6879300Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6879662Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6880415Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6880686Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6880857Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6881215Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6881505Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6881850Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6882260Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m152:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6882268Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6882502Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[119/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6882510Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6883567Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mingests authored tracks into the removable store without auto-mounting
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6885095Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6885611Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6885983Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6886487Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6886759Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6886932Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6887302Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6887592Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6887939Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6888480Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m28:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6888968Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m33:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6888977Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6889215Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[120/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6889224Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6890232Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreturns a capability handle and makes stale ABA handles inert
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6891067Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6891593Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6891967Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6892455Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6893055Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6893235Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6893605Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6894283Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6894802Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6895172Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6895789Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m53:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6895800Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6896047Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[121/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6896055Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6897106Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreplaces a track non-destructively and preserves subscriber identity
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6898159Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6898738Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6899311Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6899860Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6900832Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6901037Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6901412Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6902154Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6903188Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6903782Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6904514Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m64:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6904530Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6904784Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[122/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6904799Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6905992Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreads dependants from the committed graph and rejects source removal
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6906827Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6907366Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6907757Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6908237Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6908840Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6909016Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6909383Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6909808Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6910324Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6910871Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6911472Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6911482Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6911718Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[123/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6911726Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6913321Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mtreats observation changes as replacement of the observer track
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6914695Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6915270Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6915813Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6916339Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6916950Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6917126Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6917489Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6917921Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6918447Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6918820Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6919311Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m90:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6919329Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6919573Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[124/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6919582Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6919610Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6920082Z ^[[2m Test Files ^[[22m ^[[1m^[[31m33 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m24 passed^[[39m^[[22m^[[90m (57)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6920549Z ^[[2m      Tests ^[[22m ^[[1m^[[31m124 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m117 passed^[[39m^[[22m^[[90m (241)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6920732Z ^[[2m   Start at ^[[22m 00:30:20
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6921247Z ^[[2m   Duration ^[[22m 5.28s^[[2m (transform 1.25s, setup 442ms, import 3.93s, tests 1.08s, environment 9ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6921254Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6921260Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6942019Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopt-destroy-readopt.test.ts:40:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6949148Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6953043Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:33:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6953531Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6957300Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:56:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6958096Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6961313Z ##[error]AssertionError: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6961733Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6965226Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:89:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6965875Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6968946Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6969419Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6972465Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6972918Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6976083Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6976577Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6978838Z ##[error]AssertionError: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.6979317Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7008124Z ##[error]AssertionError: expected [ …(58) ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7009039Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7011786Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7012255Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7014935Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:38:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7015389Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7018267Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:60:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7018748Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7021427Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:79:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7022159Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7024851Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:94:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7025310Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7028735Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7029258Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7032515Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7032975Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7036343Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7036843Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7039662Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:74:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7040119Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7042854Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:38:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7043319Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7046157Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:75:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7046662Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7050110Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7050620Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7055085Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7056131Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7059732Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7060206Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7063258Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7063740Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7067296Z ##[error]TypeError: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/handle-adoption.test.ts:69:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7067786Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7071057Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:42:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7071544Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7074806Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7075259Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7078868Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:84:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7079405Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7082925Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:41:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7083396Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7087038Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:56:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7087827Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7093343Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:72:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7093806Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7099142Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:86:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7099729Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7104298Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:103:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7104773Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7109427Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:56:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7109918Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7113231Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:70:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7113699Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7117037Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:81:18
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7117506Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7120752Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:104:44
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7121498Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7124758Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:123:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7125206Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7131270Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7131771Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7135138Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7135730Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7139152Z ##[error]AssertionError: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7139665Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7143985Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7144463Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7148905Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:75:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7149378Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7154606Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:89:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7155377Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7159895Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7160396Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7164677Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7165134Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7168654Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:60:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7169150Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7174486Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:73:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7174946Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7179392Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:88:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7179876Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7184199Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:104:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7184920Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7188484Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:113:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7188960Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7197104Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7197612Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7205652Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7206163Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7214195Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:128:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7214838Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7217737Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:40:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7218373Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7222093Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:98:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7222553Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7225846Z ##[error]TypeError: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:142:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7226342Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7229056Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:199:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7229496Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7232168Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:245:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7232645Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7235347Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7235935Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7238657Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:78:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7239100Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7241818Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:168:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7242266Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7244935Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:109:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7245375Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7248219Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:136:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7248970Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7252224Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7252672Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7262431Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:145:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7262945Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7272727Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:164:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7273229Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7282936Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:199:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7283697Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7293502Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:219:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7294020Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7303750Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:243:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7304244Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7313969Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:269:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7314766Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7324522Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:305:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7325027Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7334738Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:330:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7335647Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7345326Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:351:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7345995Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7355759Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:387:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7356267Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7359782Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:147:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7418623Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7423340Z ##[error]AssertionError: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7424239Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7426485Z ##[error]AssertionError: expected [ 'property-stops-wrapper' ] to deeply equal []
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7426977Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7437618Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:278:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7438176Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7446403Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7446913Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7454932Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7455855Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7463949Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7464441Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7471594Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:162:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7472098Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7480369Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:192:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7480877Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7489113Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7489922Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7492678Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:27:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7493145Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7497949Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:64:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7498419Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7502105Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:91:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7502567Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7506103Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7506575Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7510029Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:113:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7510491Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7513934Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7514380Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7518039Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:143:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7518810Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7522298Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:42:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7522744Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7526344Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:58:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7526843Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7530254Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:74:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7530697Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7538728Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:45:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:52:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7539239Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7542562Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/t4-runtime-motion-parity.test.ts:153:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:175:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7543015Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7547903Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:360:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7548535Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7552137Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:397:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7552919Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7556240Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:76:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7556724Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7559858Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:99:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7560346Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7564623Z ##[error]AssertionError: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7565080Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7568514Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:141:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7569014Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7572140Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:163:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7572584Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7574172Z ##[error]AssertionError: expected false to be true // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7574625Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7578021Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7578486Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7581677Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7582303Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7586818Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7587312Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7590036Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7590504Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7593681Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7594128Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7597423Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7597882Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7602032Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7602484Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7605746Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:39:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7606220Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7609368Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:59:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7609817Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7612944Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:66:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7613378Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7616629Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:78:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7617366Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7619999Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:113:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7620438Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7623025Z ##[error]TypeError: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:152:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7623476Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7627920Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:28:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:33:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7628384Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7631871Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:53:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7632327Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7635962Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:64:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7636440Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7639967Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7640439Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7643921Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:90:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:30:25.7647340Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-23T00:30:18.4472285Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.4472641Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.4511463Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.4511969Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.4512200Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.4512430Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.5537769Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.5538455Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.5538969Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:18.5539215Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8644488Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(20,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8656928Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(35,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8661298Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(68,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8666444Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(40,34): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8668765Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8669911Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8670968Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8671929Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8675211Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(62,36): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8677686Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8678744Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8679875Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8680801Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8683416Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(30,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8686842Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(42,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8688927Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8690879Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(43,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8693177Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8695426Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(54,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8698863Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(60,15): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8700916Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8703314Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(79,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8707458Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(87,63): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8711889Z ##[error]packages/core/test/integration/adoption.test.ts(78,52): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8716472Z ##[error]packages/core/test/integration/adoption.test.ts(91,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8720800Z ##[error]packages/core/test/integration/adoption.test.ts(112,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8725481Z ##[error]packages/core/test/integration/end-to-end.test.ts(21,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8729971Z ##[error]packages/core/test/integration/engine-headless.test.ts(19,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8735140Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(34,70): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8738466Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8740560Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8742059Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8743479Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8744653Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8745623Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8748646Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(62,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8751503Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8753317Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8754580Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8755805Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8756952Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8757949Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8760921Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(69,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8764312Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8766183Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8767449Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8768678Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8769846Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8770826Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8773830Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(89,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8776763Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8778029Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8779312Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8780480Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8781477Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8785219Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(142,7): error TS2322: Type '() => { keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8788923Z   Call signature return types '{ keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8790481Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8792062Z       Type '{ derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8793686Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8795026Z           Type '{ stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8798350Z ##[error]packages/core/test/integration/handle-adoption.test.ts(57,31): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8800940Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8802083Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8803318Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8804261Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8807366Z ##[error]packages/core/test/integration/handle-adoption.test.ts(74,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8811261Z ##[error]packages/core/test/integration/internal-key-strip.test.ts(28,44): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8815406Z ##[error]packages/core/test/integration/issue-114-motion-track-regressions.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8820264Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(56,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8822751Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8824777Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8827271Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8828741Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8829746Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8832390Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(70,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8834784Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8836277Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8837670Z       Types of property 'boneLength' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8838663Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8841120Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(81,33): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8845244Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(83,36): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8847497Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8849006Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8850932Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8852137Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8853522Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8855614Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(50,34): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8857262Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8858010Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8858704Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8859301Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8861737Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(49,5): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8864395Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8865782Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8867250Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8867922Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8870553Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(61,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8872404Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8873743Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8874689Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8875274Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8876777Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(114,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8879864Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(120,66): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8882066Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(136,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8884839Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(141,65): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8887410Z ##[error]packages/core/test/integration/observation-identity.test.ts(35,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8890952Z ##[error]packages/core/test/integration/option-c-track-resolution.test.ts(17,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8896107Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(38,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8898921Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8900301Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8901251Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8901825Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8904282Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(53,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8906219Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8907323Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8908384Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8908969Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8910794Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(116,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8912218Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8913301Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8914093Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8914673Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8916148Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(117,9): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8918683Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(24,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8921294Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(71,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8924098Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(82,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8926736Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(147,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8929297Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(183,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8931864Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(229,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8934777Z ##[error]packages/core/test/integration/phase2-motion-scheduling.test.ts(25,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8937438Z ##[error]packages/core/test/integration/phase3-trigger-port.test.ts(27,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8940017Z ##[error]packages/core/test/integration/phase4-dynamic-lifecycle.test.ts(164,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8943150Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(37,21): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8945056Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8946172Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8947143Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8947771Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8949918Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(64,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8951428Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8952425Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8953582Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8954213Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8956366Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(86,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8957886Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8958870Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8959767Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8960388Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8962562Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(60,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8964368Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8965360Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8966267Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8966820Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8968926Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(75,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8970438Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8971525Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8972755Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8973549Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8975480Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(123,20): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8976951Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8977931Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8978817Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8979381Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8981449Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(140,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8983195Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8984193Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8985096Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8985643Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8987606Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(153,9): error TS2322: Type '{ values: { weight: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; destination: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8989110Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8989941Z     Type '{ weight: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8990706Z       Types of property 'weight' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8991256Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8993567Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(184,17): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8995142Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8996228Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8997194Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8997735Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.8999821Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(207,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { debug: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9001662Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9002777Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9003929Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9004494Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9005918Z ##[error]packages/core/test/integration/replace-motion-track.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9008055Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(32,36): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9010301Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(46,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9011606Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9012413Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9013437Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9013991Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9015475Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(52,16): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9017675Z ##[error]packages/core/test/integration/runtime-motion-lifecycle.test.ts(31,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9020473Z ##[error]packages/core/test/integration/single-input-channel.test.ts(23,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9022002Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9023311Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9024286Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9024835Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9026901Z ##[error]packages/core/test/integration/single-input-channel.test.ts(28,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9028420Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9029399Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9030302Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9030859Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9032809Z ##[error]packages/core/test/integration/t4-runtime-motion-parity.test.ts(126,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9035934Z ##[error]packages/core/test/integration/trigger-scroll.test.ts(70,67): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9037985Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9039053Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9040119Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9041090Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9044257Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(104,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9046704Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9047808Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9048551Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9049518Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9085068Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(123,69): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9086574Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9087256Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9087906Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9088445Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9090225Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(127,29): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9091644Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9092407Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9093404Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9093955Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9095586Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,16): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9096969Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9097610Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9098221Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9098755Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9100291Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,30): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9101589Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9102416Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9103446Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9103981Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9105564Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(182,47): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9106917Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9107536Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9108189Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9108719Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9110265Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(196,68): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9111570Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9112188Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9112774Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9113586Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9115138Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(198,62): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9116466Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9117084Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9117722Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9118246Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9119775Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(214,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9121085Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9121720Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9122314Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9122837Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9124788Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(228,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9126199Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9126868Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9127655Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9128206Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9130013Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(229,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9132359Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9133264Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9134067Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9134599Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9136209Z ##[error]packages/core/test/integration/trigger-time.test.ts(31,79): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9137553Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9138190Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9138796Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9139343Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9140884Z ##[error]packages/core/test/integration/trigger-time.test.ts(115,77): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9142184Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9142809Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9143843Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9144391Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9145975Z ##[error]packages/core/test/integration/trigger-time.test.ts(156,75): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9147316Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9147954Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9148555Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9149087Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9150453Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(21,29): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9153231Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(20,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9155007Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9155745Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9156493Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9157159Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9157721Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9159392Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(51,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9161091Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9161988Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9162788Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9163799Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9164364Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9166033Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(58,7): error TS2322: Type '() => { keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9167763Z   Call signature return types '{ keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9168472Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9169163Z       Type '{ second: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9169820Z         Property 'second' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9170372Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9172318Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(105,7): error TS2322: Type '() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9174674Z   Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9175549Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9176297Z       Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9177006Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9177610Z           Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9179741Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(128,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9181716Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9183195Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9184259Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9185023Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9185728Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9186342Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9188497Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(135,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9190515Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9192017Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9193114Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9193901Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9194606Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9195215Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9196920Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(154,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9198641Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9199357Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9200048Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9200700Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9201261Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9202725Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(28,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9205156Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(52,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9207168Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(72,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9209171Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(92,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9211152Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(94,47): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9213381Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(95,46): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9215466Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(124,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9217468Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(137,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9219440Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(138,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9221837Z ##[error]packages/core/test/unit/graph/requirement-edge-construction.test.ts(53,37): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9223526Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9224368Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9225404Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9226046Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9227858Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(59,39): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9229654Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9231100Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9232499Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9233919Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9237360Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(58,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9241584Z ##[error]packages/react/test/public-hook-render.test.ts(69,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:30:21.9245301Z ##[error]Process completed with exit code 2.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	﻿2026-08-23T00:30:17.6815364Z ##[group]Run npx vitest run packages/core/test/integration/end-to-end.test.ts
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:17.6816230Z ^[[36;1mnpx vitest run packages/core/test/integration/end-to-end.test.ts^[[0m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:17.6854868Z shell: /usr/bin/bash -e {0}
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:17.6855150Z env:
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:17.6855354Z   NODE_VERSION: 24
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:17.6855569Z ##[endgroup]
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.3731578Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.3735837Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.3736427Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9228063Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9229367Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 7^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9258554Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9259312Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9259973Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9263919Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9268795Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9271268Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9345317Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9346611Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9347697Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9348414Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9349333Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9350326Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9351664Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9352499Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9354348Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9354733Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9355006Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9355393Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9356158Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9357362Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9358170Z ^[[2m   Start at ^[[22m 00:30:18
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9359541Z ^[[2m   Duration ^[[22m 536ms^[[2m (transform 320ms, setup 60ms, import 337ms, tests 8ms, environment 0ms)^[[22m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9360577Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9375635Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9398643Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ assertValidProject packages/core/src/engine.ts:101:11
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ Engine.load packages/core/src/engine.ts:170:29
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:30:18.9814413Z ##[error]Process completed with exit code 1.
```
