# CI log archive: 34014499081

- Workflow: CI
- Conclusion: failure
- Head branch: fix/306-settle-error-boundary
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/34014499081
- Captured: 2026-09-06T05:39:53Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-06T05:39:19.4832938Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-06T05:39:19.4833350Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-06T05:39:19.4858730Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-06T05:39:19.4859186Z env:
quality (node 24)	Run npm test	2026-09-06T05:39:19.4859496Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-06T05:39:19.4859856Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-06T05:39:19.5827470Z 
quality (node 24)	Run npm test	2026-09-06T05:39:19.5828510Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-06T05:39:19.5829088Z > vitest run
quality (node 24)	Run npm test	2026-09-06T05:39:19.5829387Z 
quality (node 24)	Run npm test	2026-09-06T05:39:19.8821058Z 
quality (node 24)	Run npm test	2026-09-06T05:39:19.8831974Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:19.8832926Z 
quality (node 24)	Run npm test	2026-09-06T05:39:20.2402887Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.4856568Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6412761Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m32 tests^[[22m^[[2m | ^[[22m^[[31m8 failed^[[39m^[[2m)^[[22m^[[32m 70^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6420024Z      ^[[32m✓^[[39m RA-1 creates the Motion before the graph is asked and destroys it on refusal^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6422004Z      ^[[32m✓^[[39m RA-2 reports a createMotion failure verbatim and rolls nothing back^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6423523Z      ^[[32m✓^[[39m RA-3 compiles a new Track, then registers it with its Motion, then mounts it^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6425158Z      ^[[32m✓^[[39m RA-4 disposes the compiled Track and registers nothing when the graph refuses^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6426823Z      ^[[32m✓^[[39m RA-5 drops the entry before the removal hooks run, and runs them in order^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6428539Z      ^[[32m✓^[[39m RA-6 refuses a Motion that still owns tracks and reaches no hook^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6430105Z      ^[[32m✓^[[39m RA-7 leaves the retained definitions and the committed graph agreeing^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6431937Z      ^[[32m✓^[[39m RA-114 refuses the commit a hook disposed, rolls it back, then tears down once^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6433592Z      ^[[32m✓^[[39m RA-115 keeps a hook's own failure ahead of the disposal it also asked for^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6435016Z      ^[[32m✓^[[39m RA-116 answers as disposed from the call rather than from the teardown^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6436493Z      ^[[32m✓^[[39m RA-117 finishes the settle steps a settle hook disposed through, and skips the flush^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6437923Z      ^[[32m✓^[[39m RA-118 refuses a structural entry point re-entered from inside a commit's effects^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6439472Z      ^[[32m✓^[[39m RA-119 leaves the calling commit whole when its hook keeps the refusal to itself^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6441112Z      ^[[32m✓^[[39m RA-120 refuses a removal of the node the commit it re-entered is replacing^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6443295Z      ^[[32m✓^[[39m RA-121 refuses a re-entry from a settle step, and finishes the phase it interrupted^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6444749Z      ^[[32m✓^[[39m RA-122 leaves a hook's reads answering, and its commit accepted once the commit returned^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6446166Z      ^[[32m✓^[[39m RA-134 refuses a mount of the node the commit is adding, so its settle step still owns it^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6447601Z      ^[[32m✓^[[39m RA-135 leaves a hook's reads answering, and publishes the commit's own flush exactly once^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6473130Z ^[[31m     ^[[31m×^[[31m RA-126 mounts and publishes an accepted add even when Motion registration throws^[[39m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6493339Z ^[[31m     ^[[31m×^[[31m RA-127 preserves every settle failure and the later synchronous flush failure in order^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6538172Z ^[[31m     ^[[31m×^[[31m RA-128 keeps a replacement committed and publishes after its staged commit throws^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6557254Z ^[[31m     ^[[31m×^[[31m RA-129 deregisters after disposal throws and continues to later Motion cleanup^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6559277Z      ^[[32m✓^[[39m RA-130 leaves a successful settle ordered before its single publication^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6563181Z ^[[31m     ^[[31m×^[[31m preserves a settle failure when snapshot resolution also throws^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6564664Z      ^[[32m✓^[[39m preserves a lone flush failure including a thrown undefined^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6566430Z ^[[31m     ^[[31m×^[[31m completes later settle steps after a disposing hook throws and still skips publication^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6568386Z ^[[31m     ^[[31m×^[[31m records composition diagnostics while preserving the independent settle error^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6570284Z ^[[31m     ^[[31m×^[[31m counts a thrown undefined as a settle failure and permits a later commit^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6571853Z      ^[[32m✓^[[39m RA-136 refuses a live write from inside a commit before its seam is reached^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6578987Z      ^[[32m✓^[[39m RA-137 refuses a tier 0 edit from inside a commit that is moving the motions half^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6580602Z      ^[[32m✓^[[39m RA-138 answers the condition that is true rather than an absence that is not^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6582722Z      ^[[32m✓^[[39m RA-139 leaves every write path working outside a commit, and a reading hook untouched^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.6906004Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-06T05:39:20.6908703Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T05:39:20.6909951Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T05:39:20.6910528Z 
quality (node 24)	Run npm test	2026-09-06T05:39:20.6911220Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T05:39:20.6913578Z 
quality (node 24)	Run npm test	2026-09-06T05:39:20.6914000Z act(() => {
quality (node 24)	Run npm test	2026-09-06T05:39:20.6919478Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T05:39:20.6920373Z });
quality (node 24)	Run npm test	2026-09-06T05:39:20.6921027Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T05:39:20.6921752Z 
quality (node 24)	Run npm test	2026-09-06T05:39:20.6922847Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T05:39:20.6923947Z 
quality (node 24)	Run npm test	2026-09-06T05:39:20.7133899Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 105^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.7754655Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.9389274Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:20.9866122Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.0505907Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.2026178Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.2502911Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.3561020Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.4346566Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.5279671Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.5758795Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.7068889Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.7748533Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:21.8028715Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.0023468Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.0093483Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.2547528Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.2549561Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.4552060Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.4948627Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.6806964Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.7504103Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.7994070Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 917^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:22.9458695Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.0917521Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.1237384Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.2201612Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.3014382Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.3734711Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.5684611Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.6001064Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.6496708Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 94^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.7587768Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.8224339Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:23.8444691Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.0287172Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.0653548Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.1593765Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.2833900Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.3103124Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.4084486Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.5259086Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.5283567Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.6433964Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.7095199Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.7552000Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.8922575Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.9343953Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:24.9534552Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.1096122Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.1173772Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.1950137Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.3132380Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.3877223Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.3996484Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.5619736Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.5738750Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.6548131Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.7773766Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.8002081Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:25.8503952Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.0272747Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.0345054Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.0368370Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.2294977Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.2338963Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.2399888Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.4154010Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.4653753Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.6553551Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.7107755Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.8398976Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:26.8916398Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:27.0578941Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:27.1104063Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:27.3516819Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:27.3841622Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:27.6590990Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:27.7448719Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:27.9700817Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:27.9877521Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:28.2503790Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:28.2835020Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:28.5046706Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:28.6116026Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:28.7713635Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:28.8436644Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.0103665Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.1253861Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.2151584Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.2334067Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2811^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.2337723Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2808^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.3296702Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.4296633Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.4649182Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.5964162Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.5995104Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.7353073Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.8508453Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.8603881Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:29.9642276Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.0274117Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.1408790Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.1666711Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.2966875Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.3468502Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.3694606Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.4923606Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.5874046Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.6932478Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.8204209Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:30.9358413Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:31.0272106Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:31.1355348Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:31.2620512Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:31.4244039Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:31.4784509Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:31.6604011Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:31.7123849Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:31.9555858Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:32.0063500Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:32.2040874Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:32.2465570Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:32.4816418Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:32.5403893Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:32.7091165Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:32.7557070Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:32.9504096Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.0604212Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-06T05:39:33.0663291Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T05:39:33.0702687Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T05:39:33.0731816Z 
quality (node 24)	Run npm test	2026-09-06T05:39:33.0742796Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T05:39:33.0755899Z 
quality (node 24)	Run npm test	2026-09-06T05:39:33.0764056Z act(() => {
quality (node 24)	Run npm test	2026-09-06T05:39:33.0765020Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T05:39:33.0765852Z });
quality (node 24)	Run npm test	2026-09-06T05:39:33.0766497Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T05:39:33.0769327Z 
quality (node 24)	Run npm test	2026-09-06T05:39:33.0770563Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T05:39:33.0800917Z 
quality (node 24)	Run npm test	2026-09-06T05:39:33.0802489Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.0812113Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-06T05:39:33.0813892Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T05:39:33.0814777Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T05:39:33.0815109Z 
quality (node 24)	Run npm test	2026-09-06T05:39:33.0815542Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T05:39:33.0816045Z 
quality (node 24)	Run npm test	2026-09-06T05:39:33.0816185Z act(() => {
quality (node 24)	Run npm test	2026-09-06T05:39:33.0816698Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T05:39:33.0817166Z });
quality (node 24)	Run npm test	2026-09-06T05:39:33.0817554Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T05:39:33.0817821Z 
quality (node 24)	Run npm test	2026-09-06T05:39:33.0818622Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T05:39:33.0819338Z 
quality (node 24)	Run npm test	2026-09-06T05:39:33.1638651Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.2807651Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.3795339Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.5082961Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.5804022Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.7192471Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.8374706Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:33.9631728Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.0666066Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.2340100Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.3195465Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.4557730Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.5353708Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.7205689Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.7393671Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.9024170Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:34.9103910Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.0846339Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.1500015Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.2613561Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.3394156Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.4581522Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.5864454Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-06T05:39:35.5903493Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T05:39:35.5905330Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.5932556Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T05:39:35.5961797Z 
quality (node 24)	Run npm test	2026-09-06T05:39:35.6007622Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T05:39:35.6041569Z 
quality (node 24)	Run npm test	2026-09-06T05:39:35.6064370Z act(() => {
quality (node 24)	Run npm test	2026-09-06T05:39:35.6090951Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T05:39:35.6152799Z });
quality (node 24)	Run npm test	2026-09-06T05:39:35.6182038Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T05:39:35.6196893Z 
quality (node 24)	Run npm test	2026-09-06T05:39:35.6198373Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T05:39:35.6199421Z 
quality (node 24)	Run npm test	2026-09-06T05:39:35.6710436Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.7953848Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:35.8938332Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.0184071Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.0830450Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.2336188Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.3134947Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.4364126Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 5914^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.4366371Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1572^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.4368303Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1559^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.4591152Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.5873953Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.6163849Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.6641892Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.7677631Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.7777661Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.8671616Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.9534987Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:36.9961697Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.0346945Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.1351214Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.1747011Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.2044346Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.3140657Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.3393840Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.3906023Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.4813930Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.5278043Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.6261514Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.7043955Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.7326403Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8532245Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8710230Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8922386Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8979570Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.8980838Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 8 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8981799Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.8983611Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-126 mounts and publishes an accepted add even when Motion registration throws
quality (node 24)	Run npm test	2026-09-06T05:39:37.8987958Z ^[[31m^[[1mAssertionError^[[22m: expected +0 to be 1 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8988474Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.8988698Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8989220Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8989385Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.8989562Z ^[[32m- 1^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8989879Z ^[[31m+ 0^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.8990098Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9126262Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m982:35^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9128111Z     ^[[90m980|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mADDED_ID^[[39m)^[[33m.^[[39mlive)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9130381Z     ^[[90m981|^[[39m     ^[[34mexpect^[[39m(^[[34mdisagreeing^[[39m(runtime))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9132184Z     ^[[90m982|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39minstanceCount)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9133411Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9134540Z     ^[[90m983|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mgraph^[[33m.^[[39mmemberCount)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9135887Z     ^[[90m984|^[[39m     ^[[34mexpect^[[39m(batches)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9136383Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9136777Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9137052Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9138192Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-127 preserves every settle failure and the later synchronous flush failure in order
quality (node 24)	Run npm test	2026-09-06T05:39:37.9140314Z ^[[31m^[[1mAssertionError^[[22m: expected [ Error: host cause ] to have a length of 3 but got 1^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9140912Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9141206Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9141913Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9142141Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9142344Z ^[[32m- 3^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9142846Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9143098Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9143888Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1015:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9145292Z     ^[[90m1013|^[[39m     ^[[34mexpect^[[39m(thrown)^[[33m.^[[39m^[[34mtoBeInstanceOf^[[39m(^[[33mAggregateError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9146705Z     ^[[90m1014|^[[39m     ^[[35mconst^[[39m errors ^[[33m=^[[39m (thrown ^[[35mas^[[39m ^[[33mAggregateError^[[39m)^[[33m.^[[39merrors^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9148074Z     ^[[90m1015|^[[39m     ^[[34mexpect^[[39m(errors)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m3^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9148985Z     ^[[90m   |^[[39m                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9149972Z     ^[[90m1016|^[[39m     ^[[34mexpect^[[39m(errors[^[[34m0^[[39m])^[[33m.^[[39m^[[34mtoBe^[[39m(replacement)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9151471Z     ^[[90m1017|^[[39m     ^[[34mexpect^[[39m(errors[^[[34m1^[[39m])^[[33m.^[[39m^[[34mtoBe^[[39m(registration)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9152152Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9152592Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/8]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9153009Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9154891Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-128 keeps a replacement committed and publishes after its staged commit throws
quality (node 24)	Run npm test	2026-09-06T05:39:37.9156819Z ^[[31m^[[1mAssertionError^[[22m: expected [] to have a length of 1 but got +0^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9157388Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9157707Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9158241Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9158837Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9159039Z ^[[32m- 1^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9159564Z ^[[31m+ 0^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9159778Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9160583Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1055:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9162014Z     ^[[90m1053|^[[39m       ^[[32m"stage-commit hero/arm"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9162792Z     ^[[90m1054|^[[39m     ])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9163756Z     ^[[90m1055|^[[39m     ^[[34mexpect^[[39m(batches)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9164719Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9165845Z     ^[[90m1056|^[[39m     ^[[34mexpect^[[39m(batches[^[[34m0^[[39m]^[[33m?.^[[39mseeds)^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[33mNODE_ID^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9167141Z     ^[[90m1057|^[[39m     expect(batches[0]?.patches.map((patch) => patch.nodeId)).toEqual([…
quality (node 24)	Run npm test	2026-09-06T05:39:37.9167955Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9168420Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/8]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9168769Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9170565Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-129 deregisters after disposal throws and continues to later Motion cleanup
quality (node 24)	Run npm test	2026-09-06T05:39:37.9172997Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'dispose hero/arm' ] to deeply equal [ 'dispose hero/arm', …(2) ]^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9173657Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9173930Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9174501Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9174811Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9175021Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9175565Z ^[[2m    "dispose hero/arm",^[[22m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9176207Z ^[[32m-   "motion-remove hero/arm",^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9176944Z ^[[32m-   "motion-destroy hero",^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9177519Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9177804Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9178556Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1077:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9179538Z     ^[[90m1075|^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9181427Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9185913Z     ^[[90m1076|^[[39m     ^[[34mexpect^[[39m(thrown)^[[33m.^[[39m^[[34mtoBe^[[39m(failure)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9187158Z     ^[[90m1077|^[[39m     ^[[34mexpect^[[39m(journal^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoEqual^[[39m([
quality (node 24)	Run npm test	2026-09-06T05:39:37.9187759Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9188366Z     ^[[90m1078|^[[39m       ^[[32m"dispose hero/arm"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9188930Z     ^[[90m1079|^[[39m       ^[[32m"motion-remove hero/arm"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9189232Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9189531Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/8]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9189790Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9191101Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mpreserves a settle failure when snapshot resolution also throws
quality (node 24)	Run npm test	2026-09-06T05:39:37.9193271Z ^[[31m^[[1mAssertionError^[[22m: expected Error: registration failed to be an instance of AggregateError^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9194255Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1135:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9195018Z     ^[[90m1133|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9195976Z     ^[[90m1134|^[[39m     const thrown = thrownBy(() => runtime.addTrack({ id: "hand" }, { m…
quality (node 24)	Run npm test	2026-09-06T05:39:37.9197312Z     ^[[90m1135|^[[39m     ^[[34mexpect^[[39m(thrown)^[[33m.^[[39m^[[34mtoBeInstanceOf^[[39m(^[[33mAggregateError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9198352Z     ^[[90m   |^[[39m                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9199705Z     ^[[90m1136|^[[39m     ^[[34mexpect^[[39m((thrown ^[[35mas^[[39m ^[[33mAggregateError^[[39m)^[[33m.^[[39merrors)^[[33m.^[[39m^[[34mtoEqual^[[39m([settle^[[33m,^[[39m flush])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9201030Z     ^[[90m1137|^[[39m     ^[[34mexpect^[[39m((thrown ^[[35mas^[[39m ^[[33mAggregateError^[[39m)^[[33m.^[[39merrors[^[[34m0^[[39m])^[[33m.^[[39m^[[34mtoBe^[[39m(settle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9202074Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9202401Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/8]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9202627Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9204078Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mcompletes later settle steps after a disposing hook throws and still skips publication
quality (node 24)	Run npm test	2026-09-06T05:39:37.9205382Z ^[[31m^[[1mAssertionError^[[22m: expected [] to deeply equal [ 'hero/hand', '~/second' ]^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9205829Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9206039Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9206441Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9206635Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9206771Z ^[[32m- [^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9207156Z ^[[32m-   "hero/hand",^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9207641Z ^[[32m-   "~/second",^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9208206Z ^[[32m- ]^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9208676Z ^[[31m+ []^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9208855Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9209524Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1201:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9210443Z     ^[[90m1199|^[[39m       ^[[32m"composition-dispose"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9211119Z     ^[[90m1200|^[[39m     ])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9212218Z     ^[[90m1201|^[[39m     ^[[34mexpect^[[39m(attachments)^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[33mADDED_ID^[[39m^[[33m,^[[39m ^[[32m"~/second"^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9213100Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9213631Z     ^[[90m1202|^[[39m     spy^[[33m.^[[39m^[[34mmockRestore^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9214423Z     ^[[90m1203|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mgraph^[[33m.^[[39msequence)^[[33m.^[[39m^[[34mtoBe^[[39m(before)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9214903Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9215342Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/8]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9215663Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9217418Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mrecords composition diagnostics while preserving the independent settle error
quality (node 24)	Run npm test	2026-09-06T05:39:37.9219371Z ^[[31m^[[1mAssertionError^[[22m: expected [] to have a length of 1 but got +0^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9219844Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9220041Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9220451Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9220654Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9220857Z ^[[32m- 1^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9221189Z ^[[31m+ 0^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9221535Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9222044Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1224:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9222859Z     ^[[90m1222|^[[39m     const thrown = thrownBy(() => runtime.addTrack({ id: "hand" }, { m…
quality (node 24)	Run npm test	2026-09-06T05:39:37.9223573Z     ^[[90m1223|^[[39m     ^[[34mexpect^[[39m(thrown)^[[33m.^[[39m^[[34mtoBe^[[39m(failure)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9224356Z     ^[[90m1224|^[[39m     ^[[34mexpect^[[39m(batches)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9224994Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9225832Z     ^[[90m1225|^[[39m     ^[[34mexpect^[[39m(batches[^[[34m0^[[39m]^[[33m?.^[[39mdiagnostics^[[33m.^[[39mlength)^[[33m.^[[39m^[[34mtoBeGreaterThan^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9226745Z     ^[[90m1226|^[[39m     expect(runtime.diagnostics.entries).toEqual(batches[0]?.diagnostic…
quality (node 24)	Run npm test	2026-09-06T05:39:37.9227083Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9227384Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/8]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9227668Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9228662Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mcounts a thrown undefined as a settle failure and permits a later commit
quality (node 24)	Run npm test	2026-09-06T05:39:37.9230070Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'hero/hand' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9230654Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9230820Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9231193Z "hero/hand"
quality (node 24)	Run npm test	2026-09-06T05:39:37.9231557Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9231800Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9232208Z undefined
quality (node 24)	Run npm test	2026-09-06T05:39:37.9232409Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9232923Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1244:58^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9233692Z     ^[[90m1242|^[[39m     ^[[34mexpect^[[39m(caught)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9234557Z     ^[[90m1243|^[[39m     ^[[34mexpect^[[39m(observed)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9235328Z     ^[[90m1244|^[[39m     expect(runtime.graph.registry.get(ADDED_ID)?.nodeId).toBe(ADDED_ID…
quality (node 24)	Run npm test	2026-09-06T05:39:37.9236072Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9236949Z     ^[[90m1245|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39minstanceCount)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9237991Z     ^[[90m1246|^[[39m     ^[[35mconst^[[39m next ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34maddTrack^[[39m({ id^[[33m:^[[39m ^[[32m"second"^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9238574Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9238855Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/8]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9239116Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9239703Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m185 passed^[[39m^[[22m^[[90m (186)^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9240807Z ^[[2m      Tests ^[[22m ^[[1m^[[31m8 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m970 passed^[[39m^[[22m^[[90m (978)^[[39m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9241872Z ^[[2m   Start at ^[[22m 05:39:19
quality (node 24)	Run npm test	2026-09-06T05:39:37.9242673Z ^[[2m   Duration ^[[22m 17.99s^[[2m (transform 2.92s, setup 1.09s, import 10.34s, tests 13.16s, environment 23ms)^[[22m
quality (node 24)	Run npm test	2026-09-06T05:39:37.9243083Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9243090Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9264400Z ##[error]AssertionError: expected +0 to be 1 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 1
quality (node 24)	Run npm test	+ 0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:982:35
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:39:37.9272276Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9274770Z ##[error]AssertionError: expected [ Error: host cause ] to have a length of 3 but got 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 3
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1015:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:39:37.9276125Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9278161Z ##[error]AssertionError: expected [] to have a length of 1 but got +0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 1
quality (node 24)	Run npm test	+ 0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1055:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:39:37.9279206Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9282637Z ##[error]AssertionError: expected [ 'dispose hero/arm' ] to deeply equal [ 'dispose hero/arm', …(2) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "dispose hero/arm",
quality (node 24)	Run npm test	-   "motion-remove hero/arm",
quality (node 24)	Run npm test	-   "motion-destroy hero",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1077:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:39:37.9284627Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9286874Z ##[error]AssertionError: expected Error: registration failed to be an instance of AggregateError
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1135:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:39:37.9288457Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9291366Z ##[error]AssertionError: expected [] to deeply equal [ 'hero/hand', '~/second' ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- [
quality (node 24)	Run npm test	-   "hero/hand",
quality (node 24)	Run npm test	-   "~/second",
quality (node 24)	Run npm test	- ]
quality (node 24)	Run npm test	+ []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1201:25
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:39:37.9293232Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9295729Z ##[error]AssertionError: expected [] to have a length of 1 but got +0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 1
quality (node 24)	Run npm test	+ 0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1224:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:39:37.9297315Z 
quality (node 24)	Run npm test	2026-09-06T05:39:37.9300020Z ##[error]AssertionError: expected undefined to be 'hero/hand' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"hero/hand"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1244:58
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:39:37.9634824Z ##[error]Process completed with exit code 1.
```
