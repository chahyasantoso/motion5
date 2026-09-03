# CI log archive: 33699672668

- Workflow: CI
- Conclusion: failure
- Head branch: fix/ra-86-one-reverse-topology-owner
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33699672668
- Captured: 2026-09-03T00:29:45Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-03T00:29:07.1180224Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-03T00:29:07.1180507Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-03T00:29:07.1218232Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-03T00:29:07.1218512Z env:
quality (node 24)	Run npm test	2026-09-03T00:29:07.1218716Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-03T00:29:07.1218932Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-03T00:29:07.2232845Z 
quality (node 24)	Run npm test	2026-09-03T00:29:07.2233333Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-03T00:29:07.2233807Z > vitest run
quality (node 24)	Run npm test	2026-09-03T00:29:07.2233960Z 
quality (node 24)	Run npm test	2026-09-03T00:29:07.5228285Z 
quality (node 24)	Run npm test	2026-09-03T00:29:07.5231437Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:07.5232261Z 
quality (node 24)	Run npm test	2026-09-03T00:29:07.8809760Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:07.9970510Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:08.2737406Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:08.3719547Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 74^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:08.4403971Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-03T00:29:08.4428324Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T00:29:08.4429468Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T00:29:08.4429751Z 
quality (node 24)	Run npm test	2026-09-03T00:29:08.4430104Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T00:29:08.4430462Z 
quality (node 24)	Run npm test	2026-09-03T00:29:08.4430557Z act(() => {
quality (node 24)	Run npm test	2026-09-03T00:29:08.4430822Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T00:29:08.4431099Z });
quality (node 24)	Run npm test	2026-09-03T00:29:08.4431322Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T00:29:08.4431515Z 
quality (node 24)	Run npm test	2026-09-03T00:29:08.4432085Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T00:29:08.4432617Z 
quality (node 24)	Run npm test	2026-09-03T00:29:08.4667463Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 123^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:08.5392247Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:08.7159873Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 65^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:08.7610180Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:08.8084751Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:08.9893542Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.0429903Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.0464138Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.2923484Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.2989578Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.3090148Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.5304506Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.5871238Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.6494798Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 69^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.8847248Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.8980553Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:09.9073301Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.1420084Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.1577372Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.1672233Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.3895492Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.4154976Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.5053105Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 149^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.6027017Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.6550117Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.7276033Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.8417505Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:10.9628347Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.0690155Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 61^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.0802867Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.3050432Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.3258297Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.3414826Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.5809796Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.5811267Z ^[[31m     ^[[31m×^[[31m RA-86 names the solver that reads a node as a chain member^[[39m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.5812227Z ^[[31m     ^[[31m×^[[31m RA-87 counts a reader that names one source twice as one dependant^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.5813281Z ^[[31m     ^[[31m×^[[31m RA-88 answers an ordinary edge, an unread node and an unknown id exactly as before^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.5890109Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.6320188Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.7998180Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.8734802Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:11.9064632Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.0161411Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.1074478Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.1222535Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.1888420Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.3676013Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.3878723Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.4202033Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.6393767Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.6489648Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.6529619Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.8688507Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.9121161Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:12.9188648Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.1229883Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.1406237Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.1408842Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.3414959Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.3633374Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.3695167Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.6039980Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.6301280Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.8435878Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:13.9158467Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:14.0810729Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:14.1277100Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:14.3809815Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:14.4599979Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:14.6829948Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:14.8118211Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:14.9708804Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:15.0602725Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:15.3028454Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:15.3670494Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:15.5599590Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:15.7564437Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:15.8234804Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:15.9887101Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.0543261Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.3090139Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.3474603Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.5628852Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.6146825Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3082^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.6164815Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3080^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.6379736Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.7600543Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.8358329Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:16.9192859Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.0332741Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.0959444Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.1883417Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.2982496Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.3106196Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.4433108Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.5231355Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.5880410Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.6750990Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.7374514Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.7846995Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.9675394Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:17.9796435Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:18.2089848Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:18.2540901Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:18.4340384Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:18.4812705Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:18.6864202Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:18.7833824Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:18.9359422Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:19.0164690Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:19.1895075Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:19.3049440Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:19.4950272Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:19.5896980Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:19.7735833Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:19.9005097Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:20.0600000Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:20.1129876Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:20.2913808Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:20.4428665Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-03T00:29:20.4465176Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T00:29:20.4474483Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T00:29:20.4507927Z 
quality (node 24)	Run npm test	2026-09-03T00:29:20.4536369Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T00:29:20.4555349Z 
quality (node 24)	Run npm test	2026-09-03T00:29:20.4565412Z act(() => {
quality (node 24)	Run npm test	2026-09-03T00:29:20.4588314Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T00:29:20.4618210Z });
quality (node 24)	Run npm test	2026-09-03T00:29:20.4619736Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:20.4655644Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T00:29:20.4685504Z 
quality (node 24)	Run npm test	2026-09-03T00:29:20.4699659Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T00:29:20.4701028Z 
quality (node 24)	Run npm test	2026-09-03T00:29:20.4703392Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-03T00:29:20.4705966Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T00:29:20.4707436Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T00:29:20.4708354Z 
quality (node 24)	Run npm test	2026-09-03T00:29:20.4709110Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T00:29:20.4709850Z 
quality (node 24)	Run npm test	2026-09-03T00:29:20.4710150Z act(() => {
quality (node 24)	Run npm test	2026-09-03T00:29:20.4710729Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T00:29:20.4711326Z });
quality (node 24)	Run npm test	2026-09-03T00:29:20.4711833Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T00:29:20.4712263Z 
quality (node 24)	Run npm test	2026-09-03T00:29:20.4713445Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T00:29:20.4715510Z 
quality (node 24)	Run npm test	2026-09-03T00:29:20.5254529Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:20.7222356Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:20.8077943Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:20.9924734Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:21.0352131Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:21.2259838Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:21.2797041Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:21.4709432Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:21.4919479Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:21.7188345Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:21.8033467Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:21.9905202Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:22.0569808Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:22.2719811Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:22.2968023Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:22.4933015Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:22.5323895Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:22.6982146Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:22.8135384Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:22.8989854Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.0149827Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.1079911Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.2564819Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-03T00:29:23.2574505Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-03T00:29:23.2575997Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-03T00:29:23.2578301Z 
quality (node 24)	Run npm test	2026-09-03T00:29:23.2579207Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-03T00:29:23.2580546Z 
quality (node 24)	Run npm test	2026-09-03T00:29:23.2580932Z act(() => {
quality (node 24)	Run npm test	2026-09-03T00:29:23.2581595Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-03T00:29:23.2582340Z });
quality (node 24)	Run npm test	2026-09-03T00:29:23.2583816Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-03T00:29:23.2584483Z 
quality (node 24)	Run npm test	2026-09-03T00:29:23.2585796Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-03T00:29:23.2587125Z 
quality (node 24)	Run npm test	2026-09-03T00:29:23.2604550Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.3447350Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.4815468Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.5909744Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.7356458Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.8051079Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:23.9789847Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.0666878Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.2488643Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.3986266Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.4740114Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.5499829Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6668^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.5503020Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1813^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.5504906Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1711^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.6344620Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.6782325Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.7628113Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.8412648Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:24.8652208Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.0258706Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.0444257Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.0593813Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.2309745Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.2347099Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.2449332Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.4021161Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.4442732Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.4607308Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.6005213Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.7068879Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.7337306Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.8202351Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.9338694Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.9529619Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.9931534Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.9988445Z 
quality (node 24)	Run npm test	2026-09-03T00:29:25.9989077Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:25.9989434Z 
quality (node 24)	Run npm test	2026-09-03T00:29:25.9993429Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts^[[2m > ^[[22mone owner of reverse topology, read rather than rederived^[[2m > ^[[22mRA-86 names the solver that reads a node as a chain member
quality (node 24)	Run npm test	2026-09-03T00:29:26.0000626Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'hero/lower' ] to deeply equal [ 'hero/lower', 'hero/rig' ]^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0001197Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0001620Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0002091Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0002321Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0002509Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0002904Z ^[[2m    "hero/lower",^[[22m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0003379Z ^[[32m-   "hero/rig",^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0003780Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0003976Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0004867Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts:^[[2m115:41^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0041972Z     ^[[90m113|^[[39m     // The public query has to agree with it. An edge walk answers `[L…
quality (node 24)	Run npm test	2026-09-03T00:29:26.0043241Z     ^[[90m114|^[[39m     // which is a preflight telling an editor that deleting the leaf o…
quality (node 24)	Run npm test	2026-09-03T00:29:26.0045061Z     ^[[90m115|^[[39m     ^[[34mexpect^[[39m(project^[[33m.^[[39m^[[34mdependantsOf^[[39m(^[[33mUPPER^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[33mLOWER^[[39m^[[33m,^[[39m ^[[33mRIG^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0046513Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0048323Z     ^[[90m116|^[[39m     ^[[34mexpect^[[39m(project^[[33m.^[[39m^[[34mdependantsOf^[[39m(^[[33mLOWER^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[33mRIG^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0049411Z     ^[[90m117|^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0049640Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0050090Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0050462Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0052589Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts^[[2m > ^[[22mone owner of reverse topology, read rather than rederived^[[2m > ^[[22mRA-87 counts a reader that names one source twice as one dependant
quality (node 24)	Run npm test	2026-09-03T00:29:26.0055364Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'hero/lower' ] to deeply equal [ 'hero/lower', 'hero/rig' ]^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0056060Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0056288Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0056759Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0056989Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0057179Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0057880Z ^[[2m    "hero/lower",^[[22m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0058407Z ^[[32m-   "hero/rig",^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0058701Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0058822Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0059377Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts:^[[2m132:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0060317Z     ^[[90m130|^[[39m     ^[[35mconst^[[39m readers ^[[33m=^[[39m project^[[33m.^[[39m^[[34mdependantsOf^[[39m(^[[33mUPPER^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0061669Z     ^[[90m131|^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0062719Z     ^[[90m132|^[[39m     ^[[34mexpect^[[39m(readers)^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[33mLOWER^[[39m^[[33m,^[[39m ^[[33mRIG^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0063348Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0064233Z     ^[[90m133|^[[39m     ^[[34mexpect^[[39m(readers^[[33m.^[[39m^[[34mfilter^[[39m((id) ^[[33m=>^[[39m id ^[[33m===^[[39m ^[[33mLOWER^[[39m))^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0065991Z     ^[[90m134|^[[39m     // First occurrence wins, which is the committed node order the ed…
quality (node 24)	Run npm test	2026-09-03T00:29:26.0066640Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0067156Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0067808Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0069432Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts^[[2m > ^[[22mone owner of reverse topology, read rather than rederived^[[2m > ^[[22mRA-88 answers an ordinary edge, an unread node and an unknown id exactly as before
quality (node 24)	Run npm test	2026-09-03T00:29:26.0071395Z ^[[31m^[[1mAssertionError^[[22m: expected Error: ProjectRuntime is disposed. to be an instance of TypeError^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0072380Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts:^[[2m160:56^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0073581Z     ^[[90m158|^[[39m     // And it is still a live-project read. `#assertLive` stays ahead …
quality (node 24)	Run npm test	2026-09-03T00:29:26.0074430Z     ^[[90m159|^[[39m     ^[[90m// runtime has no committed graph to answer from.^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0075078Z     ^[[90m160|^[[39m     expect(thrownBy(() => project.dependantsOf(ROOT))).toBeInstanceOf(…
quality (node 24)	Run npm test	2026-09-03T00:29:26.0075662Z     ^[[90m   |^[[39m                                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0076326Z     ^[[90m161|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0076790Z     ^[[90m162|^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0076960Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0077198Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0077426Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0077450Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0078268Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m174 passed^[[39m^[[22m^[[90m (175)^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0079083Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m862 passed^[[39m^[[22m^[[90m (865)^[[39m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0079592Z ^[[2m   Start at ^[[22m 00:29:07
quality (node 24)	Run npm test	2026-09-03T00:29:26.0080275Z ^[[2m   Duration ^[[22m 18.45s^[[2m (transform 2.52s, setup 1.15s, import 10.08s, tests 13.52s, environment 28ms)^[[22m
quality (node 24)	Run npm test	2026-09-03T00:29:26.0080673Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0100437Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0124714Z ##[error]AssertionError: expected [ 'hero/lower' ] to deeply equal [ 'hero/lower', 'hero/rig' ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "hero/lower",
quality (node 24)	Run npm test	-   "hero/rig",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts:115:41
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T00:29:26.0132451Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0134780Z ##[error]AssertionError: expected [ 'hero/lower' ] to deeply equal [ 'hero/lower', 'hero/rig' ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "hero/lower",
quality (node 24)	Run npm test	-   "hero/rig",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts:132:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T00:29:26.0136315Z 
quality (node 24)	Run npm test	2026-09-03T00:29:26.0138531Z ##[error]AssertionError: expected Error: ProjectRuntime is disposed. to be an instance of TypeError
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts:160:56
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-03T00:29:26.0663068Z ##[error]Process completed with exit code 1.
```
