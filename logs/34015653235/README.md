# CI log archive: 34015653235

- Workflow: CI
- Conclusion: failure
- Head branch: fix/312-owned-teardown-diagnostics
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/34015653235
- Captured: 2026-09-06T06:07:49Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-06T06:07:18.8468340Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-06T06:07:18.8468706Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-06T06:07:18.8493215Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-06T06:07:18.8493576Z env:
quality (node 24)	Run npm test	2026-09-06T06:07:18.8493869Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-06T06:07:18.8494161Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-06T06:07:18.9351505Z 
quality (node 24)	Run npm test	2026-09-06T06:07:18.9352105Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-06T06:07:18.9352520Z > vitest run
quality (node 24)	Run npm test	2026-09-06T06:07:18.9352708Z 
quality (node 24)	Run npm test	2026-09-06T06:07:19.1690842Z 
quality (node 24)	Run npm test	2026-09-06T06:07:19.1693998Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:19.1694424Z 
quality (node 24)	Run npm test	2026-09-06T06:07:19.4741643Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:19.7258464Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:19.8201630Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m39 tests^[[22m^[[2m)^[[22m^[[32m 61^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:19.9094181Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-06T06:07:19.9152388Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T06:07:19.9164942Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T06:07:19.9165569Z 
quality (node 24)	Run npm test	2026-09-06T06:07:19.9185310Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T06:07:19.9186056Z 
quality (node 24)	Run npm test	2026-09-06T06:07:19.9207931Z act(() => {
quality (node 24)	Run npm test	2026-09-06T06:07:19.9209640Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T06:07:19.9239981Z });
quality (node 24)	Run npm test	2026-09-06T06:07:19.9240843Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T06:07:19.9241357Z 
quality (node 24)	Run npm test	2026-09-06T06:07:19.9271860Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T06:07:19.9272834Z 
quality (node 24)	Run npm test	2026-09-06T06:07:19.9401018Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 122^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:19.9816294Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.1208105Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.2060845Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.2341887Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.3714561Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.4800582Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.4881922Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.5870984Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.6870725Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.7105037Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.8311411Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.8648406Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:20.9190600Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.0810677Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.0912662Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.3218683Z  ^[[31m❯^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.3235406Z      ^[[32m✓^[[39m D-1 releases the project clock subscription when a load fails late^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.3236602Z      ^[[32m✓^[[39m D-2 disposes each built Motion and trigger exactly once on a failed load^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.3237677Z ^[[31m     ^[[31m×^[[31m D-3 keeps the load failure in front when the teardown throws too^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.3238695Z      ^[[32m✓^[[39m D-4 disposes the Motion even when the rolled back trigger throws^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.3239709Z      ^[[32m✓^[[39m D-5 drops the rolled back Motion from Engine's map exactly once^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.3240505Z      ^[[32m✓^[[39m D-6 reports the graph rejection unwrapped when the runtime never existed^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.3287818Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.4951833Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.5478559Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.6722506Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.7813217Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.8180692Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 823^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:21.8610589Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.0636916Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.0918249Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.1281195Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.2342758Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.2886119Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.3902813Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 94^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.4187771Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.5072324Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.5661575Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.6151429Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.6592919Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.8141626Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.8370534Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:22.8691349Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.0255075Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.0465107Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.0815621Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.2304864Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.2356105Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.2865474Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.4092051Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.4260467Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.4848252Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.5745322Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.6051974Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.6574823Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.7398181Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.8090271Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.8310266Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.9435608Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:23.9785924Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.0591655Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.1171740Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.1550684Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.2315841Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.3044703Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.3457399Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.4360147Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.5120656Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.5266616Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.6182348Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.6791225Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.6878947Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.7798843Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.8936594Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:24.9640717Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.0965719Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.1325378Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.2433869Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.3049792Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.4470880Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.5957676Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.6580487Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.8280251Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:25.9583097Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.1120097Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.1481740Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.3747638Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.3789957Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.5798795Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.6400624Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.7920357Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.8140645Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:26.9805366Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.0472740Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.1700913Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.2458146Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.2764009Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2448^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.2765952Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2445^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.3855802Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.3948658Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.4825647Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.5510614Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.6112782Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.6733956Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.7343737Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.7992176Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.8311169Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.9351188Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:27.9884811Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.0559271Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.0954606Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.1332011Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.2108202Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.2966759Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.3667895Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.5239645Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.5607967Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.7061584Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.7523963Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.9025805Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:28.9950615Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.0740496Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.1919585Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.2464263Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.4360703Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.4710664Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.6440809Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.6564186Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.8751237Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:29.8780292Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.0532343Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.0970447Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.2396607Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.3561093Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-06T06:07:30.3590647Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T06:07:30.3600268Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T06:07:30.3619718Z 
quality (node 24)	Run npm test	2026-09-06T06:07:30.3643327Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T06:07:30.3673265Z 
quality (node 24)	Run npm test	2026-09-06T06:07:30.3706138Z act(() => {
quality (node 24)	Run npm test	2026-09-06T06:07:30.3741419Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T06:07:30.3742870Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.3744310Z });
quality (node 24)	Run npm test	2026-09-06T06:07:30.3744943Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T06:07:30.3745340Z 
quality (node 24)	Run npm test	2026-09-06T06:07:30.3746185Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T06:07:30.3747109Z 
quality (node 24)	Run npm test	2026-09-06T06:07:30.3748768Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-06T06:07:30.3751074Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T06:07:30.3752339Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T06:07:30.3753149Z 
quality (node 24)	Run npm test	2026-09-06T06:07:30.3753778Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T06:07:30.3754432Z 
quality (node 24)	Run npm test	2026-09-06T06:07:30.3754743Z act(() => {
quality (node 24)	Run npm test	2026-09-06T06:07:30.3755389Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T06:07:30.3755952Z });
quality (node 24)	Run npm test	2026-09-06T06:07:30.3756557Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T06:07:30.3756969Z 
quality (node 24)	Run npm test	2026-09-06T06:07:30.3757928Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T06:07:30.3758826Z 
quality (node 24)	Run npm test	2026-09-06T06:07:30.4340004Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.5587745Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.6330576Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.7348780Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.7960593Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.9035659Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:30.9980636Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.1125252Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.1620585Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.3515140Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.3833793Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.5386193Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.5930955Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.7611778Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.7811193Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.9283977Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:31.9440134Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.0882699Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.1591021Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.2467745Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.3611308Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.4333480Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.5705967Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-06T06:07:32.5721007Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.5741156Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-06T06:07:32.5742398Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-06T06:07:32.5743015Z 
quality (node 24)	Run npm test	2026-09-06T06:07:32.5743618Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-06T06:07:32.5744187Z 
quality (node 24)	Run npm test	2026-09-06T06:07:32.5744471Z act(() => {
quality (node 24)	Run npm test	2026-09-06T06:07:32.5744998Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-06T06:07:32.5745487Z });
quality (node 24)	Run npm test	2026-09-06T06:07:32.5745952Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-06T06:07:32.5746271Z 
quality (node 24)	Run npm test	2026-09-06T06:07:32.5747051Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-06T06:07:32.5747787Z 
quality (node 24)	Run npm test	2026-09-06T06:07:32.6200787Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.7481890Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.8175135Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.9219000Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:32.9894765Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.0914566Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.1771036Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.2014605Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 4952^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.2040518Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1383^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.2042033Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1290^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.2889483Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.3624883Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.3667442Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.4714176Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.5107710Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.5120394Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.6229854Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.6517956Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.7123768Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.7816831Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.8070864Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.8662866Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.9238715Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:33.9585216Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.0180582Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.0942620Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.1041062Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.1920940Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.2921291Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.3001145Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.3920671Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.4366554Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.4937460Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5270139Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5312695Z 
quality (node 24)	Run npm test	2026-09-06T06:07:34.5314222Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5314655Z 
quality (node 24)	Run npm test	2026-09-06T06:07:34.5316969Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-teardown-ownership.test.ts^[[2m > ^[[22mEngine owns the teardown of everything a failed operation created^[[2m > ^[[22mD-3 keeps the load failure in front when the teardown throws too
quality (node 24)	Run npm test	2026-09-06T06:07:34.5322779Z ^[[31m^[[1mAssertionError^[[22m: expected Error: trigger factory refused to build t… to be an instance of AggregateError^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5324078Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-teardown-ownership.test.ts:^[[2m254:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5370127Z     ^[[90m252|^[[39m     const thrown = thrownBy(() => load(clock, triggers.factory, projec…
quality (node 24)	Run npm test	2026-09-06T06:07:34.5370881Z     ^[[90m253|^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5372562Z     ^[[90m254|^[[39m     ^[[34mexpect^[[39m(thrown)^[[33m.^[[39m^[[34mtoBeInstanceOf^[[39m(^[[33mAggregateError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5373842Z     ^[[90m   |^[[39m                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5375096Z     ^[[90m255|^[[39m     ^[[34mexpect^[[39m((thrown ^[[35mas^[[39m ^[[33mError^[[39m)^[[33m.^[[39mmessage)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[33mCREATE_FAILURE^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5376284Z     ^[[90m256|^[[39m     const errors = (thrown as AggregateError).errors as readonly unkno…
quality (node 24)	Run npm test	2026-09-06T06:07:34.5376762Z 
quality (node 24)	Run npm test	2026-09-06T06:07:34.5377191Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5377483Z 
quality (node 24)	Run npm test	2026-09-06T06:07:34.5378406Z 
quality (node 24)	Run npm test	2026-09-06T06:07:34.5379499Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m185 passed^[[39m^[[22m^[[90m (186)^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5387110Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m984 passed^[[39m^[[22m^[[90m (985)^[[39m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5388082Z ^[[2m   Start at ^[[22m 06:07:19
quality (node 24)	Run npm test	2026-09-06T06:07:34.5390462Z ^[[2m   Duration ^[[22m 15.34s^[[2m (transform 2.26s, setup 948ms, import 8.50s, tests 11.29s, environment 19ms)^[[22m
quality (node 24)	Run npm test	2026-09-06T06:07:34.5391995Z 
quality (node 24)	Run npm test	2026-09-06T06:07:34.5414812Z 
quality (node 24)	Run npm test	2026-09-06T06:07:34.5442683Z ##[error]AssertionError: expected Error: trigger factory refused to build t… to be an instance of AggregateError
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/engine-teardown-ownership.test.ts:254:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-06T06:07:34.5925763Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-09-06T06:07:08.2637910Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.2638283Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.2676726Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.2677208Z env:
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.2677410Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.2677621Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.3738374Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.3738993Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.3739625Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.3739871Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.6979292Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.7000639Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:08.7023858Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.3271556Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.3615382Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 64^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4926403Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4929235Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4930706Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4931698Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4932674Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4933927Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4934368Z act(() => {
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4935061Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4935800Z });
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4936578Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4937161Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4938544Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.4939833Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.5219687Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 111^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.6325310Z  ^[[31m❯^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.6327968Z      ^[[32m✓^[[39m D-1 releases the project clock subscription when a load fails late^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.6330046Z      ^[[32m✓^[[39m D-2 disposes each built Motion and trigger exactly once on a failed load^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.6333811Z ^[[31m     ^[[31m×^[[31m D-3 keeps the load failure in front when the teardown throws too^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.6335815Z      ^[[32m✓^[[39m D-4 disposes the Motion even when the rolled back trigger throws^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.6337724Z      ^[[32m✓^[[39m D-5 drops the rolled back Motion from Engine's map exactly once^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.6339719Z      ^[[32m✓^[[39m D-6 reports the graph rejection unwrapped when the runtime never existed^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.7064637Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.8245965Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:09.8953650Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.0286003Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 73^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.2956279Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.3060478Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.3360780Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.5523674Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.6155566Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.6316919Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.8087357Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.8851037Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:10.9089347Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.1075199Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.2299527Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.2391079Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.3954727Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.5267402Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.5279679Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.6335746Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.7659192Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.8154182Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:11.8887609Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.0561069Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.0750632Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.1560904Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.3041781Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.3618758Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.4217832Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.5487803Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.6203937Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.6660745Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.8212768Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.9005797Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:12.9143060Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.0654146Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.1511245Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.1757280Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.2794272Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.3826727Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.3923498Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.5224336Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.6073819Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.6395651Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.7173887Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.8227351Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:13.8907435Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.0112887Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.0271231Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.1017321Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.2891037Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.3047076Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.3623065Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.4755557Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.5577405Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.6434436Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7021475Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7219649Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7253788Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7254526Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7255022Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7258760Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-teardown-ownership.test.ts^[[2m > ^[[22mEngine owns the teardown of everything a failed operation created^[[2m > ^[[22mD-3 keeps the load failure in front when the teardown throws too
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7265631Z ^[[31m^[[1mAssertionError^[[22m: expected Error: trigger factory refused to build t… to be an instance of AggregateError^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7267533Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-teardown-ownership.test.ts:^[[2m254:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7322047Z     ^[[90m252|^[[39m     const thrown = thrownBy(() => load(clock, triggers.factory, projec…
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7323150Z     ^[[90m253|^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7324824Z     ^[[90m254|^[[39m     ^[[34mexpect^[[39m(thrown)^[[33m.^[[39m^[[34mtoBeInstanceOf^[[39m(^[[33mAggregateError^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7328655Z     ^[[90m   |^[[39m                    ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7329057Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7334940Z     ^[[90m255|^[[39m     ^[[34mexpect^[[39m((thrown ^[[35mas^[[39m ^[[33mError^[[39m)^[[33m.^[[39mmessage)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[33mCREATE_FAILURE^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7339223Z     ^[[90m256|^[[39m     const errors = (thrown as AggregateError).errors as readonly unkno…
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7340902Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m61 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7342410Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m257 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7343685Z ^[[2m   Start at ^[[22m 06:07:08
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7344926Z ^[[2m   Duration ^[[22m 5.99s^[[2m (transform 1.64s, setup 414ms, import 5.26s, tests 1.69s, environment 10ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7345667Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7346281Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7346995Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7347614Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7361680Z 
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7386853Z ##[error]AssertionError: expected Error: trigger factory refused to build t… to be an instance of AggregateError
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-teardown-ownership.test.ts:254:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-06T06:07:14.7811079Z ##[error]Process completed with exit code 1.
```
