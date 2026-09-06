# CI log archive: 34035494828

- Workflow: CI
- Conclusion: failure
- Head branch: chore/328-02-observable-outcomes
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/34035494828
- Captured: 2026-09-06T13:15:58Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-06T13:15:15.8762208Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-06T13:15:15.8762521Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-06T13:15:15.8798999Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-06T13:15:15.8799280Z env:
quality (node 24)	Run npm test	2026-09-06T13:15:15.8799493Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-06T13:15:15.8799713Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-06T13:15:15.9847255Z 
quality (node 24)	Run npm test	2026-09-06T13:15:15.9847668Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-06T13:15:15.9848188Z > vitest run
quality (node 24)	Run npm test	2026-09-06T13:15:15.9848354Z 
quality (node 24)	Run npm test	2026-09-06T13:15:16.2909534Z 
quality (node 24)	Run npm test	2026-09-06T13:15:16.2914068Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:16.2915076Z 
quality (node 24)	Run npm test	2026-09-06T13:15:16.6570448Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:17.0446975Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 59^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:17.0486607Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m40 tests^[[22m^[[2m)^[[22m^[[32m 56^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:17.3563625Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:17.5479318Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-06T13:15:17.5482729Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T13:15:17.5511045Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T13:15:17.5540587Z 
quality (node 24)	Run npm test	2026-09-06T13:15:17.5568433Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T13:15:17.5569119Z 
quality (node 24)	Run npm test	2026-09-06T13:15:17.5569315Z act(() => {
quality (node 24)	Run npm test	2026-09-06T13:15:17.5569792Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T13:15:17.5570573Z });
quality (node 24)	Run npm test	2026-09-06T13:15:17.5570997Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T13:15:17.5571384Z 
quality (node 24)	Run npm test	2026-09-06T13:15:17.5572477Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T13:15:17.5573455Z 
quality (node 24)	Run npm test	2026-09-06T13:15:17.5732331Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 143^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:17.7212263Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 343^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:17.8322607Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:17.9570099Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:18.2071488Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:18.5348996Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 162^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:18.8010772Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:19.0868527Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:19.3608180Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:19.6493516Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:19.9215202Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:20.1692661Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.6068905Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[33m 2827^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.6070909Z      ^[[33m^[[2m✓^[[22m^[[39m LF-16 leaves no authored schema in the repository on the retired form ^[[33m 2697^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.7069170Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m35 tests^[[22m^[[2m)^[[22m^[[33m 4120^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.7081554Z      ^[[33m^[[2m✓^[[22m^[[39m AE-21: refuses absent or unsupported protocol versions ^[[33m 313^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.7083202Z      ^[[33m^[[2m✓^[[22m^[[39m AE-24: requires exactly one original blob precondition per distinct path ^[[33m 312^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.7084835Z      ^[[33m^[[2m✓^[[22m^[[39m AE-26: rejects every supported CI-skip spelling including mixed case ^[[33m 490^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.7086639Z      ^[[33m^[[2m✓^[[22m^[[39m AE-27: control characters cannot inject workflow outputs through the subject ^[[33m 333^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.7088436Z      ^[[33m^[[2m✓^[[22m^[[39m AE-28: canonical paths reject traversal and line-oriented argument ambiguity ^[[33m 503^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.8599732Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9430371Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9526666Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/automation-adapters.test.ts ^[[2m(^[[22m^[[2m21 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[33m 1554^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9529814Z ^[[31m     ^[[31m×^[[31m AE-70: workflow configuration separates candidate execution and writer credentials^[[39m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9532263Z      ^[[32m✓^[[39m AE-71: retained diagnostic markup cannot inject a comment^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9534203Z      ^[[32m✓^[[39m AE-65: concrete API client accepts compare syntax but refuses traversal^[[32m 90^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9536280Z      ^[[33m^[[2m✓^[[22m^[[39m AE-66: real candidate preparation ignores branch executable configuration ^[[33m 357^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9538247Z      ^[[32m✓^[[39m AE-67: concrete evidence storage is idempotent and refuses history replacement^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9540378Z      ^[[32m✓^[[39m AE-68: early adapter failure has durable fallback without a parsed request^[[32m 61^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9542295Z      ^[[32m✓^[[39m AE-69: recovery retains ambiguous intent without claiming or replaying publication^[[32m 59^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9544147Z      ^[[32m✓^[[39m AE-51: durable evidence precedes a failed comment and retry does not replay edits^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9546905Z      ^[[32m✓^[[39m AE-52: stale completion retains evidence without replacing a current summary^[[32m 59^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9548558Z      ^[[32m✓^[[39m AE-53: only the verified bot-owned marker can be updated^[[32m 69^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9550119Z      ^[[32m✓^[[39m AE-54: reruns cannot be overwritten by an older attempt^[[32m 56^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9552221Z      ^[[32m✓^[[39m AE-55: failed or partial candidate preparation never reaches publication^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9554720Z      ^[[32m✓^[[39m AE-56: publication intent is durable before the conditional ref update^[[32m 56^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9556789Z      ^[[32m✓^[[39m AE-57: rejected publication stays unconfirmed without a blind retry^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9558485Z      ^[[32m✓^[[39m AE-58: a lost push response is reconciled against the remote commit^[[32m 71^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9560107Z      ^[[32m✓^[[39m AE-59: retry after publication and report failure never republishes^[[32m 59^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9562429Z      ^[[32m✓^[[39m AE-60: stale branches are refused without force or semantic rebase^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9564124Z      ^[[32m✓^[[39m AE-61: run identity comes from verified repository and workflow metadata^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9565892Z      ^[[32m✓^[[39m AE-62: log retries distinguish unavailable diagnostics from retained output^[[32m 80^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9567667Z      ^[[32m✓^[[39m AE-63: the publisher independently bounds candidate identities and paths^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:21.9569465Z      ^[[32m✓^[[39m AE-64: a persistence failure prevents both comment and publication^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:22.1555520Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:22.2267302Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:22.3922654Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:22.6097071Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 127^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:22.6294698Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:22.9031346Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 82^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:22.9803260Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 163^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:23.1362902Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:23.3764480Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:23.4299763Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 105^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:23.6921054Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:24.0872506Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 157^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:24.0987719Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 177^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:24.3734201Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:24.5876565Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:24.8367365Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 190^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:25.0792822Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:25.1513770Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:25.4262604Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:25.4932397Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:25.6916759Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:25.9953432Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:26.2262428Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:26.4533673Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:26.5612395Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[33m 2334^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:26.5636260Z      ^[[33m^[[2m✓^[[22m^[[39m declares the source helpers in one place and nowhere else ^[[33m 1351^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:26.5638749Z      ^[[33m^[[2m✓^[[22m^[[39m leaves no call to the retired two-bound helper anywhere in the suite ^[[33m 949^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:26.7246380Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:26.8136419Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:26.9641157Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.0713814Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.1804918Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.3174719Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.4470818Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.5562810Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.6534125Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.7460073Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.9002873Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:27.9429539Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.1499090Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.1725239Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.3661572Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/automation-receipt.test.ts ^[[2m(^[[22m^[[2m15 tests^[[22m^[[2m)^[[22m^[[33m 2716^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.3663809Z      ^[[33m^[[2m✓^[[22m^[[39m AE-48: rendering refuses forged outcomes, destinations and unknown fields ^[[33m 366^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.3666297Z      ^[[33m^[[2m✓^[[22m^[[39m AE-40: contradictory commits and malformed identities fail closed ^[[33m 449^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.4371936Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.4652387Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.5815047Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.6724341Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.7032576Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.8296453Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.9139017Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:28.9606440Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.0549683Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.1318500Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.1682773Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.2675946Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.3812347Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.5165811Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.6450673Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.7363315Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:29.9692356Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:30.1723879Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:30.4632490Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 313^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:30.4634591Z      ^[[33m^[[2m✓^[[22m^[[39m RA-107 leaves no consumer holding a second reader of the section ^[[33m 304^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:30.5315642Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:30.7192491Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:30.8630653Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:31.0136890Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:31.1782892Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:31.2631656Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:31.4866974Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:31.5526873Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:31.7191972Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:31.8881074Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:31.9734505Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:32.2182557Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:32.4470962Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:32.6412407Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:32.6640802Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3310^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:32.6642687Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3306^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:32.7542200Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:32.8688242Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:32.8785611Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.0138413Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.0587087Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.1817169Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.2229458Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.3098939Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.4751580Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.4838746Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.5327509Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.6672598Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.7582498Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.7634146Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.9253326Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.9595955Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:33.9883212Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:34.1062395Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:34.2492294Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:34.3782803Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:34.4820694Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:34.6328588Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:34.7232017Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:35.0097132Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:35.2382455Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 68^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:35.2408383Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:35.4902729Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:35.5030538Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:35.8019371Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:35.8073714Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.0067698Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.1159147Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.2949389Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.3962060Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.5698373Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.6284112Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.8044682Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.9633308Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-06T13:15:36.9671592Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T13:15:36.9701023Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T13:15:36.9701524Z 
quality (node 24)	Run npm test	2026-09-06T13:15:36.9702154Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T13:15:36.9702806Z 
quality (node 24)	Run npm test	2026-09-06T13:15:36.9702975Z act(() => {
quality (node 24)	Run npm test	2026-09-06T13:15:36.9703436Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T13:15:36.9703915Z });
quality (node 24)	Run npm test	2026-09-06T13:15:36.9704305Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T13:15:36.9705149Z 
quality (node 24)	Run npm test	2026-09-06T13:15:36.9706234Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T13:15:36.9707189Z 
quality (node 24)	Run npm test	2026-09-06T13:15:36.9852739Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-06T13:15:36.9868827Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T13:15:36.9870902Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:36.9921229Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T13:15:36.9922065Z 
quality (node 24)	Run npm test	2026-09-06T13:15:36.9922894Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T13:15:36.9923524Z 
quality (node 24)	Run npm test	2026-09-06T13:15:36.9923688Z act(() => {
quality (node 24)	Run npm test	2026-09-06T13:15:36.9924167Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T13:15:36.9924637Z });
quality (node 24)	Run npm test	2026-09-06T13:15:36.9925013Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T13:15:36.9925266Z 
quality (node 24)	Run npm test	2026-09-06T13:15:36.9926253Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T13:15:36.9927157Z 
quality (node 24)	Run npm test	2026-09-06T13:15:37.0377583Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:37.2325192Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:37.3025430Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:37.4833718Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:37.5017979Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:37.7110568Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:37.7288346Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:37.9382288Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:37.9522761Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:38.1892286Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:38.2482577Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:38.4580388Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:38.4849339Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:38.6873017Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:38.7733408Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:38.9181967Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:38.9888768Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:39.1275384Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:39.2628050Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:39.3316854Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:39.4481363Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:39.5538203Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:39.7093151Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-06T13:15:39.7095411Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T13:15:39.7102408Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T13:15:39.7106805Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:39.7107685Z 
quality (node 24)	Run npm test	2026-09-06T13:15:39.7122649Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T13:15:39.7123479Z 
quality (node 24)	Run npm test	2026-09-06T13:15:39.7123819Z act(() => {
quality (node 24)	Run npm test	2026-09-06T13:15:39.7124456Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T13:15:39.7125150Z });
quality (node 24)	Run npm test	2026-09-06T13:15:39.7125733Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T13:15:39.7126200Z 
quality (node 24)	Run npm test	2026-09-06T13:15:39.7127413Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T13:15:39.7129635Z 
quality (node 24)	Run npm test	2026-09-06T13:15:39.8069819Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:39.9212044Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.0310399Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.1702409Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.2754855Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.4114387Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.5152323Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.6608255Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.7873502Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6635^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.7875758Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1771^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.7877554Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1742^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:40.8188589Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.0017648Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.0343935Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.2328300Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.2389828Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.2522026Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.4131965Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.4489529Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.5156416Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.6154202Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.6279700Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.6843708Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.8073771Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.8272648Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:41.8755831Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.0055016Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.0296447Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.1239253Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.2542349Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.2683618Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.3672160Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4362270Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4460539Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4515207Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4515736Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4516046Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4519464Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/automation-adapters.test.ts^[[2m > ^[[22mtrusted automation adapters^[[2m > ^[[22mAE-70: workflow configuration separates candidate execution and writer credentials
quality (node 24)	Run npm test	2026-09-06T13:15:42.4526756Z ^[[31m^[[1mAssertionError^[[22m: node:internal/modules/run_main:107
quality (node 24)	Run npm test	2026-09-06T13:15:42.4527459Z     triggerUncaughtException(
quality (node 24)	Run npm test	2026-09-06T13:15:42.4527814Z     ^
quality (node 24)	Run npm test	2026-09-06T13:15:42.4527974Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4528554Z AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
quality (node 24)	Run npm test	2026-09-06T13:15:42.4529103Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4529275Z   assert.ok(candidate.includes("contents: read"))
quality (node 24)	Run npm test	2026-09-06T13:15:42.4529768Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4529991Z     at file:///home/runner/work/motion5/motion5/[eval1]:26:14 {
quality (node 24)	Run npm test	2026-09-06T13:15:42.4530709Z   generatedMessage: true,
quality (node 24)	Run npm test	2026-09-06T13:15:42.4530979Z   code: 'ERR_ASSERTION',
quality (node 24)	Run npm test	2026-09-06T13:15:42.4531219Z   actual: false,
quality (node 24)	Run npm test	2026-09-06T13:15:42.4531424Z   expected: true,
quality (node 24)	Run npm test	2026-09-06T13:15:42.4531643Z   operator: '==',
quality (node 24)	Run npm test	2026-09-06T13:15:42.4531844Z   diff: 'simple'
quality (node 24)	Run npm test	2026-09-06T13:15:42.4532043Z }
quality (node 24)	Run npm test	2026-09-06T13:15:42.4532144Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4532236Z Node.js v24.20.0
quality (node 24)	Run npm test	2026-09-06T13:15:42.4532672Z : expected 1 to be +0 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4532898Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4533032Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4533283Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4533410Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4533511Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4533739Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4533850Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4534392Z ^[[36m ^[[2m❯^[[22m scenario packages/core/test/unit/scripts/automation-adapters.test.ts:^[[2m36:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4557892Z     ^[[90m 34|^[[39m     maxBuffer^[[33m:^[[39m ^[[34m1000000^[[39m^[[33m,^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4558878Z     ^[[90m 35|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4560673Z     ^[[90m 36|^[[39m   ^[[34mexpect^[[39m(result^[[33m.^[[39mstatus^[[33m,^[[39m result^[[33m.^[[39mstderr)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4562068Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4562748Z     ^[[90m 37|^[[39m }
quality (node 24)	Run npm test	2026-09-06T13:15:42.4563208Z     ^[[90m 38|^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4564312Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/scripts/automation-adapters.test.ts:^[[2m41:5^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4565021Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4565504Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4565894Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4566232Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4571234Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m187 passed^[[39m^[[22m^[[90m (188)^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4580702Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m1054 passed^[[39m^[[22m^[[90m (1055)^[[39m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4581483Z ^[[2m   Start at ^[[22m 13:15:16
quality (node 24)	Run npm test	2026-09-06T13:15:42.4583588Z ^[[2m   Duration ^[[22m 26.13s^[[2m (transform 2.78s, setup 1.20s, import 15.87s, tests 28.94s, environment 29ms)^[[22m
quality (node 24)	Run npm test	2026-09-06T13:15:42.4585135Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4607025Z 
quality (node 24)	Run npm test	2026-09-06T13:15:42.4634560Z ##[error]AssertionError: node:internal/modules/run_main:107
quality (node 24)	Run npm test	    triggerUncaughtException(
quality (node 24)	Run npm test	    ^
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  assert.ok(candidate.includes("contents: read"))
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	    at file:///home/runner/work/motion5/motion5/[eval1]:26:14 {
quality (node 24)	Run npm test	  generatedMessage: true,
quality (node 24)	Run npm test	  code: 'ERR_ASSERTION',
quality (node 24)	Run npm test	  actual: false,
quality (node 24)	Run npm test	  expected: true,
quality (node 24)	Run npm test	  operator: '==',
quality (node 24)	Run npm test	  diff: 'simple'
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Node.js v24.20.0
quality (node 24)	Run npm test	: expected 1 to be +0 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ scenario packages/core/test/unit/scripts/automation-adapters.test.ts:36:40
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/automation-adapters.test.ts:41:5
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T13:15:42.5167319Z ##[error]Process completed with exit code 1.
```
