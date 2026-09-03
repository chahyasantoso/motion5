# CI log archive: 33778598383

- Workflow: CI
- Conclusion: failure
- Head branch: chore/262-one-spelling-for-dependants
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33778598383
- Captured: 2026-09-03T16:27:05Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-09-03T16:26:45.5476277Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.5476670Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.5499154Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.5499759Z env:
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.5500043Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.5500348Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.6543874Z 
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.6544419Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.6544985Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:45.6545193Z 
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8820421Z ##[error]packages/core/test/integration/flush-output-merge.test.ts(3,24): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8830956Z ##[error]packages/core/test/integration/flush-output-merge.test.ts(14,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8834077Z ##[error]packages/core/test/integration/graph-publisher.test.ts(2,10): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8837231Z ##[error]packages/core/test/integration/graph-publisher.test.ts(34,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8840079Z ##[error]packages/core/test/integration/p2-runtime-smells.test.ts(2,10): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8843635Z ##[error]packages/core/test/integration/p2-runtime-smells.test.ts(28,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8846646Z ##[error]packages/core/test/integration/partial-seed-inputs.test.ts(2,10): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8850027Z ##[error]packages/core/test/integration/partial-seed-inputs.test.ts(14,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8853280Z ##[error]packages/core/test/integration/publisher-output-merge-consistency.test.ts(2,10): error TS2724: '"../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8856799Z ##[error]packages/core/test/integration/publisher-output-merge-consistency.test.ts(24,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8859609Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(72,25): error TS2339: Property 'dependents' does not exist on type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8861947Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(114,23): error TS2339: Property 'dependents' does not exist on type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8865572Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(122,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8868656Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(130,38): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8871347Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(135,30): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8873975Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(148,74): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8876783Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(149,59): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8879843Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(4,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8883404Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(31,3): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8886421Z ##[error]packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts(110,32): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8889046Z ##[error]packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts(111,32): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8891754Z ##[error]packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts(128,32): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8894742Z ##[error]packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts(8,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8898034Z ##[error]packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts(25,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8901290Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(3,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8904619Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(42,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8907697Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(2,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8911014Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(30,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8914026Z ##[error]packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts(128,20): error TS2551: Property 'dependents' does not exist on type 'PublisherSnapshot'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8916687Z ##[error]packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts(128,51): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8919687Z ##[error]packages/core/test/unit/runtime/publisher-solver-members.test.ts(2,10): error TS2724: '"../../../src/graph/ir"' has no exported member named 'deriveDependents'. Did you mean 'deriveDependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.8922933Z ##[error]packages/core/test/unit/runtime/publisher-solver-members.test.ts(79,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:26:48.9099599Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-09-03T16:26:33.3889653Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.3890052Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.3916122Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.3916543Z env:
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.3916819Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.3917096Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.4775502Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.4776237Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.4776781Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:33.4777041Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.1159649Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.1163491Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.1164097Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.6311113Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.6495031Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7496464Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7500285Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7501427Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7503559Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7504238Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7504924Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7505247Z act(() => {
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7506068Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7506785Z });
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7507227Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7507599Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7508443Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7509380Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.7727442Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 77^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.8607877Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:34.9077834Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.0257203Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.0573369Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.2789751Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.3651904Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.3765587Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.4777880Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.5805556Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.5895843Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.6973263Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.7896049Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.7933884Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:35.8968051Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.0150377Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.0633997Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.1025262Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.2487439Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.2853415Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.3292387Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.4541973Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.4763469Z  ^[[31m❯^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.4765312Z      ^[[32m✓^[[39m preserves the last known good values when a node publishes error^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.4766930Z ^[[31m     ^[[31m×^[[31m derives source revisions from the upstream patches consumed in the flush^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.4768556Z ^[[31m     ^[[31m×^[[31m reports a pending reference instead of silently composing with an input hole^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.4770052Z ^[[31m     ^[[31m×^[[31m chooses the blocked upstream deterministically by edge key, not authored edge order^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.4772067Z      ^[[32m✓^[[39m rejects host objects from interpolator state at the renderer edge^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.4773247Z      ^[[32m✓^[[39m kills a timeline exactly once when a Track is disposed repeatedly^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.5399574Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.6829618Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.7081549Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.7639429Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.8897493Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.9329785Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:36.9448955Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.1214810Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.1279233Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.1368941Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.3044870Z  ^[[31m❯^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.3047094Z ^[[31m     ^[[31m×^[[31m a same-flush requirement consumer sees the source's merged value^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.3062187Z ^[[31m     ^[[31m×^[[31m a later flush resolves the source's merged value via registry fallback^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.3266671Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.3437546Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.5200198Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.5326257Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.5537099Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.6992000Z  ^[[31m❯^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.7017093Z ^[[31m     ^[[31m×^[[31m I-5 composes a shared ancestor once and publishes one whole batch^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.7018668Z ^[[31m     ^[[31m×^[[31m I-9 publishes an error and blocks the downstream closure while unrelated branches continue^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.7019911Z      ^[[32m✓^[[39m does not expose topology mutation methods^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.7057301Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.7442289Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.8630033Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.8861487Z  ^[[31m❯^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.8863117Z ^[[31m     ^[[31m×^[[31m merges output source values over the composed patch^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.8864369Z ^[[31m     ^[[31m×^[[31m uses canonical edge order when output sources collide^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:37.9137199Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.0587150Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.0696192Z  ^[[31m❯^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.0698227Z ^[[31m     ^[[31m×^[[31m uses the last published value for an unseeded requirement source^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.1364627Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.1828584Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.2667388Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.3055971Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.3456413Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.4853165Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.4928249Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.5399040Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.6436540Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.6507134Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.7225576Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.7793544Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8001756Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8040339Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8043316Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 10 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8043847Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8044677Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/flush-output-merge.test.ts^[[2m > ^[[22mGraphPublisher output edges^[[2m > ^[[22mmerges output source values over the composed patch
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8048599Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8049776Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/flush-output-merge.test.ts:^[[2m14:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8078807Z     ^[[90m 12|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8079940Z     ^[[90m 13|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8081174Z     ^[[90m 14|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8082026Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8083220Z     ^[[90m 15|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8084479Z     ^[[90m 16|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8085927Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/flush-output-merge.test.ts:^[[2m48:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8086584Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8087124Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8087560Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8088844Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/flush-output-merge.test.ts^[[2m > ^[[22mGraphPublisher output edges^[[2m > ^[[22muses canonical edge order when output sources collide
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8090353Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8091445Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/flush-output-merge.test.ts:^[[2m14:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8092245Z     ^[[90m 12|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8092782Z     ^[[90m 13|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8093426Z     ^[[90m 14|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8094162Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8095086Z     ^[[90m 15|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8096567Z     ^[[90m 16|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8097565Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/flush-output-merge.test.ts:^[[2m77:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8098073Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8098465Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8098734Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8099793Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/graph-publisher.test.ts^[[2m > ^[[22mGraphPublisher^[[2m > ^[[22mI-5 composes a shared ancestor once and publishes one whole batch
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8100990Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8102274Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/graph-publisher.test.ts:^[[2m34:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8103009Z     ^[[90m 32|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8103791Z     ^[[90m 33|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8104735Z     ^[[90m 34|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8105437Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8106619Z     ^[[90m 35|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8107711Z     ^[[90m 36|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8108807Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/graph-publisher.test.ts:^[[2m55:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8109319Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8109706Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8110051Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8111261Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/graph-publisher.test.ts^[[2m > ^[[22mGraphPublisher^[[2m > ^[[22mI-9 publishes an error and blocks the downstream closure while unrelated branches continue
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8112334Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8113044Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/graph-publisher.test.ts:^[[2m34:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8113586Z     ^[[90m 32|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8114152Z     ^[[90m 33|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8114775Z     ^[[90m 34|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8115277Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8116209Z     ^[[90m 35|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8117208Z     ^[[90m 36|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8118295Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/graph-publisher.test.ts:^[[2m81:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8118781Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8119180Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8119413Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8120162Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/p2-runtime-smells.test.ts^[[2m > ^[[22mP2 runtime smell hardening^[[2m > ^[[22mderives source revisions from the upstream patches consumed in the flush
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8121054Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8121779Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m28:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8122590Z     ^[[90m 26|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8146793Z     ^[[90m 27|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((entry) => [ent…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8147951Z     ^[[90m 28|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8148723Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8149516Z     ^[[90m 29|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8150513Z     ^[[90m 30|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8151519Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m75:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8152079Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8152488Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8152774Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8154037Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/p2-runtime-smells.test.ts^[[2m > ^[[22mP2 runtime smell hardening^[[2m > ^[[22mreports a pending reference instead of silently composing with an input hole
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8155428Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8156697Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m28:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8157525Z     ^[[90m 26|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8158373Z     ^[[90m 27|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((entry) => [ent…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8159255Z     ^[[90m 28|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8159920Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8160866Z     ^[[90m 29|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8162037Z     ^[[90m 30|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8162791Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m87:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8163085Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8163412Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8163642Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8164456Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/p2-runtime-smells.test.ts^[[2m > ^[[22mP2 runtime smell hardening^[[2m > ^[[22mchooses the blocked upstream deterministically by edge key, not authored edge order
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8165326Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8166297Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m28:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8166850Z     ^[[90m 26|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8167392Z     ^[[90m 27|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((entry) => [ent…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8167978Z     ^[[90m 28|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8168529Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8169192Z     ^[[90m 29|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8169959Z     ^[[90m 30|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8170665Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m106:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8171008Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8171226Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8171457Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8172319Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/partial-seed-inputs.test.ts^[[2m > ^[[22mGraphPublisher partial-seed requirement inputs^[[2m > ^[[22muses the last published value for an unseeded requirement source
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8173328Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8174211Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/partial-seed-inputs.test.ts:^[[2m14:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8174730Z     ^[[90m 12|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8175456Z     ^[[90m 13|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8176584Z     ^[[90m 14|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8177097Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8178031Z     ^[[90m 15|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8178837Z     ^[[90m 16|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8179531Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/partial-seed-inputs.test.ts:^[[2m74:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8180188Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8180462Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8180656Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8181575Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/publisher-output-merge-consistency.test.ts^[[2m > ^[[22mGraphPublisher: memo/registry consistency (recovery A1)^[[2m > ^[[22ma same-flush requirement consumer sees the source's merged value
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8182934Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8184024Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m24:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8185414Z     ^[[90m 22|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8186162Z     ^[[90m 23|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((n) => [n.id, n…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8186872Z     ^[[90m 24|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8187532Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8188236Z     ^[[90m 25|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8189248Z     ^[[90m 26|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8190190Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m57:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8190828Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8191102Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8191334Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8192519Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/publisher-output-merge-consistency.test.ts^[[2m > ^[[22mGraphPublisher: memo/registry consistency (recovery A1)^[[2m > ^[[22ma later flush resolves the source's merged value via registry fallback
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8193705Z ^[[31m^[[1mTypeError^[[22m: deriveDependents is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8194686Z ^[[36m ^[[2m❯^[[22m snapshot packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m24:15^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8195262Z     ^[[90m 22|^[[39m   nodes^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8196062Z     ^[[90m 23|^[[39m   nodeById: Object.freeze(Object.fromEntries(nodes.map((n) => [n.id, n…
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8196708Z     ^[[90m 24|^[[39m   dependents^[[33m:^[[39m ^[[34mderiveDependents^[[39m(nodes)^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8197192Z     ^[[90m   |^[[39m               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8197887Z     ^[[90m 25|^[[39m   order^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m(nodes^[[33m.^[[39m^[[34mmap^[[39m(({ id }) ^[[33m=>^[[39m id))^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8198949Z     ^[[90m 26|^[[39m   diagnostics^[[33m:^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mfreeze^[[39m([])^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8199874Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m86:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8200232Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8200467Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8200717Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8200735Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8201166Z ^[[2m Test Files ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m57 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8201849Z ^[[2m      Tests ^[[22m ^[[1m^[[31m10 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m248 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8202531Z ^[[2m   Start at ^[[22m 16:26:34
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8203351Z ^[[2m   Duration ^[[22m 4.67s^[[2m (transform 1.51s, setup 371ms, import 4.39s, tests 1.18s, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8203671Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8203677Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8227148Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/flush-output-merge.test.ts:14:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/flush-output-merge.test.ts:48:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8236586Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8239349Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/flush-output-merge.test.ts:14:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/flush-output-merge.test.ts:77:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8240888Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8243108Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/graph-publisher.test.ts:34:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/graph-publisher.test.ts:55:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8244454Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8246645Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/graph-publisher.test.ts:34:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/graph-publisher.test.ts:81:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8248113Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8250304Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/p2-runtime-smells.test.ts:28:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/p2-runtime-smells.test.ts:75:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8251717Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8253812Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/p2-runtime-smells.test.ts:28:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/p2-runtime-smells.test.ts:87:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8255211Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8258248Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/p2-runtime-smells.test.ts:28:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/p2-runtime-smells.test.ts:106:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8259790Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8262088Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/partial-seed-inputs.test.ts:14:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/partial-seed-inputs.test.ts:74:19
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8263471Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8266159Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/publisher-output-merge-consistency.test.ts:24:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/publisher-output-merge-consistency.test.ts:57:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8267861Z 
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8270473Z ##[error]TypeError: deriveDependents is not a function
integration (node 24)	Run npm run test:integration	 ❯ snapshot packages/core/test/integration/publisher-output-merge-consistency.test.ts:24:15
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/publisher-output-merge-consistency.test.ts:86:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-09-03T16:26:38.8590978Z ##[error]Process completed with exit code 1.
```
