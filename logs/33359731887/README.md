# CI log archive: 33359731887

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-27-handle-base
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33359731887
- Captured: 2026-08-31T05:13:38Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-31T05:13:16.3955497Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.3956081Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.4000045Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.4000335Z env:
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.4000534Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.4000753Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.5027893Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.5028708Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.5029858Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.5030243Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.8775213Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.8820399Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:16.8821285Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.5722331Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.6208205Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 69^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7452935Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7456243Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7471976Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7472806Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7473612Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7474392Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7474758Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7475358Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7475994Z });
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7476563Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7477033Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7478241Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7479571Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.7785002Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 145^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.8682647Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:17.9478851Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.1121535Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.1421645Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.3151827Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.6191409Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.6283255Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.6289730Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.9090294Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.9146547Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:18.9504063Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.2526575Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.2550336Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.2562202Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.2563937Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.2565608Z ^[[31m     ^[[31m×^[[31m U-4 changes nothing when the candidate graph refuses a derived observation^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.2641677Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.2891301Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.5781348Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.6043727Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.6693288Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.8292206Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.8829668Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:19.9723532Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.0901480Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.0991168Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.2128219Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.3491628Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.3786149Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.4953227Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.4955574Z ^[[31m     ^[[31m×^[[31m ingests authored tracks into the removable store without auto-mounting^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.4958850Z      ^[[32m✓^[[39m returns a capability handle and refuses stale ABA handles^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.4960627Z      ^[[32m✓^[[39m replaces a track non-destructively and preserves subscriber identity^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.4961990Z      ^[[32m✓^[[39m reads dependants from the committed graph and rejects source removal^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.4963283Z      ^[[32m✓^[[39m treats observation changes as replacement of the observer track^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.5874382Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.6776983Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.7155414Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.8731194Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.9356672Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:20.9510694Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.1053293Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.2041283Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.2094426Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.3591046Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.4591484Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.4698145Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.5731336Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.6719730Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.7120041Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.7862016Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.9131415Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:21.9323620Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.0450699Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.1346161Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.1862125Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.2392867Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.3778294Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.3891039Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.4507283Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.6421480Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.6472318Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.6577382Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.8631098Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.8874256Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:22.9151833Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0410217Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0579898Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0612708Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0613399Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0613997Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0617922Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0624553Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0625357Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0625898Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0626486Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0627417Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0627991Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0628513Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0629235Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0629774Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0630300Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0630941Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0631340Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0631692Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0632082Z         "v": 100,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0632433Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0632736Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0633067Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0633396Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0633596Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0633905Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0634325Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0634536Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0635567Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m102:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0668101Z     ^[[90m100|^[[39m     // the next flush resolved nothing and published a composition fai…
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0670579Z     ^[[90m101|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0673922Z     ^[[90m102|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m100^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0675573Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0676217Z     ^[[90m103|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0676903Z     ^[[90m104|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0677444Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0677903Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0678286Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0680652Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0683040Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0683709Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0683998Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0684409Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0684753Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0685167Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0685543Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0685886Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0686233Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0686609Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0686976Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0687307Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0687955Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0688538Z         "v": 200,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0689161Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0689503Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0689798Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0690095Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0690255Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0690862Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0691268Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0691458Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0692219Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m117:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0692794Z     ^[[90m115|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0693621Z     ^[[90m116|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0694930Z     ^[[90m117|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0695776Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0696142Z     ^[[90m118|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0696508Z     ^[[90m119|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0696761Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0696998Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0697217Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0698706Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0701226Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0701877Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0702138Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0702530Z {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0702853Z   "id": "arm",
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0703215Z   "keyframes": {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0703599Z     "x": [
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0703995Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0704356Z         "p": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0704721Z         "v": 0,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0705054Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0705376Z       {
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0705716Z         "p": 1,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0706070Z         "v": 100,
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0706421Z       },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0706745Z     ],
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0707057Z   },
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0707365Z }
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0707542Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0707802Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0708257Z undefined
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0708446Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0709792Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m131:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0711376Z     ^[[90m129|^[[39m     // all moved to a definition the Motion then refused, so the handl…
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0712596Z     ^[[90m130|^[[39m     // never took effect and the node composed values nothing had acce…
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0714651Z     ^[[90m131|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m100^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0716296Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0717830Z     ^[[90m132|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0719303Z     ^[[90m133|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0719551Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0719998Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0720361Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0722486Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-4 changes nothing when the candidate graph refuses a derived observation
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0724806Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'observes')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0726403Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m147:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0727749Z     ^[[90m145|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0728615Z     ^[[90m146|^[[39m     expect((thrown as Error).message).toMatch(/^observation-unknown-so…
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0730813Z     ^[[90m147|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack^[[33m.^[[39mobserves)^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0732235Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0733789Z     ^[[90m148|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0734978Z     ^[[90m149|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0735209Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0735642Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0736014Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0737977Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mingests authored tracks into the removable store without auto-mounting
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0740356Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'id')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0741843Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m41:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0743423Z     ^[[90m 39|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"scene/arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0744920Z     ^[[90m 40|^[[39m     ^[[35mconst^[[39m free ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"~/free"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0746444Z     ^[[90m 41|^[[39m     ^[[34mexpect^[[39m(authored^[[33m.^[[39mtrack^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0747530Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0748726Z     ^[[90m 42|^[[39m     ^[[34mexpect^[[39m(free^[[33m.^[[39mtrack^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"free"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0750922Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m handle^[[33m.^[[39m^[[34mmount^[[39m(^[[32m"scene/arm"^[[39m))^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0751887Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0752365Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0752723Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0752757Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0753594Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m60 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0754992Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m253 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0755907Z ^[[2m   Start at ^[[22m 05:13:16
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0757096Z ^[[2m   Duration ^[[22m 6.16s^[[2m (transform 1.73s, setup 433ms, import 5.25s, tests 1.73s, environment 12ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0757816Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0757826Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0786610Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "id": "arm",
integration (node 24)	Run npm run test:integration	  "keyframes": {
integration (node 24)	Run npm run test:integration	    "x": [
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 0,
integration (node 24)	Run npm run test:integration	        "v": 0,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 1,
integration (node 24)	Run npm run test:integration	        "v": 100,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	    ],
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:102:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0798810Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0803518Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "id": "arm",
integration (node 24)	Run npm run test:integration	  "keyframes": {
integration (node 24)	Run npm run test:integration	    "x": [
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 0,
integration (node 24)	Run npm run test:integration	        "v": 0,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 1,
integration (node 24)	Run npm run test:integration	        "v": 200,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	    ],
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:117:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0806077Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0810589Z ##[error]AssertionError: expected undefined to deeply equal { id: 'arm', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "id": "arm",
integration (node 24)	Run npm run test:integration	  "keyframes": {
integration (node 24)	Run npm run test:integration	    "x": [
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 0,
integration (node 24)	Run npm run test:integration	        "v": 0,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	      {
integration (node 24)	Run npm run test:integration	        "p": 1,
integration (node 24)	Run npm run test:integration	        "v": 100,
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	    ],
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:131:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0813649Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0816425Z ##[error]TypeError: Cannot read properties of undefined (reading 'observes')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:147:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0818246Z 
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.0821227Z ##[error]TypeError: Cannot read properties of undefined (reading 'id')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:41:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T05:13:23.1116529Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-31T05:13:18.7038264Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.7038610Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.7078080Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.7078363Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.7078566Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.7078780Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.8083806Z 
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.8084586Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.8085396Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:18.8085788Z 
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7846515Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(102,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7856695Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(117,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7858768Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(131,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7861067Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(147,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7862947Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(41,21): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7864747Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(42,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7866754Z ##[error]packages/core/test/unit/runtime/live-value-animated.test.ts(90,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7868564Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(117,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7872574Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(181,18): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7874460Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(182,18): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7876251Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(209,16): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7878029Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(267,24): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7880194Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(277,16): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7882066Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(145,42): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7883873Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(162,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7885650Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(216,19): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7887378Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(219,19): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7889367Z ##[error]packages/core/test/unit/runtime/structural-commit-path.test.ts(109,46): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7891284Z ##[error]packages/core/test/unit/runtime/structural-commit-path.test.ts(243,36): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7893053Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(107,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7894736Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(126,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.7896909Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(142,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:13:22.8336960Z ##[error]Process completed with exit code 2.
```
