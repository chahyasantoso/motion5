# CI log archive: 33352456616

- Workflow: CI
- Conclusion: failure
- Head branch: perf/ra-18-graph-ir-dependents
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33352456616
- Captured: 2026-08-31T03:01:53Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-31T03:01:25.8097626Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-31T03:01:25.8098021Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-31T03:01:25.8121988Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-31T03:01:25.8122441Z env:
quality (node 24)	Run npm test	2026-08-31T03:01:25.8122757Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-31T03:01:25.8123107Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-31T03:01:25.9050720Z 
quality (node 24)	Run npm test	2026-08-31T03:01:25.9051309Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-31T03:01:25.9051700Z > vitest run
quality (node 24)	Run npm test	2026-08-31T03:01:25.9051953Z 
quality (node 24)	Run npm test	2026-08-31T03:01:26.1489491Z 
quality (node 24)	Run npm test	2026-08-31T03:01:26.1504156Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:26.1520359Z 
quality (node 24)	Run npm test	2026-08-31T03:01:26.4467241Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:26.5624078Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:26.6410516Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:26.8233136Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:26.8475683Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:26.8927883Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-31T03:01:26.8931640Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T03:01:26.8932964Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T03:01:26.8933504Z 
quality (node 24)	Run npm test	2026-08-31T03:01:26.8934123Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T03:01:26.8934603Z 
quality (node 24)	Run npm test	2026-08-31T03:01:26.8934972Z act(() => {
quality (node 24)	Run npm test	2026-08-31T03:01:26.8935489Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T03:01:26.8936142Z });
quality (node 24)	Run npm test	2026-08-31T03:01:26.8936685Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T03:01:26.8940798Z 
quality (node 24)	Run npm test	2026-08-31T03:01:26.8941903Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T03:01:26.8943255Z 
quality (node 24)	Run npm test	2026-08-31T03:01:26.9157176Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 84^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.0051481Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.0313461Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.1263182Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.1705952Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.1907209Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.3174658Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.3868731Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.4723278Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.4832435Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.5771199Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.6345484Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.6599677Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.7562144Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.7967899Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.8463959Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 71^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.8949725Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.9639078Z  ^[[31m❯^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.9640717Z ^[[31m     ^[[31m×^[[31m RA-18 names every reader of every node, edges and solver membership alike^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.9642032Z ^[[31m     ^[[31m×^[[31m RA-19 answers for every node, frozen, including the ones nothing reads^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.9643099Z ^[[31m     ^[[31m×^[[31m RA-20 answers identically from both builders, which finalize through one owner^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.9654583Z ^[[31m     ^[[31m×^[[31m RA-21 walks the reverse topology the snapshot carries, not one built from edges^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:27.9655693Z ^[[31m     ^[[31m×^[[31m RA-22 resolves a node through the snapshot's nodeById, not a map rebuilt per flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.0122095Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.0381628Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.1468889Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.1873140Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.2403623Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.3461902Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.3521472Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.4158589Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.5081584Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.5132034Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.6005785Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.6389000Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.6714090Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.7523800Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.7856324Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.7891305Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.9238835Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.9416384Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:28.9417859Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.0682132Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.1205076Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.1251804Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.1968951Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.2832380Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.2919627Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.3551243Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.4125275Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.4439123Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.4918109Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.5686669Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.5865726Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.6776084Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.7409448Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.8662057Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:29.8811480Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.0281983Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.0351848Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.1821716Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.2612568Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.3815479Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.4742374Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.6273675Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.6340471Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.8202624Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.8259669Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:30.9687281Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.0380853Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.1212785Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.1838263Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.3012334Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.3396800Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.4568297Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.5412624Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.6071736Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.6226176Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 1915^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.6240785Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 1913^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.7099799Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.7366846Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.7981496Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.8621970Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.8902355Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.9619628Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:31.9918601Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.0562260Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.1024703Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.1717944Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.2001590Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.2293825Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.3113636Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.3847414Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.4282344Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.5718707Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.5852578Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.7471758Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.7550523Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.9140061Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:32.9648882Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.1020271Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.1747165Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.2638669Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.3562492Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.4441117Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.5242266Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.6363106Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.6913207Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.7813890Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.8512343Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:33.9756577Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-31T03:01:33.9781417Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T03:01:33.9796932Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T03:01:33.9797576Z 
quality (node 24)	Run npm test	2026-08-31T03:01:33.9798082Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T03:01:33.9798563Z 
quality (node 24)	Run npm test	2026-08-31T03:01:33.9798898Z act(() => {
quality (node 24)	Run npm test	2026-08-31T03:01:33.9799849Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T03:01:33.9800587Z });
quality (node 24)	Run npm test	2026-08-31T03:01:33.9801158Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T03:01:33.9801486Z 
quality (node 24)	Run npm test	2026-08-31T03:01:33.9802161Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T03:01:33.9803018Z 
quality (node 24)	Run npm test	2026-08-31T03:01:33.9848139Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-31T03:01:33.9850933Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T03:01:33.9852406Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T03:01:33.9852754Z 
quality (node 24)	Run npm test	2026-08-31T03:01:33.9853137Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T03:01:33.9853533Z 
quality (node 24)	Run npm test	2026-08-31T03:01:33.9853747Z act(() => {
quality (node 24)	Run npm test	2026-08-31T03:01:33.9854195Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T03:01:33.9854571Z });
quality (node 24)	Run npm test	2026-08-31T03:01:33.9855153Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T03:01:33.9855397Z 
quality (node 24)	Run npm test	2026-08-31T03:01:33.9856028Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T03:01:33.9860376Z 
quality (node 24)	Run npm test	2026-08-31T03:01:33.9886057Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.0094621Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.1480029Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.1769576Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.2971698Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.3311402Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.4397243Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.4937761Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.5911247Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.6332032Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.7872355Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.8050937Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.9371973Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:34.9584207Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.0992007Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.1310036Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.2478526Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.2714272Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.3699852Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.4581020Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.5042664Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.6077389Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.6401018Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.7775748Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-31T03:01:35.7777638Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T03:01:35.7782794Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T03:01:35.7783346Z 
quality (node 24)	Run npm test	2026-08-31T03:01:35.7783958Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T03:01:35.7784428Z 
quality (node 24)	Run npm test	2026-08-31T03:01:35.7784690Z act(() => {
quality (node 24)	Run npm test	2026-08-31T03:01:35.7785147Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T03:01:35.7785720Z });
quality (node 24)	Run npm test	2026-08-31T03:01:35.7786126Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T03:01:35.7786483Z 
quality (node 24)	Run npm test	2026-08-31T03:01:35.7787158Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T03:01:35.7787833Z 
quality (node 24)	Run npm test	2026-08-31T03:01:35.7803687Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.8063564Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.9438249Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:35.9957511Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.1142642Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.1404983Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.2552093Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.3008798Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.3444338Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 4038^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.3445857Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1095^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.3446950Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1082^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.4106332Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.4710411Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.4781311Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.5563471Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.6011641Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.6057426Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.7195681Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.7431832Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.7489543Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.8496974Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.8805612Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.8858634Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:36.9815189Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.0157744Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.0196485Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.1168407Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.1508549Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.1861992Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.2827352Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.3054545Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.3397538Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4302914Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4459076Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4492679Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4533111Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4534019Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4534368Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4537403Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/graph-dependents.test.ts^[[2m > ^[[22mreverse topology is derived once, by the graph that owns every other edge rule^[[2m > ^[[22mRA-18 names every reader of every node, edges and solver membership alike
quality (node 24)	Run npm test	2026-08-31T03:01:37.4541778Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4542775Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/graph-dependents.test.ts:^[[2m144:24^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4576117Z     ^[[90m142|^[[39m   it("RA-18 names every reader of every node, edges and solver members…
quality (node 24)	Run npm test	2026-08-31T03:01:37.4577068Z     ^[[90m143|^[[39m     ^[[35mconst^[[39m dependents ^[[33m=^[[39m ^[[34mdependentsOf^[[39m(^[[34mwalkerGraph^[[39m(buildGraphIR))^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4578052Z     ^[[90m144|^[[39m     ^[[34mexpect^[[39m(dependents)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4578690Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4579452Z     ^[[90m145|^[[39m     ^[[34mexpect^[[39m(dependents)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[33mEXPECTED^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4580202Z     ^[[90m146|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4580462Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4580750Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4581091Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4582225Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/graph-dependents.test.ts^[[2m > ^[[22mreverse topology is derived once, by the graph that owns every other edge rule^[[2m > ^[[22mRA-19 answers for every node, frozen, including the ones nothing reads
quality (node 24)	Run npm test	2026-08-31T03:01:37.4587870Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4588744Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/graph-dependents.test.ts:^[[2m151:24^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4589537Z     ^[[90m149|^[[39m     ^[[35mconst^[[39m graph ^[[33m=^[[39m ^[[34mwalkerGraph^[[39m(buildGraphIR)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4590504Z     ^[[90m150|^[[39m     ^[[35mconst^[[39m dependents ^[[33m=^[[39m ^[[34mdependentsOf^[[39m(graph)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4591324Z     ^[[90m151|^[[39m     ^[[34mexpect^[[39m(dependents)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4591965Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4592416Z     ^[[90m152|^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4593022Z     ^[[90m153|^[[39m     // Total rather than sparse. A missing key and an empty list are t…
quality (node 24)	Run npm test	2026-08-31T03:01:37.4593345Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4593577Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4593790Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4594841Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/graph-dependents.test.ts^[[2m > ^[[22mreverse topology is derived once, by the graph that owns every other edge rule^[[2m > ^[[22mRA-20 answers identically from both builders, which finalize through one owner
quality (node 24)	Run npm test	2026-08-31T03:01:37.4595911Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be defined^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4596610Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/graph-dependents.test.ts:^[[2m166:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4597495Z     ^[[90m164|^[[39m     ^[[35mconst^[[39m builder ^[[33m=^[[39m ^[[35mnew^[[39m ^[[33mIncrementalGraphBuilder^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4598309Z     ^[[90m165|^[[39m     const incremental = dependentsOf(walkerGraph((project) => builder.…
quality (node 24)	Run npm test	2026-08-31T03:01:37.4599343Z     ^[[90m166|^[[39m     ^[[34mexpect^[[39m(reference)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4600123Z     ^[[90m   |^[[39m                       ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4600788Z     ^[[90m167|^[[39m     ^[[34mexpect^[[39m(incremental)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4601521Z     ^[[90m168|^[[39m     ^[[34mexpect^[[39m(incremental)^[[33m.^[[39m^[[34mtoEqual^[[39m(reference)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4601930Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4602236Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4602482Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4603657Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/graph-dependents.test.ts^[[2m > ^[[22mthe publisher reads graph shape rather than deriving it per flush^[[2m > ^[[22mRA-21 walks the reverse topology the snapshot carries, not one built from edges
quality (node 24)	Run npm test	2026-08-31T03:01:37.4605150Z ^[[31m^[[1mAssertionError^[[22m: expected { nodeId: 'consumer', …(6) } to be undefined^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4605549Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4605757Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4606089Z undefined
quality (node 24)	Run npm test	2026-08-31T03:01:37.4606241Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4606427Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4606760Z {
quality (node 24)	Run npm test	2026-08-31T03:01:37.4607016Z   "diagnostics": [],
quality (node 24)	Run npm test	2026-08-31T03:01:37.4607344Z   "nodeId": "consumer",
quality (node 24)	Run npm test	2026-08-31T03:01:37.4607687Z   "revision": 1,
quality (node 24)	Run npm test	2026-08-31T03:01:37.4607988Z   "sourceProgress": 0,
quality (node 24)	Run npm test	2026-08-31T03:01:37.4608287Z   "sourceRevisions": {
quality (node 24)	Run npm test	2026-08-31T03:01:37.4608612Z     "source": 1,
quality (node 24)	Run npm test	2026-08-31T03:01:37.4608904Z   },
quality (node 24)	Run npm test	2026-08-31T03:01:37.4609159Z   "status": "ready",
quality (node 24)	Run npm test	2026-08-31T03:01:37.4609493Z   "values": {
quality (node 24)	Run npm test	2026-08-31T03:01:37.4609755Z     "y": 2,
quality (node 24)	Run npm test	2026-08-31T03:01:37.4610236Z   },
quality (node 24)	Run npm test	2026-08-31T03:01:37.4610518Z }
quality (node 24)	Run npm test	2026-08-31T03:01:37.4610672Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4611182Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/graph-dependents.test.ts:^[[2m197:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4611775Z     ^[[90m195|^[[39m     )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4612677Z     ^[[90m196|^[[39m     ^[[34mexpect^[[39m(skipped^[[33m.^[[39m^[[35mget^[[39m(^[[32m"source"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m1^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4613746Z     ^[[90m197|^[[39m     ^[[34mexpect^[[39m(skipped^[[33m.^[[39m^[[35mget^[[39m(^[[32m"consumer"^[[39m))^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4614455Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4614929Z     ^[[90m198|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4615288Z     ^[[90m199|^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4615476Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4615753Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4616004Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4617187Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/graph/graph-dependents.test.ts^[[2m > ^[[22mthe publisher reads graph shape rather than deriving it per flush^[[2m > ^[[22mRA-22 resolves a node through the snapshot's nodeById, not a map rebuilt per flush
quality (node 24)	Run npm test	2026-08-31T03:01:37.4618475Z ^[[31m^[[1mAssertionError^[[22m: expected { nodeId: 'consumer', …(6) } to be undefined^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4618858Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4619102Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4619403Z undefined
quality (node 24)	Run npm test	2026-08-31T03:01:37.4619571Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4620355Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4620924Z {
quality (node 24)	Run npm test	2026-08-31T03:01:37.4621252Z   "diagnostics": [],
quality (node 24)	Run npm test	2026-08-31T03:01:37.4621605Z   "nodeId": "consumer",
quality (node 24)	Run npm test	2026-08-31T03:01:37.4621916Z   "revision": 1,
quality (node 24)	Run npm test	2026-08-31T03:01:37.4622211Z   "sourceProgress": 0,
quality (node 24)	Run npm test	2026-08-31T03:01:37.4622543Z   "sourceRevisions": {
quality (node 24)	Run npm test	2026-08-31T03:01:37.4622936Z     "source": 1,
quality (node 24)	Run npm test	2026-08-31T03:01:37.4623261Z   },
quality (node 24)	Run npm test	2026-08-31T03:01:37.4623521Z   "status": "ready",
quality (node 24)	Run npm test	2026-08-31T03:01:37.4623875Z   "values": {
quality (node 24)	Run npm test	2026-08-31T03:01:37.4624147Z     "y": 2,
quality (node 24)	Run npm test	2026-08-31T03:01:37.4624399Z   },
quality (node 24)	Run npm test	2026-08-31T03:01:37.4624711Z }
quality (node 24)	Run npm test	2026-08-31T03:01:37.4624840Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4625402Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/graph/graph-dependents.test.ts:^[[2m214:38^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4626067Z     ^[[90m212|^[[39m     )^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4627233Z     ^[[90m213|^[[39m     ^[[34mexpect^[[39m(registry^[[33m.^[[39m^[[35mget^[[39m(^[[32m"source"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m1^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4628353Z     ^[[90m214|^[[39m     ^[[34mexpect^[[39m(registry^[[33m.^[[39m^[[35mget^[[39m(^[[32m"consumer"^[[39m))^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4629136Z     ^[[90m   |^[[39m                                      ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4629604Z     ^[[90m215|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4630236Z     ^[[90m216|^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4630472Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4630777Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4631003Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4631031Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4631605Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m164 passed^[[39m^[[22m^[[90m (165)^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4632728Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m801 passed^[[39m^[[22m^[[90m (806)^[[39m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4633338Z ^[[2m   Start at ^[[22m 03:01:26
quality (node 24)	Run npm test	2026-08-31T03:01:37.4634047Z ^[[2m   Duration ^[[22m 11.28s^[[2m (transform 1.89s, setup 721ms, import 6.27s, tests 8.00s, environment 14ms)^[[22m
quality (node 24)	Run npm test	2026-08-31T03:01:37.4634450Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4634458Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4660187Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/graph-dependents.test.ts:144:24
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T03:01:37.4669734Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4671848Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/graph-dependents.test.ts:151:24
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T03:01:37.4672913Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4674439Z ##[error]AssertionError: expected undefined to be defined
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/graph-dependents.test.ts:166:23
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T03:01:37.4675369Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4677893Z ##[error]AssertionError: expected { nodeId: 'consumer', …(6) } to be undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "diagnostics": [],
quality (node 24)	Run npm test	  "nodeId": "consumer",
quality (node 24)	Run npm test	  "revision": 1,
quality (node 24)	Run npm test	  "sourceProgress": 0,
quality (node 24)	Run npm test	  "sourceRevisions": {
quality (node 24)	Run npm test	    "source": 1,
quality (node 24)	Run npm test	  },
quality (node 24)	Run npm test	  "status": "ready",
quality (node 24)	Run npm test	  "values": {
quality (node 24)	Run npm test	    "y": 2,
quality (node 24)	Run npm test	  },
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/graph-dependents.test.ts:197:37
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T03:01:37.4679536Z 
quality (node 24)	Run npm test	2026-08-31T03:01:37.4682288Z ##[error]AssertionError: expected { nodeId: 'consumer', …(6) } to be undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "diagnostics": [],
quality (node 24)	Run npm test	  "nodeId": "consumer",
quality (node 24)	Run npm test	  "revision": 1,
quality (node 24)	Run npm test	  "sourceProgress": 0,
quality (node 24)	Run npm test	  "sourceRevisions": {
quality (node 24)	Run npm test	    "source": 1,
quality (node 24)	Run npm test	  },
quality (node 24)	Run npm test	  "status": "ready",
quality (node 24)	Run npm test	  "values": {
quality (node 24)	Run npm test	    "y": 2,
quality (node 24)	Run npm test	  },
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/graph/graph-dependents.test.ts:214:38
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T03:01:37.5117238Z ##[error]Process completed with exit code 1.
```
