# CI log archive: 33878483636

- Workflow: CI
- Conclusion: failure
- Head branch: fix/298-handle-writes-report-disposal
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33878483636
- Captured: 2026-09-04T13:31:48Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-04T13:31:12.1837506Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-04T13:31:12.1837796Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-04T13:31:12.1877828Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-04T13:31:12.1878115Z env:
quality (node 24)	Run npm test	2026-09-04T13:31:12.1878332Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-04T13:31:12.1878553Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-04T13:31:12.2994415Z 
quality (node 24)	Run npm test	2026-09-04T13:31:12.2994895Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-04T13:31:12.2995346Z > vitest run
quality (node 24)	Run npm test	2026-09-04T13:31:12.2995549Z 
quality (node 24)	Run npm test	2026-09-04T13:31:12.6392282Z 
quality (node 24)	Run npm test	2026-09-04T13:31:12.6397085Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:12.6397751Z 
quality (node 24)	Run npm test	2026-09-04T13:31:12.9911737Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.0911915Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.3518283Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.3882549Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.4754514Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-04T13:31:13.4780490Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-04T13:31:13.4788235Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-04T13:31:13.4789323Z 
quality (node 24)	Run npm test	2026-09-04T13:31:13.4790286Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-04T13:31:13.4791046Z 
quality (node 24)	Run npm test	2026-09-04T13:31:13.4791384Z act(() => {
quality (node 24)	Run npm test	2026-09-04T13:31:13.4791947Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-04T13:31:13.4792526Z });
quality (node 24)	Run npm test	2026-09-04T13:31:13.4793068Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-04T13:31:13.4793495Z 
quality (node 24)	Run npm test	2026-09-04T13:31:13.4794642Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-04T13:31:13.4795666Z 
quality (node 24)	Run npm test	2026-09-04T13:31:13.5001166Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 114^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.6222674Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.6651726Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.8391621Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.8691060Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:13.9101442Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.1051099Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.1285189Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.1690070Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.3474928Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.4752020Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.6218728Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.6240725Z      ^[[32m✓^[[39m RA-27 answers `definition` on a track handle, and no `track` survives beside it^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.6272159Z      ^[[32m✓^[[39m RA-28 puts both refusals under one abstract base and moves neither message^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.6273975Z      ^[[32m✓^[[39m RA-29 probes without throwing while the resolvers keep refusing by name^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.6275763Z      ^[[32m✓^[[39m RA-30 keys a motion handle on its own token, and the id coming back does not revive it^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.6277815Z      ^[[32m✓^[[39m RA-31 reports the bindings the one reader of the group shape derives, dict entries and all^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.6280132Z      ^[[32m✓^[[39m RA-32 refuses on every member of the motion handle, and answers `id` and `live`^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.6282277Z ^[[31m     ^[[31m×^[[31m RA-111 reports the disposal rather than the staleness on every writing member^[[39m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.7425992Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8691637Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8693640Z      ^[[32m✓^[[39m SH-1 refuses on every member of the enumerated public handle surface^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8738903Z      ^[[32m✓^[[39m SH-2 keeps the current message verbatim and carries its stable rule id^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8810711Z      ^[[32m✓^[[39m SH-3 stays a TypeError, so every existing narrowing keeps matching^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8851122Z      ^[[32m✓^[[39m SH-4 answers `live` on both sides of every invalidation and never throws doing it^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8880368Z      ^[[32m✓^[[39m SH-5 lets expected cleanup guard on `live` instead of on try/catch^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8883359Z      ^[[32m✓^[[39m SH-6 leaves the live path exactly as it was^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8910513Z      ^[[32m✓^[[39m SH-7 keeps one token comparison and no branch inside the handle factory^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.8940696Z ^[[31m     ^[[31m×^[[31m SH-8 reports the disposal rather than the staleness on every writing member^[[39m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:14.9963502Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.1038575Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.2603186Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.3831184Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.3941396Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 1103^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.5191705Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 64^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.6483661Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.7751138Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.8160827Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:15.8853433Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.0141687Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.0548495Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.1377772Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.2614431Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.3475196Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 147^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.3941654Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.4656065Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.5501471Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.6126642Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.7481396Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.8213061Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:16.8666723Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.0212081Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.0811096Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.1306665Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.2533175Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.3118835Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.3991540Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.4905666Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.5117601Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.6641415Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.7204247Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.7433619Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.8862949Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:17.9411890Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.0034185Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.0650599Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.1978693Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.2617546Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.2666469Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.4605744Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.4781392Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.5124412Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.6761276Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.7170109Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.7671528Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.9106084Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.9390872Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:18.9696557Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.1323613Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.1329611Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.2008599Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.3716857Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.4495507Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.6232306Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.6951520Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.8411270Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:19.9191742Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:20.0653997Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:20.2801324Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:20.3041048Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:20.5644469Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:20.6189393Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:20.8491988Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:20.8661450Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:21.1421430Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:21.1495762Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:21.3914225Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:21.4925254Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:21.6264383Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:21.7501191Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:21.8781621Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.0561835Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.1246095Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.2428332Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2932^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.2431202Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2929^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.2961150Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.3641595Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.4570699Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.5397756Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.5628510Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.7113746Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.7960326Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.8246591Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.9424300Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:22.9872871Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.0873761Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.1655097Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.2449533Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.2804268Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.3721315Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.4493217Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.5908908Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.6671540Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.8586342Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:23.9359518Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:24.1022321Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:24.1669722Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:24.3212479Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:24.4700603Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:24.5321501Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:24.6990823Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:24.7600808Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:24.9771335Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:25.0559351Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:25.2576285Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:25.2708481Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:25.5301696Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:25.5373678Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:25.7448110Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:25.8004329Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:25.9721077Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:26.1082924Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-04T13:31:26.1139487Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-04T13:31:26.1150100Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-04T13:31:26.1166139Z 
quality (node 24)	Run npm test	2026-09-04T13:31:26.1190407Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-04T13:31:26.1191459Z 
quality (node 24)	Run npm test	2026-09-04T13:31:26.1196407Z act(() => {
quality (node 24)	Run npm test	2026-09-04T13:31:26.1197091Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-04T13:31:26.1197811Z });
quality (node 24)	Run npm test	2026-09-04T13:31:26.1198465Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-04T13:31:26.1198975Z 
quality (node 24)	Run npm test	2026-09-04T13:31:26.1200680Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-04T13:31:26.1215016Z 
quality (node 24)	Run npm test	2026-09-04T13:31:26.1217201Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-04T13:31:26.1219648Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-04T13:31:26.1220927Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-04T13:31:26.1221600Z 
quality (node 24)	Run npm test	2026-09-04T13:31:26.1222356Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-04T13:31:26.1223135Z 
quality (node 24)	Run npm test	2026-09-04T13:31:26.1223478Z act(() => {
quality (node 24)	Run npm test	2026-09-04T13:31:26.1224077Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-04T13:31:26.1224711Z });
quality (node 24)	Run npm test	2026-09-04T13:31:26.1225242Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-04T13:31:26.1225708Z 
quality (node 24)	Run npm test	2026-09-04T13:31:26.1226864Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-04T13:31:26.1227951Z 
quality (node 24)	Run npm test	2026-09-04T13:31:26.1243329Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:26.1977480Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:26.3421689Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:26.4385349Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:26.5804346Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:26.6451516Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:26.8007199Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:26.8596345Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.0253442Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.0834298Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.2969795Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.3694531Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.5158480Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.5898683Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.7814837Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.8105538Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:27.9941348Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:28.0107044Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:28.2003407Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:28.2721661Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:28.3718742Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:28.4922831Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:28.5993829Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:28.7569972Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-04T13:31:28.7597456Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-04T13:31:28.7635606Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-04T13:31:28.7679983Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:28.7700011Z 
quality (node 24)	Run npm test	2026-09-04T13:31:28.7700886Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-04T13:31:28.7703231Z 
quality (node 24)	Run npm test	2026-09-04T13:31:28.7703600Z act(() => {
quality (node 24)	Run npm test	2026-09-04T13:31:28.7736644Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-04T13:31:28.7737592Z });
quality (node 24)	Run npm test	2026-09-04T13:31:28.7738124Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-04T13:31:28.7738879Z 
quality (node 24)	Run npm test	2026-09-04T13:31:28.7742524Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-04T13:31:28.7745829Z 
quality (node 24)	Run npm test	2026-09-04T13:31:28.8881641Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.0177363Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.1211402Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.2502119Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.3381054Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.4611417Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.5631719Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.7082741Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.7561565Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6299^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.7563538Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1676^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.7573895Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1675^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.8536905Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.8802625Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:29.9791937Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.0383576Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.0878533Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.1750165Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.2341524Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.3424630Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.3593649Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.4070923Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.5227595Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.5590679Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.5854315Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.6986742Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.7574883Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.7670990Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.8922616Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:30.9976360Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.0075030Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.1029686Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.1888449Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2282967Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2694930Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2746527Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2747546Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2748046Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2752909Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/handle-base.test.ts^[[2m > ^[[22mone handle base, one definition spelling, and one stale error family^[[2m > ^[[22mRA-111 reports the disposal rather than the staleness on every writing member
quality (node 24)	Run npm test	2026-09-04T13:31:31.2756837Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'addTrack', 'setTrigger', …(2) ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2757418Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2757643Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2758043Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2758255Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2758446Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2758688Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2758952Z ^[[31m+   "addTrack",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2759562Z ^[[31m+   "setTrigger",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2760031Z ^[[31m+   "setStagger",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2760315Z ^[[31m+   "destroy",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2760576Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2760698Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2761159Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/handle-base.test.ts:^[[2m315:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2821425Z     ^[[90m313|^[[39m       )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2822029Z     ^[[90m314|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2822931Z     ^[[90m315|^[[39m     ^[[34mexpect^[[39m(misreported)^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2823801Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2824320Z     ^[[90m316|^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2825100Z     ^[[90m317|^[[39m     // The read half is unchanged, stated rather than implied. `track`…
quality (node 24)	Run npm test	2026-09-04T13:31:31.2825663Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2826093Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2826444Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2828624Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-8 reports the disposal rather than the staleness on every writing member
quality (node 24)	Run npm test	2026-09-04T13:31:31.2831204Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'replace', 'addObserve', …(11) ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2831842Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2832054Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2832490Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2832703Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2832880Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2833236Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2833638Z ^[[31m+   "replace",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2834068Z ^[[31m+   "addObserve",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2834597Z ^[[31m+   "removeObserve",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2835134Z ^[[31m+   "overrideValues",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2835652Z ^[[31m+   "setValues",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2836125Z ^[[31m+   "setRequire",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2836977Z ^[[31m+   "removeRequire",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2837526Z ^[[31m+   "setKeyframeGroup",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2838109Z ^[[31m+   "removeKeyframeGroup",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2838619Z ^[[31m+   "setGoal",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2839238Z ^[[31m+   "removeGoal",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2839722Z ^[[31m+   "setKeyframe",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2840241Z ^[[31m+   "removeKeyframe",^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2840671Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2840870Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2841657Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m327:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2853911Z     ^[[90m325|^[[39m       )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2854682Z     ^[[90m326|^[[39m     })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2855737Z     ^[[90m327|^[[39m     ^[[34mexpect^[[39m(misreported)^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2856751Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2857735Z     ^[[90m328|^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2858752Z     ^[[90m329|^[[39m     // `remove` is the one that was already right, because `#removeTra…
quality (node 24)	Run npm test	2026-09-04T13:31:31.2859519Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2859813Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2860392Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2860896Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2866889Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m183 passed^[[39m^[[22m^[[90m (185)^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2875150Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m937 passed^[[39m^[[22m^[[90m (939)^[[39m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2876457Z ^[[2m   Start at ^[[22m 13:31:12
quality (node 24)	Run npm test	2026-09-04T13:31:31.2878993Z ^[[2m   Duration ^[[22m 18.61s^[[2m (transform 2.60s, setup 1.15s, import 9.94s, tests 13.90s, environment 25ms)^[[22m
quality (node 24)	Run npm test	2026-09-04T13:31:31.2881309Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2905141Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2942398Z ##[error]AssertionError: expected [ 'addTrack', 'setTrigger', …(2) ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "addTrack",
quality (node 24)	Run npm test	+   "setTrigger",
quality (node 24)	Run npm test	+   "setStagger",
quality (node 24)	Run npm test	+   "destroy",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/handle-base.test.ts:315:25
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-04T13:31:31.2952992Z 
quality (node 24)	Run npm test	2026-09-04T13:31:31.2956538Z ##[error]AssertionError: expected [ 'replace', 'addObserve', …(11) ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "replace",
quality (node 24)	Run npm test	+   "addObserve",
quality (node 24)	Run npm test	+   "removeObserve",
quality (node 24)	Run npm test	+   "overrideValues",
quality (node 24)	Run npm test	+   "setValues",
quality (node 24)	Run npm test	+   "setRequire",
quality (node 24)	Run npm test	+   "removeRequire",
quality (node 24)	Run npm test	+   "setKeyframeGroup",
quality (node 24)	Run npm test	+   "removeKeyframeGroup",
quality (node 24)	Run npm test	+   "setGoal",
quality (node 24)	Run npm test	+   "removeGoal",
quality (node 24)	Run npm test	+   "setKeyframe",
quality (node 24)	Run npm test	+   "removeKeyframe",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:327:25
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-04T13:31:31.3451969Z ##[error]Process completed with exit code 1.
```
