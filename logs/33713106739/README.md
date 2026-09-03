# CI log archive: 33713106739

- Workflow: CI
- Conclusion: failure
- Head branch: fix/ra-100-publish-at-rest-and-write-drop
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33713106739
- Captured: 2026-09-03T03:56:12Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-03T03:55:32.2597688Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-03T03:55:32.2598151Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-03T03:55:32.2624650Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-03T03:55:32.2624922Z env:
quality (node 24)	Run npm test	2026-09-03T03:55:32.2625130Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-03T03:55:32.2625341Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-03T03:55:32.8772526Z 
quality (node 24)	Run npm test	2026-09-03T03:55:32.8773483Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-03T03:55:32.8773898Z > vitest run
quality (node 24)	Run npm test	2026-09-03T03:55:32.8774060Z 
quality (node 24)	Run npm test	2026-09-03T03:55:33.1666931Z 
quality (node 24)	Run npm test	2026-09-03T03:55:33.1670884Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:33.1671830Z 
quality (node 24)	Run npm test	2026-09-03T03:55:33.5037819Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:33.5712308Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:33.8054626Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:33.8939898Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 61^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:33.9663854Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-03T03:55:33.9666677Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T03:55:33.9694661Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T03:55:33.9717625Z 
quality (node 24)	Run npm test	2026-09-03T03:55:33.9738557Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T03:55:33.9772732Z 
quality (node 24)	Run npm test	2026-09-03T03:55:33.9787531Z act(() => {
quality (node 24)	Run npm test	2026-09-03T03:55:33.9798185Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T03:55:33.9828086Z });
quality (node 24)	Run npm test	2026-09-03T03:55:33.9833288Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T03:55:33.9856664Z 
quality (node 24)	Run npm test	2026-09-03T03:55:33.9879760Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T03:55:33.9908537Z 
quality (node 24)	Run npm test	2026-09-03T03:55:34.0103850Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 133^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0106069Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0107831Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0109479Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0111087Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0112916Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0115275Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0117035Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0118782Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0120286Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0121704Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0123568Z ^[[31m     ^[[31m×^[[31m 11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0125389Z      ^[[32m✓^[[39m 12. T-C4.1: Dynamic mutation and transactional rollback for solver topology^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0128336Z ^[[31m     ^[[31m×^[[31m 13. A three-bone tail solves iteratively while every other bone stays put^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.0695224Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2320200Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2322088Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2323748Z ^[[31m     ^[[31m×^[[31m LF-6 publishes a bare static value and holds it at every progress^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2327966Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2332021Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2352302Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2357176Z      ^[[32m✓^[[39m LF-10 closes the static domain instead of leaving it open^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2358594Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2359707Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2360860Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2362024Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2362767Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2363678Z      ^[[32m✓^[[39m LF-16 leaves no authored schema in the repository on the retired form^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2749489Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.2810345Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.4745146Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5389337Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5410661Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5459272Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5473869Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5476143Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5477617Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5479163Z      ^[[32m✓^[[39m T-6 rolls the Motion back when the candidate graph rejects it^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5480432Z      ^[[32m✓^[[39m T-7 keeps one clock subscription when a Motion is created at runtime^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.5511286Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.7032452Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.7707913Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.8633350Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.9652437Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:34.9764398Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.0948487Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.2320725Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.2430287Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.4601396Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.4719381Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.4798817Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.6768086Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.6996198Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.7282473Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.9063799Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.9499033Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:35.9708370Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.1591487Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.1943156Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 107^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.1993295Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.3608926Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.3744898Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.4172345Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.6319018Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.6349382Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.6855896Z  ^[[31m❯^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.6888557Z ^[[31m     ^[[31m×^[[31m FB-11 a five-bone chain tracks an animated goal with every length intact^[[39m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.6935909Z ^[[31m     ^[[31m×^[[31m FB-12 two goals off one spine are both reached, and the spine is solved once^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.8493447Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.9110658Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.9619379Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.9623604Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows^[[39m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.9625771Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.9627779Z      ^[[32m✓^[[39m IK-16 DOM adapter skips a nested composite and writes nothing for a solver node^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:36.9630487Z      ^[[32m✓^[[39m IK-17 handle.get for solver node returns solved rotations record^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.0912940Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.1208260Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.1839816Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.3198282Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.3269477Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.4411142Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.5373644Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.5512878Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.6319423Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.7011098Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.7439514Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.8691213Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.9426137Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.9444465Z ^[[31m     ^[[31m×^[[31m RA-8 publishes the observing node when addObserve commits, with no tick^[[39m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.9458438Z      ^[[32m✓^[[39m RA-9 lands a new node on blocked when its source has published nothing^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.9459452Z      ^[[32m✓^[[39m RA-10 seeds no flush for a commit that derives no node^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.9460432Z      ^[[32m✓^[[39m RA-11 seeds exactly one flush per structural commit, and none for a no-op^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.9461769Z      ^[[32m✓^[[39m RA-12 seeds no flush when the graph refuses the candidate^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.9462643Z      ^[[32m✓^[[39m RA-13 publishes no patch for a commit that changed no composed value^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:37.9539201Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.1165601Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.1167757Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.1169311Z      ^[[32m✓^[[39m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.1170683Z      ^[[32m✓^[[39m Q-9 refuses a binding whose source is not a node in the graph^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.1172036Z      ^[[32m✓^[[39m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.1173577Z      ^[[32m✓^[[39m Q-11 keeps an upstream value out of the observer's authored value namespace^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.1174794Z      ^[[32m✓^[[39m Q-12 refuses a binding to a slot the plugin never declared, at load^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.1370056Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.2251799Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.3095054Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.3663489Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.4344686Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.5518173Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.5599702Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.6273158Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.7514953Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.7700599Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.8269401Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:38.9836044Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.0469479Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.2067983Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.3309371Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.3310316Z      ^[[32m✓^[[39m drives a time Motion once per project-clock tick^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.3310978Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.3311933Z      ^[[32m✓^[[39m rejects external signals without changing progress^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.3312576Z      ^[[32m✓^[[39m coalesces rapid driver ticks to the latest progress^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.3313291Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.3314013Z      ^[[32m✓^[[39m keeps manual signals working and preserves range validation^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.3314767Z      ^[[32m✓^[[39m isolates a throwing clock consumer while preserving other Motion progress^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.4017645Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.5411597Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.6104834Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.8599782Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.8756094Z  ^[[31m❯^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.8760229Z ^[[31m     ^[[31m×^[[31m MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers^[[39m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:39.8762128Z ^[[31m     ^[[31m×^[[31m MG-13 seeding the goal node alone re-solves the whole chain^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.1519128Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.1989265Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.4160176Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.4357643Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.6990721Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.7102938Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.7105195Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.7107051Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.7109015Z      ^[[32m✓^[[39m N-9 refuses the flat spelling of a key both plugins claim^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.7110417Z      ^[[32m✓^[[39m N-10 publishes grouped leaves under their unprefixed names^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:40.9148412Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.0391023Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.1539432Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.2569581Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.3739479Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.5300823Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.6247498Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.7349721Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2805^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.7352768Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2802^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.7408988Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.8586220Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.9030867Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:41.9991625Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.0465603Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.1449645Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.2299129Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.2909172Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.3409367Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.4139234Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.5228734Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.5478793Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.6638360Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.7119600Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.7279322Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.8638266Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:42.9554651Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.0363047Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.2004014Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.2006540Z ^[[31m     ^[[31m×^[[31m diagnoses a plugin returning a non-record composition value^[[39m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.2008566Z      ^[[32m✓^[[39m diagnoses an output observation whose source has already published a non-record value^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.2011735Z      ^[[32m✓^[[39m does not publish malformed composition values as ready patches^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.2916829Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.4394458Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.4969634Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.6928059Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.7537697Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.9169625Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:43.9855387Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.1434368Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.2723198Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.4311492Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.5529407Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.7096485Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.7098577Z      ^[[32m✓^[[39m H-1 keeps a namespaced derived key out of every published surface^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.7100126Z      ^[[32m✓^[[39m H-2 keeps a declared unprefixed internal key out of the patch^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.7101678Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.8208762Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.9965824Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.9968672Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:44.9971235Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.0227487Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.2403793Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.3199934Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-03T03:55:45.3219072Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T03:55:45.3220406Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T03:55:45.3221001Z 
quality (node 24)	Run npm test	2026-09-03T03:55:45.3221850Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T03:55:45.3223248Z 
quality (node 24)	Run npm test	2026-09-03T03:55:45.3223541Z act(() => {
quality (node 24)	Run npm test	2026-09-03T03:55:45.3224131Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T03:55:45.3224719Z });
quality (node 24)	Run npm test	2026-09-03T03:55:45.3225220Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T03:55:45.3225607Z 
quality (node 24)	Run npm test	2026-09-03T03:55:45.3226645Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T03:55:45.3227978Z 
quality (node 24)	Run npm test	2026-09-03T03:55:45.3389909Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-03T03:55:45.3423347Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T03:55:45.3447707Z 
quality (node 24)	Run npm test	2026-09-03T03:55:45.3549196Z  ^[[31m❯^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.3558965Z      ^[[32m✓^[[39m renders the current patch and updates after publication^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.3568816Z ^[[31m     ^[[31m×^[[31m H-4 hands a consumer the same stripped values the publisher retained^[[39m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.4374505Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.5419104Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.6328243Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.7747804Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.8258735Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:45.9989465Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.0629588Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.2418705Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.2463154Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.4523669Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.5088774Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.6575117Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.7269411Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.9361776Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:46.9467173Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.1059326Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.1126597Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.3126133Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.3578290Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.4864236Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.5528604Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.7209369Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.8059775Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-03T03:55:47.8129081Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T03:55:47.8130848Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:47.8132234Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T03:55:47.8157739Z 
quality (node 24)	Run npm test	2026-09-03T03:55:47.8179880Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T03:55:47.8187753Z 
quality (node 24)	Run npm test	2026-09-03T03:55:47.8188307Z act(() => {
quality (node 24)	Run npm test	2026-09-03T03:55:47.8188920Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T03:55:47.8189473Z });
quality (node 24)	Run npm test	2026-09-03T03:55:47.8189960Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T03:55:47.8190371Z 
quality (node 24)	Run npm test	2026-09-03T03:55:47.8191388Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T03:55:47.8196017Z 
quality (node 24)	Run npm test	2026-09-03T03:55:47.9359689Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.0273395Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.1679613Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.2322554Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.3909132Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.4554031Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.6005825Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.6008452Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 5714^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.6009731Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1582^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.6010546Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1523^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.6559587Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.7799202Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.8486551Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.8766203Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:48.9599027Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.0426188Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.0772630Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.1265149Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.2428514Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.2615720Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.2929621Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.4190707Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.4338372Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.4686383Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.5648867Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.6308051Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.6591328Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.7395872Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.8606540Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.8899641Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:49.9389634Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.0699802Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.0720279Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1050633Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1097727Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1098734Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 21 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1099410Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1104975Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/react/test/public-hook-render.test.ts^[[2m > ^[[22mReact public hook render/update (C2)^[[2m > ^[[22mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-03T03:55:50.1109537Z ^[[31m^[[1mAssertionError^[[22m: expected [ { x: +0 }, { x: 1 } ] to deeply equal [ undefined, { x: 1 } ]^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1110061Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1110293Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1110606Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1110744Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1110860Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1111119Z ^[[32m-   undefined,^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1111369Z ^[[31m+   {^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1111622Z ^[[31m+     "x": 0,^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1111858Z ^[[31m+   },^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1112330Z ^[[2m    {^[[22m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1112572Z ^[[2m      "x": 1,^[[22m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1112807Z ^[[2m    },^[[22m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1113033Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1113145Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1113552Z ^[[36m ^[[2m❯^[[22m packages/react/test/public-hook-render.test.ts:^[[2m96:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1145363Z     ^[[90m 94|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1146357Z     ^[[90m 95|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1148330Z     ^[[90m 96|^[[39m     ^[[34mexpect^[[39m(values)^[[33m.^[[39m^[[34mtoEqual^[[39m([undefined^[[33m,^[[39m { x^[[33m:^[[39m ^[[34m1^[[39m }])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1149738Z     ^[[90m   |^[[39m                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1152643Z     ^[[90m 97|^[[39m     renderer^[[33m!^[[39m^[[33m.^[[39m^[[34munmount^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1153793Z     ^[[90m 98|^[[39m     engine^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1154484Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1155101Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1155449Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1156459Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-6 publishes a bare static value and holds it at every progress
quality (node 24)	Run npm test	2026-09-03T03:55:50.1158361Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { length: 62 }^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1158679Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1158839Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1159072Z {
quality (node 24)	Run npm test	2026-09-03T03:55:50.1159281Z   "length": 62,
quality (node 24)	Run npm test	2026-09-03T03:55:50.1159489Z }
quality (node 24)	Run npm test	2026-09-03T03:55:50.1159597Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1159727Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1159952Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1160060Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1160510Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m231:41^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1172771Z     ^[[90m229|^[[39m   it("LF-6 publishes a bare static value and holds it at every progres…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1174327Z     ^[[90m230|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1176715Z     ^[[90m231|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m0^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1178529Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1180469Z     ^[[90m232|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1183055Z     ^[[90m233|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m1^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1184299Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1184828Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1185343Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1187588Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-11 a five-bone chain tracks an animated goal with every length intact
quality (node 24)	Run npm test	2026-09-03T03:55:50.1190222Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1191025Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1191407Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1191939Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1192263Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1192625Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1193150Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1193466Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1194392Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m168:66^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1196739Z     ^[[90m166|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1197877Z     ^[[90m167|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"rig/tail-target"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1199134Z     ^[[90m168|^[[39m     for (const id of TAIL_NODES) expect(patches.get(id)?.status).toBe(…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1200420Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1201035Z     ^[[90m169|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1201785Z     ^[[90m170|^[[39m     // One solve for the whole chain, keyed by member id, and never a …
quality (node 24)	Run npm test	2026-09-03T03:55:50.1202325Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1202803Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1203189Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1205163Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-12 two goals off one spine are both reached, and the spine is solved once
quality (node 24)	Run npm test	2026-09-03T03:55:50.1207466Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1208117Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1208370Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1208774Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1208967Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1209211Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1209630Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1209852Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1210655Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m213:66^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1211470Z     ^[[90m211|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1212295Z     ^[[90m212|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"rig/hip"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1213425Z     ^[[90m213|^[[39m     for (const id of TREE_NODES) expect(patches.get(id)?.status).toBe(…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1214499Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1215255Z     ^[[90m214|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1216005Z     ^[[90m215|^[[39m     // One solver vertex, one composition, five members. The spine bel…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1216514Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1216914Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1217386Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1219423Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-12 the worked rig re-expressed with a goal dict solves to the same two numbers
quality (node 24)	Run npm test	2026-09-03T03:55:50.1221684Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1222339Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1222598Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1223006Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1223199Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1223454Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1223856Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1224067Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1224877Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m122:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1225770Z     ^[[90m120|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1226928Z     ^[[90m121|^[[39m     ^[[35mconst^[[39m solver ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1228612Z     ^[[90m122|^[[39m     ^[[34mexpect^[[39m(solver^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1229730Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1231024Z     ^[[90m123|^[[39m     const rotations = solver?.values.rotations as Readonly<Record<stri…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1232665Z     ^[[90m124|^[[39m     ^[[34mexpect^[[39m(rotations[^[[32m"walker/upper-arm"^[[39m])^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1233492Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1233919Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1234247Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1235925Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-13 seeding the goal node alone re-solves the whole chain
quality (node 24)	Run npm test	2026-09-03T03:55:50.1237907Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1238529Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1238790Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1239267Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1239755Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1239975Z ^[[32m- true^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1240430Z ^[[31m+ false^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1240649Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1241439Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m155:36^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1242984Z     ^[[90m153|^[[39m     ^[[35mconst^[[39m second ^[[33m=^[[39m forearm^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1243906Z     ^[[90m154|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1244948Z     ^[[90m155|^[[39m     ^[[34mexpect^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[34misFinite^[[39m(first))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1246088Z     ^[[90m   |^[[39m                                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1247673Z     ^[[90m156|^[[39m     ^[[34mexpect^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[34misFinite^[[39m(second))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1249272Z     ^[[90m157|^[[39m     ^[[34mexpect^[[39m(second)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(first)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1249954Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1250437Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1250815Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1252645Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows
quality (node 24)	Run npm test	2026-09-03T03:55:50.1254602Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1255178Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1255433Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1255764Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1255931Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1256154Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1256483Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1256655Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1257461Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m118:33^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1258270Z     ^[[90m116|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1259458Z     ^[[90m117|^[[39m     ^[[35mconst^[[39m solverPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1261238Z     ^[[90m118|^[[39m     ^[[34mexpect^[[39m(solverPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1262417Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1263029Z     ^[[90m119|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1264225Z     ^[[90m120|^[[39m     ^[[35mconst^[[39m forearmPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/forearm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1265051Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1265505Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1265890Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1268023Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
quality (node 24)	Run npm test	2026-09-03T03:55:50.1270005Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1271513Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m209:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1273068Z     ^[[90m207|^[[39m     ^[[35mconst^[[39m x1 ^[[33m=^[[39m forearmPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1274048Z     ^[[90m208|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1274884Z     ^[[90m209|^[[39m     ^[[34mexpect^[[39m(x0)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1275761Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1276706Z     ^[[90m210|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1278052Z     ^[[90m211|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(x0)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1278668Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1279109Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1279477Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1281486Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
quality (node 24)	Run npm test	2026-09-03T03:55:50.1283902Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'error' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1284563Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1284826Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1285230Z "error"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1285433Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1285695Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1286103Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1286303Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1287148Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m91:27^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1288601Z     ^[[90m 89|^[[39m     // two boundaries: interpolator scratch stripped before the chain,…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1289782Z     ^[[90m 90|^[[39m     // rejected after it. Hiding it here instead would turn a loud err…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1291126Z     ^[[90m 91|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"error"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1292207Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1293136Z     ^[[90m 92|^[[39m     expect(patch?.diagnostics[0]?.ruleId).toBe("composition-output-sha…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1294136Z     ^[[90m 93|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1294614Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1295051Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1295419Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1296973Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
quality (node 24)	Run npm test	2026-09-03T03:55:50.1299507Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1301073Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m102:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1302495Z     ^[[90m100|^[[39m     // ownership change that stopped the interpolator reading a leaf w…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1303451Z     ^[[90m101|^[[39m     ^[[90m// and then hold still.^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1304976Z     ^[[90m102|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1306287Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1307816Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1310078Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1311101Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1311568Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1311947Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1313816Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
quality (node 24)	Run npm test	2026-09-03T03:55:50.1316304Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'walk/pelvis'^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1317809Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m386:26^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1319568Z     ^[[90m384|^[[39m     ^[[35mconst^[[39m publishedIds ^[[33m=^[[39m batch^[[33m.^[[39mpatches^[[33m.^[[39m^[[34mmap^[[39m((p) ^[[33m=>^[[39m p^[[33m.^[[39mnodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1320672Z     ^[[90m385|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1321611Z     ^[[90m386|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/pelvis"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1322649Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1323866Z     ^[[90m387|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/thigh"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1325465Z     ^[[90m388|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/shin"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1326214Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1326646Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1327001Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1329130Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
quality (node 24)	Run npm test	2026-09-03T03:55:50.1331339Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1332829Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m416:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1333987Z     ^[[90m414|^[[39m     // Thigh (base.rotation=0, own rotation=45): worldRot=45, x = 0 + …
quality (node 24)	Run npm test	2026-09-03T03:55:50.1335040Z     ^[[90m415|^[[39m     ^[[90m// y = 100 + 50*sin(45deg) = 135.355^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1336708Z     ^[[90m416|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1338241Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1339854Z     ^[[90m417|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1342092Z     ^[[90m418|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1343015Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1343443Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1343822Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1345877Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline
quality (node 24)	Run npm test	2026-09-03T03:55:50.1348796Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1350442Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m563:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1351784Z     ^[[90m561|^[[39m     const shinPatch = batch.patches.find((p) => p.nodeId === "walk/shi…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1352598Z     ^[[90m562|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1354001Z     ^[[90m563|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1355271Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1356842Z     ^[[90m564|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1359317Z     ^[[90m565|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1360347Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1360804Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1361182Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1363166Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m13. A three-bone tail solves iteratively while every other bone stays put
quality (node 24)	Run npm test	2026-09-03T03:55:50.1365357Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1366018Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1366280Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1366688Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1366950Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1367197Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1367695Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1367902Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1368758Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m693:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1370139Z     ^[[90m691|^[[39m     ^[[90m// 1. Every node of the rig publishes, both solvers included.^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1371302Z     ^[[90m692|^[[39m     for (const id of ["walk/tail-1", "walk/tail-2", "walk/tail-3", "wa…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1372585Z     ^[[90m693|^[[39m       ^[[34mexpect^[[39m(^[[34mat^[[39m(id)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1373663Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1374170Z     ^[[90m694|^[[39m     }
quality (node 24)	Run npm test	2026-09-03T03:55:50.1374568Z     ^[[90m695|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1374780Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1375158Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1375493Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1377563Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
quality (node 24)	Run npm test	2026-09-03T03:55:50.1380177Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1381951Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m105:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1383797Z     ^[[90m103|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"walk/pelvis"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1385342Z     ^[[90m104|^[[39m     const thigh = batch.patches.find(({ nodeId }) => nodeId === "walk/…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1387073Z     ^[[90m105|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1388320Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1389686Z     ^[[90m106|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1392030Z     ^[[90m107|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1393023Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1393463Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1393844Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1395874Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
quality (node 24)	Run npm test	2026-09-03T03:55:50.1398024Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1398597Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1398865Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1399292Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1399493Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1399748Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1400155Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1400548Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1401313Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m43:35^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1402850Z     ^[[90m 41|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1404291Z     ^[[90m 42|^[[39m     const firstConsumer = first.patches.find(({ nodeId }) => nodeId ==…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1405819Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(firstConsumer^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1406953Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1408217Z     ^[[90m 44|^[[39m     ^[[35mconst^[[39m firstRevision ^[[33m=^[[39m firstConsumer^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1409098Z     ^[[90m 45|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1409326Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1409698Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1410059Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1411697Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
quality (node 24)	Run npm test	2026-09-03T03:55:50.1413592Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1414084Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1414275Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1414569Z "ready"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1414719Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1414898Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1415188Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1415346Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1415888Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m75:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1417554Z     ^[[90m 73|^[[39m       ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m (cycle ^[[33m+^[[39m ^[[34m1^[[39m) ^[[33m/^[[39m ^[[34m50^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1419010Z     ^[[90m 74|^[[39m       const patch = batch.patches.find(({ nodeId }) => nodeId === cons…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1420197Z     ^[[90m 75|^[[39m       ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1421149Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1422240Z     ^[[90m 76|^[[39m       revisions^[[33m.^[[39m^[[34mpush^[[39m(patch^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1422968Z     ^[[90m 77|^[[39m     }
quality (node 24)	Run npm test	2026-09-03T03:55:50.1423177Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1423518Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1423815Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1425423Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
quality (node 24)	Run npm test	2026-09-03T03:55:50.1427572Z ^[[31m^[[1mAssertionError^[[22m: expected { nodeId: 'scene/arm', …(6) } to be undefined^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1428118Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1428347Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1428914Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1429101Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1429339Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1429701Z {
quality (node 24)	Run npm test	2026-09-03T03:55:50.1430006Z   "diagnostics": [],
quality (node 24)	Run npm test	2026-09-03T03:55:50.1430356Z   "nodeId": "scene/arm",
quality (node 24)	Run npm test	2026-09-03T03:55:50.1430723Z   "revision": 1,
quality (node 24)	Run npm test	2026-09-03T03:55:50.1431069Z   "sourceProgress": 0,
quality (node 24)	Run npm test	2026-09-03T03:55:50.1431426Z   "sourceRevisions": {},
quality (node 24)	Run npm test	2026-09-03T03:55:50.1431795Z   "status": "ready",
quality (node 24)	Run npm test	2026-09-03T03:55:50.1432120Z   "values": {
quality (node 24)	Run npm test	2026-09-03T03:55:50.1432413Z     "x": 0,
quality (node 24)	Run npm test	2026-09-03T03:55:50.1432698Z   },
quality (node 24)	Run npm test	2026-09-03T03:55:50.1432979Z }
quality (node 24)	Run npm test	2026-09-03T03:55:50.1433141Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1433931Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m194:46^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1435010Z     ^[[90m192|^[[39m     ^[[90m// what parity is about. Issue #223, slice A2.^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1436696Z     ^[[90m193|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mhandle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1438996Z     ^[[90m194|^[[39m     ^[[34mexpect^[[39m(authored^[[33m.^[[39mhandle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m))^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1440232Z     ^[[90m   |^[[39m                                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1440784Z     ^[[90m195|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1441917Z     ^[[90m196|^[[39m     ^[[35mconst^[[39m authoredSeen ^[[33m=^[[39m ^[[34mrecord^[[39m(authored^[[33m.^[[39mhandle^[[33m,^[[39m ^[[32m"scene/arm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1442726Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1443140Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1443427Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1444584Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
quality (node 24)	Run npm test	2026-09-03T03:55:50.1446060Z ^[[31m^[[1mAssertionError^[[22m: expected { x: +0 } to be undefined^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1446549Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1446807Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1447192Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1447522Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1447750Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1448099Z {
quality (node 24)	Run npm test	2026-09-03T03:55:50.1448398Z   "x": 0,
quality (node 24)	Run npm test	2026-09-03T03:55:50.1448685Z }
quality (node 24)	Run npm test	2026-09-03T03:55:50.1448857Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1449600Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:50^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1450899Z     ^[[90m 57|^[[39m     ^[[35mconst^[[39m { scheduler^[[33m,^[[39m handle } ^[[33m=^[[39m ^[[34mloadTimeMotion^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1451952Z     ^[[90m 58|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1453335Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1454609Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1455735Z     ^[[90m 60|^[[39m     ^[[34mexpect^[[39m(scheduler^[[33m.^[[39mpending)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1456833Z     ^[[90m 61|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1457400Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1457814Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1458174Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1459924Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/composition-output-shape.test.ts^[[2m > ^[[22mcomposition and output-shape diagnostics^[[2m > ^[[22mdiagnoses a plugin returning a non-record composition value
quality (node 24)	Run npm test	2026-09-03T03:55:50.1462118Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'composition-output-shape' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1462819Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1463065Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1463455Z "composition-output-shape"
quality (node 24)	Run npm test	2026-09-03T03:55:50.1463709Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1463904Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1464488Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1464654Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1465455Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/composition-output-shape.test.ts:^[[2m73:95^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1466581Z     ^[[90m 71|^[[39m     runtime^[[33m.^[[39m^[[34mmount^[[39m(^[[32m"hero/arm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1468121Z     ^[[90m 72|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"hero/arm"^[[39m^[[33m,^[[39m ^[[34m0.5^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1469387Z     ^[[90m 73|^[[39m     expect(batch.patches.find(({ nodeId }) => nodeId === "hero/arm")?.…
quality (node 24)	Run npm test	2026-09-03T03:55:50.1470408Z     ^[[90m   |^[[39m                                                                                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1471312Z     ^[[90m 74|^[[39m       ^[[32m"composition-output-shape"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1471973Z     ^[[90m 75|^[[39m     )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1472253Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1472652Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1473232Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1474928Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-flush.test.ts^[[2m > ^[[22ma structural commit ends at one flush^[[2m > ^[[22mRA-8 publishes the observing node when addObserve commits, with no tick
quality (node 24)	Run npm test	2026-09-03T03:55:50.1476833Z ^[[31m^[[1mAssertionError^[[22m: expected { nodeId: 'hero/leg', …(6) } to be undefined^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1477515Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1477770Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1478135Z undefined
quality (node 24)	Run npm test	2026-09-03T03:55:50.1478323Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1478549Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1478923Z {
quality (node 24)	Run npm test	2026-09-03T03:55:50.1479252Z   "diagnostics": [],
quality (node 24)	Run npm test	2026-09-03T03:55:50.1479630Z   "nodeId": "hero/leg",
quality (node 24)	Run npm test	2026-09-03T03:55:50.1479996Z   "revision": 1,
quality (node 24)	Run npm test	2026-09-03T03:55:50.1480342Z   "sourceProgress": 0,
quality (node 24)	Run npm test	2026-09-03T03:55:50.1480716Z   "sourceRevisions": {},
quality (node 24)	Run npm test	2026-09-03T03:55:50.1481094Z   "status": "ready",
quality (node 24)	Run npm test	2026-09-03T03:55:50.1481446Z   "values": {
quality (node 24)	Run npm test	2026-09-03T03:55:50.1481828Z     "hero/leg": 1,
quality (node 24)	Run npm test	2026-09-03T03:55:50.1482146Z   },
quality (node 24)	Run npm test	2026-09-03T03:55:50.1482462Z }
quality (node 24)	Run npm test	2026-09-03T03:55:50.1482622Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1483475Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-flush.test.ts:^[[2m72:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1484845Z     ^[[90m 70|^[[39m     ^[[35mconst^[[39m registry ^[[33m=^[[39m runtime^[[33m.^[[39mgraph^[[33m.^[[39mregistry^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1485667Z     ^[[90m 71|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1486767Z     ^[[90m 72|^[[39m     ^[[34mexpect^[[39m(registry^[[33m.^[[39m^[[35mget^[[39m(^[[33mLEG_ID^[[39m))^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1488010Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1488563Z     ^[[90m 73|^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1489739Z     ^[[90m 74|^[[39m     runtime^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mLEG_ID^[[39m)^[[33m.^[[39m^[[34maddObserve^[[39m({ source^[[33m:^[[39m ^[[33mARM_ID^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1490512Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1490923Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/21]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1491315Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1491347Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1492099Z ^[[2m Test Files ^[[22m ^[[1m^[[31m14 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m167 passed^[[39m^[[22m^[[90m (181)^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1493370Z ^[[2m      Tests ^[[22m ^[[1m^[[31m21 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m868 passed^[[39m^[[22m^[[90m (889)^[[39m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1494284Z ^[[2m   Start at ^[[22m 03:55:33
quality (node 24)	Run npm test	2026-09-03T03:55:50.1495364Z ^[[2m   Duration ^[[22m 16.92s^[[2m (transform 2.26s, setup 1.07s, import 9.30s, tests 12.12s, environment 24ms)^[[22m
quality (node 24)	Run npm test	2026-09-03T03:55:50.1495969Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1496002Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1526504Z ##[error]AssertionError: expected [ { x: +0 }, { x: 1 } ] to deeply equal [ undefined, { x: 1 } ]
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1535472Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1538090Z ##[error]AssertionError: expected undefined to deeply equal { length: 62 }
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1539645Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1541322Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1542297Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1543814Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1544870Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1546618Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1547981Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1550580Z ##[error]AssertionError: expected false to be true // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1552633Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1555347Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1557149Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1559335Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/ik-two-bone.test.ts:209:16
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:55:50.1560811Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1563525Z ##[error]AssertionError: expected undefined to be 'error' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1565423Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1568277Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:102:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:55:50.1570188Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1572225Z ##[error]AssertionError: expected [] to include 'walk/pelvis'
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:386:26
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:55:50.1573850Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1576342Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:416:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:55:50.1578395Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1581030Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:563:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:55:50.1583020Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1585920Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1588095Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1590926Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:105:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T03:55:50.1592955Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1595614Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1597542Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1600169Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1602031Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1606091Z ##[error]AssertionError: expected { nodeId: 'scene/arm', …(6) } to be undefined
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1609454Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1612077Z ##[error]AssertionError: expected { x: +0 } to be undefined
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1614031Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1617822Z ##[error]AssertionError: expected undefined to be 'composition-output-shape' // Object.is equality
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1620180Z 
quality (node 24)	Run npm test	2026-09-03T03:55:50.1624756Z ##[error]AssertionError: expected { nodeId: 'hero/leg', …(6) } to be undefined
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
quality (node 24)	Run npm test	2026-09-03T03:55:50.1971550Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-09-03T03:55:26.8032277Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8032767Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8071840Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8072067Z env:
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8072237Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8072413Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8913288Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8913957Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8914365Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:26.8914558Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.2190031Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.2193617Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.2194195Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7141670Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7159688Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7160950Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7161977Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7162983Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7164042Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7165022Z      ^[[32m✓^[[39m T-6 rolls the Motion back when the candidate graph rejects it^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7165978Z      ^[[32m✓^[[39m T-7 keeps one clock subscription when a Motion is created at runtime^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7309347Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7310578Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7311926Z ^[[31m     ^[[31m×^[[31m LF-6 publishes a bare static value and holds it at every progress^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7313172Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7314907Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7316069Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7317176Z      ^[[32m✓^[[39m LF-10 closes the static domain instead of leaving it open^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7318262Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7319634Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7320453Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7321123Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7321774Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.7322412Z      ^[[32m✓^[[39m LF-16 leaves no authored schema in the repository on the retired form^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8430392Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8431450Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8431978Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8432198Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8432458Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8433405Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8433500Z act(() => {
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8433716Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8433938Z });
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8434194Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8434318Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8434750Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8435121Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8697442Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 93^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8699160Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8699957Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8700718Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8701469Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8702166Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8702979Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8703662Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8704284Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8704836Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8705361Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8706289Z ^[[31m     ^[[31m×^[[31m 11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8707385Z      ^[[32m✓^[[39m 12. T-C4.1: Dynamic mutation and transactional rollback for solver topology^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.8708758Z ^[[31m     ^[[31m×^[[31m 13. A three-bone tail solves iteratively while every other bone stays put^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.9308025Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:27.9622207Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.0905329Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.1087758Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.1931104Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4310531Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4340042Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4341589Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows^[[39m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4342604Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4343359Z      ^[[32m✓^[[39m IK-16 DOM adapter skips a nested composite and writes nothing for a solver node^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4344501Z      ^[[32m✓^[[39m IK-17 handle.get for solver node returns solved rotations record^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4369245Z  ^[[31m❯^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4370122Z ^[[31m     ^[[31m×^[[31m FB-11 a five-bone chain tracks an animated goal with every length intact^[[39m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.4371589Z ^[[31m     ^[[31m×^[[31m FB-12 two goals off one spine are both reached, and the spine is solved once^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6181541Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6295021Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6792839Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6794789Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6796327Z      ^[[32m✓^[[39m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6797576Z      ^[[32m✓^[[39m Q-9 refuses a binding whose source is not a node in the graph^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6798998Z      ^[[32m✓^[[39m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6800260Z      ^[[32m✓^[[39m Q-11 keeps an upstream value out of the observer's authored value namespace^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.6801448Z      ^[[32m✓^[[39m Q-12 refuses a binding to a slot the plugin never declared, at load^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.8272403Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.8277619Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:28.8661104Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0592640Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0593860Z      ^[[32m✓^[[39m drives a time Motion once per project-clock tick^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0619407Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0643260Z      ^[[32m✓^[[39m rejects external signals without changing progress^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0644398Z      ^[[32m✓^[[39m coalesces rapid driver ticks to the latest progress^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0645435Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0647847Z      ^[[32m✓^[[39m keeps manual signals working and preserves range validation^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0649126Z      ^[[32m✓^[[39m isolates a throwing clock consumer while preserving other Motion progress^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0662050Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0775510Z  ^[[31m❯^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0777270Z ^[[31m     ^[[31m×^[[31m MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers^[[39m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.0780435Z ^[[31m     ^[[31m×^[[31m MG-13 seeding the goal node alone re-solves the whole chain^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.2680672Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.2765268Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.2944243Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.2957757Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.2959186Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.2960378Z      ^[[32m✓^[[39m N-9 refuses the flat spelling of a key both plugins claim^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.2961466Z      ^[[32m✓^[[39m N-10 publishes grouped leaves under their unprefixed names^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.4282479Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.4701561Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.5138876Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.6131774Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.6848106Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.7282441Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.8052510Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.8911233Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.8986858Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:29.9909632Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.0850178Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.0949007Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.1395234Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.2696297Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.2978780Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.3493663Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.4592855Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.4595168Z      ^[[32m✓^[[39m H-1 keeps a namespaced derived key out of every published surface^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.4596530Z      ^[[32m✓^[[39m H-2 keeps a declared unprefixed internal key out of the patch^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.4597675Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.5021250Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.5394657Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.5396708Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.5398641Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.6154113Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.6916667Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.6968282Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.7783762Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.8517327Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.8774295Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:30.9304609Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.0240621Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.0615901Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.1115472Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.1709234Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.2502632Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.3296449Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.3610373Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.4286271Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.4761976Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.5247653Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6089847Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6501513Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6592862Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6616336Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6616863Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 18 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6617188Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6620500Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-6 publishes a bare static value and holds it at every progress
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6624152Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { length: 62 }^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6624621Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6624814Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6625102Z {
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6625342Z   "length": 62,
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6625591Z }
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6625719Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6625890Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6626156Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6626297Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6629174Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m231:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6674177Z     ^[[90m229|^[[39m   it("LF-6 publishes a bare static value and holds it at every progres…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6675260Z     ^[[90m230|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6676654Z     ^[[90m231|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m0^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6677622Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6679093Z     ^[[90m232|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6680663Z     ^[[90m233|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAt^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m }^[[33m,^[[39m ^[[34m1^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ length^[[33m:^[[39m ^[[34m62^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6681400Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6681699Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6681973Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6683125Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-11 a five-bone chain tracks an animated goal with every length intact
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6684572Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6685019Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6685194Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6685469Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6685614Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6685784Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6686064Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6686199Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6686770Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m168:66^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6693568Z     ^[[90m166|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6694535Z     ^[[90m167|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"rig/tail-target"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6695681Z     ^[[90m168|^[[39m     for (const id of TAIL_NODES) expect(patches.get(id)?.status).toBe(…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6696684Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6699630Z     ^[[90m169|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6700533Z     ^[[90m170|^[[39m     // One solve for the whole chain, keyed by member id, and never a …
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6701269Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6701743Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6702163Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6703619Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-12 two goals off one spine are both reached, and the spine is solved once
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6705608Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6706366Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6706682Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6707100Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6707374Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6707828Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6708143Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6708453Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6709057Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m213:66^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6709693Z     ^[[90m211|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6710378Z     ^[[90m212|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"rig/hip"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6711271Z     ^[[90m213|^[[39m     for (const id of TREE_NODES) expect(patches.get(id)?.status).toBe(…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6712035Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6712500Z     ^[[90m214|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6713095Z     ^[[90m215|^[[39m     // One solver vertex, one composition, five members. The spine bel…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6713541Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6713862Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6714127Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6715506Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-12 the worked rig re-expressed with a goal dict solves to the same two numbers
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6717047Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6717493Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6717672Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6717946Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6718088Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6718258Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6718651Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6718793Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6719357Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m122:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6721360Z     ^[[90m120|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6727976Z     ^[[90m121|^[[39m     ^[[35mconst^[[39m solver ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6729453Z     ^[[90m122|^[[39m     ^[[34mexpect^[[39m(solver^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6730424Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6731358Z     ^[[90m123|^[[39m     const rotations = solver?.values.rotations as Readonly<Record<stri…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6732765Z     ^[[90m124|^[[39m     ^[[34mexpect^[[39m(rotations[^[[32m"walker/upper-arm"^[[39m])^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6733655Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6734144Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6734587Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6736006Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-13 seeding the goal node alone re-solves the whole chain
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6737545Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6738179Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6738636Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6739115Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6739503Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6739804Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6740237Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6740542Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6741257Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m155:36^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6742488Z     ^[[90m153|^[[39m     ^[[35mconst^[[39m second ^[[33m=^[[39m forearm^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6743345Z     ^[[90m154|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6744380Z     ^[[90m155|^[[39m     ^[[34mexpect^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[34misFinite^[[39m(first))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6745466Z     ^[[90m   |^[[39m                                    ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6746891Z     ^[[90m156|^[[39m     ^[[34mexpect^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[34misFinite^[[39m(second))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6748553Z     ^[[90m157|^[[39m     ^[[34mexpect^[[39m(second)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(first)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6749189Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6749690Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6750138Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6751581Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6753275Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6753898Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6754233Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6754687Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6754971Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6755304Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6755766Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6756081Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6756790Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m118:33^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6757576Z     ^[[90m116|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6758695Z     ^[[90m117|^[[39m     ^[[35mconst^[[39m solverPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/arm-solve"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6760115Z     ^[[90m118|^[[39m     ^[[34mexpect^[[39m(solverPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6761121Z     ^[[90m   |^[[39m                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6761731Z     ^[[90m119|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6762753Z     ^[[90m120|^[[39m     ^[[35mconst^[[39m forearmPatch ^[[33m=^[[39m patches^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walker/forearm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6763496Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6763978Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6764407Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6765935Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6767526Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6770739Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m209:16^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6772021Z     ^[[90m207|^[[39m     ^[[35mconst^[[39m x1 ^[[33m=^[[39m forearmPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx ^[[35mas^[[39m number^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6772881Z     ^[[90m208|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6773571Z     ^[[90m209|^[[39m     ^[[34mexpect^[[39m(x0)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6774306Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6775107Z     ^[[90m210|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6776104Z     ^[[90m211|^[[39m     ^[[34mexpect^[[39m(x1)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoEqual^[[39m(x0)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6776703Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6777164Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6777583Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6779209Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6780938Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'error' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6781550Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6781885Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6782327Z "error"
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6782618Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6782937Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6783366Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6783663Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6784703Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m91:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6785865Z     ^[[90m 89|^[[39m     // two boundaries: interpolator scratch stripped before the chain,…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6787258Z     ^[[90m 90|^[[39m     // rejected after it. Hiding it here instead would turn a loud err…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6788638Z     ^[[90m 91|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"error"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6789644Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6790948Z     ^[[90m 92|^[[39m     expect(patch?.diagnostics[0]?.ruleId).toBe("composition-output-sha…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6791867Z     ^[[90m 93|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6792362Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6792859Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6793295Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6794786Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6796738Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6798164Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m102:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6799446Z     ^[[90m100|^[[39m     // ownership change that stopped the interpolator reading a leaf w…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6800319Z     ^[[90m101|^[[39m     ^[[90m// and then hold still.^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6801568Z     ^[[90m102|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6802659Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6803923Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6805940Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6806826Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6807295Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6807723Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6828513Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6830372Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'walk/pelvis'^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6831595Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m386:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6833159Z     ^[[90m384|^[[39m     ^[[35mconst^[[39m publishedIds ^[[33m=^[[39m batch^[[33m.^[[39mpatches^[[33m.^[[39m^[[34mmap^[[39m((p) ^[[33m=>^[[39m p^[[33m.^[[39mnodeId)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6834200Z     ^[[90m385|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6835096Z     ^[[90m386|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/pelvis"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6836053Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6837048Z     ^[[90m387|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/thigh"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6838269Z     ^[[90m388|^[[39m     ^[[34mexpect^[[39m(publishedIds)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"walk/shin"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6839039Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6839485Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6839911Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6841438Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6842809Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6844593Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m416:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6845679Z     ^[[90m414|^[[39m     // Thigh (base.rotation=0, own rotation=45): worldRot=45, x = 0 + …
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6846377Z     ^[[90m415|^[[39m     ^[[90m// y = 100 + 50*sin(45deg) = 135.355^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6847461Z     ^[[90m416|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6848472Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6849410Z     ^[[90m417|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6850267Z     ^[[90m418|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6850702Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6850899Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6851080Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6851892Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6852932Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6853649Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m563:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6854601Z     ^[[90m561|^[[39m     const shinPatch = batch.patches.find((p) => p.nodeId === "walk/shi…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6855180Z     ^[[90m562|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6856211Z     ^[[90m563|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6857201Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6858471Z     ^[[90m564|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6860081Z     ^[[90m565|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6860786Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6861115Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6861393Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6862777Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m13. A three-bone tail solves iteratively while every other bone stays put
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6864305Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6864792Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6864979Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6865278Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6865424Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6865587Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6865874Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6866011Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6866629Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m693:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6867580Z     ^[[90m691|^[[39m     ^[[90m// 1. Every node of the rig publishes, both solvers included.^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6868575Z     ^[[90m692|^[[39m     for (const id of ["walk/tail-1", "walk/tail-2", "walk/tail-3", "wa…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6869595Z     ^[[90m693|^[[39m       ^[[34mexpect^[[39m(^[[34mat^[[39m(id)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6870379Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6870795Z     ^[[90m694|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6871111Z     ^[[90m695|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6871276Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6871797Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6872223Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6873621Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6874693Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6875441Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m105:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6876168Z     ^[[90m103|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"walk/pelvis"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6876959Z     ^[[90m104|^[[39m     const thigh = batch.patches.find(({ nodeId }) => nodeId === "walk/…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6878114Z     ^[[90m105|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6879134Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6880161Z     ^[[90m106|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6881449Z     ^[[90m107|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6881826Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6882023Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6882181Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6882955Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6883821Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6884108Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6884223Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6884405Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6884497Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6884594Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6884769Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6884857Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6885158Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m43:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6885761Z     ^[[90m 41|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6906080Z     ^[[90m 42|^[[39m     const firstConsumer = first.patches.find(({ nodeId }) => nodeId ==…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6906898Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(firstConsumer^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6907708Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6908698Z     ^[[90m 44|^[[39m     ^[[35mconst^[[39m firstRevision ^[[33m=^[[39m firstConsumer^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6909165Z     ^[[90m 45|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6909284Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6909494Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6909699Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6910447Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6911916Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6912387Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6912575Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6912869Z "ready"
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6913003Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6913180Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6913459Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6913605Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6914132Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m75:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6915119Z     ^[[90m 73|^[[39m       ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m (cycle ^[[33m+^[[39m ^[[34m1^[[39m) ^[[33m/^[[39m ^[[34m50^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6915906Z     ^[[90m 74|^[[39m       const patch = batch.patches.find(({ nodeId }) => nodeId === cons…
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6916490Z     ^[[90m 75|^[[39m       ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6916938Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6917418Z     ^[[90m 76|^[[39m       revisions^[[33m.^[[39m^[[34mpush^[[39m(patch^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6917799Z     ^[[90m 77|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6917922Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6918103Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6918268Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6919219Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6920170Z ^[[31m^[[1mAssertionError^[[22m: expected { nodeId: 'scene/arm', …(6) } to be undefined^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6920435Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6920545Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6920737Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6920827Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6920934Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6921109Z {
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6921275Z   "diagnostics": [],
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6921458Z   "nodeId": "scene/arm",
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6921646Z   "revision": 1,
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6921830Z   "sourceProgress": 0,
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6922015Z   "sourceRevisions": {},
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6922196Z   "status": "ready",
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6922365Z   "values": {
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6922537Z     "x": 0,
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6922691Z   },
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6922843Z }
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6922934Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6923320Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m194:46^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6923868Z     ^[[90m192|^[[39m     ^[[90m// what parity is about. Issue #223, slice A2.^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6924640Z     ^[[90m193|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mhandle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6925519Z     ^[[90m194|^[[39m     ^[[34mexpect^[[39m(authored^[[33m.^[[39mhandle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m))^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6926069Z     ^[[90m   |^[[39m                                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6926342Z     ^[[90m195|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6926864Z     ^[[90m196|^[[39m     ^[[35mconst^[[39m authoredSeen ^[[33m=^[[39m ^[[34mrecord^[[39m(authored^[[33m.^[[39mhandle^[[33m,^[[39m ^[[32m"scene/arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6927218Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6927396Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6927774Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6928972Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6930066Z ^[[31m^[[1mAssertionError^[[22m: expected { x: +0 } to be undefined^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6930436Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6930613Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6930891Z undefined
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6931039Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6931196Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6931462Z {
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6931681Z   "x": 0,
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6931904Z }
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6932025Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6932545Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:50^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6933589Z     ^[[90m 57|^[[39m     ^[[35mconst^[[39m { scheduler^[[33m,^[[39m handle } ^[[33m=^[[39m ^[[34mloadTimeMotion^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6934403Z     ^[[90m 58|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6935502Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6936427Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6937304Z     ^[[90m 60|^[[39m     ^[[34mexpect^[[39m(scheduler^[[33m.^[[39mpending)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6938113Z     ^[[90m 61|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6938539Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6938823Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/18]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6939082Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6939093Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6939660Z ^[[2m Test Files ^[[22m ^[[1m^[[31m11 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m51 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6940624Z ^[[2m      Tests ^[[22m ^[[1m^[[31m18 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m240 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6941259Z ^[[2m   Start at ^[[22m 03:55:27
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6942126Z ^[[2m   Duration ^[[22m 4.43s^[[2m (transform 1.37s, setup 402ms, import 4.00s, tests 1.19s, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6942601Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6942619Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6961639Z ##[error]AssertionError: expected undefined to deeply equal { length: 62 }
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6967590Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6969532Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6970451Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6971948Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6972789Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6973999Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6974834Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6976169Z ##[error]AssertionError: expected false to be true // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6977290Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6978902Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6980136Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6981259Z ##[error]AssertionError: expected undefined to be defined
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:209:16
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6982227Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6984305Z ##[error]AssertionError: expected undefined to be 'error' // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6986014Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6988025Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:102:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6989610Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6991158Z ##[error]AssertionError: expected [] to include 'walk/pelvis'
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:386:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6992279Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6994183Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:416:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6995511Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6997410Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:563:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.6998932Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7000978Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7002342Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7004424Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:105:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7005860Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7007335Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7008187Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7009489Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7010322Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7012217Z ##[error]AssertionError: expected { nodeId: 'scene/arm', …(6) } to be undefined
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7013366Z 
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7014435Z ##[error]AssertionError: expected { x: +0 } to be undefined
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
integration (node 24)	Run npm run test:integration	2026-09-03T03:55:31.7296412Z ##[error]Process completed with exit code 1.
```
