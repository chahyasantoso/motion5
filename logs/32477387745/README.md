# CI log archive: 32477387745

- Workflow: CI
- Conclusion: failure
- Head branch: feat/issue-173-plugin-owned-requirements
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32477387745
- Captured: 2026-08-21T11:29:27Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-21T11:29:07.6799022Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:07.6799429Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:07.6837885Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:07.6838405Z env:
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:07.6838647Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:07.6838915Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:07.7900362Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:07.7901220Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:07.7901871Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.2506629Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.2506725Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.2510870Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.2511445Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.7531077Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.7615454Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8523283Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8526595Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8549330Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8550954Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8551893Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8736203Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 82^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8739698Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8741768Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8743739Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8745663Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8747564Z      ^[[32m✓^[[39m 5. Render multiple tracks from one Motion in one published batch^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8750323Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8752529Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8754596Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8756477Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:08.8758481Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.0265303Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.0321938Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.1530539Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.2847407Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.3393454Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.3396190Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.3399673Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.3407669Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.3429998Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.3439911Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.3450881Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.3833401Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.5330526Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.6290943Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.6472643Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.7649591Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.8984928Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.9088047Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:09.9990382Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.1439700Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.1907268Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.1910429Z ^[[31m     ^[[31m×^[[31m N-7 claims the natural bone key names and composes world space from them^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.1912741Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.1914444Z      ^[[32m✓^[[39m N-9 refuses the flat spelling of a key both plugins claim^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.1915917Z      ^[[32m✓^[[39m N-10 publishes grouped leaves under their unprefixed names^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.2532602Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.3583162Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.4411224Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.4670538Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.6115268Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.6951499Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.7117138Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.8236198Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.9838836Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:10.9871678Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.0561523Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.1598694Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.2569083Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.3270401Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.3656416Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.4871671Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.5520855Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.5762412Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.7103911Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.7760967Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.8004780Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:11.9111509Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.0016731Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.0340718Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.2655553Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.2724923Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.2847408Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.4570383Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.4893569Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.5283758Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.6898794Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.6949308Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.7524058Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8360047Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8395770Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8396749Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 9 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8419021Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8432066Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-7 claims the natural bone key names and composes world space from them
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8433544Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'base')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8434826Z ^[[36m ^[[2m❯^[[22m Object.compose packages/core/src/plugins/fk.ts:^[[2m75:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8443996Z     ^[[90m 73|^[[39m   outputs^[[33m:^[[39m [^[[32m"x"^[[39m^[[33m,^[[39m ^[[32m"y"^[[39m^[[33m,^[[39m ^[[32m"rotation"^[[39m]^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8445580Z     ^[[90m 74|^[[39m   compose^[[33m:^[[39m (values^[[33m,^[[39m progress^[[33m,^[[39m inputs) ^[[33m=>^[[39m {
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8446498Z     ^[[90m 75|^[[39m     ^[[35mconst^[[39m base ^[[33m=^[[39m ^[[34mreadBase^[[39m(inputs^[[33m.^[[39mbase)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8447271Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8447945Z     ^[[90m 76|^[[39m     ^[[35mconst^[[39m length ^[[33m=^[[39m ^[[34mreadNumber^[[39m(values^[[33m.^[[39mlength)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8449077Z     ^[[90m 77|^[[39m     ^[[35mconst^[[39m localRotation ^[[33m=^[[39m ^[[34mreadNumber^[[39m(values^[[33m.^[[39mrotation)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8450050Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m85:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8450458Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8450716Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8450938Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8451923Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8453641Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8454893Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m103:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8468593Z     ^[[90m101|^[[39m     // ownership change that stopped the interpolator reading a leaf w…
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8469480Z     ^[[90m102|^[[39m     ^[[90m// and then hold still.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8471209Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8472651Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8474359Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8476626Z     ^[[90m105|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8477667Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8478150Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8478800Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8480826Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8482413Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8483339Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m292:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8500654Z     ^[[90m290|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8501643Z     ^[[90m291|^[[39m     // Thigh (parentRot=0, own rotation=45): worldRot=45, x = 0 + 50*c…
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8504094Z     ^[[90m292|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8505552Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8507098Z     ^[[90m293|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8509680Z     ^[[90m294|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8510774Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8511690Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8512080Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8514091Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8516968Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8518908Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m102:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8559263Z     ^[[90m100|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8561116Z     ^[[90m101|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8562776Z     ^[[90m102|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8574166Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8575352Z     ^[[90m103|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8576643Z     ^[[90m104|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8577931Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m171:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8579995Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8582265Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m99:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8583385Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8584234Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8584682Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8586732Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8589472Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 50, received difference is NaN, but expected 5e-13^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8591206Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m126:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8592162Z     ^[[90m124|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8593521Z     ^[[90m125|^[[39m     ^[[35mconst^[[39m values ^[[33m=^[[39m handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walk/thigh"^[[39m)^[[33m?.^[[39mvalues ^[[33m??^[[39m {}^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8595327Z     ^[[90m126|^[[39m     ^[[34mexpect^[[39m(values^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m50^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8596451Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8597725Z     ^[[90m127|^[[39m     ^[[34mexpect^[[39m(values^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8599748Z     ^[[90m128|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mdependantsOf^[[39m(^[[32m"walk/pelvis"^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8600921Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8601357Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8601898Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8603745Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8606480Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'stops-shape at motions[0].tracks[1].k…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8607532Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8607780Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8610675Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8611045Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8611352Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8612431Z "stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8613234Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8614186Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8615270Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8615864Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8616787Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8617959Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8618946Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8619451Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8619673Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8620122Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8620489Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8622529Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8625300Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[1].keyframes.reach.requires.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8627023Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m102:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8628478Z     ^[[90m100|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8630072Z     ^[[90m101|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8631381Z     ^[[90m102|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8632165Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8633146Z     ^[[90m103|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8634279Z     ^[[90m104|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8635441Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m171:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8637309Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8639262Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m155:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8640008Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8640452Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8640830Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8642852Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8645537Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8647216Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m102:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8648702Z     ^[[90m100|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8650527Z     ^[[90m101|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8652124Z     ^[[90m102|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8652895Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8653827Z     ^[[90m103|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8654929Z     ^[[90m104|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8656054Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m171:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8657496Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8663775Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m183:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8664550Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8664992Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8665395Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8667312Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8670395Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'stops-shape at motions[0].tracks[1].k…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8671465Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8671703Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8672159Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8672454Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8672688Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8673721Z "stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8674507Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8675404Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m201:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8676472Z     ^[[90m199|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8677052Z     ^[[90m200|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8677925Z     ^[[90m201|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8679115Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8679819Z     ^[[90m202|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8680379Z     ^[[90m203|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8680659Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8681083Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8681446Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8681488Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8682323Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m49 passed^[[39m^[[22m^[[90m (52)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8683758Z ^[[2m      Tests ^[[22m ^[[1m^[[31m9 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m196 passed^[[39m^[[22m^[[90m (205)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8684680Z ^[[2m   Start at ^[[22m 11:29:08
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8685848Z ^[[2m   Duration ^[[22m 4.57s^[[2m (transform 1.14s, setup 0ms, import 3.70s, tests 1.07s, environment 8ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8686569Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8686600Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8713265Z ##[error]TypeError: Cannot read properties of undefined (reading 'base')
integration (node 24)	Run npm run test:integration	 ❯ Object.compose packages/core/src/plugins/fk.ts:75:34
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:85:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8723260Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8725879Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:103:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8727189Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8729488Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:292:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8730642Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8733836Z ##[error]TypeError: stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:102:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:171:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:99:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8735984Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8737639Z ##[error]AssertionError: expected undefined to be close to 50, received difference is NaN, but expected 5e-13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:126:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8739185Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8745336Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'stops-shape at motions[0].tracks[1].k…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:139:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8748668Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8752112Z ##[error]TypeError: stops-shape at motions[0].tracks[1].keyframes.reach.requires.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:102:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:171:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:155:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8754073Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8757401Z ##[error]TypeError: stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:102:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:171:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:183:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8759797Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8762983Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'stops-shape at motions[0].tracks[1].k…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:201:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:29:12.8986415Z ##[error]Process completed with exit code 1.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-21T11:29:01.9599670Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:01.9600196Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:01.9636458Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:01.9636686Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:01.9636887Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:01.9637085Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:04.3950977Z ##[error]packages/core/src/plugins/fk.ts(74,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { x: number; y: number; rotation: number; }' is not assignable to type 'PluginComposer'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:04.3958118Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:04.3959785Z ##[error]packages/core/src/plugins/fk.ts(74,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:04.3961548Z ##[error]packages/core/src/plugins/fk.ts(74,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:04.3963257Z ##[error]packages/core/src/plugins/fk.ts(74,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:29:04.4278511Z ##[error]Process completed with exit code 2.
quality (node 24)	Run npm run typecheck	﻿2026-08-21T11:29:03.0721874Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.0722219Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.0771953Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.0772270Z env:
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.0772485Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.0772710Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.1865068Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.1865885Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.1866575Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:03.1866883Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6169119Z ##[error]packages/core/src/plugins/fk.ts(74,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { x: number; y: number; rotation: number; }' is not assignable to type 'PluginComposer'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6178858Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6180924Z ##[error]packages/core/src/plugins/fk.ts(74,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6183380Z ##[error]packages/core/src/plugins/fk.ts(74,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6185782Z ##[error]packages/core/src/plugins/fk.ts(74,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6189011Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { span: number; }' is not assignable to type 'PluginComposer'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6191138Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6192856Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6195735Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6198397Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6202079Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(34,3): error TS2353: Object literal may only specify known properties, and 'requirements' does not exist in type 'PluginDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6206073Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(50,48): error TS2353: Object literal may only specify known properties, and 'requirements' does not exist in type 'PluginDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6209284Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(72,21): error TS2339: Property 'requirements' does not exist on type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:29:06.6606750Z ##[error]Process completed with exit code 2.
```
