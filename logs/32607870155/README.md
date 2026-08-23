# CI log archive: 32607870155

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lf-bare-authored-leaf
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32607870155
- Captured: 2026-08-23T00:27:18Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-23T00:26:51.8362491Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.8362892Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.8408908Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.8409464Z env:
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.8409686Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.8409897Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.9639318Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.9640160Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.9641271Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:51.9641761Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.2891777Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.2913196Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.2914518Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.7974414Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8117699Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8133112Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8135206Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8137177Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8139332Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8141555Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8143555Z ^[[31m     ^[[31m×^[[31m T-6 rolls the Motion back when the candidate graph rejects it^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8145598Z ^[[31m     ^[[31m×^[[31m T-7 keeps one clock subscription when a Motion is created at runtime^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8581716Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 75^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8602798Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8604625Z      ^[[32m✓^[[39m LF-6 publishes a bare static value and holds it at every progress^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8606679Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8608284Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8609166Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8610157Z ^[[31m     ^[[31m×^[[31m LF-10 closes the static domain instead of leaving it open^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8611477Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8612999Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8614257Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8615570Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8616598Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:52.8617507Z ^[[31m     ^[[31m×^[[31m LF-16 leaves no authored schema in the repository on the retired form^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1093384Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1113416Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1134415Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1136385Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1137689Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1139003Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1140190Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1142064Z ^[[31m     ^[[31m×^[[31m Y-7 cites the section in a diagnostic about a leaf inside it^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1144214Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1148119Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1150196Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1152429Z      ^[[32m✓^[[39m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1154469Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1182738Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1699161Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1701614Z ^[[31m     ^[[31m×^[[31m 1. Load valid walker project through Engine with plugin registry^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1703376Z ^[[31m     ^[[31m×^[[31m 2. Render walker nodes through createDomPatchAdapter^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1705075Z ^[[31m     ^[[31m×^[[31m 3. Demonstrate time playback using single injected browser clock^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1706813Z ^[[31m     ^[[31m×^[[31m 4. Demonstrate progress through TriggerPort and manual signals^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1708555Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1710444Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1712648Z ^[[31m     ^[[31m×^[[31m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1714428Z ^[[31m     ^[[31m×^[[31m 8. Show blocked/pending/error diagnostics without crashing the app^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1716039Z ^[[31m     ^[[31m×^[[31m 9. Use React usePatch hook at the React boundary^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.1717601Z ^[[31m     ^[[31m×^[[31m 10. Automated end-to-end integration test passes clean^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2023470Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m8 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2025362Z      ^[[32m✓^[[39m L-11 accepts the loop fields and names each loop rule by id^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2026786Z      ^[[32m✓^[[39m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2028446Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2030095Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2032549Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2034517Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2036189Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2037890Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2039464Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2041661Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.2078852Z      ^[[32m✓^[[39m L-21 keeps loop time running while its Motion is paused^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.3313275Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.4193156Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.5108994Z  ^[[31m❯^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.5124995Z ^[[31m     ^[[31m×^[[31m 1. Engine time playback: project clock tick advances time motion playhead^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.5143303Z ^[[31m     ^[[31m×^[[31m 2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.5146345Z ^[[31m     ^[[31m×^[[31m 3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.5148956Z ^[[31m     ^[[31m×^[[31m 4. Stale scheduled write: paused Motion cancels pending write before scheduler flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.5151831Z ^[[31m     ^[[31m×^[[31m 5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.6383899Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.6386541Z ^[[31m     ^[[31m×^[[31m T-11 gives each trigger type its own input path instead of the manual one^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.6388801Z ^[[31m     ^[[31m×^[[31m T-12 lets seek scrub a driver-backed node and lets the driver overwrite it^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.6391266Z      ^[[32m✓^[[39m advances from the one injected clock and rejects control after disposal^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.6393254Z      ^[[32m✓^[[39m cancels queued trigger work when paused and does not duplicate on remount^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.7084933Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.7087690Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.7090129Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.7092643Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.7094735Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.7096815Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.7099206Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8129395Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8137715Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8142148Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8143297Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8144274Z ^[[31m     ^[[31m×^[[31m U-4 changes nothing when the candidate graph refuses a derived observation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8947272Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8949974Z      ^[[32m✓^[[39m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8952910Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8955124Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8958716Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8960464Z      ^[[32m✓^[[39m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:53.8962387Z ^[[31m     ^[[31m×^[[31m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0021491Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0023436Z      ^[[32m✓^[[39m adopts a free track under ~/id and publishes through the ordinary graph path^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0025050Z      ^[[32m✓^[[39m rejects duplicate adopted ids instead of silently replacing membership^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0026857Z      ^[[32m✓^[[39m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0028734Z      ^[[32m✓^[[39m keeps every adopted track independently addressable across sequential adopt and destroy calls^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0030501Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-finite stop positions^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0032236Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-monotonic stop positions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0033557Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with duplicate stop positions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0034850Z      ^[[32m✓^[[39m adopts a track into an existing motion under motionId/trackId^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0036039Z      ^[[32m✓^[[39m rejects adopting into a non-existent motion^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0037243Z      ^[[32m✓^[[39m destroys a motion-adopted track and invokes removeMotionTrack^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0779805Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0782301Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0783656Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0785543Z ^[[31m     ^[[31m×^[[31m rejects external signals without changing progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0787457Z ^[[31m     ^[[31m×^[[31m coalesces rapid driver ticks to the latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0788990Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0790669Z ^[[31m     ^[[31m×^[[31m keeps manual signals working and preserves range validation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.0792699Z ^[[31m     ^[[31m×^[[31m isolates a throwing clock consumer while preserving other Motion progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.1998293Z  ^[[31m❯^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.2000549Z ^[[31m     ^[[31m×^[[31m passes contribution context and creates the prepared timeline at load^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.2005639Z ^[[31m     ^[[31m×^[[31m selects one predicate contributor through Engine.load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.2007288Z ^[[31m     ^[[31m×^[[31m rejects malformed contributions during Engine.load^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.2008995Z ^[[31m     ^[[31m×^[[31m rejects authored ease collisions before any timeline is created^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.2010906Z ^[[31m     ^[[31m×^[[31m merges contributed keyframes into compiler diagnostics before timeline creation^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3054877Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3057492Z ^[[31m     ^[[31m×^[[31m 3.1 drives progress from an injected source and clamps out-of-range emissions^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3059781Z ^[[31m     ^[[31m×^[[31m 3.2 subscribes to the injected source once and unsubscribes exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3062015Z      ^[[32m✓^[[39m 3.3 rejects a missing source with a trigger-driver-unavailable diagnostic^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3064229Z ^[[31m     ^[[31m×^[[31m 3.4 unsubscribes an already resolved source when a later Motion cannot resolve^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3066315Z ^[[31m     ^[[31m×^[[31m registers no clock consumer for a push-driven scroll Motion^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3068176Z ^[[31m     ^[[31m×^[[31m rejects external signals for scroll Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3102106Z  ^[[31m❯^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3104590Z      ^[[32m✓^[[39m 1. Port lifecycle: subscribe, emit, unsubscribe, and resubscribe cleanly^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3106675Z      ^[[32m✓^[[39m 2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3108961Z ^[[31m     ^[[31m×^[[31m 3. Manual and custom trigger ports operate without DOM imports in core^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3111600Z ^[[31m     ^[[31m×^[[31m 4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.3113881Z      ^[[32m✓^[[39m 5. Idempotent teardown: pause, unmount, and dispose cleanly detach ports without leaks^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.4633096Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.4635603Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.4637462Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.4639455Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.4641550Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5800176Z  ^[[31m❯^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5802558Z ^[[31m     ^[[31m×^[[31m C-9 keeps a motion-owned track live through replacement^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5809208Z ^[[31m     ^[[31m×^[[31m C-10 preserves the array index and stagger timing across a replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5811437Z ^[[31m     ^[[31m×^[[31m C-11 keeps the observation replacement path resolvable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5813193Z ^[[31m     ^[[31m×^[[31m C-12 disposes every compiled timeline exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5814911Z ^[[31m     ^[[31m×^[[31m C-13 keeps runtime add and remove in step with the resolver^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5900881Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5903550Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5905820Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.5907654Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.6733591Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8297943Z  ^[[31m❯^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8300100Z ^[[31m     ^[[31m×^[[31m 1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8301533Z ^[[31m     ^[[31m×^[[31m 2. Pause cancels pending scheduled write and prevents Track mutation on flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8302485Z      ^[[32m✓^[[39m 3. Remount does not duplicate subscriptions or schedule parallel jobs^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8303318Z      ^[[32m✓^[[39m 4. Clock and trigger paths both retain cancellation behavior on pause^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8304194Z ^[[31m     ^[[31m×^[[31m 5. Burst signals produce exactly 1 published patch batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8673707Z  ^[[31m❯^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8676377Z ^[[31m     ^[[31m×^[[31m creates a motion, attaches a track, and signals progress from an empty project^[[39m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8678472Z ^[[31m     ^[[31m×^[[31m rejects motion destruction while it still owns tracks, then allows empty destruction^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8680135Z ^[[31m     ^[[31m×^[[31m keeps two runtime motions independently signalable^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8681404Z      ^[[32m✓^[[39m rejects duplicate and malformed motion ids without poisoning retries^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8682402Z      ^[[32m✓^[[39m rejects non-empty authored motions without deleting their schema tracks^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.8683274Z      ^[[32m✓^[[39m rejects addMotion with pre-populated tracks instead of dropping them^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.9738714Z  ^[[31m❯^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.9742226Z ^[[31m     ^[[31m×^[[31m covers source spelling across an add and its matching remove^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.9744731Z ^[[31m     ^[[31m×^[[31m deduplicates equivalent observations and preserves no-op sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.9746757Z ^[[31m     ^[[31m×^[[31m rejects an invalid free-track observation with stable diagnostics^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.9748918Z ^[[31m     ^[[31m×^[[31m V-7 refuses an authored target through addObserve on either role^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:54.9751223Z ^[[31m     ^[[31m×^[[31m J-7 refuses an authored role or projection through addObserve^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.0250000Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.1574390Z  ^[[31m❯^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.1576872Z ^[[31m     ^[[31m×^[[31m does not drive the disposed Track after direct replacement^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.1578452Z ^[[31m     ^[[31m×^[[31m preserves current progress when replacing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.1580070Z ^[[31m     ^[[31m×^[[31m preserves the original array index and stagger timing^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.1581934Z ^[[31m     ^[[31m×^[[31m keeps sibling progress healthy after replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.1583448Z ^[[31m     ^[[31m×^[[31m keeps the observation replacement path live^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.2248294Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.2743331Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.2760120Z ^[[31m     ^[[31m×^[[31m ingests authored tracks into the removable store without auto-mounting^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.2783991Z ^[[31m     ^[[31m×^[[31m returns a capability handle and makes stale ABA handles inert^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.2793478Z ^[[31m     ^[[31m×^[[31m replaces a track non-destructively and preserves subscriber identity^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.2795860Z ^[[31m     ^[[31m×^[[31m reads dependants from the committed graph and rejects source removal^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.2797801Z ^[[31m     ^[[31m×^[[31m treats observation changes as replacement of the observer track^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4218616Z  ^[[31m❯^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4243091Z ^[[31m     ^[[31m×^[[31m re-registers the compiled Track without throwing on the next Motion update^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4244692Z ^[[31m     ^[[31m×^[[31m preserves the replaced Track index and stagger timing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4246169Z ^[[31m     ^[[31m×^[[31m updates a Motion-owned Track through observation mutations^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4985702Z  ^[[31m❯^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4987875Z ^[[31m     ^[[31m×^[[31m returns a deeply frozen runtime-owned definition^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4989452Z ^[[31m     ^[[31m×^[[31m isolates caller mutation from the frozen graph definition^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4991603Z ^[[31m     ^[[31m×^[[31m uses the authored validation owner for malformed runtime track structure^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.4993994Z ^[[31m     ^[[31m×^[[31m keeps the existing same-source destroy and readopt path working^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.5380199Z  ^[[31m❯^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.5383090Z ^[[31m     ^[[31m×^[[31m F-10 interpolates grouped leaves without renaming the owning plugin^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.5385282Z ^[[31m     ^[[31m×^[[31m F-11 interpolates a grouped track when the Engine has no plugin registry^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.5387387Z ^[[31m     ^[[31m×^[[31m F-12 publishes identical values for the flat and grouped spellings^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.6825396Z  ^[[31m❯^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.6827478Z ^[[31m     ^[[31m×^[[31m publishes a progress change through the public project handle^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.6828851Z ^[[31m     ^[[31m×^[[31m keeps one clock owner while clock progress publishes once^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.6830101Z ^[[31m     ^[[31m×^[[31m still resolves authored-key plugins during progress updates^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.6831763Z ^[[31m     ^[[31m×^[[31m routes a manual trigger through the public handle into a published patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.7515324Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.7929418Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.7932493Z ^[[31m     ^[[31m×^[[31m H-1 keeps a namespaced derived key out of every published surface^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.7934708Z ^[[31m     ^[[31m×^[[31m H-2 keeps a declared unprefixed internal key out of the patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.7936724Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.9243179Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:55.9967183Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.0270528Z  ^[[31m❯^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.0309970Z      ^[[32m✓^[[39m adopts a free track and publishes a ready patch via seek^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.0311989Z      ^[[32m✓^[[39m destroyAdopted removes the node from the graph^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.0313652Z ^[[31m     ^[[31m×^[[31m rejects adoption of a track with malformed keyframes^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.0315412Z ^[[31m     ^[[31m×^[[31m adopts a track into an existing motion and receives motion signals^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.1613976Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.2077634Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.2413209Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.4120297Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.4414788Z  ^[[31m❯^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.4433241Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before constructing a runtime^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.4435681Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before any timeline is created^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.4437690Z ^[[31m     ^[[31m×^[[31m resolves authored plugin ownership during load, not on the first seek^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.4439787Z ^[[31m     ^[[31m×^[[31m accepts a valid project and creates its timelines during load^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.5051788Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.5069680Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.6146758Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.6367618Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.7523448Z  ^[[31m❯^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.7553331Z ^[[31m     ^[[31m×^[[31m tells subscribers the node was destroyed and reaches them again after re-adoption^[[39m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:56.8293606Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.0089985Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.0352000Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.0354044Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.0725197Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.2040319Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.2714763Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.2857955Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.4414581Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.4932358Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.4950381Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.4984594Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.4985543Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 124 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.4986330Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.4997469Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopt-destroy-readopt.test.ts^[[2m > ^[[22madopt -> destroy -> re-adopt lifecycle on the wire (D1)^[[2m > ^[[22mtells subscribers the node was destroyed and reaches them again after re-adoption
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5002381Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5005165Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5095024Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5096313Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5097730Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5098655Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5099529Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5100621Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5102192Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5103311Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5104358Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopt-destroy-readopt.test.ts:^[[2m40:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5104839Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5105398Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5105634Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5106928Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mreturns a deeply frozen runtime-owned definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5109073Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5110623Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5112057Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5113163Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5114476Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5115367Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5116213Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5117277Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5118419Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5119450Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5120525Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m33:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5121280Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5121878Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5122112Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5123233Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22misolates caller mutation from the frozen graph definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5124815Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5125946Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5126717Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5127541Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5128809Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5129616Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5130160Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5131130Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5132677Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5134211Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5136008Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m56:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5136685Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5136956Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5137177Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5138284Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22muses the authored validation owner for malformed runtime track structure
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5139789Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5140288Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5140423Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5140660Z undefined
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5140770Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5141205Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5142118Z "TypeError: property-stops-wrapper at addTrack(broken).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5142702Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5143226Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m79:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5143778Z     ^[[90m 77|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5144249Z     ^[[90m 78|^[[39m     expect(() => handle.adopt(malformed, owner)).toThrow(/observes-sha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5144919Z     ^[[90m 79|^[[39m     expect(() => handle.adopt({ id: "broken", keyframes: { x: ramp(0, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5145563Z     ^[[90m   |^[[39m                                                                                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5145969Z     ^[[90m 80|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5146337Z     ^[[90m 81|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5146591Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5146820Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5147028Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5148090Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mkeeps the existing same-source destroy and readopt path working
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5149668Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5150786Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5152348Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5153778Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5155601Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5156863Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5157938Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5159840Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5162443Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5163957Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5165511Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m89:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5166301Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5166786Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5167193Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5168748Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-finite stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5171633Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5172646Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5172961Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5173391Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5173626Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5173889Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5175255Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5176200Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5176959Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m79:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5177990Z     ^[[90m 77|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5182381Z     ^[[90m 78|^[[39m       runtime.adopt({ id: "bad", keyframes: { x: { stops: [{ p: Number…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5183822Z     ^[[90m 79|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5184741Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5185527Z     ^[[90m 80|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5186310Z     ^[[90m 81|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5186631Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5187073Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5187473Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5188998Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-monotonic stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5191694Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5192653Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5192953Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5193359Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5193593Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5193829Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5195114Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5196060Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5196850Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m100:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5197797Z     ^[[90m 98|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5243675Z     ^[[90m 99|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5244660Z     ^[[90m100|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5245512Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5246280Z     ^[[90m101|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5247263Z     ^[[90m102|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5247579Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5248018Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5248383Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5249868Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with duplicate stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5252728Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5254114Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5254393Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5255098Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5255334Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5255603Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5256907Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5257866Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5258630Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m121:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5259546Z     ^[[90m119|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5260152Z     ^[[90m120|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5261308Z     ^[[90m121|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5262205Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5262983Z     ^[[90m122|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5263730Z     ^[[90m123|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5264036Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5264448Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5264821Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5266379Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-10 closes the static domain instead of leaving it open
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5268597Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5269435Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5269702Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5270155Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5270456Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5270643Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5271314Z ^[[32m-   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5272036Z ^[[31m+   "keyframes-missing-values-section",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5272621Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5272817Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5273625Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m260:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5274991Z     ^[[90m258|^[[39m     expect(ruleIds({ x: Number.POSITIVE_INFINITY })).toEqual(["stops-s…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5276711Z     ^[[90m259|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m () ^[[33m=>^[[39m ^[[34m1^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5278763Z     ^[[90m260|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m { hold^[[33m:^[[39m ^[[34m1^[[39m } }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5280296Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5281580Z     ^[[90m261|^[[39m     // The shape error cites the property the author wrote, not a `.st…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5282994Z     ^[[90m262|^[[39m     ^[[90m// exists anywhere in the document.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5283481Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5283925Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5284322Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5286041Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-16 leaves no authored schema in the repository on the retired form
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5287962Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(58) ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5288496Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5288737Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5289196Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5289428Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5289621Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5289998Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5290675Z ^[[31m+   "packages/core/src/contract/authored-leaf.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5291732Z ^[[31m+   "packages/core/src/contract/v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5292553Z ^[[31m+   "packages/core/src/contract/validate-v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5293454Z ^[[31m+   "packages/core/test/contract/adapters.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5294625Z ^[[31m+   "packages/core/test/contract/graph-builder-incremental.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5296091Z ^[[31m+   "packages/core/test/contract/gsap-absolute-stops.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5297250Z ^[[31m+   "packages/core/test/contract/gsap-authored-duration.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5298546Z ^[[31m+   "packages/core/test/contract/gsap-equivalence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5299593Z ^[[31m+   "packages/core/test/contract/gsap-multi-stop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5300616Z ^[[31m+   "packages/core/test/contract/gsap-one-tween.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5302594Z ^[[31m+   "packages/core/test/contract/gsap-paused-timeline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5303806Z ^[[31m+   "packages/core/test/contract/gsap-sparse-percent-map.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5304854Z ^[[31m+   "packages/core/test/contract/ports.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5305867Z ^[[31m+   "packages/core/test/contract/s4-validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5306917Z ^[[31m+   "packages/core/test/contract/v5-validator.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5307974Z ^[[31m+   "packages/core/test/contract/validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5309136Z ^[[31m+   "packages/core/test/integration/adopt-destroy-readopt.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5310413Z ^[[31m+   "packages/core/test/integration/adopted-track-immutability.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5311802Z ^[[31m+   "packages/core/test/integration/adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5312829Z ^[[31m+   "packages/core/test/integration/end-to-end.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5313881Z ^[[31m+   "packages/core/test/integration/engine-headless.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5315105Z ^[[31m+   "packages/core/test/integration/engine-load-validation.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5316390Z ^[[31m+   "packages/core/test/integration/engine-x3-contribution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5317556Z ^[[31m+   "packages/core/test/integration/handle-adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5318668Z ^[[31m+   "packages/core/test/integration/internal-key-strip.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5320030Z ^[[31m+   "packages/core/test/integration/issue-114-motion-track-regressions.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5323769Z ^[[31m+   "packages/core/test/integration/keyframe-groups.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5325061Z ^[[31m+   "packages/core/test/integration/motion-trigger-types.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5326333Z ^[[31m+   "packages/core/test/integration/mutation-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5327567Z ^[[31m+   "packages/core/test/integration/observation-identity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5328835Z ^[[31m+   "packages/core/test/integration/option-c-track-resolution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5330131Z ^[[31m+   "packages/core/test/integration/per-plugin-key-ownership.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5332321Z ^[[31m+   "packages/core/test/integration/phase0-red-baseline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5333640Z ^[[31m+   "packages/core/test/integration/phase2-motion-scheduling.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5334908Z ^[[31m+   "packages/core/test/integration/phase3-trigger-port.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5336191Z ^[[31m+   "packages/core/test/integration/phase4-dynamic-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5337403Z ^[[31m+   "packages/core/test/integration/phase7-walker-demo.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5338631Z ^[[31m+   "packages/core/test/integration/plugin-group-values-section.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5339938Z ^[[31m+   "packages/core/test/integration/plugin-owned-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5341445Z ^[[31m+   "packages/core/test/integration/replace-motion-track.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5342773Z ^[[31m+   "packages/core/test/integration/replace-track-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5344076Z ^[[31m+   "packages/core/test/integration/runtime-motion-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5345310Z ^[[31m+   "packages/core/test/integration/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5346548Z ^[[31m+   "packages/core/test/integration/t4-runtime-motion-parity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5347962Z ^[[31m+   "packages/core/test/integration/trigger-scroll.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5349053Z ^[[31m+   "packages/core/test/integration/trigger-time-loop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5350339Z ^[[31m+   "packages/core/test/integration/trigger-time.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5351788Z ^[[31m+   "packages/core/test/integration/unified-mutation-surface.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5353178Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-completeness.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5354580Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-contract.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5355852Z ^[[31m+   "packages/core/test/unit/domain/plugin-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5356927Z ^[[31m+   "packages/core/test/unit/domain/plugins.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5357978Z ^[[31m+   "packages/core/test/unit/domain/s7-plugin-evidence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5359130Z ^[[31m+   "packages/core/test/unit/graph/incremental-cache.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5360382Z ^[[31m+   "packages/core/test/unit/graph/requirement-edge-construction.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5362536Z ^[[31m+   "packages/core/test/unit/graph/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5363787Z ^[[31m+   "packages/core/test/unit/runtime/composition-output-shape.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5364891Z ^[[31m+   "packages/react/test/public-hook-render.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5365566Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5365806Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5366634Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m344:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5367912Z     ^[[90m342|^[[39m     // be red for a fixture that authors the retired form, but a fixtu…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5369060Z     ^[[90m343|^[[39m     // and that is the one that reads as an accepted second shape late…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5370506Z     ^[[90m344|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5371839Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5372478Z     ^[[90m345|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5373041Z     ^[[90m346|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5373330Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5373756Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5374110Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5375854Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5378663Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5380549Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5382070Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5383589Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5384816Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5385578Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5386555Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5387681Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5388825Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5389890Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5390249Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5390645Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5391414Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5392891Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mpublishes a progress change through the public project handle
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5395782Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5397122Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5397827Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5399027Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5400088Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5400667Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5401851Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5402539Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5403175Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5403882Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m38:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5404236Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5404474Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5404676Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5405445Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mkeeps one clock owner while clock progress publishes once
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5406861Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5407882Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5408559Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5409378Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5410299Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5411225Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5411810Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5412669Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5413542Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5414571Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m60:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5415052Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5415437Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5415669Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5416671Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mstill resolves authored-key plugins during progress updates
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5419033Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5420316Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5421994Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5423029Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5423731Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5424154Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5424890Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5425496Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5426119Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5426827Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m79:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5427178Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5427407Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5427614Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5428458Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mroutes a manual trigger through the public handle into a published patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5429929Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5431124Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5431816Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5432621Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5433307Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5433719Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5434228Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5434820Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5435416Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5436122Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m94:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5436473Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5436699Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5436911Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5437954Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before constructing a runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5439411Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5439945Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5440081Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5440307Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5440437Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5440566Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5441653Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5442581Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5443661Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m31:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5444726Z     ^[[90m 29|^[[39m     const invalid = projectWith({ opacity: { stops: [{ p: Number.NaN, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5445480Z     ^[[90m 30|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5446342Z     ^[[90m 31|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5447378Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5448151Z     ^[[90m 32|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5448793Z     ^[[90m 33|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5449136Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5449629Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5450019Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5451577Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5453955Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5454667Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5454841Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5455108Z /stop-position-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5455320Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5455577Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5456887Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5457645Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5458144Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m48:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5459134Z     ^[[90m 46|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5459608Z     ^[[90m 47|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5460400Z     ^[[90m 48|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5461260Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5462369Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5463097Z     ^[[90m 50|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5463420Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5463812Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5464039Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5465454Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mresolves authored plugin ownership during load, not on the first seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5468339Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5469326Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5469566Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5469997Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5470232Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5470513Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5472030Z "property-stops-wrapper at motions[0].tracks[0].keyframes.unknown: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5473029Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5473863Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m65:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5474875Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5475844Z     ^[[90m 64|^[[39m       engine.load(projectWith({ unknown: { stops: [{ p: 0, v: 0 }] } }…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5476981Z     ^[[90m 65|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-unknown-key/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5477794Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5478803Z     ^[[90m 66|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5479687Z     ^[[90m 67|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5480216Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5480630Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5481356Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5483250Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22maccepts a valid project and creates its timelines during load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5486148Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5487366Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5488046Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5488852Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5489544Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5489961Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5490490Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5491640Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5492338Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5493096Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m74:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5493481Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5493714Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5493938Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5495012Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mpasses contribution context and creates the prepared timeline at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5496649Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5497651Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5498326Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5499127Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5499806Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5500223Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5500742Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5501545Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5502224Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5503280Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m38:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5503848Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5504321Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5504657Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5505726Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mselects one predicate contributor through Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5508640Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5510184Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5511420Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5512502Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5513881Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5514473Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5515013Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5515684Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5516685Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5517664Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m75:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5518056Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5518299Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5518542Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5520086Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects malformed contributions during Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5521956Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5522881Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5523154Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5523529Z /plugin-contribution-stop-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5523717Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5523857Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5524688Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5525517Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5526268Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m108:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5527147Z     ^[[90m106|^[[39m         ^[[34mprojectWith^[[39m({ x^[[33m:^[[39m ^[[34mproperty^[[39m(^[[34m1^[[39m) }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5528062Z     ^[[90m107|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5528986Z     ^[[90m108|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-stop-order/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5529599Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5530184Z     ^[[90m109|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5531205Z     ^[[90m110|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5531398Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5531645Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5532047Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5533158Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects authored ease collisions before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5535396Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5536042Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5536195Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5536698Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5537064Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5537264Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5538867Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5539889Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5540371Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5541109Z     ^[[90m131|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5541499Z     ^[[90m132|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5542087Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5542867Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5543562Z     ^[[90m134|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5544075Z     ^[[90m135|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5544248Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5544473Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5544683Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5545804Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mmerges contributed keyframes into compiler diagnostics before timeline creation
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5547430Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5548053Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5548194Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5548480Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5548695Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5548828Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5549549Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5550087Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5550548Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m170:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5551477Z     ^[[90m168|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5552136Z     ^[[90m169|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5553172Z     ^[[90m170|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5553884Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5554467Z     ^[[90m171|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5554986Z     ^[[90m172|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5555160Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5555390Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5555600Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5556499Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22mrejects adoption of a track with malformed keyframes
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5557869Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5558412Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5558548Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5558785Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5558919Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5559049Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5559746Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5560573Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5561564Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m57:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5562292Z     ^[[90m 55|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5562636Z     ^[[90m 56|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5563954Z     ^[[90m 57|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m handle^[[33m.^[[39m^[[34madopt^[[39m(bad^[[33m,^[[39m owner))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5564955Z     ^[[90m   |^[[39m                                            ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5565449Z     ^[[90m 58|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5566073Z     ^[[90m 59|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5566415Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5566766Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5566986Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5568236Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22madopts a track into an existing motion and receives motion signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5570620Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5572270Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5573568Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5574674Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5575678Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5576334Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5576880Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5577633Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5579088Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5580457Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5582053Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m69:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5582720Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5583164Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5583537Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5585530Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-1 keeps a namespaced derived key out of every published surface
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5588429Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5590309Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5591849Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5593382Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5594648Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5595403Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5597354Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5598538Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5599648Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5601202Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5602677Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m42:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5603351Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5603759Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5604135Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5606071Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-2 keeps a declared unprefixed internal key out of the patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5608974Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5610822Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5615026Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5616881Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5618418Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5619167Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5620115Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5621713Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5622818Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5624414Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5625893Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5626630Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5627045Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5627405Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5629260Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5632627Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5634558Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5635825Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5637304Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5638556Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5639816Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5641621Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5642816Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5644025Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5645377Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5646843Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m84:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5647504Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5647922Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5648290Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5650341Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mdoes not drive the disposed Track after direct replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5655038Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5657279Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5658569Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5660490Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5662100Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5662830Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5663746Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5664818Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5668058Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5669836Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5671865Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m41:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5672639Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5673054Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5673402Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5675366Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves current progress when replacing
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5678516Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5680358Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5682259Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5683713Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5684910Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5685637Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5686578Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5687652Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5688770Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5690290Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5692368Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m56:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5693184Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5693601Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5693964Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5695903Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves the original array index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5701544Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5705080Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5706336Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5707801Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5709027Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5709792Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5710750Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5712232Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5713396Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5714899Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5716949Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m72:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5718009Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5718480Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5718859Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5720735Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps sibling progress healthy after replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5725117Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5727868Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5729129Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5730609Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5732224Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5732989Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5733928Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5735004Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5736140Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5737674Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5739485Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m86:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5740279Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5740711Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5741729Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5743607Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps the observation replacement path live
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5747828Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5750506Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5752025Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5753930Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5755441Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5756210Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5757177Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5758291Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5759408Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5761185Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5763009Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m103:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5763790Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5764215Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5764578Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5766383Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-10 interpolates grouped leaves without renaming the owning plugin
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5771455Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5774547Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5775792Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5777256Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5778486Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5779232Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5780172Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5781466Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5782589Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5783902Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5785327Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m56:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5785954Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5786372Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5786745Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5788605Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-11 interpolates a grouped track when the Engine has no plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5791849Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5793809Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5795016Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5796484Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5797719Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5798740Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5799689Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5801423Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5802579Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5803899Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5805298Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m70:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5805929Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5806344Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5806702Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5808511Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-12 publishes identical values for the flat and grouped spellings
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5811647Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5813574Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5814785Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5816241Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5817475Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5818246Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5819180Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5820279Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5821584Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5822866Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5824260Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m81:18^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5824916Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5825340Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5825709Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5827662Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-11 gives each trigger type its own input path instead of the manual one
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5830349Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5832215Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5833029Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5833870Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5834560Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5834988Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5835506Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5836108Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5836718Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5838024Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5838949Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m104:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5839557Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5839800Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5840397Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5842018Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-12 lets seek scrub a driver-backed node and lets the driver overwrite it
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5844477Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5846260Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5847741Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5849179Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5850397Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5851320Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5852242Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5853302Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5854340Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5855309Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5856542Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m123:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5857044Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5857449Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5857795Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5859291Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5864119Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5867119Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5868284Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5869108Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5870162Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5871618Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5872560Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5873516Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5874882Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5875638Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5876394Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5877359Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5877777Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5878153Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5879531Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5881729Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5882544Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5882708Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5882975Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5883149Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5883322Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5884541Z "property-stops-wrapper at addTrack(child).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5885079Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5885718Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m118:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5886685Z     ^[[90m116|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5886993Z     ^[[90m117|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5887459Z     ^[[90m118|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-un…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5888330Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5888910Z     ^[[90m119|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5889390Z     ^[[90m120|^[[39m     const replacement = handle.adopt({ id: "child", keyframes: { x: ra…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5889720Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5889974Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5890344Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5891860Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5893931Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5894560Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5894813Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5895256Z /observation-self-reference/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5895540Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5895767Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5896490Z "property-stops-wrapper at addTrack(self).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5897203Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5898022Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m140:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5898597Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5898881Z     ^[[90m139|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5899349Z     ^[[90m140|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-se…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5899915Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5900582Z     ^[[90m141|^[[39m     const replacement = handle.adopt({ id: "self", keyframes: { x: ram…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5902156Z     ^[[90m142|^[[39m     ^[[34mexpect^[[39m(replacement^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"~/self"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5902866Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5903273Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5903622Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5905233Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mcovers source spelling across an add and its matching remove
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5909159Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5912196Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5913389Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5915033Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5916224Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5916936Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5917853Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5918908Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5919975Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5921556Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5923086Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5923754Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5924160Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5924513Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5926190Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mdeduplicates equivalent observations and preserves no-op sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5930156Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5933003Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5934198Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5935681Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5936892Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5937609Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5938528Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5939573Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5940633Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5942229Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5944146Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m75:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5944857Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5945358Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5945870Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5947602Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mrejects an invalid free-track observation with stable diagnostics
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5952197Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5954310Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5955150Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5956308Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5957364Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5957883Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5974184Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5975331Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5976444Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5977864Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5979385Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m89:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5980053Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5980471Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5980829Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5982686Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mV-7 refuses an authored target through addObserve on either role
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5986675Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5989285Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5990488Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5992116Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5993345Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5994074Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5994984Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5996053Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5997117Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.5998510Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6000018Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6000656Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6001239Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6001600Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6003239Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mJ-7 refuses an authored role or projection through addObserve
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6007192Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6009794Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6011154Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6012607Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6013798Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6014801Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6015719Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6016972Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6018033Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6019414Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6021140Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6021823Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6022145Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6022366Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6023473Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-9 keeps a motion-owned track live through replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6025150Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6026164Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6026845Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6027666Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6028645Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6029397Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6030317Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6031564Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6032665Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6034067Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6035621Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m60:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6036315Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6036719Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6037072Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6039178Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-10 preserves the array index and stagger timing across a replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6044881Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6048325Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6049512Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6051116Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6052352Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6053081Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6053998Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6055127Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6056239Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6057820Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6059368Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m73:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6060056Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6060461Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6060810Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6062958Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-11 keeps the observation replacement path resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6067138Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6069762Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6071193Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6072678Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6073918Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6074641Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6075552Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6076604Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6077691Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6079067Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6080614Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m88:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6081489Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6081913Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6082269Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6084192Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-12 disposes every compiled timeline exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6087937Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6090124Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6091534Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6092990Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6094186Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6094898Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6095816Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6096857Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6097923Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6099557Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6101545Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m104:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6102249Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6102658Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6103003Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6105011Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-13 keeps runtime add and remove in step with the resolver
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6107924Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6109674Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6110861Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6112466Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6113676Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6114328Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6114867Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6115474Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6116086Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6116864Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6117722Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m113:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6118128Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6118351Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6118566Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6119535Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6124461Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6127681Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6128352Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6129154Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6130078Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6130520Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6131173Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6131781Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6132574Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6133462Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6134466Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6135226Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6135720Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6136124Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6137917Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6139466Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6140046Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6140210Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6140468Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6140619Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6140751Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6144569Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6147306Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6147825Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m123:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6148585Z     ^[[90m121|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6149236Z     ^[[90m122|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6149960Z     ^[[90m123|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6150717Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6151478Z     ^[[90m124|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6151929Z     ^[[90m125|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6152106Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6152332Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6152537Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6153499Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6161820Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6167716Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6168953Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6170437Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6171935Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6172695Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6173633Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6174765Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6175915Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6177326Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6178917Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m128:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6179665Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6180112Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6180477Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6182783Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m1. Engine time playback: project clock tick advances time motion playhead
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6184744Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6186153Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6186856Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6187683Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6188376Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6188790Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6189324Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6189927Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6190533Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6191510Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m40:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6191887Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6192191Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6192394Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6194290Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6197115Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6198591Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6199264Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6200063Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6200805Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6201496Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6202014Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6202644Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6203296Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6204010Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m98:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6204407Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6204660Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6204866Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6206097Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6207836Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6209033Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6209806Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6210618Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6211979Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6212760Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6213404Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6214216Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6215130Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6216030Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m142:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6216424Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6216649Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[58/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6216877Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6218113Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m4. Stale scheduled write: paused Motion cancels pending write before scheduler flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6219868Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6221095Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6222085Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6223140Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6223876Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6224337Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6224878Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6225522Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6226196Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6226989Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m199:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6227411Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6227662Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[59/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6227887Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6229200Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6231281Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6232382Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6233144Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6234025Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6234795Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6235260Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6235825Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6236486Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6237169Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6237977Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m245:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6238371Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6238620Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[60/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6238849Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6240095Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6242129Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6243219Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6243964Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6244832Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6245601Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6246056Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6246622Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6247284Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6248120Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6249001Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6249587Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6249852Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[61/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6250078Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6251478Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m2. Pause cancels pending scheduled write and prevents Track mutation on flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6253247Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6254321Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6255055Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6255955Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6256849Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6257386Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6257998Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6258673Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6259338Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6260149Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m78:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6260582Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6260828Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[62/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6261272Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6262351Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m5. Burst signals produce exactly 1 published patch batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6264008Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6265074Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6265791Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6266673Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6267396Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6267847Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6268413Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6269068Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6269740Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6270550Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m168:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6271219Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6271511Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[63/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6271720Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6272908Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m3. Manual and custom trigger ports operate without DOM imports in core
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6274676Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6275938Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6276823Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6277716Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6278452Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6278910Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6279496Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6280131Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6280801Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6281838Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m109:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6282253Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6282503Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[64/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6282736Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6284029Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6285856Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6286923Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6287660Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6288523Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6289293Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6289737Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6290316Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6291161Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6291863Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6292660Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m136:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6293075Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6293326Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[65/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6293548Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6294814Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6296526Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6297160Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6297325Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6297602Z /stop-position|monoton/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6297775Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6297913Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6298665Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6299231Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6299776Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m172:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6300385Z     ^[[90m170|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6300722Z     ^[[90m171|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6301452Z     ^[[90m172|^[[39m     expect(() => runtime.adopt(badTrack, {})).toThrow(/stop-position|m…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6302279Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6302827Z     ^[[90m173|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6303292Z     ^[[90m174|^[[39m     ^[[90m// Graph state byte-identical after failed adoption^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6303647Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6303903Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[66/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6304132Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6305187Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m1. Load valid walker project through Engine with plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6312211Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6317181Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6317867Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6318745Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6319444Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6319897Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6320503Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6321650Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6322845Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6324065Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m145:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6324505Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6324892Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[67/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6325130Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6326069Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m2. Render walker nodes through createDomPatchAdapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6332641Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6337513Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6338205Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6339018Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6340138Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6341120Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6342161Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6343211Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6343870Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6344601Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m164:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6344974Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6345203Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[68/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6345412Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6346400Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m3. Demonstrate time playback using single injected browser clock
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6353134Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6357707Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6358382Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6359195Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6359883Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6360298Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6360814Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6361873Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6362496Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6363217Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m199:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6363809Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6364055Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[69/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6364266Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6365357Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m4. Demonstrate progress through TriggerPort and manual signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6371990Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6376520Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6377193Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6377999Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6378678Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6379100Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6379623Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6380220Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6380825Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6381947Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m219:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6382432Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6382683Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[70/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6382895Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6383880Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6390278Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6396505Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6397421Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6398243Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6398926Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6399346Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6399867Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6400462Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6401587Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6402988Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m243:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6403646Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6403919Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[71/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6404149Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6405503Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6412562Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6417135Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6417818Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6418623Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6419317Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6419740Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6420255Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6420856Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6421733Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6422473Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m269:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6422839Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6423080Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[72/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6423287Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6424303Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m7. Mount, unmount, remount, and dispose without duplicate subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6430861Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6435900Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6437034Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6438015Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6439375Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6440268Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6441387Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6442394Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6443407Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6444635Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m305:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6445221Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6445618Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[73/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6445956Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6447576Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m8. Show blocked/pending/error diagnostics without crashing the app
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6459574Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6468361Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6469564Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6471142Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6472298Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6472984Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6473857Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6474860Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6475877Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6477064Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m330:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6477709Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6478106Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[74/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6478466Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6480152Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6492269Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6498263Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6499317Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6500142Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6500834Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6501579Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6502386Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6502999Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6503779Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6504500Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m351:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6504865Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6505100Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[75/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6505302Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6506234Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m10. Automated end-to-end integration test passes clean
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6512761Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6517272Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6517956Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6518772Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6519462Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6519878Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6520393Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6521236Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6522312Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6523146Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m387:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6523521Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6523759Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[76/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6523973Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6525120Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6526914Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6527968Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6528643Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6529443Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6530303Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6530721Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6531594Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6532195Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6532807Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6533598Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6534498Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m147:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6534904Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6535131Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[77/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6535330Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6536375Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-7 cites the section in a diagnostic about a leaf inside it
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6537657Z ^[[31m^[[1mAssertionError^[[22m: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6538024Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6538161Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6538439Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6538748Z   "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6539108Z   "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6539380Z }
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6539484Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6539618Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6539831Z [
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6540005Z   {
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6540444Z     "message": "The { stops: [...] } wrapper is retired; author the stops array directly as the value.",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6541191Z     "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6541539Z     "ruleId": "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6541839Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6542057Z   },
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6542230Z ]
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6542330Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6542866Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m214:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6543620Z     ^[[90m212|^[[39m   it("Y-7 cites the section in a diagnostic about a leaf inside it", (…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6544274Z     ^[[90m213|^[[39m     const authored = { fk: { values: { length: { stops: [{ p: 2, v: 1 …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6544977Z     ^[[90m214|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6545545Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6546011Z     ^[[90m215|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6546580Z     ^[[90m216|^[[39m         ruleId^[[33m:^[[39m ^[[32m"stop-position-range"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6546884Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6547111Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[78/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6547329Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6548428Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6549673Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'property-stops-wrapper' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6550036Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6550165Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6550433Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6550559Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6550666Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6550881Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6551414Z ^[[31m+   "property-stops-wrapper",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6551718Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6551832Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6552328Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m228:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6553073Z     ^[[90m226|^[[39m     // a property called `values` that `fk` claims, and nothing about …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6554246Z     ^[[90m227|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m { fk^[[33m:^[[39m { values^[[33m:^[[39m { values^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } } }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6555309Z     ^[[90m228|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m(authored))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6555893Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6556218Z     ^[[90m229|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6556695Z     ^[[90m230|^[[39m     const resolved = registry(passthrough).resolveForKeyframes(authore…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6557039Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6557268Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[79/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6557477Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6558574Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6565259Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6569777Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6570455Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6571539Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6572243Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6572659Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6573184Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6573782Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6574405Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6575212Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6576115Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m278:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6576536Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6576766Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[80/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6576967Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6578035Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6583134Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6586743Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6587424Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6588228Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6588916Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6589342Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6589855Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6590444Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6591252Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6592042Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6592921Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6593323Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6593548Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[81/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6593756Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6594840Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6599736Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6603646Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6604352Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6605164Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6605846Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6606259Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6606775Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6607375Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6607981Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6608758Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6609817Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6610327Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6610564Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[82/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6610774Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6612017Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6614594Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6615634Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6615865Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6616304Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6616550Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6616789Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6621440Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6624249Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6624769Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m146:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6625356Z     ^[[90m144|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6625674Z     ^[[90m145|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6626170Z     ^[[90m146|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6626755Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6627146Z     ^[[90m147|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6627420Z     ^[[90m148|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6627550Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6627779Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[83/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6627981Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6629063Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6634476Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6637292Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6637981Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6638787Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6639469Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6640065Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6640585Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6641573Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6642194Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6642975Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6643884Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m162:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6644284Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6644512Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[84/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6644717Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6645771Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6652651Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6658531Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6659751Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6661356Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6662575Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6663312Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6664236Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6665291Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6665920Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6666704Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6667605Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m192:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6668006Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6668239Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[85/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6668444Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6669464Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6671254Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6671874Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6672024Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6672297Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6672467Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6672597Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6677026Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6681122Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6682082Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m213:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6683086Z     ^[[90m211|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6683651Z     ^[[90m212|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6684545Z     ^[[90m213|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6685551Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6686226Z     ^[[90m214|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6686750Z     ^[[90m215|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6687030Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6687440Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[86/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6687787Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6689366Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mre-registers the compiled Track without throwing on the next Motion update
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6691153Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6692170Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6692858Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6693672Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6694403Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6694816Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6695511Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6696125Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6696745Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6697638Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m27:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6698019Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6698398Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[87/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6698624Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6699731Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mpreserves the replaced Track index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6705283Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6708588Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6709270Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6710261Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6711317Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6711746Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6712280Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6712891Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6713497Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6714224Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m64:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6714603Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6714833Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[88/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6715040Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6715964Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mupdates a Motion-owned Track through observation mutations
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6718193Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6719818Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6720492Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6721674Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6722884Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6723550Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6724393Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6725649Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6726941Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6728540Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m91:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6729251Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6729733Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[89/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6730281Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6732561Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6734419Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6735621Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6736483Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6737420Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6738222Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6738754Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6739428Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6740194Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6741215Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6743168Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6745310Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6746188Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6746619Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[90/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6746939Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6810063Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6813649Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6815451Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6816719Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6817594Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6818313Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6818727Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6819258Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6819876Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6820516Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6821670Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6822625Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m113:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6823055Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6823305Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[91/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6823525Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6824609Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6826225Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6827211Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6827884Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6828692Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6829375Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6829999Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6830876Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6832164Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6832917Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6833744Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6834671Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6835089Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6835318Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[92/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6835573Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6837644Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-4 changes nothing when the candidate graph refuses a derived observation
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6841383Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6843188Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6844372Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6845828Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6847040Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6847707Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6848243Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6848835Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6849455Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6850254Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6851617Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m143:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6852391Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6852817Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[93/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6853170Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6854935Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mcreates a motion, attaches a track, and signals progress from an empty project
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6856505Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6857612Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6858378Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6859174Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6860153Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6860813Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6861608Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6862498Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6863554Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6864533Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6865898Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m42:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6866594Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6866993Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[94/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6867336Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6869301Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mrejects motion destruction while it still owns tracks, then allows empty destruction
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6871864Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6872998Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6873763Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6874558Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6875525Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6876178Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6876720Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6877448Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6878290Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6879016Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6879764Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m58:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6880153Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6880379Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[95/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6880576Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6881674Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mkeeps two runtime motions independently signalable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6883202Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6884408Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6885165Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6886593Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6888353Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6889519Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6890471Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6891990Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6893517Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6894423Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6895338Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m74:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6895731Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6896077Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[96/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6896281Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6897334Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6902873Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6908080Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6909272Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6910701Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6911647Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6912075Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6912594Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6913200Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6914227Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6915579Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m45:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6916732Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m52:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6917365Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6917605Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[97/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6917813Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6918895Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6921219Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6922716Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6923397Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6924226Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6924898Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6925519Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6926460Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6927172Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6927950Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6929360Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m153:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6931330Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m175:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6932047Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6932485Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[98/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6932781Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6933817Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-6 rolls the Motion back when the candidate graph rejects it
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6935348Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6936613Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6937389Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6938208Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6939185Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6939834Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6940375Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6941482Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6943093Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6944316Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6945717Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m360:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6946413Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6946840Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[99/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6947193Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6949141Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-7 keeps one clock subscription when a Motion is created at runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6950721Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6952104Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6952864Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6953814Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6954824Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6955585Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6956278Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6957086Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6958121Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6959286Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6960683Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m397:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6961980Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6962409Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[100/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6962625Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6963532Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.1 drives progress from an injected source and clamps out-of-range emissions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6965153Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6966162Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6966842Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6967655Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6968342Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6968768Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6969293Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6969897Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6970506Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6971629Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6972407Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m76:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6972947Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6973186Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[101/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6973395Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6974641Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.2 subscribes to the injected source once and unsubscribes exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6977324Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6979124Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6980311Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6981518Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6982226Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6982644Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6983307Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6983940Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6984712Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6985467Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6986856Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m99:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6987481Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6987886Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[102/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6988232Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6989573Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.4 unsubscribes an already resolved source when a later Motion cannot resolve
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6991684Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6992287Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6992428Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6992882Z /trigger-driver-unavailable/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6993050Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6993187Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6994530Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6995648Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6996072Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6996616Z     ^[[90m131|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6997168Z     ^[[90m132|^[[39m       load(resolve, [scrollMotion("hero", "hero"), scrollMotion("orpha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6997862Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/trigger-driver-unavailable/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6998367Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6998661Z     ^[[90m134|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6999222Z     ^[[90m135|^[[39m     ^[[34mexpect^[[39m(hero^[[33m.^[[39msubscriptions)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6999628Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.6999850Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[103/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7000148Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7001383Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mregisters no clock consumer for a push-driven scroll Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7003456Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7004451Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7005363Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7006265Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7006961Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7007385Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7007904Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7008509Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7009114Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7010206Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7011796Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m141:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7012418Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7012823Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[104/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7013177Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7014533Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mrejects external signals for scroll Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7016615Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7017612Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7018282Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7019103Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7020219Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7021150Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7022108Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7022915Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7023646Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7024352Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7025108Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m163:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7025450Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7025679Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[105/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7025887Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7026691Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7027790Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7028118Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7028271Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7028529Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7028664Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7028773Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7029019Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7029210Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7029857Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7030693Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7031568Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7032637Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7033648Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7034625Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7035467Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7035697Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7035931Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[106/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7036150Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7037050Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7039293Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7039678Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7040031Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7040520Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7040784Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7041183Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7041555Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7041851Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7042192Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7042640Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7043066Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7043075Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7043299Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[107/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7043307Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7044189Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7045160Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7045682Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7046032Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7046523Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7046779Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7046938Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7047277Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7047561Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7047902Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7048350Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7048783Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7048792Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7049017Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[108/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7049025Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7049903Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7051627Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7052033Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7052388Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7052866Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7053131Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7053290Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7053633Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7053906Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7054244Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7054690Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7055120Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7055135Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7055353Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[109/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7055372Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7056321Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7057826Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7058526Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7059139Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7060026Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7060713Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7061393Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7062032Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7062546Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7063166Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7063957Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7063972Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7064369Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[110/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7064390Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7065805Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7066780Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7067189Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7067580Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7068281Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7068556Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7068731Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7069336Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7069636Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7069980Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7070737Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7071739Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7071769Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7072173Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[111/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7072188Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7073628Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7074453Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7074840Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7075195Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7075687Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7075946Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7076097Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7076435Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7076713Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7077049Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7077489Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7078081Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7078198Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7078431Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[112/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7078439Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7079298Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7080791Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7081436Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7081801Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7082306Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7082577Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7082730Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7083196Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7083713Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7084316Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7085144Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7085749Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7085762Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7086003Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[113/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7086013Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7086807Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7087686Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7088381Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7089015Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7089898Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7090365Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7090860Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7091683Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7092359Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7092973Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7093824Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7094228Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m39:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7094238Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7094457Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[114/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7094473Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7095211Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7096036Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7096422Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7096766Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7097246Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7097507Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7097664Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7097998Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7098273Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7098615Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7099095Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7099489Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7099504Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7099763Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[115/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7099778Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7101468Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mrejects external signals without changing progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7102985Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7103672Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7104150Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7104638Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7104906Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7105062Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7105395Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7105669Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7106007Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7106478Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7106865Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m66:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7107014Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7107242Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[116/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7107250Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7108228Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mcoalesces rapid driver ticks to the latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7109184Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7109885Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7110518Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7111581Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7112073Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7112366Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7113003Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7113520Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7114024Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7114510Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7114902Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m78:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7114912Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7115132Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[117/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7115140Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7115987Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mkeeps manual signals working and preserves range validation
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7116796Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7117174Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7117515Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7117992Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7118252Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7118408Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7118748Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7119019Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7119360Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7119761Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m113:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7119770Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7119986Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[118/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7119995Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7121108Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22misolates a throwing clock consumer while preserving other Motion progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7121968Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7122348Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7122692Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7123350Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7123720Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7123877Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7124218Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7124488Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7124819Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7125207Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m152:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7125216Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7125437Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[119/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7125444Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7126465Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mingests authored tracks into the removable store without auto-mounting
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7127964Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7128337Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7128679Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7129159Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7129410Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7129579Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7129916Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7130196Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7130736Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7131902Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m28:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7132782Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m33:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7132800Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7133204Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[120/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7133219Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7134818Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreturns a capability handle and makes stale ABA handles inert
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7135631Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7136144Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7136505Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7136964Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7137550Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7137715Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7138069Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7138627Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7139246Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7139602Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7140067Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m53:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7140076Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7140294Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[121/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7140302Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7141568Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreplaces a track non-destructively and preserves subscriber identity
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7142369Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7142886Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7143232Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7143692Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7144270Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7144431Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7144783Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7145187Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7145687Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7146042Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7146493Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m64:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7146507Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7146723Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[122/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7146730Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7148138Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreads dependants from the committed graph and rejects source removal
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7149579Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7150487Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7151304Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7152157Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7153203Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7153483Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7154104Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7154837Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7155722Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7156532Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7157518Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7157534Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7157939Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[123/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7157951Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7159808Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mtreats observation changes as replacement of the observer track
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7161452Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7162296Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7162669Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7163143Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7163735Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7163893Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7164243Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7164651Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7165146Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7165491Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7165956Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m90:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7165965Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7166200Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[124/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7166209Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7166243Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7166697Z ^[[2m Test Files ^[[22m ^[[1m^[[31m33 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m24 passed^[[39m^[[22m^[[90m (57)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7167244Z ^[[2m      Tests ^[[22m ^[[1m^[[31m124 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m117 passed^[[39m^[[22m^[[90m (241)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7167554Z ^[[2m   Start at ^[[22m 00:26:52
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7168106Z ^[[2m   Duration ^[[22m 5.19s^[[2m (transform 1.28s, setup 453ms, import 4.00s, tests 1.07s, environment 9ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7168115Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7168121Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7196283Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopt-destroy-readopt.test.ts:40:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7204218Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7208101Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:33:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7208639Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7212384Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:56:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7213536Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7217656Z ##[error]AssertionError: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7218385Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7223480Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:89:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7224002Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7227034Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7227506Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7230401Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7230855Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7234839Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7235672Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7238246Z ##[error]AssertionError: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7238782Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7275596Z ##[error]AssertionError: expected [ …(58) ] to deeply equal []
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7277128Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7281838Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7282443Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7285123Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:38:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7285614Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7289079Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:60:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7289883Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7293794Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:79:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7294644Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7297337Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:94:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7297823Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7302238Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7303132Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7308322Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7308839Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7312284Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7312800Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7315560Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:74:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7316039Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7318697Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:38:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7319255Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7324141Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:75:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7325004Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7329743Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7330351Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7335078Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7336395Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7342890Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7343846Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7348319Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7348875Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7352546Z ##[error]TypeError: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/handle-adoption.test.ts:69:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7353070Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7356254Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:42:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7356747Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7360256Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7360761Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7364766Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:84:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7365610Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7372017Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:41:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7372751Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7376199Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:56:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7376881Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7383031Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:72:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7383806Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7390343Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:86:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7391402Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7399168Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:103:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7400020Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7405678Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:56:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7406347Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7409718Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:70:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7410212Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7413641Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:81:18
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7414136Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7417736Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:104:44
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7418553Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7423536Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:123:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7424277Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7433286Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7433892Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7437317Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7437797Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7441516Z ##[error]AssertionError: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7442250Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7446630Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7447458Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7455281Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:75:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7456046Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7461437Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:89:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7462296Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7466827Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7467356Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7472824Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7473713Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7479518Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:60:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7480027Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7487311Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:73:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7487848Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7494214Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:88:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7494777Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7501351Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:104:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7502251Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7505584Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:113:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7506051Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7514756Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7515666Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7526533Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7527105Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7536644Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:128:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7537750Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7542299Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:40:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7543014Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7546699Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:98:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7547166Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7550304Z ##[error]TypeError: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:142:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7550784Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7555236Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:199:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7556082Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7560512Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:245:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7561280Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7564018Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7564497Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7567193Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:78:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7567671Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7570368Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:168:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7570835Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7573777Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:109:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7574557Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7579335Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:136:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7580494Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7584531Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7585054Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7594814Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:145:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7595382Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7608453Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:164:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7609123Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7618893Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:199:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7619787Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7633250Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:219:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7633841Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7646592Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:243:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7647474Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7659859Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:269:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7660723Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7671142Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:305:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7672070Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7684492Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:330:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7685370Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7699182Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:351:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7700076Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7709882Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:387:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7710447Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7714608Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:147:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7715152Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7720224Z ##[error]AssertionError: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7721658Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7723851Z ##[error]AssertionError: expected [ 'property-stops-wrapper' ] to deeply equal []
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7724366Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7734920Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:278:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7735497Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7743590Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7744114Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7752335Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7753184Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7761487Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7762062Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7768912Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:162:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7769400Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7777586Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:192:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7778134Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7786413Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7787257Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7789989Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:27:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7790474Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7795309Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:64:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7795807Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7799410Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:91:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7799883Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7822630Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7823625Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7827339Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:113:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7827847Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7831449Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7831986Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7835349Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:143:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7836269Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7839638Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:42:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7840097Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7843817Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:58:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7844366Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7847756Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:74:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7848210Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7856256Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:45:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:52:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7856805Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7860324Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/t4-runtime-motion-parity.test.ts:153:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:175:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7861113Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7864608Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:360:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7865089Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7868480Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:397:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7869298Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7872677Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:76:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7873181Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7876208Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:99:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7876684Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7880852Z ##[error]AssertionError: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7881734Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7884996Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:141:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7885479Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7888493Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:163:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7888946Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7890481Z ##[error]AssertionError: expected false to be true // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7891200Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7894384Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7894880Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7897998Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7898669Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7902962Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7903619Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7906270Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7906740Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7909832Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7910301Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7913696Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7914213Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7918308Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7918795Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7922204Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:39:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7922752Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7925884Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:59:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7926361Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7929437Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:66:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7929883Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7933308Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:78:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7934177Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7936850Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:113:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7937320Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7939886Z ##[error]TypeError: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:152:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7940354Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7944811Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:28:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:33:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7945305Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7948750Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:53:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7949223Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7952813Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:64:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7953286Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7956700Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7957178Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7960591Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:90:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:57.7964297Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-23T00:26:59.2999606Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.2999980Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.3039611Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.3039905Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.3040106Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.3040320Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.4141963Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.4142685Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.4143179Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:59.4143404Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7883189Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(20,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7897498Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(35,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7902665Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(68,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7908299Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(40,34): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7910839Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7912055Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7913161Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7914353Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7917705Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(62,36): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7920290Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7921458Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7922552Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7923493Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7926296Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(30,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7930016Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(42,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7932219Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7933694Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(43,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7935409Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7936778Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(54,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7939415Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(60,15): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7941406Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7943614Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(79,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7948005Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(87,63): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7952692Z ##[error]packages/core/test/integration/adoption.test.ts(78,52): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7957476Z ##[error]packages/core/test/integration/adoption.test.ts(91,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7961912Z ##[error]packages/core/test/integration/adoption.test.ts(112,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7966577Z ##[error]packages/core/test/integration/end-to-end.test.ts(21,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7971262Z ##[error]packages/core/test/integration/engine-headless.test.ts(19,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7976639Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(34,70): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7980096Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7982257Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7983794Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7985269Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7986490Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7987512Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7990611Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(62,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7993582Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7995481Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7996779Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7998043Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.7999224Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8000380Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8003615Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(69,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8007171Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8009097Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8010414Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8011699Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8012904Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8013934Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8017033Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(89,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8020056Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8021355Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8022612Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8023786Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8024966Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8028711Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(142,7): error TS2322: Type '() => { keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8032503Z   Call signature return types '{ keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8034306Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8036001Z       Type '{ derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8037527Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8038930Z           Type '{ stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8042418Z ##[error]packages/core/test/integration/handle-adoption.test.ts(57,31): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8045401Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8046553Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8047653Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8048621Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8051894Z ##[error]packages/core/test/integration/handle-adoption.test.ts(74,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8056197Z ##[error]packages/core/test/integration/internal-key-strip.test.ts(28,44): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8060246Z ##[error]packages/core/test/integration/issue-114-motion-track-regressions.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8065421Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(56,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8068023Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8069975Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8072491Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8074025Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8075360Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8078128Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(70,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8080544Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8082073Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8083521Z       Types of property 'boneLength' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8084715Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8087156Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(81,33): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8091145Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(83,36): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8093463Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8094922Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8096025Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8096713Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8097316Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8098979Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(50,34): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8100549Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8101210Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8101837Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8102385Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8104820Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(49,5): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8106968Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8108080Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8109064Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8109625Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8111781Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(61,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8113341Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8114742Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8115711Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8116283Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8117775Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(114,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8119967Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(120,66): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8122108Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(136,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8124452Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(141,65): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8127181Z ##[error]packages/core/test/integration/observation-identity.test.ts(35,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8129499Z ##[error]packages/core/test/integration/option-c-track-resolution.test.ts(17,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8132279Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(38,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8133817Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8135068Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8135976Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8136542Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8138666Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(53,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8140507Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8141600Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8142580Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8143126Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8145217Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(116,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8146723Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8147565Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8148343Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8148925Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8150415Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(117,9): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8153012Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(24,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8155949Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(71,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8158578Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(82,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8161184Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(147,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8163724Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(183,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8166583Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(229,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8169184Z ##[error]packages/core/test/integration/phase2-motion-scheduling.test.ts(25,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8171766Z ##[error]packages/core/test/integration/phase3-trigger-port.test.ts(27,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8174700Z ##[error]packages/core/test/integration/phase4-dynamic-lifecycle.test.ts(164,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8177728Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(37,21): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8179587Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8180694Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8181686Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8182332Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8184796Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(64,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8186391Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8187394Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8188298Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8188931Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8191078Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(86,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8192619Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8193614Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8194759Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8195393Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8197548Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(60,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8199147Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8200199Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8201126Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8201691Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8203797Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(75,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8205628Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8206726Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8207978Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8208523Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8210450Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(123,20): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8211899Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8212883Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8213788Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8214606Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8216758Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(140,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8218301Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8219290Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8220188Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8220741Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8222684Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(153,9): error TS2322: Type '{ values: { weight: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; destination: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8224438Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8225310Z     Type '{ weight: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8226136Z       Types of property 'weight' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8226703Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8228868Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(184,17): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8230464Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8231568Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8232540Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8233084Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8235418Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(207,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { debug: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8237329Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8238323Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8239513Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8240082Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8241527Z ##[error]packages/core/test/integration/replace-motion-track.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8243676Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(32,36): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8246287Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(46,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8247629Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8248447Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8249184Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8249733Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8251166Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(52,16): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8253375Z ##[error]packages/core/test/integration/runtime-motion-lifecycle.test.ts(31,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8256569Z ##[error]packages/core/test/integration/single-input-channel.test.ts(23,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8258187Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8259321Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8260323Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8260887Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8262970Z ##[error]packages/core/test/integration/single-input-channel.test.ts(28,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8264822Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8265831Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8266751Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8267315Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8269422Z ##[error]packages/core/test/integration/t4-runtime-motion-parity.test.ts(126,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8272045Z ##[error]packages/core/test/integration/trigger-scroll.test.ts(70,67): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8273820Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8275277Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8275978Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8276520Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8278263Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(104,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8279673Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8280320Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8280932Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8281473Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8283027Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(123,69): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8284688Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8285667Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8286306Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8287116Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8289000Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(127,29): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8290465Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8291106Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8291732Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8292275Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8293849Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,16): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8321542Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8322655Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8323335Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8323909Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8326178Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,30): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8327684Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8328564Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8329311Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8329856Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8331472Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(182,47): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8332842Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8333486Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8334327Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8335098Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8336734Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(196,68): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8338172Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8338802Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8339408Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8339936Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8341517Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(198,62): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8342815Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8343450Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8344047Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8344863Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8346451Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(214,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8347845Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8348470Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8349073Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8349600Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8351147Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(228,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8352454Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8353106Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8353719Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8354524Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8356179Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(229,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8358077Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8358859Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8359846Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8360820Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8362846Z ##[error]packages/core/test/integration/trigger-time.test.ts(31,79): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8364514Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8365206Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8365828Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8366375Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8367967Z ##[error]packages/core/test/integration/trigger-time.test.ts(115,77): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8369302Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8369948Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8370558Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8371087Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8372604Z ##[error]packages/core/test/integration/trigger-time.test.ts(156,75): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8373886Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8374940Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8375566Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8376106Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8377548Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(21,29): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8380223Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(20,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8381965Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8382714Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8383428Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8384437Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8385240Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8387165Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(51,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8388925Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8389833Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8390721Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8391391Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8391962Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8393604Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(58,7): error TS2322: Type '() => { keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8395675Z   Call signature return types '{ keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8396389Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8397118Z       Type '{ second: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8397776Z         Property 'second' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8398336Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8400385Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(105,7): error TS2322: Type '() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8402420Z   Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8403292Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8404056Z       Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8405081Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8405699Z           Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8407932Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(128,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8409965Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8411215Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8412095Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8412853Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8413551Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8414414Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8416680Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(135,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8418690Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8420211Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8421076Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8421828Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8422531Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8423143Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8425101Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(154,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8426879Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8427614Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8428320Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8428981Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8429558Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8431098Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(28,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8433189Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(52,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8435691Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(72,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8437821Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(92,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8439867Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(94,47): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8441888Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(95,46): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8443879Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(124,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8446223Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(137,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8448230Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(138,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8450680Z ##[error]packages/core/test/unit/graph/requirement-edge-construction.test.ts(53,37): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8452082Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8452923Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8454045Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8455341Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8457258Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(59,39): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8458713Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8459558Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8460341Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8460983Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8462973Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(58,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8466178Z ##[error]packages/react/test/public-hook-render.test.ts(69,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:27:02.8470619Z ##[error]Process completed with exit code 2.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	﻿2026-08-23T00:26:59.8324635Z ##[group]Run npx vitest run packages/core/test/integration/end-to-end.test.ts
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:26:59.8325266Z ^[[36;1mnpx vitest run packages/core/test/integration/end-to-end.test.ts^[[0m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:26:59.8363104Z shell: /usr/bin/bash -e {0}
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:26:59.8363321Z env:
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:26:59.8363486Z   NODE_VERSION: 24
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:26:59.8363666Z ##[endgroup]
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:00.5615829Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:00.5619389Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:00.5619914Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:00.9942910Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:00.9944265Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 5^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0609295Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0610323Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0610746Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0612213Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0616838Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0617987Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0687562Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0688388Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0688963Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0689320Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0689767Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0690264Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0690793Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0691511Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0691963Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0692302Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0692509Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0692688Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0695113Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0695609Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0696164Z ^[[2m   Start at ^[[22m 00:27:00
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0696988Z ^[[2m   Duration ^[[22m 488ms^[[2m (transform 264ms, setup 45ms, import 276ms, tests 6ms, environment 0ms)^[[22m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0698448Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0709895Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0730030Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ assertValidProject packages/core/src/engine.ts:101:11
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ Engine.load packages/core/src/engine.ts:170:29
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:27:01.0997898Z ##[error]Process completed with exit code 1.
```
