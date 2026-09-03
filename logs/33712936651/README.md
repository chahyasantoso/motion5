# CI log archive: 33712936651

- Workflow: CI
- Conclusion: failure
- Head branch: fix/ra-100-publish-at-rest-and-write-drop
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33712936651
- Captured: 2026-09-03T03:53:16Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-03T03:52:43.1664677Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-03T03:52:43.1664970Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-03T03:52:43.1703211Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-03T03:52:43.1703490Z env:
quality (node 24)	Run npm test	2026-09-03T03:52:43.1703692Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-03T03:52:43.1703907Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-03T03:52:43.2806933Z 
quality (node 24)	Run npm test	2026-09-03T03:52:43.2807574Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-03T03:52:43.2808008Z > vitest run
quality (node 24)	Run npm test	2026-09-03T03:52:43.2808150Z 
quality (node 24)	Run npm test	2026-09-03T03:52:43.5853198Z 
quality (node 24)	Run npm test	2026-09-03T03:52:43.5855075Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:43.5855938Z 
quality (node 24)	Run npm test	2026-09-03T03:52:43.9435712Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.0321173Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.2810364Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.3794671Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.4747489Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-03T03:52:44.4749864Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T03:52:44.4750994Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T03:52:44.4751491Z 
quality (node 24)	Run npm test	2026-09-03T03:52:44.4773171Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T03:52:44.4773913Z 
quality (node 24)	Run npm test	2026-09-03T03:52:44.4774155Z act(() => {
quality (node 24)	Run npm test	2026-09-03T03:52:44.4774647Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T03:52:44.4775186Z });
quality (node 24)	Run npm test	2026-09-03T03:52:44.4775610Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T03:52:44.4775968Z 
quality (node 24)	Run npm test	2026-09-03T03:52:44.4777064Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T03:52:44.4778065Z 
quality (node 24)	Run npm test	2026-09-03T03:52:44.5161525Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 117^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5172542Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5174632Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5197794Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5233090Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5266539Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5268887Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5303896Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5326443Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5344756Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5363586Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5378671Z ^[[31m     ^[[31m×^[[31m 11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5399914Z      ^[[32m✓^[[39m 12. T-C4.1: Dynamic mutation and transactional rollback for solver topology^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.5424548Z ^[[31m     ^[[31m×^[[31m 13. A three-bone tail solves iteratively while every other bone stays put^[[39m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.6040121Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7524825Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7527114Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7559911Z ^[[31m     ^[[31m×^[[31m LF-6 publishes a bare static value and holds it at every progress^[[39m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7573671Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7575285Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7581307Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7583132Z      ^[[32m✓^[[39m LF-10 closes the static domain instead of leaving it open^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7584586Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7594110Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7595724Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7598426Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7601892Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7604363Z      ^[[32m✓^[[39m LF-16 leaves no authored schema in the repository on the retired form^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.7806465Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:44.8692533Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0153436Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0601507Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0630411Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0648190Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0663869Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0686419Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0688682Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0690712Z      ^[[32m✓^[[39m T-6 rolls the Motion back when the candidate graph rejects it^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.0692894Z      ^[[32m✓^[[39m T-7 keeps one clock subscription when a Motion is created at runtime^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.1372759Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.2820626Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.3023229Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.4370215Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.5470803Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.5555570Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.6477799Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.8270392Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:45.9088884Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 64^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.0414293Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.0668432Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.1420980Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.3152303Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.3254302Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.3608370Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.5386735Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.5784503Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.6166775Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.8108586Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.8767053Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:46.9166711Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 140^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.0365146Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.1004113Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.1084163Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.3414492Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.3554218Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.4357198Z  ^[[31m❯^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.4359896Z ^[[31m     ^[[31m×^[[31m FB-11 a five-bone chain tracks an animated goal with every length intact^[[39m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.4364837Z ^[[31m     ^[[31m×^[[31m FB-12 two goals off one spine are both reached, and the spine is solved once^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.5924953Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.6712722Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.6717691Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows^[[39m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.6719980Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.6721998Z      ^[[32m✓^[[39m IK-16 DOM adapter skips a nested composite and writes nothing for a solver node^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.6724061Z      ^[[32m✓^[[39m IK-17 handle.get for solver node returns solved rotations record^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.6999227Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.8571124Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.8983242Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:47.9831926Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.0781070Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.1169925Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.2753971Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.3322791Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.3459449Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.4775584Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.5378407Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.5415168Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.7384456Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.7674646Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.8117574Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.8120270Z ^[[31m     ^[[31m×^[[31m RA-8 publishes the observing node when addObserve commits, with no tick^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.8122745Z      ^[[32m✓^[[39m RA-9 lands a new node on blocked when its source has published nothing^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.8124507Z      ^[[32m✓^[[39m RA-10 seeds no flush for a commit that derives no node^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.8126864Z      ^[[32m✓^[[39m RA-11 seeds exactly one flush per structural commit, and none for a no-op^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.8128675Z      ^[[32m✓^[[39m RA-12 seeds no flush when the graph refuses the candidate^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:48.8130351Z      ^[[32m✓^[[39m RA-13 publishes no patch for a commit that changed no composed value^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0133065Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0295971Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0298558Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0300534Z      ^[[32m✓^[[39m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0302557Z      ^[[32m✓^[[39m Q-9 refuses a binding whose source is not a node in the graph^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0304351Z      ^[[32m✓^[[39m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0306209Z      ^[[32m✓^[[39m Q-11 keeps an upstream value out of the observer's authored value namespace^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0307868Z      ^[[32m✓^[[39m Q-12 refuses a binding to a slot the plugin never declared, at load^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.0346914Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.2550689Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.2655985Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.2894211Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.4897174Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.4944094Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.5353018Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.7125912Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.7244304Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.7577628Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.9924861Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:49.9974400Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2685014Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2934671Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2936909Z      ^[[32m✓^[[39m drives a time Motion once per project-clock tick^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2938368Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2940277Z      ^[[32m✓^[[39m rejects external signals without changing progress^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2941775Z      ^[[32m✓^[[39m coalesces rapid driver ticks to the latest progress^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2944072Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2945683Z      ^[[32m✓^[[39m keeps manual signals working and preserves range validation^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.2947356Z      ^[[32m✓^[[39m isolates a throwing clock consumer while preserving other Motion progress^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.5124338Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.5310829Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.7443861Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.9448614Z  ^[[31m❯^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.9450762Z ^[[31m     ^[[31m×^[[31m MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers^[[39m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.9452696Z ^[[31m     ^[[31m×^[[31m MG-13 seeding the goal node alone re-solves the whole chain^[[39m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:50.9913075Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.2704756Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.3174991Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.5624285Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.5979947Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.8711081Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.8897299Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.8904970Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.8906894Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.8908518Z      ^[[32m✓^[[39m N-9 refuses the flat spelling of a key both plugins claim^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:51.8910466Z      ^[[32m✓^[[39m N-10 publishes grouped leaves under their unprefixed names^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.1062517Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.2416222Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.3513439Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.4844469Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.6098803Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.7985769Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.8604318Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.9640532Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3066^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:52.9643017Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3062^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.0008012Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.1169092Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.1761625Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.2846477Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.3158001Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.4607786Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.5558613Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.5603748Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.7280018Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.7765944Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.8383186Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:53.9619530Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.0331444Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.0664562Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.1594372Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.2335087Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.3834684Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.4309005Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.6584969Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.6587577Z ^[[31m     ^[[31m×^[[31m diagnoses a plugin returning a non-record composition value^[[39m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.6589915Z      ^[[32m✓^[[39m diagnoses an output observation whose source has already published a non-record value^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.6592796Z      ^[[32m✓^[[39m does not publish malformed composition values as ready patches^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.6800259Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.9074588Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:54.9144066Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:55.1461378Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:55.2161283Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:55.3394209Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:55.4774725Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:55.5665693Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:55.7762699Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:55.8574307Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.0622056Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.1883635Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.1903551Z      ^[[32m✓^[[39m H-1 keeps a namespaced derived key out of every published surface^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.1933336Z      ^[[32m✓^[[39m H-2 keeps a declared unprefixed internal key out of the patch^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.1983555Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.3551495Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.4710314Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.4713527Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.4738728Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.6048781Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.7021612Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.9264895Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-03T03:52:56.9284205Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T03:52:56.9285705Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T03:52:56.9287864Z 
quality (node 24)	Run npm test	2026-09-03T03:52:56.9288843Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T03:52:56.9290644Z 
quality (node 24)	Run npm test	2026-09-03T03:52:56.9291073Z act(() => {
quality (node 24)	Run npm test	2026-09-03T03:52:56.9291786Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T03:52:56.9295459Z });
quality (node 24)	Run npm test	2026-09-03T03:52:56.9296129Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T03:52:56.9296663Z 
quality (node 24)	Run npm test	2026-09-03T03:52:56.9297978Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T03:52:56.9299243Z 
quality (node 24)	Run npm test	2026-09-03T03:52:56.9394541Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-03T03:52:56.9423883Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.9474693Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T03:52:56.9475757Z 
quality (node 24)	Run npm test	2026-09-03T03:52:56.9602545Z  ^[[31m❯^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.9643695Z      ^[[32m✓^[[39m renders the current patch and updates after publication^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:56.9660822Z ^[[31m     ^[[31m×^[[31m H-4 hands a consumer the same stripped values the publisher retained^[[39m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:57.1531696Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:57.2469402Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:57.3690342Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:57.4474780Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:57.5946625Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:57.7169468Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:57.7909644Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:57.9249812Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:58.0784604Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:58.1425546Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:58.3323852Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:58.3944655Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:58.6054634Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:58.6200198Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:58.8751827Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:58.8905808Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.0901360Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.1745575Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.3024188Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.3774385Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.5087770Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.5995774Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-03T03:52:59.6006793Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T03:52:59.6008403Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T03:52:59.6009027Z 
quality (node 24)	Run npm test	2026-09-03T03:52:59.6009772Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T03:52:59.6010566Z 
quality (node 24)	Run npm test	2026-09-03T03:52:59.6010822Z act(() => {
quality (node 24)	Run npm test	2026-09-03T03:52:59.6011300Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T03:52:59.6011816Z });
quality (node 24)	Run npm test	2026-09-03T03:52:59.6012585Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T03:52:59.6069201Z 
quality (node 24)	Run npm test	2026-09-03T03:52:59.6070354Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T03:52:59.6071325Z 
quality (node 24)	Run npm test	2026-09-03T03:52:59.6073083Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.7359463Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.8227327Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:52:59.9944623Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.0743864Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.2068361Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.3017671Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.4264385Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.5464048Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.7411068Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.7505824Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.9091640Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6663^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.9099432Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1844^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.9101637Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1802^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.9650324Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:00.9655446Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.1009639Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.1720062Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.1808867Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.3282764Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.3805376Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.3904435Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.5296972Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.5646602Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.5834276Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.7044010Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.7688434Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.7875563Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:01.8994924Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.0153638Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.0209896Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.1450757Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.2249624Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.2366692Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3027246Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3080774Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3081361Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 21 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3081673Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3086812Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/react/test/public-hook-render.test.ts^[[2m > ^[[22mReact public hook render/update (C2)^[[2m > ^[[22mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-03T03:53:02.3093633Z ^[[31m^[[1mAssertionError^[[22m: expected [ { x: +0 }, { x: 1 } ] to deeply equal [ undefined, { x: 1 } ]^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3094295Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3094541Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3094962Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3095168Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3095348Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3095736Z ^[[32m-   undefined,^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3096152Z ^[[31m+   {^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3096601Z ^[[31m+     "x": 0,^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3097007Z ^[[31m+   },^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3097691Z ^[[2m    {^[[22m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3098095Z ^[[2m      "x": 1,^[[22m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3098434Z ^[[2m    },^[[22m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3098650Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3098771Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3099204Z ^[[36m ^[[2m❯^[[22m packages/react/test/public-hook-render.test.ts:^[[2m96:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3128272Z     ^[[90m 94|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3129049Z     ^[[90m 95|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3130510Z     ^[[90m 96|^[[39m     ^[[34mexpect^[[39m(values)^[[33m.^[[39m^[[34mtoEqual^[[39m([undefined^[[33m,^[[39m { x^[[33m:^[[39m ^[[34m1^[[39m }])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3131896Z     ^[[90m   |^[[39m                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3133381Z     ^[[90m 97|^[[39m     renderer^[[33m!^[[39m^[[33m.^[[39m^[[34munmount^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3134574Z     ^[[90m 98|^[[39m     engine^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3135269Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3135900Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3136475Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3138271Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-6 publishes a bare static value and holds it at every progress
quality (node 24)	Run npm test	2026-09-03T03:53:02.3139539Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { length: 62 }^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3140112Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3140621Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3141155Z {
quality (node 24)	Run npm test	2026-09-03T03:53:02.3141486Z   "length": 62,
quality (node 24)	Run npm test	2026-09-03T03:53:02.3141827Z }
quality (node 24)	Run npm test	2026-09-03T03:53:02.3141991Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3142489Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3142869Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3143054Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3143879Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m231:41^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3177268Z     ^[[90m229|^[[39m   it("LF-6 publishes a bare static value and holds it at every progres…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3178193Z     ^[[90m230|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3179367Z     ^[[90m231|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m0^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3180162Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3181102Z     ^[[90m232|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3182547Z     ^[[90m233|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m1^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3183274Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3184027Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3184406Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3186233Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-11 a five-bone chain tracks an animated goal with every length intact
quality (node 24)	Run npm test	2026-09-03T03:53:02.3188247Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3188614Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3188754Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3188988Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3189103Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3189235Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3189458Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3189566Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3190020Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m168:66^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3202307Z     ^[[90m166|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3203439Z     ^[[90m167|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"rig/tail-target"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3204750Z     ^[[90m168|^[[39m     for (const id of TAIL_NODES) expect(patches.get(id)?.status).toBe(…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3206094Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3206810Z     ^[[90m169|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3207664Z     ^[[90m170|^[[39m     // One solve for the whole chain, keyed by member id, and never a …
quality (node 24)	Run npm test	2026-09-03T03:53:02.3208256Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3208698Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3209059Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3210903Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-12 two goals off one spine are both reached, and the spine is solved once
quality (node 24)	Run npm test	2026-09-03T03:53:02.3213174Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3213773Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3214003Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3214352Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3214530Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3214757Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3215142Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3215320Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3215792Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m213:66^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3216284Z     ^[[90m211|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3216824Z     ^[[90m212|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"rig/hip"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3217525Z     ^[[90m213|^[[39m     for (const id of TREE_NODES) expect(patches.get(id)?.status).toBe(…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3218128Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3218493Z     ^[[90m214|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3218985Z     ^[[90m215|^[[39m     // One solver vertex, one composition, five members. The spine bel…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3219380Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3219612Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3219821Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3220872Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-12 the worked rig re-expressed with a goal dict solves to the same two numbers
quality (node 24)	Run npm test	2026-09-03T03:53:02.3222930Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3223579Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3223823Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3224196Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3224380Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3224607Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3224971Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3225162Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3225917Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m122:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3228131Z     ^[[90m120|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3229236Z     ^[[90m121|^[[39m     ^[[35mconst^[[39m solver ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3230805Z     ^[[90m122|^[[39m     ^[[34mexpect^[[39m(solver^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3231869Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3233328Z     ^[[90m123|^[[39m     const rotations = solver?.values.rotations as Readonly<Record<stri…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3234368Z     ^[[90m124|^[[39m     ^[[34mexpect^[[39m(rotations[^[[32m"walker/upper-arm"^[[39m])^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3235416Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3235879Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3236248Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3237793Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-13 seeding the goal node alone re-solves the whole chain
quality (node 24)	Run npm test	2026-09-03T03:53:02.3238969Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3239305Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3239438Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3239704Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3240046Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3240167Z ^[[32m- true^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3240406Z ^[[31m+ false^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3240544Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3240975Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m155:36^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3241818Z     ^[[90m153|^[[39m     ^[[35mconst^[[39m second ^[[33m=^[[39m forearm^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3242777Z     ^[[90m154|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3243460Z     ^[[90m155|^[[39m     ^[[34mexpect^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[34misFinite^[[39m(first))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3244219Z     ^[[90m   |^[[39m                                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3245648Z     ^[[90m156|^[[39m     ^[[34mexpect^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[34misFinite^[[39m(second))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3247334Z     ^[[90m157|^[[39m     ^[[34mexpect^[[39m(second)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(first)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3248028Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3248482Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3248888Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3251714Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows
quality (node 24)	Run npm test	2026-09-03T03:53:02.3254269Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3254951Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3255235Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3256548Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3256756Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3257048Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3257455Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3257661Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3258486Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m118:33^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3259372Z     ^[[90m116|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3270092Z     ^[[90m117|^[[39m     ^[[35mconst^[[39m solverPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3294335Z     ^[[90m118|^[[39m     ^[[34mexpect^[[39m(solverPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3295828Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3296461Z     ^[[90m119|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3297149Z     ^[[90m120|^[[39m     ^[[35mconst^[[39m forearmPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/forearm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3297598Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3297852Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3298074Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3299108Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
quality (node 24)	Run npm test	2026-09-03T03:53:02.3300163Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3300871Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m209:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3301913Z     ^[[90m207|^[[39m     ^[[35mconst^[[39m x1 ^[[33m=^[[39m forearmPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3302734Z     ^[[90m208|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3303182Z     ^[[90m209|^[[39m     ^[[34mexpect^[[39m(x0)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3303662Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3304158Z     ^[[90m210|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3304800Z     ^[[90m211|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(x0)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3305123Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3305357Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3305569Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3306574Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
quality (node 24)	Run npm test	2026-09-03T03:53:02.3307916Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'error' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3308300Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3308447Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3308663Z "error"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3308772Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3308902Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3309115Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3309226Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3309676Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m91:27^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3310386Z     ^[[90m 89|^[[39m     // two boundaries: interpolator scratch stripped before the chain,…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3311025Z     ^[[90m 90|^[[39m     // rejected after it. Hiding it here instead would turn a loud err…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3311759Z     ^[[90m 91|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"error"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3312836Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3313716Z     ^[[90m 92|^[[39m     expect(patch?.diagnostics[0]?.ruleId).toBe("composition-output-sha…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3314306Z     ^[[90m 93|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3314594Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3315026Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3315438Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3317330Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
quality (node 24)	Run npm test	2026-09-03T03:53:02.3319805Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3321537Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m102:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3323133Z     ^[[90m100|^[[39m     // ownership change that stopped the interpolator reading a leaf w…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3324160Z     ^[[90m101|^[[39m     ^[[90m// and then hold still.^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3325676Z     ^[[90m102|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3327069Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3328645Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3330827Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3331839Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3332595Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3332973Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3334862Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
quality (node 24)	Run npm test	2026-09-03T03:53:02.3337367Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'walk/pelvis'^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3338680Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m386:26^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3340600Z     ^[[90m384|^[[39m     ^[[35mconst^[[39m publishedIds ^[[33m=^[[39m batch^[[33m.^[[39mpatches^[[33m.^[[39m^[[34mmap^[[39m((p) ^[[33m=>^[[39m p^[[33m.^[[39mnodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3341828Z     ^[[90m385|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3343171Z     ^[[90m386|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/pelvis"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3344288Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3345464Z     ^[[90m387|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/thigh"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3347010Z     ^[[90m388|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/shin"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3347759Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3348205Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3348584Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3350600Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
quality (node 24)	Run npm test	2026-09-03T03:53:02.3353372Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3355055Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m416:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3356368Z     ^[[90m414|^[[39m     // Thigh (base.rotation=0, own rotation=45): worldRot=45, x = 0 + …
quality (node 24)	Run npm test	2026-09-03T03:53:02.3357381Z     ^[[90m415|^[[39m     ^[[90m// y = 100 + 50*sin(45deg) = 135.355^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3358972Z     ^[[90m416|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3360351Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3361882Z     ^[[90m417|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3364286Z     ^[[90m418|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3365297Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3365731Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3366106Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3368110Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline
quality (node 24)	Run npm test	2026-09-03T03:53:02.3370879Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3372906Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m563:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3374274Z     ^[[90m561|^[[39m     const shinPatch = batch.patches.find((p) => p.nodeId === "walk/shi…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3375097Z     ^[[90m562|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3376491Z     ^[[90m563|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3377882Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3379460Z     ^[[90m564|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3381865Z     ^[[90m565|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3383149Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3383611Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3383990Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3385911Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m13. A three-bone tail solves iteratively while every other bone stays put
quality (node 24)	Run npm test	2026-09-03T03:53:02.3388086Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3388733Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3388990Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3389369Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3389556Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3389790Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3390156Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3390343Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3391165Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m693:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3392785Z     ^[[90m691|^[[39m     ^[[90m// 1. Every node of the rig publishes, both solvers included.^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3393996Z     ^[[90m692|^[[39m     for (const id of ["walk/tail-1", "walk/tail-2", "walk/tail-3", "wa…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3395450Z     ^[[90m693|^[[39m       ^[[34mexpect^[[39m(^[[34mat^[[39m(id)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3396594Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3397183Z     ^[[90m694|^[[39m     }
quality (node 24)	Run npm test	2026-09-03T03:53:02.3397605Z     ^[[90m695|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3397824Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3398243Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3398604Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3400593Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
quality (node 24)	Run npm test	2026-09-03T03:53:02.3403405Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3405171Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m105:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3406988Z     ^[[90m103|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"walk/pelvis"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3408476Z     ^[[90m104|^[[39m     const thigh = batch.patches.find(({ nodeId }) => nodeId === "walk/…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3410114Z     ^[[90m105|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3411368Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3413056Z     ^[[90m106|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3415131Z     ^[[90m107|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3416323Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3416765Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3417129Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3419091Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
quality (node 24)	Run npm test	2026-09-03T03:53:02.3421281Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3421942Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3422432Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3422845Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3423036Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3423285Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3423639Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3424094Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3424792Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m43:35^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3426272Z     ^[[90m 41|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3427670Z     ^[[90m 42|^[[39m     const firstConsumer = first.patches.find(({ nodeId }) => nodeId ==…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3429140Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(firstConsumer^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3430300Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3431637Z     ^[[90m 44|^[[39m     ^[[35mconst^[[39m firstRevision ^[[33m=^[[39m firstConsumer^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3432894Z     ^[[90m 45|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3433120Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3433562Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3433970Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3435849Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
quality (node 24)	Run npm test	2026-09-03T03:53:02.3437962Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3438592Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3438824Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3439191Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3439376Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3439597Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3439954Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3440146Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3440848Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m75:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3442907Z     ^[[90m 73|^[[39m       ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m (cycle ^[[33m+^[[39m ^[[34m1^[[39m) ^[[33m/^[[39m ^[[34m50^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3444655Z     ^[[90m 74|^[[39m       const patch = batch.patches.find(({ nodeId }) => nodeId === cons…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3446171Z     ^[[90m 75|^[[39m       ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3447388Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3448567Z     ^[[90m 76|^[[39m       revisions^[[33m.^[[39m^[[34mpush^[[39m(patch^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3449525Z     ^[[90m 77|^[[39m     }
quality (node 24)	Run npm test	2026-09-03T03:53:02.3449780Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3450211Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3450594Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3452993Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
quality (node 24)	Run npm test	2026-09-03T03:53:02.3455428Z ^[[31m^[[1mAssertionError^[[22m: expected { nodeId: 'scene/arm', …(6) } to be undefined^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3456074Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3456343Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3456731Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3457175Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3457441Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3457818Z {
quality (node 24)	Run npm test	2026-09-03T03:53:02.3458147Z   "diagnostics": [],
quality (node 24)	Run npm test	2026-09-03T03:53:02.3458545Z   "nodeId": "scene/arm",
quality (node 24)	Run npm test	2026-09-03T03:53:02.3458941Z   "revision": 1,
quality (node 24)	Run npm test	2026-09-03T03:53:02.3459321Z   "sourceProgress": 0,
quality (node 24)	Run npm test	2026-09-03T03:53:02.3459732Z   "sourceRevisions": {},
quality (node 24)	Run npm test	2026-09-03T03:53:02.3460144Z   "status": "ready",
quality (node 24)	Run npm test	2026-09-03T03:53:02.3460511Z   "values": {
quality (node 24)	Run npm test	2026-09-03T03:53:02.3460843Z     "x": 0,
quality (node 24)	Run npm test	2026-09-03T03:53:02.3461169Z   },
quality (node 24)	Run npm test	2026-09-03T03:53:02.3461483Z }
quality (node 24)	Run npm test	2026-09-03T03:53:02.3461656Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3462779Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m194:46^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3464124Z     ^[[90m192|^[[39m     ^[[90m// what parity is about. Issue #223, slice A2.^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3466105Z     ^[[90m193|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mhandle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3468612Z     ^[[90m194|^[[39m     ^[[34mexpect^[[39m(authored^[[33m.^[[39mhandle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m))^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3470007Z     ^[[90m   |^[[39m                                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3470652Z     ^[[90m195|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3471951Z     ^[[90m196|^[[39m     ^[[35mconst^[[39m authoredSeen ^[[33m=^[[39m ^[[34mrecord^[[39m(authored^[[33m.^[[39mhandle^[[33m,^[[39m ^[[32m"scene/arm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3473219Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3473682Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3474065Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3475538Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
quality (node 24)	Run npm test	2026-09-03T03:53:02.3477221Z ^[[31m^[[1mAssertionError^[[22m: expected { x: +0 } to be undefined^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3477759Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3478022Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3478415Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3478626Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3478869Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3479236Z {
quality (node 24)	Run npm test	2026-09-03T03:53:02.3479545Z   "x": 0,
quality (node 24)	Run npm test	2026-09-03T03:53:02.3479864Z }
quality (node 24)	Run npm test	2026-09-03T03:53:02.3480035Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3480802Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:50^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3482429Z     ^[[90m 57|^[[39m     ^[[35mconst^[[39m { scheduler^[[33m,^[[39m handle } ^[[33m=^[[39m ^[[34mloadTimeMotion^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3483666Z     ^[[90m 58|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3485301Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3486733Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3488069Z     ^[[90m 60|^[[39m     ^[[34mexpect^[[39m(scheduler^[[33m.^[[39mpending)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3489321Z     ^[[90m 61|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3489778Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3490210Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3490591Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3492844Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/composition-output-shape.test.ts^[[2m > ^[[22mcomposition and output-shape diagnostics^[[2m > ^[[22mdiagnoses a plugin returning a non-record composition value
quality (node 24)	Run npm test	2026-09-03T03:53:02.3495361Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'composition-output-shape' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3496172Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3496441Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3496914Z "composition-output-shape"
quality (node 24)	Run npm test	2026-09-03T03:53:02.3497222Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3497464Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3497871Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3498065Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3499215Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/composition-output-shape.test.ts:^[[2m73:95^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3500541Z     ^[[90m 71|^[[39m     runtime^[[33m.^[[39m^[[34mmount^[[39m(^[[32m"hero/arm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3502352Z     ^[[90m 72|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"hero/arm"^[[39m^[[33m,^[[39m ^[[34m0.5^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3503917Z     ^[[90m 73|^[[39m     expect(batch.patches.find(({ nodeId }) => nodeId === "hero/arm")?.…
quality (node 24)	Run npm test	2026-09-03T03:53:02.3505198Z     ^[[90m   |^[[39m                                                                                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3506277Z     ^[[90m 74|^[[39m       ^[[32m"composition-output-shape"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3507044Z     ^[[90m 75|^[[39m     )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3507339Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3507776Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3508401Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3510461Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-flush.test.ts^[[2m > ^[[22ma structural commit ends at one flush^[[2m > ^[[22mRA-8 publishes the observing node when addObserve commits, with no tick
quality (node 24)	Run npm test	2026-09-03T03:53:02.3512944Z ^[[31m^[[1mAssertionError^[[22m: expected { nodeId: 'hero/leg', …(6) } to be undefined^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3513585Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3513851Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3514277Z undefined
quality (node 24)	Run npm test	2026-09-03T03:53:02.3514466Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3514703Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3515062Z {
quality (node 24)	Run npm test	2026-09-03T03:53:02.3515395Z   "diagnostics": [],
quality (node 24)	Run npm test	2026-09-03T03:53:02.3515806Z   "nodeId": "hero/leg",
quality (node 24)	Run npm test	2026-09-03T03:53:02.3516224Z   "revision": 1,
quality (node 24)	Run npm test	2026-09-03T03:53:02.3516613Z   "sourceProgress": 0,
quality (node 24)	Run npm test	2026-09-03T03:53:02.3517051Z   "sourceRevisions": {},
quality (node 24)	Run npm test	2026-09-03T03:53:02.3517471Z   "status": "ready",
quality (node 24)	Run npm test	2026-09-03T03:53:02.3517849Z   "values": {
quality (node 24)	Run npm test	2026-09-03T03:53:02.3518244Z     "hero/leg": 1,
quality (node 24)	Run npm test	2026-09-03T03:53:02.3518601Z   },
quality (node 24)	Run npm test	2026-09-03T03:53:02.3518911Z }
quality (node 24)	Run npm test	2026-09-03T03:53:02.3519108Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3520040Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-flush.test.ts:^[[2m72:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3521587Z     ^[[90m 70|^[[39m     ^[[35mconst^[[39m registry ^[[33m=^[[39m runtime^[[33m.^[[39mgraph^[[33m.^[[39mregistry^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3522759Z     ^[[90m 71|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3523952Z     ^[[90m 72|^[[39m     ^[[34mexpect^[[39m(registry^[[33m.^[[39m^[[35mget^[[39m(^[[33mLEG_ID^[[39m))^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3525209Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3525799Z     ^[[90m 73|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3527074Z     ^[[90m 74|^[[39m     runtime^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mLEG_ID^[[39m)^[[33m.^[[39m^[[34maddObserve^[[39m({ source^[[33m:^[[39m ^[[33mARM_ID^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3527981Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3528410Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3528794Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3528825Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3529681Z ^[[2m Test Files ^[[22m ^[[1m^[[31m14 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m167 passed^[[39m^[[22m^[[90m (181)^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3531138Z ^[[2m      Tests ^[[22m ^[[1m^[[31m21 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m868 passed^[[39m^[[22m^[[90m (889)^[[39m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3532059Z ^[[2m   Start at ^[[22m 03:52:43
quality (node 24)	Run npm test	2026-09-03T03:53:02.3533552Z ^[[2m   Duration ^[[22m 18.70s^[[2m (transform 2.53s, setup 1.10s, import 10.09s, tests 13.55s, environment 28ms)^[[22m
quality (node 24)	Run npm test	2026-09-03T03:53:02.3534284Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3534295Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3563607Z ##[error]AssertionError: expected [ { x: +0 }, { x: 1 } ] to deeply equal [ undefined, { x: 1 } ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	-   undefined,
quality (node 24)	Run npm test	+   {
quality (node 24)	Run npm test	+     "x": 0,
quality (node 24)	Run npm test	+   },
quality (node 24)	Run npm test	    {
quality (node 24)	Run npm test	      "x": 1,
quality (node 24)	Run npm test	    },
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/react/test/public-hook-render.test.ts:96:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3574264Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3577662Z ##[error]AssertionError: expected undefined to deeply equal { length: 62 }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "length": 62,
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:231:41
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3580002Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3582971Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:168:66
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3584156Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3585960Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:213:66
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3587103Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3588759Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:122:28
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3590359Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3592771Z ##[error]AssertionError: expected false to be true // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- true
quality (node 24)	Run npm test	+ false
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:155:36
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3594153Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3595863Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-two-bone.test.ts:118:33
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3597760Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3599816Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-two-bone.test.ts:209:16
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3601436Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3604791Z ##[error]AssertionError: expected undefined to be 'error' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"error"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/internal-key-strip.test.ts:91:27
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3607017Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3610197Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:102:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3612579Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3614975Z ##[error]AssertionError: expected [] to include 'walk/pelvis'
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:386:26
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3616744Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3619613Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:416:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3621666Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3624904Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:563:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3626979Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3630040Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:693:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3632331Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3635401Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:105:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3637504Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3640343Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/remount.test.ts:43:35
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3642536Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3645403Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/remount.test.ts:75:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3647356Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3652051Z ##[error]AssertionError: expected { nodeId: 'scene/arm', …(6) } to be undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "diagnostics": [],
quality (node 24)	Run npm test	  "nodeId": "scene/arm",
quality (node 24)	Run npm test	  "revision": 1,
quality (node 24)	Run npm test	  "sourceProgress": 0,
quality (node 24)	Run npm test	  "sourceRevisions": {},
quality (node 24)	Run npm test	  "status": "ready",
quality (node 24)	Run npm test	  "values": {
quality (node 24)	Run npm test	    "x": 0,
quality (node 24)	Run npm test	  },
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:194:46
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3655269Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3658134Z ##[error]AssertionError: expected { x: +0 } to be undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "x": 0,
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time.test.ts:59:50
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3660092Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3664178Z ##[error]AssertionError: expected undefined to be 'composition-output-shape' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"composition-output-shape"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/composition-output-shape.test.ts:73:95
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.3666716Z 
quality (node 24)	Run npm test	2026-09-03T03:53:02.3669868Z ##[error]AssertionError: expected { nodeId: 'hero/leg', …(6) } to be undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "diagnostics": [],
quality (node 24)	Run npm test	  "nodeId": "hero/leg",
quality (node 24)	Run npm test	  "revision": 1,
quality (node 24)	Run npm test	  "sourceProgress": 0,
quality (node 24)	Run npm test	  "sourceRevisions": {},
quality (node 24)	Run npm test	  "status": "ready",
quality (node 24)	Run npm test	  "values": {
quality (node 24)	Run npm test	    "hero/leg": 1,
quality (node 24)	Run npm test	  },
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-flush.test.ts:72:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:53:02.4034782Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-09-03T03:52:35.7910220Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.7910815Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.7949989Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.7950318Z env:
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.7950535Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.7950748Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.8968793Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.8969597Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.8970116Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:35.8970365Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.2113231Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.2115150Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.2116289Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8524786Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8527212Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8530573Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8531873Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8533781Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8535443Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8537055Z      ^[[32m✓^[[39m T-6 rolls the Motion back when the candidate graph rejects it^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8538562Z      ^[[32m✓^[[39m T-7 keeps one clock subscription when a Motion is created at runtime^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8846300Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 70^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8848631Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8850599Z ^[[31m     ^[[31m×^[[31m LF-6 publishes a bare static value and holds it at every progress^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8852615Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8854296Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8855651Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8857072Z      ^[[32m✓^[[39m LF-10 closes the static domain instead of leaving it open^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8858458Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8859831Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8861257Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8863656Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8883882Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:36.8934025Z      ^[[32m✓^[[39m LF-16 leaves no authored schema in the repository on the retired form^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0280234Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0298234Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0373905Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0374774Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0375653Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0378123Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0378554Z act(() => {
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0412945Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0413808Z });
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0414534Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0415066Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0416417Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0417752Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0917385Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 161^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0940484Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0995962Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.0997982Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1000009Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1002786Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1005127Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1007319Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1009270Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1010989Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1012867Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1015030Z ^[[31m     ^[[31m×^[[31m 11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1017089Z      ^[[32m✓^[[39m 12. T-C4.1: Dynamic mutation and transactional rollback for solver topology^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1019288Z ^[[31m     ^[[31m×^[[31m 13. A three-bone tail solves iteratively while every other bone stays put^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.1860596Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.2434029Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.3643250Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.4108254Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.5505114Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8294646Z  ^[[31m❯^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 56^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8303862Z ^[[31m     ^[[31m×^[[31m FB-11 a five-bone chain tracks an animated goal with every length intact^[[39m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8340599Z ^[[31m     ^[[31m×^[[31m FB-12 two goals off one spine are both reached, and the spine is solved once^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8386888Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8389076Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows^[[39m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8391762Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8394179Z      ^[[32m✓^[[39m IK-16 DOM adapter skips a nested composite and writes nothing for a solver node^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8396071Z      ^[[32m✓^[[39m IK-17 handle.get for solver node returns solved rotations record^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:37.8398189Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.0934950Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.1197729Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.1336398Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.1364656Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.1366543Z      ^[[32m✓^[[39m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.1367919Z      ^[[32m✓^[[39m Q-9 refuses a binding whose source is not a node in the graph^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.1369241Z      ^[[32m✓^[[39m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.1370555Z      ^[[32m✓^[[39m Q-11 keeps an upstream value out of the observer's authored value namespace^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.1371737Z      ^[[32m✓^[[39m Q-12 refuses a binding to a slot the plugin never declared, at load^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.3681696Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.3793367Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.3974628Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6464844Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6495793Z      ^[[32m✓^[[39m drives a time Motion once per project-clock tick^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6497029Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6498251Z      ^[[32m✓^[[39m rejects external signals without changing progress^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6499403Z      ^[[32m✓^[[39m coalesces rapid driver ticks to the latest progress^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6500598Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6501828Z      ^[[32m✓^[[39m keeps manual signals working and preserves range validation^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6503097Z      ^[[32m✓^[[39m isolates a throwing clock consumer while preserving other Motion progress^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.6634479Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.7395254Z  ^[[31m❯^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.7413810Z ^[[31m     ^[[31m×^[[31m MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers^[[39m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.7416777Z ^[[31m     ^[[31m×^[[31m MG-13 seeding the goal node alone re-solves the whole chain^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.9545536Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:38.9550935Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.0141615Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.0144518Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.0146862Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.0148657Z      ^[[32m✓^[[39m N-9 refuses the flat spelling of a key both plugins claim^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.0150424Z      ^[[32m✓^[[39m N-10 publishes grouped leaves under their unprefixed names^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.1664729Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.2326845Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.2905212Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.4047202Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.5548983Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.5704733Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.6859524Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.8055175Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.8364455Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:39.9605659Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.0590365Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.0807176Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.1809570Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.3274971Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.3474896Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.4514691Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.5792746Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.6064635Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.6067900Z      ^[[32m✓^[[39m H-1 keeps a namespaced derived key out of every published surface^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.6069621Z      ^[[32m✓^[[39m H-2 keeps a declared unprefixed internal key out of the patch^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.6071445Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.7112976Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.7128376Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.7130894Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.8002985Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.8511031Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:40.9139577Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.0270307Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.0595469Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.1790671Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.2379631Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.3455148Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.3623476Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.5003609Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.5476203Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.5766194Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.8341620Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.8636930Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:41.8704493Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.0451449Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.0856197Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.1064550Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2645596Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2700350Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2734583Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2735337Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 18 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2735837Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2740673Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-6 publishes a bare static value and holds it at every progress
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2748553Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { length: 62 }^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2749255Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2749579Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2750003Z {
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2750354Z   "length": 62,
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2750720Z }
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2750896Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2751180Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2751575Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2751863Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2753067Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m231:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2820334Z     ^[[90m229|^[[39m   it("LF-6 publishes a bare static value and holds it at every progres…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2822014Z     ^[[90m230|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2824506Z     ^[[90m231|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m0^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2826031Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2827773Z     ^[[90m232|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2830127Z     ^[[90m233|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m1^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2831207Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2831652Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2832037Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2834217Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-11 a five-bone chain tracks an animated goal with every length intact
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2836366Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2837018Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2837262Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2837650Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2837830Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2838071Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2838447Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2838646Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2839459Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m168:66^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2858859Z     ^[[90m166|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2859980Z     ^[[90m167|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"rig/tail-target"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2861360Z     ^[[90m168|^[[39m     for (const id of TAIL_NODES) expect(patches.get(id)?.status).toBe(…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2862743Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2863481Z     ^[[90m169|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2864349Z     ^[[90m170|^[[39m     // One solve for the whole chain, keyed by member id, and never a …
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2864938Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2865403Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2865798Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2867706Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-12 two goals off one spine are both reached, and the spine is solved once
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2870316Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2871304Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2871595Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2872008Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2872220Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2872721Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2873138Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2873352Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2874199Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m213:66^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2875135Z     ^[[90m211|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2876111Z     ^[[90m212|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"rig/hip"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2877379Z     ^[[90m213|^[[39m     for (const id of TREE_NODES) expect(patches.get(id)?.status).toBe(…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2878450Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2879093Z     ^[[90m214|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2879904Z     ^[[90m215|^[[39m     // One solver vertex, one composition, five members. The spine bel…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2880582Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2881027Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2881397Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2885337Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-12 the worked rig re-expressed with a goal dict solves to the same two numbers
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2887574Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2888257Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2888503Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2888883Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2889062Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2889509Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2889894Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2890087Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2890873Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m122:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2891698Z     ^[[90m120|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2893719Z     ^[[90m121|^[[39m     ^[[35mconst^[[39m solver ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2895391Z     ^[[90m122|^[[39m     ^[[34mexpect^[[39m(solver^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2897677Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2898705Z     ^[[90m123|^[[39m     const rotations = solver?.values.rotations as Readonly<Record<stri…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2952184Z     ^[[90m124|^[[39m     ^[[34mexpect^[[39m(rotations[^[[32m"walker/upper-arm"^[[39m])^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2953443Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2953977Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2954424Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2956253Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-13 seeding the goal node alone re-solves the whole chain
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2958326Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2958951Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2959193Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2959756Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2959991Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2960194Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2960632Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2960851Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2961679Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m155:36^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2975916Z     ^[[90m153|^[[39m     ^[[35mconst^[[39m second ^[[33m=^[[39m forearm^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2977051Z     ^[[90m154|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2978329Z     ^[[90m155|^[[39m     ^[[34mexpect^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[34misFinite^[[39m(first))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2979604Z     ^[[90m   |^[[39m                                    ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2981860Z     ^[[90m156|^[[39m     ^[[34mexpect^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[34misFinite^[[39m(second))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2983742Z     ^[[90m157|^[[39m     ^[[34mexpect^[[39m(second)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(first)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2984418Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2984951Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2985357Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2987280Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2989424Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2990078Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2990331Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2990976Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2991184Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2991444Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2991849Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2992061Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2993122Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m118:33^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2994024Z     ^[[90m116|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2995202Z     ^[[90m117|^[[39m     ^[[35mconst^[[39m solverPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2996872Z     ^[[90m118|^[[39m     ^[[34mexpect^[[39m(solverPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2998015Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2998613Z     ^[[90m119|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.2999781Z     ^[[90m120|^[[39m     ^[[35mconst^[[39m forearmPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/forearm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3000683Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3001316Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3001692Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3023260Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3024492Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3025217Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m209:16^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3026043Z     ^[[90m207|^[[39m     ^[[35mconst^[[39m x1 ^[[33m=^[[39m forearmPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3026564Z     ^[[90m208|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3026996Z     ^[[90m209|^[[39m     ^[[34mexpect^[[39m(x0)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3027452Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3027941Z     ^[[90m210|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3028572Z     ^[[90m211|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(x0)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3028913Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3029147Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3029358Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3030376Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3031519Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'error' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3031868Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3032002Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3032220Z "error"
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3032479Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3032612Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3032828Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3032942Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3033391Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m91:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3034106Z     ^[[90m 89|^[[39m     // two boundaries: interpolator scratch stripped before the chain,…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3036144Z     ^[[90m 90|^[[39m     // rejected after it. Hiding it here instead would turn a loud err…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3037618Z     ^[[90m 91|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"error"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3038726Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3039838Z     ^[[90m 92|^[[39m     expect(patch?.diagnostics[0]?.ruleId).toBe("composition-output-sha…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3040854Z     ^[[90m 93|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3041290Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3041701Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3042063Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3044116Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3045657Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3046667Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m102:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3047437Z     ^[[90m100|^[[39m     // ownership change that stopped the interpolator reading a leaf w…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3047971Z     ^[[90m101|^[[39m     ^[[90m// and then hold still.^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3049328Z     ^[[90m102|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3050694Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3052222Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3054622Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3055631Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3056102Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3056464Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3058264Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3060139Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'walk/pelvis'^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3061432Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m386:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3062979Z     ^[[90m384|^[[39m     ^[[35mconst^[[39m publishedIds ^[[33m=^[[39m batch^[[33m.^[[39mpatches^[[33m.^[[39m^[[34mmap^[[39m((p) ^[[33m=>^[[39m p^[[33m.^[[39mnodeId)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3063655Z     ^[[90m385|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3064246Z     ^[[90m386|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/pelvis"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3064881Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3065521Z     ^[[90m387|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/thigh"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3066338Z     ^[[90m388|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/shin"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3066717Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3067009Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3067358Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3069228Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3071514Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3074006Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m416:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3075414Z     ^[[90m414|^[[39m     // Thigh (base.rotation=0, own rotation=45): worldRot=45, x = 0 + …
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3076354Z     ^[[90m415|^[[39m     ^[[90m// y = 100 + 50*sin(45deg) = 135.355^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3077835Z     ^[[90m416|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3079178Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3080839Z     ^[[90m417|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3083242Z     ^[[90m418|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3084282Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3084736Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3085096Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3086753Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3088175Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3089407Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m563:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3090763Z     ^[[90m561|^[[39m     const shinPatch = batch.patches.find((p) => p.nodeId === "walk/shi…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3091522Z     ^[[90m562|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3093152Z     ^[[90m563|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3094478Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3096004Z     ^[[90m564|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3098095Z     ^[[90m565|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3099122Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3099567Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3099944Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3101838Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m13. A three-bone tail solves iteratively while every other bone stays put
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3104189Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3104884Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3105129Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3105512Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3105692Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3105931Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3106302Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3106496Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3107336Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m693:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3108674Z     ^[[90m691|^[[39m     ^[[90m// 1. Every node of the rig publishes, both solvers included.^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3109869Z     ^[[90m692|^[[39m     for (const id of ["walk/tail-1", "walk/tail-2", "walk/tail-3", "wa…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3111329Z     ^[[90m693|^[[39m       ^[[34mexpect^[[39m(^[[34mat^[[39m(id)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3112758Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3113397Z     ^[[90m694|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3113837Z     ^[[90m695|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3114058Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3114961Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3115601Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3117660Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3120240Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3121974Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m105:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3124020Z     ^[[90m103|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"walk/pelvis"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3125504Z     ^[[90m104|^[[39m     const thigh = batch.patches.find(({ nodeId }) => nodeId === "walk/…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3127218Z     ^[[90m105|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3128552Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3130027Z     ^[[90m106|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3132083Z     ^[[90m107|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3133305Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3133751Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3134135Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3136065Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3138271Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3138964Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3139191Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3139551Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3139719Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3139936Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3140287Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3140472Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3169021Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m43:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3170620Z     ^[[90m 41|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3172177Z     ^[[90m 42|^[[39m     const firstConsumer = first.patches.find(({ nodeId }) => nodeId ==…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3174041Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(firstConsumer^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3175291Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3176650Z     ^[[90m 44|^[[39m     ^[[35mconst^[[39m firstRevision ^[[33m=^[[39m firstConsumer^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3177726Z     ^[[90m 45|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3177954Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3178380Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3178795Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3180626Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3182902Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3183541Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3183860Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3184318Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3184509Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3184736Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3185100Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3185287Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3185982Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m75:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3188117Z     ^[[90m 73|^[[39m       ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m (cycle ^[[33m+^[[39m ^[[34m1^[[39m) ^[[33m/^[[39m ^[[34m50^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3189939Z     ^[[90m 74|^[[39m       const patch = batch.patches.find(({ nodeId }) => nodeId === cons…
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3191325Z     ^[[90m 75|^[[39m       ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3192613Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3193819Z     ^[[90m 76|^[[39m       revisions^[[33m.^[[39m^[[34mpush^[[39m(patch^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3194744Z     ^[[90m 77|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3194982Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3195413Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3195791Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3197874Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3200200Z ^[[31m^[[1mAssertionError^[[22m: expected { nodeId: 'scene/arm', …(6) } to be undefined^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3200819Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3201080Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3201497Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3201719Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3201995Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3202689Z {
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3203071Z   "diagnostics": [],
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3203498Z   "nodeId": "scene/arm",
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3203923Z   "revision": 1,
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3204314Z   "sourceProgress": 0,
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3204739Z   "sourceRevisions": {},
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3205178Z   "status": "ready",
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3205567Z   "values": {
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3205945Z     "x": 0,
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3206333Z   },
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3206650Z }
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3206840Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3207830Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m194:46^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3209276Z     ^[[90m192|^[[39m     ^[[90m// what parity is about. Issue #223, slice A2.^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3211157Z     ^[[90m193|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mhandle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3213681Z     ^[[90m194|^[[39m     ^[[34mexpect^[[39m(authored^[[33m.^[[39mhandle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m))^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3215090Z     ^[[90m   |^[[39m                                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3215726Z     ^[[90m195|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3217034Z     ^[[90m196|^[[39m     ^[[35mconst^[[39m authoredSeen ^[[33m=^[[39m ^[[34mrecord^[[39m(authored^[[33m.^[[39mhandle^[[33m,^[[39m ^[[32m"scene/arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3217921Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3218635Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3219207Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3220627Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3222266Z ^[[31m^[[1mAssertionError^[[22m: expected { x: +0 } to be undefined^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3223031Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3223296Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3223707Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3223899Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3224138Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3224512Z {
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3224828Z   "x": 0,
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3225164Z }
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3225333Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3226127Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:50^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3227624Z     ^[[90m 57|^[[39m     ^[[35mconst^[[39m { scheduler^[[33m,^[[39m handle } ^[[33m=^[[39m ^[[34mloadTimeMotion^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3228870Z     ^[[90m 58|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3230490Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3232061Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3233642Z     ^[[90m 60|^[[39m     ^[[34mexpect^[[39m(scheduler^[[33m.^[[39mpending)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3234897Z     ^[[90m 61|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3235370Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3235815Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3236186Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3236230Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3237075Z ^[[2m Test Files ^[[22m ^[[1m^[[31m11 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m51 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3238603Z ^[[2m      Tests ^[[22m ^[[1m^[[31m18 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m240 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3239547Z ^[[2m   Start at ^[[22m 03:52:36
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3240718Z ^[[2m   Duration ^[[22m 6.03s^[[2m (transform 1.47s, setup 464ms, import 5.13s, tests 1.74s, environment 12ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3241460Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3241472Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3269740Z ##[error]AssertionError: expected undefined to deeply equal { length: 62 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "length": 62,
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:231:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3279414Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3282888Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:168:66
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3284872Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3288003Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:213:66
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3290023Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3293392Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:122:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3295415Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3298231Z ##[error]AssertionError: expected false to be true // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- true
integration (node 24)	Run npm run test:integration	+ false
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:155:36
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3300081Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3303234Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:118:33
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3305212Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3307338Z ##[error]AssertionError: expected undefined to be defined
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:209:16
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3308879Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3311911Z ##[error]AssertionError: expected undefined to be 'error' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"error"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:91:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3314810Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3317967Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:102:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3319995Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3322334Z ##[error]AssertionError: expected [] to include 'walk/pelvis'
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:386:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3324270Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3327035Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:416:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3328883Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3331499Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:563:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3334315Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3337268Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:693:30
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3339148Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3341892Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:105:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3343996Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3346617Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/remount.test.ts:43:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3348419Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3350917Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/remount.test.ts:75:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3353043Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3357818Z ##[error]AssertionError: expected { nodeId: 'scene/arm', …(6) } to be undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "diagnostics": [],
integration (node 24)	Run npm run test:integration	  "nodeId": "scene/arm",
integration (node 24)	Run npm run test:integration	  "revision": 1,
integration (node 24)	Run npm run test:integration	  "sourceProgress": 0,
integration (node 24)	Run npm run test:integration	  "sourceRevisions": {},
integration (node 24)	Run npm run test:integration	  "status": "ready",
integration (node 24)	Run npm run test:integration	  "values": {
integration (node 24)	Run npm run test:integration	    "x": 0,
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:194:46
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3360707Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.3363523Z ##[error]AssertionError: expected { x: +0 } to be undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "x": 0,
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:59:50
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:52:42.4369092Z ##[error]Process completed with exit code 1.
```
