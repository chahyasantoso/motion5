# CI log archive: 34015071263

- Workflow: CI
- Conclusion: failure
- Head branch: fix/312-release-error-boundary
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/34015071263
- Captured: 2026-09-06T05:53:50Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-06T05:53:15.7854749Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-06T05:53:15.7855061Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-06T05:53:15.7892826Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-06T05:53:15.7893100Z env:
quality (node 24)	Run npm test	2026-09-06T05:53:15.7893295Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-06T05:53:15.7893503Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-06T05:53:15.8962856Z 
quality (node 24)	Run npm test	2026-09-06T05:53:15.8963611Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-06T05:53:15.8964151Z > vitest run
quality (node 24)	Run npm test	2026-09-06T05:53:15.8964577Z 
quality (node 24)	Run npm test	2026-09-06T05:53:16.2059914Z 
quality (node 24)	Run npm test	2026-09-06T05:53:16.2077136Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.2077815Z 
quality (node 24)	Run npm test	2026-09-06T05:53:16.6122851Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9390060Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9803580Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m37 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 80^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9806052Z      ^[[32m✓^[[39m RA-1 creates the Motion before the graph is asked and destroys it on refusal^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9807725Z      ^[[32m✓^[[39m RA-2 reports a createMotion failure verbatim and rolls nothing back^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9810689Z      ^[[32m✓^[[39m RA-3 compiles a new Track, then registers it with its Motion, then mounts it^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9812449Z      ^[[32m✓^[[39m RA-4 disposes the compiled Track and registers nothing when the graph refuses^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9814118Z      ^[[32m✓^[[39m RA-5 drops the entry before the removal hooks run, and runs them in order^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9815650Z      ^[[32m✓^[[39m RA-6 refuses a Motion that still owns tracks and reaches no hook^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9817149Z      ^[[32m✓^[[39m RA-7 leaves the retained definitions and the committed graph agreeing^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9818873Z      ^[[32m✓^[[39m RA-114 refuses the commit a hook disposed, rolls it back, then tears down once^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9821042Z      ^[[32m✓^[[39m RA-115 keeps a hook's own failure ahead of the disposal it also asked for^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9822697Z      ^[[32m✓^[[39m RA-116 answers as disposed from the call rather than from the teardown^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9824392Z      ^[[32m✓^[[39m RA-117 finishes the settle steps a settle hook disposed through, and skips the flush^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9826234Z      ^[[32m✓^[[39m RA-118 refuses a structural entry point re-entered from inside a commit's effects^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9828051Z      ^[[32m✓^[[39m RA-119 leaves the calling commit whole when its hook keeps the refusal to itself^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9830289Z      ^[[32m✓^[[39m RA-120 refuses a removal of the node the commit it re-entered is replacing^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9832724Z      ^[[32m✓^[[39m RA-121 refuses a re-entry from a settle step, and finishes the phase it interrupted^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9834320Z      ^[[32m✓^[[39m RA-122 leaves a hook's reads answering, and its commit accepted once the commit returned^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9836024Z      ^[[32m✓^[[39m RA-134 refuses a mount of the node the commit is adding, so its settle step still owns it^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9837737Z      ^[[32m✓^[[39m RA-135 leaves a hook's reads answering, and publishes the commit's own flush exactly once^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9839390Z      ^[[32m✓^[[39m RA-126 mounts and publishes an accepted add even when Motion registration throws^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9841666Z      ^[[32m✓^[[39m RA-127 preserves every settle failure and the later synchronous flush failure in order^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9844045Z      ^[[32m✓^[[39m RA-128 keeps a replacement committed and publishes after its staged commit throws^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9845969Z      ^[[32m✓^[[39m RA-129 deregisters after disposal throws and continues to later Motion cleanup^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9852658Z      ^[[32m✓^[[39m RA-130 leaves a successful settle ordered before its single publication^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9854269Z      ^[[32m✓^[[39m preserves a settle failure when snapshot resolution also throws^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9855664Z      ^[[32m✓^[[39m preserves a lone flush failure including a thrown undefined^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9857050Z      ^[[32m✓^[[39m completes later settle steps after a disposing hook throws and still skips publication^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9858623Z      ^[[32m✓^[[39m records composition diagnostics while preserving the independent settle error^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9860521Z      ^[[32m✓^[[39m counts a thrown undefined as a settle failure and permits a later commit^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9862336Z ^[[31m     ^[[31m×^[[31m RA-140 completes a direct release before reporting its composition failure^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9864013Z ^[[31m     ^[[31m×^[[31m RA-141 keeps the commit refusal ahead of a deferred release failure^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9865605Z ^[[31m     ^[[31m×^[[31m RA-142 preserves a successful commit result when its deferred release fails^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9867256Z ^[[31m     ^[[31m×^[[31m RA-143 completes every graph detach before reporting their failures^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9868629Z      ^[[32m✓^[[39m RA-144 releases cleanly once and records no release diagnostic^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9870297Z      ^[[32m✓^[[39m RA-136 refuses a live write from inside a commit before its seam is reached^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9871927Z      ^[[32m✓^[[39m RA-137 refuses a tier 0 edit from inside a commit that is moving the motions half^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9873652Z      ^[[32m✓^[[39m RA-138 answers the condition that is true rather than an absence that is not^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:16.9875418Z      ^[[32m✓^[[39m RA-139 leaves every write path working outside a commit, and a reading hook untouched^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.0935992Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-06T05:53:17.0939019Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T05:53:17.0943211Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T05:53:17.0965881Z 
quality (node 24)	Run npm test	2026-09-06T05:53:17.0993199Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T05:53:17.1020298Z 
quality (node 24)	Run npm test	2026-09-06T05:53:17.1032616Z act(() => {
quality (node 24)	Run npm test	2026-09-06T05:53:17.1039210Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T05:53:17.1040288Z });
quality (node 24)	Run npm test	2026-09-06T05:53:17.1040934Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T05:53:17.1041447Z 
quality (node 24)	Run npm test	2026-09-06T05:53:17.1042738Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T05:53:17.1044565Z 
quality (node 24)	Run npm test	2026-09-06T05:53:17.1238274Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 125^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.2260704Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.3161275Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 67^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.4599272Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.4726355Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 86^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.6011449Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.7411089Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.8152208Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:17.8803803Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.0132900Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.0675417Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.1715230Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.3073229Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.3446480Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.5533052Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.5871735Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.8592587Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:18.8725187Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.0987436Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.1363129Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.3206540Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.3881362Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 1037^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.4336702Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.5928791Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.7451032Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.8270320Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.8869401Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:19.9854372Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.1028461Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.2376281Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.2961926Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 144^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.3766409Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.4449582Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.5422312Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.5954516Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.7461193Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.8345752Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:20.8943026Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.0521728Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.0713383Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.1736917Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.3148812Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.3233186Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.4170990Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.5398829Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.5878368Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.6942495Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.7802191Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.8013436Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.9150163Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:21.9967167Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.0835111Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.1152062Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.2782700Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.3007288Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.4096894Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.5096333Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.5519238Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.6441562Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.7632796Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.7912909Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:22.8897774Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.0202195Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.0376119Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.1150772Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.2207098Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.2678540Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.3270804Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.4907135Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.5716281Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.7790740Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.7881972Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:23.9960058Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:24.0202074Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:24.2522097Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:24.3665108Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:24.5056993Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:24.6872488Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:24.8472994Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:25.0141243Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:25.1021804Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:25.3544002Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:25.3850225Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:25.6122476Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:25.7632114Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:25.8696023Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.0070717Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.0904411Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.3236756Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.3701581Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.5917054Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.6618416Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.6621263Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3194^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.6623427Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3190^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.7727036Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.8677642Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:26.9769117Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.0638409Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.1237167Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.2149261Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.3307013Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.3344516Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.4611149Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.5752094Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.6229360Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.6502296Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.7835349Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:27.8283783Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:28.0172220Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:28.0551985Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:28.2728300Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:28.3299033Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:28.5408268Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:28.5854302Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:28.7914408Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:28.8956534Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:29.0472002Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:29.1497983Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:29.2791623Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:29.4452151Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:29.5981998Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:29.7333577Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:29.8343369Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:30.0130948Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:30.1558813Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:30.2952442Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:30.4194901Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:30.5552370Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:30.7475269Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-06T05:53:30.7477172Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T05:53:30.7479008Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T05:53:30.7484551Z 
quality (node 24)	Run npm test	2026-09-06T05:53:30.7485476Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T05:53:30.7486447Z 
quality (node 24)	Run npm test	2026-09-06T05:53:30.7511427Z act(() => {
quality (node 24)	Run npm test	2026-09-06T05:53:30.7533455Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T05:53:30.7533992Z });
quality (node 24)	Run npm test	2026-09-06T05:53:30.7548115Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T05:53:30.7548620Z 
quality (node 24)	Run npm test	2026-09-06T05:53:30.7550123Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T05:53:30.7555338Z 
quality (node 24)	Run npm test	2026-09-06T05:53:30.7633033Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-06T05:53:30.7639647Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T05:53:30.7641820Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T05:53:30.7643299Z 
quality (node 24)	Run npm test	2026-09-06T05:53:30.7645805Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T05:53:30.7646709Z 
quality (node 24)	Run npm test	2026-09-06T05:53:30.7647232Z act(() => {
quality (node 24)	Run npm test	2026-09-06T05:53:30.7647904Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T05:53:30.7648644Z });
quality (node 24)	Run npm test	2026-09-06T05:53:30.7649326Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T05:53:30.7650084Z 
quality (node 24)	Run npm test	2026-09-06T05:53:30.7651258Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T05:53:30.7652332Z 
quality (node 24)	Run npm test	2026-09-06T05:53:30.7664891Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:30.7841697Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:30.9881629Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.0097870Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.2192851Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.2302232Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.4528754Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.5006745Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.6907106Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.7331255Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.9792470Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:31.9982180Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:32.2038951Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:32.2272363Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:32.4542074Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:32.5182257Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:32.6567187Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:32.7108748Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:32.8499560Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:32.9915722Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:33.0590944Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:33.1965680Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:33.3056948Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:33.4292948Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-06T05:53:33.4341422Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T05:53:33.4343208Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:33.4390800Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T05:53:33.4457820Z 
quality (node 24)	Run npm test	2026-09-06T05:53:33.4470925Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T05:53:33.4471799Z 
quality (node 24)	Run npm test	2026-09-06T05:53:33.4483489Z act(() => {
quality (node 24)	Run npm test	2026-09-06T05:53:33.4484323Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T05:53:33.4484965Z });
quality (node 24)	Run npm test	2026-09-06T05:53:33.4485386Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T05:53:33.4485668Z 
quality (node 24)	Run npm test	2026-09-06T05:53:33.4486842Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T05:53:33.4487726Z 
quality (node 24)	Run npm test	2026-09-06T05:53:33.5359234Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:33.6870939Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:33.7798391Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:33.9752284Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.0291574Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.2147789Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.2768835Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.4494646Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6607^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.4510360Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1856^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.4520066Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1770^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.4578494Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.5976426Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.6060772Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.7104279Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.8022015Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.8156423Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.9249605Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:34.9876640Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.0819426Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.1269263Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.1871951Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.2859728Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.3008135Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.3822350Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.4691691Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.5200488Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.5872105Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.6764123Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.7602364Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.8494656Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:35.9308704Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0186026Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0389586Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0807394Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0869494Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.0870900Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 4 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0871418Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.0876479Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-140 completes a direct release before reporting its composition failure
quality (node 24)	Run npm test	2026-09-06T05:53:36.0882649Z ^[[31m^[[1mAssertionError^[[22m: expected [] to have a length of 1 but got +0^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0883469Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.0884170Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0884671Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0884906Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.0885107Z ^[[32m- 1^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0885521Z ^[[31m+ 0^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.0885740Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.0886714Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1270:41^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1066945Z     ^[[90m1268|^[[39m     ^[[34mexpect^[[39m(journal^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"composition-dispose"^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1069127Z     ^[[90m1269|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39minstanceCount)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1071650Z     ^[[90m1270|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mdiagnostics^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1073604Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1075199Z     ^[[90m1271|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mdiagnostics^[[33m.^[[39mentries[^[[34m0^[[39m])^[[33m.^[[39m^[[34mtoMatchObject^[[39m({
quality (node 24)	Run npm test	2026-09-06T05:53:36.1076639Z     ^[[90m1272|^[[39m       ruleId^[[33m:^[[39m ^[[32m"project-release-failed"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1077178Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1077638Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1078006Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1080209Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-141 keeps the commit refusal ahead of a deferred release failure
quality (node 24)	Run npm test	2026-09-06T05:53:36.1082279Z ^[[31m^[[1mAssertionError^[[22m: expected 'composition release failed' to be 'ProjectRuntime is disposed.' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1082790Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1083454Z Expected: ^[[32m"^[[7mProjectRuntime is dispos^[[27med^[[7m.^[[27m"^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1084576Z Received: ^[[31m"^[[7mcomposition release fail^[[27med"^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1085047Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1086057Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1288:39^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1087532Z     ^[[90m1286|^[[39m     const thrown = thrownBy(() => runtime.addTrack({ id: "hand" }, { m…
quality (node 24)	Run npm test	2026-09-06T05:53:36.1088409Z     ^[[90m1287|^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1089356Z     ^[[90m1288|^[[39m     expect((thrown as Error).message).toBe("ProjectRuntime is disposed…
quality (node 24)	Run npm test	2026-09-06T05:53:36.1090748Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1091983Z     ^[[90m1289|^[[39m     ^[[34mexpect^[[39m(thrown)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBe^[[39m(failure)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1093783Z     ^[[90m1290|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mdiagnostics^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1094732Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1095666Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1096043Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1098608Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-142 preserves a successful commit result when its deferred release fails
quality (node 24)	Run npm test	2026-09-06T05:53:36.1101322Z ^[[31m^[[1mAssertionError^[[22m: expected Error: composition release failed to be undefined^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1101997Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1102264Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1102672Z undefined
quality (node 24)	Run npm test	2026-09-06T05:53:36.1102883Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1103132Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1103496Z Error {
quality (node 24)	Run npm test	2026-09-06T05:53:36.1103918Z   "message": "composition release failed",
quality (node 24)	Run npm test	2026-09-06T05:53:36.1104395Z }
quality (node 24)	Run npm test	2026-09-06T05:53:36.1104558Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1105452Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1303:28^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1106997Z     ^[[90m1301|^[[39m     const outcome = outcomeOf(() => runtime.addTrack({ id: "hand" }, {…
quality (node 24)	Run npm test	2026-09-06T05:53:36.1107558Z     ^[[90m1302|^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1108620Z     ^[[90m1303|^[[39m     ^[[34mexpect^[[39m(outcome^[[33m.^[[39mthrown)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1109551Z     ^[[90m   |^[[39m                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1111080Z     ^[[90m1304|^[[39m     ^[[34mexpect^[[39m(outcome^[[33m.^[[39mvalue^[[33m?.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[33mADDED_ID^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1112084Z     ^[[90m1305|^[[39m     ^[[34mexpect^[[39m(outcome^[[33m.^[[39mvalue^[[33m?.^[[39mlive)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1112520Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1112787Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1112997Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1114104Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-143 completes every graph detach before reporting their failures
quality (node 24)	Run npm test	2026-09-06T05:53:36.1116750Z ^[[31m^[[1mAssertionError^[[22m: expected Error: first detach failed to be an instance of AggregateError^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1118573Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m1325:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1120572Z     ^[[90m1323|^[[39m     ^[[35mconst^[[39m thrown ^[[33m=^[[39m ^[[34mthrownBy^[[39m(() ^[[33m=>^[[39m runtime^[[33m.^[[39m^[[34mdispose^[[39m())^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1121359Z     ^[[90m1324|^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1121964Z     ^[[90m1325|^[[39m     ^[[34mexpect^[[39m(thrown)^[[33m.^[[39m^[[34mtoBeInstanceOf^[[39m(^[[33mAggregateError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1122549Z     ^[[90m   |^[[39m                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1123407Z     ^[[90m1326|^[[39m     ^[[34mexpect^[[39m((thrown ^[[35mas^[[39m ^[[33mAggregateError^[[39m)^[[33m.^[[39merrors)^[[33m.^[[39m^[[34mtoEqual^[[39m([first^[[33m,^[[39m second])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1125400Z     ^[[90m1327|^[[39m     ^[[34mexpect^[[39m(detached)^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[33mNODE_ID^[[39m^[[33m,^[[39m ^[[32m"~/second"^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1125898Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1126158Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1126378Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1126410Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1126894Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m185 passed^[[39m^[[22m^[[90m (186)^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1128293Z ^[[2m      Tests ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m979 passed^[[39m^[[22m^[[90m (983)^[[39m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1128849Z ^[[2m   Start at ^[[22m 05:53:16
quality (node 24)	Run npm test	2026-09-06T05:53:36.1129521Z ^[[2m   Duration ^[[22m 19.85s^[[2m (transform 2.77s, setup 1.20s, import 10.57s, tests 14.95s, environment 29ms)^[[22m
quality (node 24)	Run npm test	2026-09-06T05:53:36.1130114Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1152598Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1179337Z ##[error]AssertionError: expected [] to have a length of 1 but got +0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 1
quality (node 24)	Run npm test	+ 0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1270:41
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:53:36.1188149Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1191109Z ##[error]AssertionError: expected 'composition release failed' to be 'ProjectRuntime is disposed.' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "ProjectRuntime is disposed."
quality (node 24)	Run npm test	Received: "composition release failed"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1288:39
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:53:36.1192640Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1194787Z ##[error]AssertionError: expected Error: composition release failed to be undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	Error {
quality (node 24)	Run npm test	  "message": "composition release failed",
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1303:28
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:53:36.1196098Z 
quality (node 24)	Run npm test	2026-09-06T05:53:36.1197637Z ##[error]AssertionError: expected Error: first detach failed to be an instance of AggregateError
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:1325:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T05:53:36.1676095Z ##[error]Process completed with exit code 1.
```
