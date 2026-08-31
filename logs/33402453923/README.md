# CI log archive: 33402453923

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-69-authored-property-edit
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33402453923
- Captured: 2026-08-31T14:25:32Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-31T14:24:59.2122821Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-31T14:24:59.2123116Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-31T14:24:59.2160756Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-31T14:24:59.2161059Z env:
quality (node 24)	Run npm test	2026-08-31T14:24:59.2161270Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-31T14:24:59.2161491Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-31T14:24:59.3455041Z 
quality (node 24)	Run npm test	2026-08-31T14:24:59.3455868Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-31T14:24:59.3456345Z > vitest run
quality (node 24)	Run npm test	2026-08-31T14:24:59.3456503Z 
quality (node 24)	Run npm test	2026-08-31T14:24:59.6535095Z 
quality (node 24)	Run npm test	2026-08-31T14:24:59.6539585Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-31T14:24:59.6540598Z 
quality (node 24)	Run npm test	2026-08-31T14:25:00.0345097Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.1626498Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.3866103Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.4986941Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m | ^[[22m^[[31m8 failed^[[39m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5013488Z ^[[31m     ^[[31m×^[[31m RA-69 writes a key the group authors as a live value, and never asks the graph^[[39m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5030122Z ^[[31m     ^[[31m×^[[31m RA-70 writes an animated key through the same verb, at the same progress^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5032764Z ^[[31m     ^[[31m×^[[31m RA-71 introduces a leaf the group does not author yet, and compiles it in place^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5034823Z ^[[31m     ^[[31m×^[[31m RA-72 removes a leaf, and leaves behind no shape nothing refuses^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5036917Z ^[[31m     ^[[31m×^[[31m RA-73 refuses a plugin this node authors no group for, and originates nothing^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5039092Z ^[[31m     ^[[31m×^[[31m RA-74 keeps the kind refusal in force, in both directions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5041122Z ^[[31m     ^[[31m×^[[31m RA-75 refuses both verbs by name inside a recipe, and commits nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5043221Z ^[[31m     ^[[31m×^[[31m RA-76 lets the registry refuse a new leaf it claims nothing about^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.5511953Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-31T14:25:00.5514853Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T14:25:00.5516435Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T14:25:00.5517179Z 
quality (node 24)	Run npm test	2026-08-31T14:25:00.5518300Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T14:25:00.5519250Z 
quality (node 24)	Run npm test	2026-08-31T14:25:00.5519819Z act(() => {
quality (node 24)	Run npm test	2026-08-31T14:25:00.5520553Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T14:25:00.5521861Z });
quality (node 24)	Run npm test	2026-08-31T14:25:00.5522512Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T14:25:00.5523029Z 
quality (node 24)	Run npm test	2026-08-31T14:25:00.5524346Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T14:25:00.5525624Z 
quality (node 24)	Run npm test	2026-08-31T14:25:00.5847105Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 131^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.6763423Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.8633146Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.8740092Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 71^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:00.8907959Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.1107958Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.1627411Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.1697896Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.4161603Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.4306040Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.4707054Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.6318693Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.7599584Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:01.8098388Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.0263755Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.0360228Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.0468443Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.2772341Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3072613Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3075310Z ^[[31m     ^[[31m×^[[31m SH-1 refuses on every member of the enumerated public handle surface^[[39m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3077291Z      ^[[32m✓^[[39m SH-2 keeps the current message verbatim and carries its stable rule id^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3079503Z      ^[[32m✓^[[39m SH-3 stays a TypeError, so every existing narrowing keeps matching^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3081174Z      ^[[32m✓^[[39m SH-4 answers `live` on both sides of every invalidation and never throws doing it^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3082738Z      ^[[32m✓^[[39m SH-5 lets expected cleanup guard on `live` instead of on try/catch^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3084491Z      ^[[32m✓^[[39m SH-6 leaves the live path exactly as it was^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3086046Z      ^[[32m✓^[[39m SH-7 keeps one token comparison and no branch inside the handle factory^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.3191157Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.5330630Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.5914867Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.6631511Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 147^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.7800005Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.8186773Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.9060170Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:02.9911558Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.1108008Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.2180083Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.2702022Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.4640288Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.4758447Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.5380338Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.7220056Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.7466828Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.7860030Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:03.9831691Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.0121870Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.0218509Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.2063456Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.2071178Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.2456035Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.4411569Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.4881180Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.5015410Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.7050635Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.7411923Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.7585981Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.9640551Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:04.9821400Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.0027156Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.2030265Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.2233737Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.2309661Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.4320469Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.4432949Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.4691734Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.7056684Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.7160231Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.9473479Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:05.9786824Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:06.1556829Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:06.2179948Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:06.4700361Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:06.5471105Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:06.8187474Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:06.8820600Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:07.1397992Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:07.1550672Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:07.4432651Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:07.4516731Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:07.7161741Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:07.8163829Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:07.9660654Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.0390851Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.2295051Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.3468980Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.4889961Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.5973292Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.8041520Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.8130396Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.8771036Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3240^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:08.8773515Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3237^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.0320106Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.1228209Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.1535719Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.2895155Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.3910415Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.4609907Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.4764956Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.6550091Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.6945041Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.7931260Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.8515442Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.9270179Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:09.9931223Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:10.1860254Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:10.2048515Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:10.4358856Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:10.4736799Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:10.6879410Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:10.7100660Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:10.9508098Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:11.0443016Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:11.2180820Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:11.2810369Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:11.5205199Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:11.6239179Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:11.8280240Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:11.9594058Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:12.1363956Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:12.2470147Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:12.3835780Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:12.4763078Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:12.6710797Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-31T14:25:12.6713265Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T14:25:12.6745114Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T14:25:12.6745959Z 
quality (node 24)	Run npm test	2026-08-31T14:25:12.6746829Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T14:25:12.6747949Z 
quality (node 24)	Run npm test	2026-08-31T14:25:12.6748609Z act(() => {
quality (node 24)	Run npm test	2026-08-31T14:25:12.6758646Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T14:25:12.6759943Z });
quality (node 24)	Run npm test	2026-08-31T14:25:12.6760624Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T14:25:12.6761181Z 
quality (node 24)	Run npm test	2026-08-31T14:25:12.6762475Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T14:25:12.6763755Z 
quality (node 24)	Run npm test	2026-08-31T14:25:12.6859422Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:12.6921605Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-31T14:25:12.6924282Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T14:25:12.6948539Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T14:25:12.6950540Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:12.6972703Z 
quality (node 24)	Run npm test	2026-08-31T14:25:12.6981365Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T14:25:12.6984512Z 
quality (node 24)	Run npm test	2026-08-31T14:25:12.6984929Z act(() => {
quality (node 24)	Run npm test	2026-08-31T14:25:12.6985608Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T14:25:12.6986394Z });
quality (node 24)	Run npm test	2026-08-31T14:25:12.6987168Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T14:25:12.7028577Z 
quality (node 24)	Run npm test	2026-08-31T14:25:12.7029838Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T14:25:12.7030998Z 
quality (node 24)	Run npm test	2026-08-31T14:25:12.9629807Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:12.9976202Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:13.2103325Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:13.2369342Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:13.4497985Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:13.4890096Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:13.6809827Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:13.6875314Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:13.9299938Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:13.9779494Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:14.1752563Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:14.2430150Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:14.4940548Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:14.5126750Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:14.7313110Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:14.7403825Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:14.9965024Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.0399261Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.1982549Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.2179512Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.3927368Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.4623646Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-31T14:25:15.4626234Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T14:25:15.4628015Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T14:25:15.4628811Z 
quality (node 24)	Run npm test	2026-08-31T14:25:15.4629612Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T14:25:15.4630368Z 
quality (node 24)	Run npm test	2026-08-31T14:25:15.4630717Z act(() => {
quality (node 24)	Run npm test	2026-08-31T14:25:15.4631360Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T14:25:15.4632014Z });
quality (node 24)	Run npm test	2026-08-31T14:25:15.4632602Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T14:25:15.4633078Z 
quality (node 24)	Run npm test	2026-08-31T14:25:15.4634287Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T14:25:15.4635400Z 
quality (node 24)	Run npm test	2026-08-31T14:25:15.4661368Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.6310950Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.6600323Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.8790557Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:15.9091257Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:16.1165181Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:16.1409951Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:16.3735471Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:16.4214914Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:16.6530015Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:16.6581799Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:16.8888975Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:16.9069591Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.0456103Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 7001^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.0466626Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1942^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.0472402Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1870^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.0899937Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.1558207Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.2556649Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.3181145Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.3697118Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.4904713Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.5294467Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.5453167Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.6985219Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.7322977Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.7515563Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.9052304Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:17.9519976Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.0063022Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.1510351Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.1934709Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.2529336Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3283447Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3598591Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3659731Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3660751Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 9 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3661096Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3665598Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/keyframe-property-edit.test.ts^[[2m > ^[[22mone authored property, inside a group this node already authors^[[2m > ^[[22mRA-69 writes a key the group authors as a live value, and never asks the graph
quality (node 24)	Run npm test	2026-08-31T14:25:18.3672674Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3674352Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3745810Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m track ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3748510Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(track)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3750090Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3751151Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3752318Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3753670Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m track ^[[35mas^[[39m ^[[33mEdits^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3755195Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m189:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3755946Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3756431Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3757177Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3759703Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/keyframe-property-edit.test.ts^[[2m > ^[[22mone authored property, inside a group this node already authors^[[2m > ^[[22mRA-70 writes an animated key through the same verb, at the same progress
quality (node 24)	Run npm test	2026-08-31T14:25:18.3762397Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3764201Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3765831Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m track ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3767269Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(track)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3770444Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3771540Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3772656Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3774011Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m track ^[[35mas^[[39m ^[[33mEdits^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3775519Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m216:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3776252Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3776732Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3777128Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3779665Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/keyframe-property-edit.test.ts^[[2m > ^[[22mone authored property, inside a group this node already authors^[[2m > ^[[22mRA-71 introduces a leaf the group does not author yet, and compiles it in place
quality (node 24)	Run npm test	2026-08-31T14:25:18.3782314Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3784137Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3785749Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m track ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3787206Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(track)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3788971Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3789946Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3791103Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3808276Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m track ^[[35mas^[[39m ^[[33mEdits^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3809899Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m240:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3810659Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3811090Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3812007Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3814176Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/keyframe-property-edit.test.ts^[[2m > ^[[22mone authored property, inside a group this node already authors^[[2m > ^[[22mRA-72 removes a leaf, and leaves behind no shape nothing refuses
quality (node 24)	Run npm test	2026-08-31T14:25:18.3816647Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3818603Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3820185Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m track ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3821484Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(track)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3822833Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3824066Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3825176Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3826394Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m track ^[[35mas^[[39m ^[[33mEdits^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3828002Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m269:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3828723Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3829144Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3829502Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3831707Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/keyframe-property-edit.test.ts^[[2m > ^[[22mone authored property, inside a group this node already authors^[[2m > ^[[22mRA-73 refuses a plugin this node authors no group for, and originates nothing
quality (node 24)	Run npm test	2026-08-31T14:25:18.3834209Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3835891Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3837387Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m track ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3839233Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(track)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3840645Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3841598Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3842694Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3843921Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m track ^[[35mas^[[39m ^[[33mEdits^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3845299Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m302:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3846021Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3846465Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3846837Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3849081Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/keyframe-property-edit.test.ts^[[2m > ^[[22mone authored property, inside a group this node already authors^[[2m > ^[[22mRA-74 keeps the kind refusal in force, in both directions
quality (node 24)	Run npm test	2026-08-31T14:25:18.3851435Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3853108Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3854585Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m track ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3855960Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(track)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3856933Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3858041Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3858689Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3859378Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m track ^[[35mas^[[39m ^[[33mEdits^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3860165Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m343:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3860811Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3861239Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3861607Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3862863Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/keyframe-property-edit.test.ts^[[2m > ^[[22mone authored property, inside a group this node already authors^[[2m > ^[[22mRA-75 refuses both verbs by name inside a recipe, and commits nothing
quality (node 24)	Run npm test	2026-08-31T14:25:18.3864923Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3865871Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3866698Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m track ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3867465Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(track)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3868466Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3869077Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3870214Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3871796Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m track ^[[35mas^[[39m ^[[33mEdits^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3873278Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m380:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3874039Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3874530Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3874943Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3876333Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/keyframe-property-edit.test.ts^[[2m > ^[[22mone authored property, inside a group this node already authors^[[2m > ^[[22mRA-76 lets the registry refuse a new leaf it claims nothing about
quality (node 24)	Run npm test	2026-08-31T14:25:18.3877980Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3878977Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3879821Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m track ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(nodeId)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3880589Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(track)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3881386Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3881931Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3882541Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeKeyframe"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3883210Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m track ^[[35mas^[[39m ^[[33mEdits^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3883982Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/keyframe-property-edit.test.ts:^[[2m415:17^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3884383Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3884628Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3884835Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3886027Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-1 refuses on every member of the enumerated public handle surface
quality (node 24)	Run npm test	2026-08-31T14:25:18.3887539Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'addObserve', 'definition', …(14) ] to deeply equal [ 'addObserve', 'definition', …(16) ]^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3888453Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3888617Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3888901Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3889041Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3889196Z ^[[33m@@ -4,17 +4,15 @@^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3889721Z ^[[2m    "id",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3890148Z ^[[2m    "live",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3890629Z ^[[2m    "overrideValues",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3890946Z ^[[2m    "remove",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3891223Z ^[[2m    "removeGoal",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3891542Z ^[[32m-   "removeKeyframe",^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3891901Z ^[[2m    "removeKeyframeGroup",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3892446Z ^[[2m    "removeObserve",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3892975Z ^[[2m    "removeRequire",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3893391Z ^[[2m    "replace",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3893821Z ^[[2m    "requires",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3894534Z ^[[2m    "setGoal",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3895034Z ^[[32m-   "setKeyframe",^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3895630Z ^[[2m    "setKeyframeGroup",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3896127Z ^[[2m    "setRequire",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3896590Z ^[[2m    "setValues",^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3897040Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3897254Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3898409Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m144:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3900227Z     ^[[90m142|^[[39m     ^[[35mconst^[[39m surface ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m.^[[39m^[[34msort^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3901765Z     ^[[90m143|^[[39m     const declared = [...NON_REFUSING, ...Object.keys(MEMBER_ARGUMENTS…
quality (node 24)	Run npm test	2026-08-31T14:25:18.3902936Z     ^[[90m144|^[[39m     ^[[34mexpect^[[39m(surface)^[[33m.^[[39m^[[34mtoEqual^[[39m(declared)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3903733Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3904303Z     ^[[90m145|^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3904856Z     ^[[90m146|^[[39m     // Collected rather than asserted one by one, so a red run names e…
quality (node 24)	Run npm test	2026-08-31T14:25:18.3905209Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3905638Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3906006Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3906042Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3906723Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m171 passed^[[39m^[[22m^[[90m (173)^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3908011Z ^[[2m      Tests ^[[22m ^[[1m^[[31m9 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m851 passed^[[39m^[[22m^[[90m (860)^[[39m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3908584Z ^[[2m   Start at ^[[22m 14:24:59
quality (node 24)	Run npm test	2026-08-31T14:25:18.3909485Z ^[[2m   Duration ^[[22m 18.68s^[[2m (transform 2.57s, setup 1.12s, import 10.18s, tests 13.92s, environment 28ms)^[[22m
quality (node 24)	Run npm test	2026-08-31T14:25:18.3910222Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3910234Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3933963Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/keyframe-property-edit.test.ts:189:17
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.3942060Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3944806Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/keyframe-property-edit.test.ts:216:17
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.3946325Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3948878Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/keyframe-property-edit.test.ts:240:17
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.3950357Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3952697Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/keyframe-property-edit.test.ts:269:17
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.3954100Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3956231Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/keyframe-property-edit.test.ts:302:17
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.3958177Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3960459Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/keyframe-property-edit.test.ts:343:17
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.3961826Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3963915Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/keyframe-property-edit.test.ts:380:17
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.3965251Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3967538Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(13) ] to include 'setKeyframe'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/keyframe-property-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/keyframe-property-edit.test.ts:415:17
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.3969400Z 
quality (node 24)	Run npm test	2026-08-31T14:25:18.3975874Z ##[error]AssertionError: expected [ 'addObserve', 'definition', …(14) ] to deeply equal [ 'addObserve', 'definition', …(16) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	@@ -4,17 +4,15 @@
quality (node 24)	Run npm test	    "id",
quality (node 24)	Run npm test	    "live",
quality (node 24)	Run npm test	    "overrideValues",
quality (node 24)	Run npm test	    "remove",
quality (node 24)	Run npm test	    "removeGoal",
quality (node 24)	Run npm test	-   "removeKeyframe",
quality (node 24)	Run npm test	    "removeKeyframeGroup",
quality (node 24)	Run npm test	    "removeObserve",
quality (node 24)	Run npm test	    "removeRequire",
quality (node 24)	Run npm test	    "replace",
quality (node 24)	Run npm test	    "requires",
quality (node 24)	Run npm test	    "setGoal",
quality (node 24)	Run npm test	-   "setKeyframe",
quality (node 24)	Run npm test	    "setKeyframeGroup",
quality (node 24)	Run npm test	    "setRequire",
quality (node 24)	Run npm test	    "setValues",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:144:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T14:25:18.4407161Z ##[error]Process completed with exit code 1.
```
