# CI log archive: 33363271700

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-33-motion-driver-edit
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33363271700
- Captured: 2026-08-31T06:13:34Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-31T06:13:04.2301856Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-31T06:13:04.2302281Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-31T06:13:04.2330627Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-31T06:13:04.2331215Z env:
quality (node 24)	Run npm test	2026-08-31T06:13:04.2331598Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-31T06:13:04.2331969Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-31T06:13:04.3304632Z 
quality (node 24)	Run npm test	2026-08-31T06:13:04.3305259Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-31T06:13:04.3305850Z > vitest run
quality (node 24)	Run npm test	2026-08-31T06:13:04.3306137Z 
quality (node 24)	Run npm test	2026-08-31T06:13:04.5921868Z 
quality (node 24)	Run npm test	2026-08-31T06:13:04.5942611Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:04.5943332Z 
quality (node 24)	Run npm test	2026-08-31T06:13:04.9625639Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.0478490Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.1994286Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.3772534Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.3947364Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.4743201Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-31T06:13:05.4780128Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T06:13:05.4811843Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T06:13:05.4841008Z 
quality (node 24)	Run npm test	2026-08-31T06:13:05.4870387Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T06:13:05.4894814Z 
quality (node 24)	Run npm test	2026-08-31T06:13:05.4920423Z act(() => {
quality (node 24)	Run npm test	2026-08-31T06:13:05.4929624Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T06:13:05.4981302Z });
quality (node 24)	Run npm test	2026-08-31T06:13:05.5011433Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T06:13:05.5011806Z 
quality (node 24)	Run npm test	2026-08-31T06:13:05.5042155Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T06:13:05.5070971Z 
quality (node 24)	Run npm test	2026-08-31T06:13:05.5073183Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 105^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.6052597Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.6296733Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.7426912Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.8323855Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.8532579Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:05.9911532Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.1531606Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.1933937Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.2210206Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.2232917Z      ^[[32m✓^[[39m RA-27 answers `definition` on a track handle, and no `track` survives beside it^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.2243400Z      ^[[32m✓^[[39m RA-28 puts both refusals under one abstract base and moves neither message^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.2291975Z      ^[[32m✓^[[39m RA-29 probes without throwing while the resolvers keep refusing by name^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.2319135Z      ^[[32m✓^[[39m RA-30 keys a motion handle on its own token, and the id coming back does not revive it^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.2382422Z      ^[[32m✓^[[39m RA-31 reports the bindings the one reader of the group shape derives, dict entries and all^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.2386890Z ^[[31m     ^[[31m×^[[31m RA-32 refuses on every member of the motion handle, and answers `id` and `live`^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.3597458Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.4070486Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.4661385Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.5930096Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.5940454Z ^[[31m     ^[[31m×^[[31m RA-33 moves the retained trigger and asks the driver layer once, with no graph work^[[39m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.5962640Z ^[[31m     ^[[31m×^[[31m RA-34 moves the retained stagger through its own seam and never touches the trigger^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.5992904Z ^[[31m     ^[[31m×^[[31m RA-35 refuses an invalid trigger before it asks the driver layer anything^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.6022510Z ^[[31m     ^[[31m×^[[31m RA-36 reports the driver layer's own failure and moves nothing when it fails^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.6044337Z ^[[31m     ^[[31m×^[[31m RA-37 tears down none of the tracks the motion owns^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.6062458Z ^[[31m     ^[[31m×^[[31m RA-38 asks the driver layer nothing when the edit changes nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.6450159Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.6769560Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.8391614Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.8552579Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:06.8812347Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 108^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.0512532Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.0572496Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.1523782Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.2502729Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.3515138Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.4265935Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.4402578Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.5560863Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.6322561Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.6365325Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.7217434Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.8135692Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.8542564Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.8681350Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:07.9808422Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.0119228Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.0200592Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.1693424Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.2022386Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.2118721Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.3477371Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.3737207Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.4179252Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.5310183Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.5374169Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.5964513Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.6941786Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.7388035Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.7580084Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.8716057Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.8929513Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:08.9294459Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.0629951Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.0970481Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.2413905Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.2702699Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.3982150Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.4177754Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.5581301Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.6197671Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.7809877Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:09.8754741Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.0162860Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.0838255Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.2486733Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.3062874Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.4605788Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.5953826Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.6540988Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.7692886Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:10.8372520Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.0019606Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.0376097Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.2133270Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.2770945Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.3749990Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.5090406Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2471^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.5102925Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2469^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.5204154Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.5507242Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.7063536Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.7246085Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.7312713Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.8832876Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.8930025Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:11.9252839Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.0619495Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.0796787Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.0965747Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.2318352Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.2446844Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.3926652Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.4324068Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.5905394Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.6312905Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.7925285Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.8262693Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:12.9877429Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.0465983Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.1778184Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.2296673Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.4112955Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.4657959Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.6317111Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.6760338Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.8603001Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:13.8939078Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.0332928Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.0952370Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.2504439Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.2970354Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-31T06:13:14.2972112Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T06:13:14.2973162Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T06:13:14.2973593Z 
quality (node 24)	Run npm test	2026-08-31T06:13:14.2974109Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T06:13:14.2974617Z 
quality (node 24)	Run npm test	2026-08-31T06:13:14.2974829Z act(() => {
quality (node 24)	Run npm test	2026-08-31T06:13:14.2975319Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T06:13:14.2975836Z });
quality (node 24)	Run npm test	2026-08-31T06:13:14.2976247Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T06:13:14.2976533Z 
quality (node 24)	Run npm test	2026-08-31T06:13:14.2977341Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T06:13:14.2978077Z 
quality (node 24)	Run npm test	2026-08-31T06:13:14.3047164Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-31T06:13:14.3048794Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T06:13:14.3054514Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T06:13:14.3054947Z 
quality (node 24)	Run npm test	2026-08-31T06:13:14.3055416Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T06:13:14.3055951Z 
quality (node 24)	Run npm test	2026-08-31T06:13:14.3056255Z act(() => {
quality (node 24)	Run npm test	2026-08-31T06:13:14.3056681Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T06:13:14.3057415Z });
quality (node 24)	Run npm test	2026-08-31T06:13:14.3057850Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T06:13:14.3058162Z 
quality (node 24)	Run npm test	2026-08-31T06:13:14.3058858Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T06:13:14.3063742Z 
quality (node 24)	Run npm test	2026-08-31T06:13:14.3068520Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.4120336Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.4719756Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.5999918Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.6437680Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.7759747Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:14.8762681Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.0172613Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.0322522Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.1903208Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.2354767Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.3737710Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.4182694Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.5645883Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.6070325Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.7000185Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.7538006Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.8543021Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:15.9188617Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.0362896Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.0801627Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.2152720Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.2783146Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-31T06:13:16.2812270Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.2854321Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T06:13:16.2913919Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T06:13:16.2972494Z 
quality (node 24)	Run npm test	2026-08-31T06:13:16.2995921Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T06:13:16.3001518Z 
quality (node 24)	Run npm test	2026-08-31T06:13:16.3001954Z act(() => {
quality (node 24)	Run npm test	2026-08-31T06:13:16.3002534Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T06:13:16.3003147Z });
quality (node 24)	Run npm test	2026-08-31T06:13:16.3003569Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T06:13:16.3004793Z 
quality (node 24)	Run npm test	2026-08-31T06:13:16.3005761Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T06:13:16.3006570Z 
quality (node 24)	Run npm test	2026-08-31T06:13:16.3982440Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.4590344Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.5733319Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.6472554Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.7445832Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.7981514Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.9139859Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.9182900Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 4698^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.9184685Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1251^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.9186025Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1324^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:16.9706092Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.0741965Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.1312720Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.1606199Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.2132370Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.2744442Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.3257371Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.3415812Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.4231211Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.4815621Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.5167605Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.5643865Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.6172661Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.6555809Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.7126153Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.7681333Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.7926079Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.8752227Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.9492389Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:17.9839227Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.0415785Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1309189Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1366238Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1658630Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1703132Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1703830Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 7 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1704182Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1707163Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/handle-base.test.ts^[[2m > ^[[22mone handle base, one definition spelling, and one stale error family^[[2m > ^[[22mRA-32 refuses on every member of the motion handle, and answers `id` and `live`
quality (node 24)	Run npm test	2026-08-31T06:13:18.1711708Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'addTrack', 'definition', …(6) ] to deeply equal [ 'addTrack', 'definition', …(8) ]^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1712172Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1712411Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1712915Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1713153Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1713352Z ^[[33m@@ -2,11 +2,9 @@^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1713682Z ^[[2m    "addTrack",^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1714023Z ^[[2m    "definition",^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1714398Z ^[[2m    "destroy",^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1714700Z ^[[2m    "id",^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1714975Z ^[[2m    "live",^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1715296Z ^[[32m-   "setStagger",^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1715618Z ^[[32m-   "setTrigger",^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1715929Z ^[[2m    "track",^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1716230Z ^[[2m    "trackIds",^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1716551Z ^[[2m    "tryTrack",^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1716827Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1716983Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1717357Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/handle-base.test.ts:^[[2m255:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1757337Z     ^[[90m253|^[[39m     ^[[35mconst^[[39m surface ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m.^[[39m^[[34msort^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1758278Z     ^[[90m254|^[[39m     const declared = [...NON_REFUSING, ...Object.keys(MOTION_MEMBER_AR…
quality (node 24)	Run npm test	2026-08-31T06:13:18.1758965Z     ^[[90m255|^[[39m     ^[[34mexpect^[[39m(surface)^[[33m.^[[39m^[[34mtoEqual^[[39m(declared)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1759701Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1760065Z     ^[[90m256|^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1760535Z     ^[[90m257|^[[39m     handle^[[33m.^[[39m^[[34mdestroy^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1761064Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1761332Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1761554Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1762616Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/motion-driver-edit.test.ts^[[2m > ^[[22ma Motion's driver is editable in place, and that edit reaches no graph^[[2m > ^[[22mRA-33 moves the retained trigger and asks the driver layer once, with no graph work
quality (node 24)	Run npm test	2026-08-31T06:13:18.1763827Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1764791Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m125:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1766134Z     ^[[90m123|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mmotion^[[39m(^[[33mMOTION^[[39m) ^[[35mas^[[39m ^[[33mEditableMotion^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1767059Z     ^[[90m124|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1768585Z     ^[[90m125|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setTrigger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1769614Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1770531Z     ^[[90m126|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setStagger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1771321Z     ^[[90m127|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1772191Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m134:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1772576Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1772900Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1773166Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1774582Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/motion-driver-edit.test.ts^[[2m > ^[[22ma Motion's driver is editable in place, and that edit reaches no graph^[[2m > ^[[22mRA-34 moves the retained stagger through its own seam and never touches the trigger
quality (node 24)	Run npm test	2026-08-31T06:13:18.1776042Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1776793Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m125:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1777703Z     ^[[90m123|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mmotion^[[39m(^[[33mMOTION^[[39m) ^[[35mas^[[39m ^[[33mEditableMotion^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1778771Z     ^[[90m124|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1779506Z     ^[[90m125|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setTrigger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1780014Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1780548Z     ^[[90m126|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setStagger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1781274Z     ^[[90m127|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1781899Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m152:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1782241Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1782501Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1782690Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1783889Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/motion-driver-edit.test.ts^[[2m > ^[[22ma Motion's driver is editable in place, and that edit reaches no graph^[[2m > ^[[22mRA-35 refuses an invalid trigger before it asks the driver layer anything
quality (node 24)	Run npm test	2026-08-31T06:13:18.1785055Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1785828Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m125:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1787178Z     ^[[90m123|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mmotion^[[39m(^[[33mMOTION^[[39m) ^[[35mas^[[39m ^[[33mEditableMotion^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1788491Z     ^[[90m124|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1789425Z     ^[[90m125|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setTrigger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1790327Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1791160Z     ^[[90m126|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setStagger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1791724Z     ^[[90m127|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1792391Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m176:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1792873Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1793112Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1793426Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1794492Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/motion-driver-edit.test.ts^[[2m > ^[[22ma Motion's driver is editable in place, and that edit reaches no graph^[[2m > ^[[22mRA-36 reports the driver layer's own failure and moves nothing when it fails
quality (node 24)	Run npm test	2026-08-31T06:13:18.1795782Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1796659Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m125:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1797556Z     ^[[90m123|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mmotion^[[39m(^[[33mMOTION^[[39m) ^[[35mas^[[39m ^[[33mEditableMotion^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1798813Z     ^[[90m124|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1799669Z     ^[[90m125|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setTrigger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1800314Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1801316Z     ^[[90m126|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setStagger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1802151Z     ^[[90m127|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1803117Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m197:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1803625Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1803980Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1804244Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1805470Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/motion-driver-edit.test.ts^[[2m > ^[[22ma Motion's driver is editable in place, and that edit reaches no graph^[[2m > ^[[22mRA-37 tears down none of the tracks the motion owns
quality (node 24)	Run npm test	2026-08-31T06:13:18.1806639Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1807462Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m125:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1808367Z     ^[[90m123|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mmotion^[[39m(^[[33mMOTION^[[39m) ^[[35mas^[[39m ^[[33mEditableMotion^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1809194Z     ^[[90m124|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1809892Z     ^[[90m125|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setTrigger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1810383Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1811129Z     ^[[90m126|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setStagger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1811932Z     ^[[90m127|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1812749Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m212:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1813274Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1813831Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1814113Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1815314Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/motion-driver-edit.test.ts^[[2m > ^[[22ma Motion's driver is editable in place, and that edit reaches no graph^[[2m > ^[[22mRA-38 asks the driver layer nothing when the edit changes nothing
quality (node 24)	Run npm test	2026-08-31T06:13:18.1816970Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1817818Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m125:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1818957Z     ^[[90m123|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mmotion^[[39m(^[[33mMOTION^[[39m) ^[[35mas^[[39m ^[[33mEditableMotion^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1820114Z     ^[[90m124|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1821354Z     ^[[90m125|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setTrigger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1822177Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1822840Z     ^[[90m126|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setStagger"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1823502Z     ^[[90m127|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1824291Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/motion-driver-edit.test.ts:^[[2m234:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1824620Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1824897Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1825169Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1825191Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1825727Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m166 passed^[[39m^[[22m^[[90m (168)^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1826769Z ^[[2m      Tests ^[[22m ^[[1m^[[31m7 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m815 passed^[[39m^[[22m^[[90m (822)^[[39m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1827524Z ^[[2m   Start at ^[[22m 06:13:04
quality (node 24)	Run npm test	2026-08-31T06:13:18.1828154Z ^[[2m   Duration ^[[22m 13.55s^[[2m (transform 2.00s, setup 823ms, import 7.50s, tests 9.74s, environment 16ms)^[[22m
quality (node 24)	Run npm test	2026-08-31T06:13:18.1828520Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1828527Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1849061Z ##[error]AssertionError: expected [ 'addTrack', 'definition', …(6) ] to deeply equal [ 'addTrack', 'definition', …(8) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	@@ -2,11 +2,9 @@
quality (node 24)	Run npm test	    "addTrack",
quality (node 24)	Run npm test	    "definition",
quality (node 24)	Run npm test	    "destroy",
quality (node 24)	Run npm test	    "id",
quality (node 24)	Run npm test	    "live",
quality (node 24)	Run npm test	-   "setStagger",
quality (node 24)	Run npm test	-   "setTrigger",
quality (node 24)	Run npm test	    "track",
quality (node 24)	Run npm test	    "trackIds",
quality (node 24)	Run npm test	    "tryTrack",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/handle-base.test.ts:255:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T06:13:18.1855871Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1858565Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:125:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/motion-driver-edit.test.ts:134:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T06:13:18.1860066Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1862777Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:125:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/motion-driver-edit.test.ts:152:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T06:13:18.1864325Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1866475Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:125:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/motion-driver-edit.test.ts:176:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T06:13:18.1868104Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1870862Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:125:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/motion-driver-edit.test.ts:197:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T06:13:18.1872630Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1875095Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:125:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/motion-driver-edit.test.ts:212:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T06:13:18.1876944Z 
quality (node 24)	Run npm test	2026-08-31T06:13:18.1879505Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(5) ] to include 'setTrigger'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/motion-driver-edit.test.ts:125:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/motion-driver-edit.test.ts:234:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T06:13:18.2279882Z ##[error]Process completed with exit code 1.
```
