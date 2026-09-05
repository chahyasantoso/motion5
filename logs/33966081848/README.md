# CI log archive: 33966081848

- Workflow: CI
- Conclusion: failure
- Head branch: fix/310-callback-reentrancy-rung
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33966081848
- Captured: 2026-09-05T12:28:20Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-05T12:27:45.6321372Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-05T12:27:45.6321805Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-05T12:27:45.6345568Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-05T12:27:45.6345995Z env:
quality (node 24)	Run npm test	2026-09-05T12:27:45.6346266Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-05T12:27:45.6346643Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-05T12:27:45.8533170Z 
quality (node 24)	Run npm test	2026-09-05T12:27:46.1312157Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-05T12:27:46.1312848Z > vitest run
quality (node 24)	Run npm test	2026-09-05T12:27:46.1313131Z 
quality (node 24)	Run npm test	2026-09-05T12:27:46.1313146Z 
quality (node 24)	Run npm test	2026-09-05T12:27:46.1314890Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.1315729Z 
quality (node 24)	Run npm test	2026-09-05T12:27:46.4738148Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7064446Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7707593Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7709578Z      ^[[32m✓^[[39m RA-1 creates the Motion before the graph is asked and destroys it on refusal^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7711424Z      ^[[32m✓^[[39m RA-2 reports a createMotion failure verbatim and rolls nothing back^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7713015Z      ^[[32m✓^[[39m RA-3 compiles a new Track, then registers it with its Motion, then mounts it^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7714666Z      ^[[32m✓^[[39m RA-4 disposes the compiled Track and registers nothing when the graph refuses^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7716185Z      ^[[32m✓^[[39m RA-5 drops the entry before the removal hooks run, and runs them in order^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7717683Z      ^[[32m✓^[[39m RA-6 refuses a Motion that still owns tracks and reaches no hook^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7719037Z      ^[[32m✓^[[39m RA-7 leaves the retained definitions and the committed graph agreeing^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7720616Z      ^[[32m✓^[[39m RA-114 refuses the commit a hook disposed, rolls it back, then tears down once^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7722545Z      ^[[32m✓^[[39m RA-115 keeps a hook's own failure ahead of the disposal it also asked for^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7724050Z      ^[[32m✓^[[39m RA-116 answers as disposed from the call rather than from the teardown^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7725520Z      ^[[32m✓^[[39m RA-117 finishes the settle steps a settle hook disposed through, and skips the flush^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7726911Z      ^[[32m✓^[[39m RA-118 refuses a structural entry point re-entered from inside a commit's effects^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7728352Z      ^[[32m✓^[[39m RA-119 leaves the calling commit whole when its hook keeps the refusal to itself^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7729680Z      ^[[32m✓^[[39m RA-120 refuses a removal of the node the commit it re-entered is replacing^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7762688Z      ^[[32m✓^[[39m RA-121 refuses a re-entry from a settle step, and finishes the phase it interrupted^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7764680Z      ^[[32m✓^[[39m RA-122 leaves a hook's reads answering, and its commit accepted once the commit returned^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7766509Z ^[[31m     ^[[31m×^[[31m RA-134 refuses a mount of the node the commit is adding, so its settle step still owns it^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.7768302Z      ^[[32m✓^[[39m RA-135 leaves a hook's reads answering, and publishes the commit's own flush exactly once^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.8920838Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-05T12:27:46.8962688Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T12:27:46.8991887Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T12:27:46.8992788Z 
quality (node 24)	Run npm test	2026-09-05T12:27:46.9012152Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T12:27:46.9013121Z 
quality (node 24)	Run npm test	2026-09-05T12:27:46.9013699Z act(() => {
quality (node 24)	Run npm test	2026-09-05T12:27:46.9014425Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T12:27:46.9015169Z });
quality (node 24)	Run npm test	2026-09-05T12:27:46.9015818Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T12:27:46.9016344Z 
quality (node 24)	Run npm test	2026-09-05T12:27:46.9017464Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T12:27:46.9018459Z 
quality (node 24)	Run npm test	2026-09-05T12:27:46.9109414Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 98^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:46.9730221Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.0482991Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.2056046Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.2365338Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.2729454Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.4587710Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.5117163Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.5431632Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7222318Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7225004Z      ^[[32m✓^[[39m RA-8 publishes the observing node when addObserve commits, with no tick^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7226982Z      ^[[32m✓^[[39m RA-9 lands a new node on blocked when its source has published nothing^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7228586Z      ^[[32m✓^[[39m RA-10 seeds no flush for a commit that derives no node^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7230018Z      ^[[32m✓^[[39m RA-11 seeds exactly one flush per structural commit, and none for a no-op^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7231445Z      ^[[32m✓^[[39m RA-12 seeds no flush when the graph refuses the candidate^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7232812Z      ^[[32m✓^[[39m RA-13 publishes no patch for a commit that changed no composed value^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7234851Z ^[[31m     ^[[31m×^[[31m RA-131 refuses an invalidate a commit's own hook asks for, and keeps its own flush^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7236516Z ^[[31m     ^[[31m×^[[31m RA-132 refuses a seek from a stageTrack hook, so the displaced Track is never re-seeked^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7238152Z ^[[31m     ^[[31m×^[[31m RA-133 refuses a seed for the node the commit is adding, and publishes that node anyway^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7272146Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.7942286Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.9586210Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:47.9724603Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.1764061Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.1771482Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.4285577Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.4603395Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.6617590Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.7071064Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.8420233Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 851^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.8602628Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:48.9872531Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.1014318Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.2209005Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.2325170Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.3597001Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.4169003Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.4622346Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.5850828Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.6486167Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 108^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.6901383Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.7990735Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.8620057Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:49.8682617Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.0633409Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.0709485Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.1723657Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.2894583Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.3545893Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.4012204Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.5323106Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.5486305Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.6282610Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.7354268Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.7558860Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.9011709Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.9508728Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:50.9616893Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.1156734Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.1265795Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.2182958Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.2807173Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.3656751Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.4152738Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.5092413Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.5932921Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.6073666Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.6990025Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.7982384Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.8643992Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:51.9273220Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.0239479Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.0534405Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.1172577Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.2306342Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.2372510Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.3082777Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.4589742Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.5223258Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.7318710Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.7368473Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.9333496Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:52.9526280Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:53.1376254Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:53.2789400Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:53.3703353Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:53.5295970Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:53.6593150Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:53.8143197Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:53.8812702Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:54.1026152Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:54.1582739Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:54.3643112Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:54.5058899Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:54.5773104Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:54.7145323Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:54.7927496Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.0009560Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.0176590Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.0311947Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2609^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.0314359Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2606^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.1973255Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.2102204Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.2560066Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.3743033Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.4719332Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.4947627Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.6109836Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.6979909Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.6982753Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.7713076Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.8863266Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:55.9490882Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.0158637Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.0552753Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.1491429Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.1972550Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.3499561Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.3901523Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.5632948Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.5988399Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.8008645Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:56.8112607Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.0260024Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.0755151Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.1837046Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.3610679Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.4327604Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.6252417Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.7074727Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.8973175Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:57.9114609Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:58.1568377Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:58.1872591Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:58.3852880Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:58.4130648Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:58.6303237Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:58.7233023Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-05T12:27:58.7262341Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T12:27:58.7285702Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T12:27:58.7311015Z 
quality (node 24)	Run npm test	2026-09-05T12:27:58.7311944Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T12:27:58.7312643Z 
quality (node 24)	Run npm test	2026-09-05T12:27:58.7313208Z act(() => {
quality (node 24)	Run npm test	2026-09-05T12:27:58.7313809Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T12:27:58.7371451Z });
quality (node 24)	Run npm test	2026-09-05T12:27:58.7401598Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T12:27:58.7417212Z 
quality (node 24)	Run npm test	2026-09-05T12:27:58.7418380Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:58.7420062Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T12:27:58.7424717Z 
quality (node 24)	Run npm test	2026-09-05T12:27:58.7426077Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-05T12:27:58.7428151Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T12:27:58.7431317Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T12:27:58.7431826Z 
quality (node 24)	Run npm test	2026-09-05T12:27:58.7432572Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T12:27:58.7433359Z 
quality (node 24)	Run npm test	2026-09-05T12:27:58.7433664Z act(() => {
quality (node 24)	Run npm test	2026-09-05T12:27:58.7434146Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T12:27:58.7434771Z });
quality (node 24)	Run npm test	2026-09-05T12:27:58.7435286Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T12:27:58.7435679Z 
quality (node 24)	Run npm test	2026-09-05T12:27:58.7436518Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T12:27:58.7437281Z 
quality (node 24)	Run npm test	2026-09-05T12:27:58.8133324Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:58.9129793Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.0252560Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.1236147Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.2302521Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.3290945Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.5113803Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.5433098Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.7329237Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.8083177Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:27:59.9062520Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.0332927Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.1157054Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.2632338Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.2782889Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.4329050Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.4658109Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.6092821Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.6835459Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.7982899Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:00.8933961Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.0119594Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.1386231Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-05T12:28:01.1412467Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T12:28:01.1471842Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T12:28:01.1473632Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.1479236Z 
quality (node 24)	Run npm test	2026-09-05T12:28:01.1501779Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T12:28:01.1563312Z 
quality (node 24)	Run npm test	2026-09-05T12:28:01.1591273Z act(() => {
quality (node 24)	Run npm test	2026-09-05T12:28:01.1651564Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T12:28:01.1681179Z });
quality (node 24)	Run npm test	2026-09-05T12:28:01.1698088Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T12:28:01.1698985Z 
quality (node 24)	Run npm test	2026-09-05T12:28:01.1700242Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T12:28:01.1701566Z 
quality (node 24)	Run npm test	2026-09-05T12:28:01.2314051Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.3347755Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.4448441Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.5278829Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.6353470Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.6954782Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 5492^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.6956700Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1475^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.6958016Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1431^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.7337073Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.8176729Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.8872546Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.9894114Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:01.9947040Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.0741127Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.1552275Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.1658843Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.2774702Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.3296726Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.3595835Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.4570871Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.5027096Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.5167674Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.6206194Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.6693727Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.6857457Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.7822593Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.8371644Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.8796508Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:02.9970044Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.0484008Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.0626612Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2080929Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2086177Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2279714Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2346281Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2347560Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 4 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2348350Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2351405Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-flush.test.ts^[[2m > ^[[22ma structural commit ends at one flush^[[2m > ^[[22mRA-131 refuses an invalidate a commit's own hook asks for, and keeps its own flush
quality (node 24)	Run npm test	2026-09-05T12:28:03.2355887Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'compile hero/hand', …(1) ] to deeply equal [ 'compile hero/hand', …(1) ]^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2356518Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2356757Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2357298Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2357495Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2357702Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2358150Z ^[[2m    "compile hero/hand",^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2359425Z ^[[32m-   "intrusion schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2360550Z ^[[31m+   "intrusion accepted",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2361061Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2361230Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2361809Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-flush.test.ts:^[[2m306:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2401025Z     ^[[90m304|^[[39m     runtime^[[33m.^[[39m^[[34maddTrack^[[39m({ id^[[33m:^[[39m ^[[32m"hand"^[[39m }^[[33m,^[[39m { motionId^[[33m:^[[39m ^[[33mMOTION_ID^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2402373Z     ^[[90m305|^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2403306Z     ^[[90m306|^[[39m     expect(rig.entries).toEqual(["compile hero/hand", `intrusion ${REE…
quality (node 24)	Run npm test	2026-09-05T12:28:03.2404247Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2404964Z     ^[[90m307|^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2405902Z     ^[[90m308|^[[39m     // One flush per structural commit, pinned from inside the commit …
quality (node 24)	Run npm test	2026-09-05T12:28:03.2406800Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2407222Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2407621Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2409306Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-flush.test.ts^[[2m > ^[[22ma structural commit ends at one flush^[[2m > ^[[22mRA-132 refuses a seek from a stageTrack hook, so the displaced Track is never re-seeked
quality (node 24)	Run npm test	2026-09-05T12:28:03.2411550Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'stage hero/arm', …(3) ] to deeply equal [ 'stage hero/arm', …(2) ]^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2412291Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2412576Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2413118Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2413401Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2413585Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2414125Z ^[[2m    "stage hero/arm",^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2415392Z ^[[32m-   "intrusion schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2416632Z ^[[31m+   "progress hero/arm 0.5",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2417319Z ^[[31m+   "intrusion accepted",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2417809Z ^[[2m    "stage-commit hero/arm",^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2418152Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2418376Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2418890Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-flush.test.ts:^[[2m335:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2419665Z     ^[[90m333|^[[39m     // is replacing and publishes the displaced values. After the slic…
quality (node 24)	Run npm test	2026-09-05T12:28:03.2420292Z     ^[[90m334|^[[39m     ^[[90m// the stage and its commit.^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2421124Z     ^[[90m335|^[[39m     ^[[34mexpect^[[39m(rig^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoEqual^[[39m([
quality (node 24)	Run npm test	2026-09-05T12:28:03.2421676Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2422226Z     ^[[90m336|^[[39m       ^[[32m"stage hero/arm"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2422860Z     ^[[90m337|^[[39m       ^[[32m`intrusion ^[[39m^[[36m${^[[39m^[[33mREENTRANT^[[39m^[[36m}^[[39m^[[32m`^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2423271Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2423575Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2423946Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2425542Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-flush.test.ts^[[2m > ^[[22ma structural commit ends at one flush^[[2m > ^[[22mRA-133 refuses a seed for the node the commit is adding, and publishes that node anyway
quality (node 24)	Run npm test	2026-09-05T12:28:03.2427574Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'compile hero/hand', …(1) ] to deeply equal [ 'compile hero/hand', …(1) ]^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2428277Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2428583Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2429095Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2429389Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2429577Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2430125Z ^[[2m    "compile hero/hand",^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2431689Z ^[[32m-   "intrusion schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2432803Z ^[[31m+   "intrusion accepted",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2433693Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2433904Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2434723Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-flush.test.ts:^[[2m362:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2435894Z     ^[[90m360|^[[39m     // is asked to walk a node it cannot find: harmless by ADR-051's a…
quality (node 24)	Run npm test	2026-09-05T12:28:03.2437056Z     ^[[90m361|^[[39m     // batch. Refused by the same one condition, which does not read t…
quality (node 24)	Run npm test	2026-09-05T12:28:03.2438137Z     ^[[90m362|^[[39m     expect(rig.entries).toEqual(["compile hero/hand", `intrusion ${REE…
quality (node 24)	Run npm test	2026-09-05T12:28:03.2439048Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2440221Z     ^[[90m363|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mgraph^[[33m.^[[39msequence)^[[33m.^[[39m^[[34mtoBe^[[39m(before ^[[33m+^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2441450Z     ^[[90m364|^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2441778Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2442213Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2442778Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2444572Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/structural-commit-path.test.ts^[[2m > ^[[22ma structural change runs one transaction, in one order^[[2m > ^[[22mRA-134 refuses a mount of the node the commit is adding, so its settle step still owns it
quality (node 24)	Run npm test	2026-09-05T12:28:03.2446808Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'compile hero/hand', …(2) ] to deeply equal [ 'compile hero/hand', …(2) ]^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2447427Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2447697Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2448267Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2448537Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2448768Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2449314Z ^[[2m    "compile hero/hand",^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2450854Z ^[[32m-   "reentry schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2452077Z ^[[31m+   "reentry Unknown graph node \"hero/hand\".",^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2452921Z ^[[2m    "motion-add hero/hand undefined",^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2453672Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2453862Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2454673Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/structural-commit-path.test.ts:^[[2m850:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2469831Z     ^[[90m848|^[[39m     ^[[34mexpect^[[39m(outcome^[[33m.^[[39mthrown)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2476220Z     ^[[90m849|^[[39m     ^[[34mexpect^[[39m(outcome^[[33m.^[[39mvalue^[[33m?.^[[39mlive)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2477834Z     ^[[90m850|^[[39m     ^[[34mexpect^[[39m(journal^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoEqual^[[39m([
quality (node 24)	Run npm test	2026-09-05T12:28:03.2478859Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2479852Z     ^[[90m851|^[[39m       ^[[32m"compile hero/hand"^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2481115Z     ^[[90m852|^[[39m       ^[[32m`reentry ^[[39m^[[36m${^[[39m^[[33mREENTRANT^[[39m^[[36m}^[[39m^[[32m`^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2481790Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2482330Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2482763Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2482789Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2484300Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m184 passed^[[39m^[[22m^[[90m (186)^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2494077Z ^[[2m      Tests ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m960 passed^[[39m^[[22m^[[90m (964)^[[39m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2495190Z ^[[2m   Start at ^[[22m 12:27:46
quality (node 24)	Run npm test	2026-09-05T12:28:03.2497725Z ^[[2m   Duration ^[[22m 17.07s^[[2m (transform 2.40s, setup 1.09s, import 9.59s, tests 12.32s, environment 20ms)^[[22m
quality (node 24)	Run npm test	2026-09-05T12:28:03.2499869Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2521865Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2553450Z ##[error]AssertionError: expected [ 'compile hero/hand', …(1) ] to deeply equal [ 'compile hero/hand', …(1) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "compile hero/hand",
quality (node 24)	Run npm test	-   "intrusion schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",
quality (node 24)	Run npm test	+   "intrusion accepted",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-flush.test.ts:306:25
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T12:28:03.2565815Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2571707Z ##[error]AssertionError: expected [ 'stage hero/arm', …(3) ] to deeply equal [ 'stage hero/arm', …(2) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "stage hero/arm",
quality (node 24)	Run npm test	-   "intrusion schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",
quality (node 24)	Run npm test	+   "progress hero/arm 0.5",
quality (node 24)	Run npm test	+   "intrusion accepted",
quality (node 24)	Run npm test	    "stage-commit hero/arm",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-flush.test.ts:335:25
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T12:28:03.2574515Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2579082Z ##[error]AssertionError: expected [ 'compile hero/hand', …(1) ] to deeply equal [ 'compile hero/hand', …(1) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "compile hero/hand",
quality (node 24)	Run npm test	-   "intrusion schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",
quality (node 24)	Run npm test	+   "intrusion accepted",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-flush.test.ts:362:25
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T12:28:03.2581946Z 
quality (node 24)	Run npm test	2026-09-05T12:28:03.2586763Z ##[error]AssertionError: expected [ 'compile hero/hand', …(2) ] to deeply equal [ 'compile hero/hand', …(2) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "compile hero/hand",
quality (node 24)	Run npm test	-   "reentry schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",
quality (node 24)	Run npm test	+   "reentry Unknown graph node \"hero/hand\".",
quality (node 24)	Run npm test	    "motion-add hero/hand undefined",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/structural-commit-path.test.ts:850:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T12:28:03.2920939Z ##[error]Process completed with exit code 1.
```
