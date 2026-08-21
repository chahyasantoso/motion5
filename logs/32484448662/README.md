# CI log archive: 32484448662

- Workflow: CI
- Conclusion: failure
- Head branch: fix/issue-176-transactional-track-replacement
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32484448662
- Captured: 2026-08-21T12:58:47Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-21T12:58:26.6754197Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.6754587Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.6793876Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.6794158Z env:
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.6794390Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.6794632Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.7832990Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.7833630Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.7834437Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:26.7834891Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:27.1977927Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:27.1980661Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:27.1981427Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:27.7045400Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:27.7142843Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:27.7241989Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:27.9129440Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:27.9977170Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.0793204Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.0795021Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.0807517Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.0827194Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.0828328Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.0828840Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.1523200Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.2797797Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.3061169Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.4396149Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.4398460Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.4400415Z      ^[[32m✓^[[39m U-2 leaves a refused recompile retryable rather than stranding the node^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.4402261Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.4403966Z      ^[[32m✓^[[39m U-4 changes nothing when the candidate graph refuses a derived observation^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.5358149Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.5487546Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.6963083Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.7918548Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.8016692Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:28.9494481Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.0405021Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.0602294Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.1938745Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.2549982Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.3079074Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.4351349Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.4987006Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.5578932Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.6564910Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.7677588Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.7865139Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.8927543Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:29.9921267Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.0384197Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.1105198Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.2018675Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.3083156Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.3367936Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.4267416Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.5294500Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.5404138Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.6398188Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.7404552Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.7668767Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.8353983Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.9707532Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:30.9800647Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.1969968Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.2068345Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.2129217Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.3933104Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.4350050Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.4397785Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.6053487Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.6786806Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.6817756Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7551841Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7583647Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7584305Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7584623Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7588489Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7594927Z ^[[31m^[[1mAssertionError^[[22m: expected true to be false // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7595416Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7596100Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7596448Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7596596Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7596718Z ^[[32m- false^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7596966Z ^[[31m+ true^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7597087Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7598030Z ^[[36m ^[[2m❯^[[22m valuesAfterSeek packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m77:66^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7635089Z     ^[[90m 75|^[[39m function valuesAfterSeek(handle: ProjectHandle, progress: number): unk…
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7637321Z     ^[[90m 76|^[[39m   ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[33mNODE_ID^[[39m^[[33m,^[[39m progress)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7639297Z     ^[[90m 77|^[[39m   expect(batch.patches.some(({ status }) => status === "error")).toBe(…
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7640901Z     ^[[90m   |^[[39m                                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7642588Z     ^[[90m 78|^[[39m   ^[[35mreturn^[[39m handle^[[33m.^[[39m^[[35mget^[[39m(^[[33mNODE_ID^[[39m)^[[33m?.^[[39mvalues^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7643731Z     ^[[90m 79|^[[39m }
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7645250Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m99:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7646969Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7650602Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7651501Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7651917Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7653989Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7655681Z ^[[31m^[[1mAssertionError^[[22m: expected { id: 'arm', duration: +0, …(1) } to deeply equal { id: 'arm', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7656470Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7656639Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7656911Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7657061Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7657270Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7657731Z ^[[31m+   "duration": 0,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7658139Z ^[[2m    "id": "arm",^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7658433Z ^[[2m    "keyframes": {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7658704Z ^[[2m      "x": {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7658966Z ^[[2m        "stops": [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7659242Z ^[[2m          {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7659716Z ^[[2m            "p": 0,^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7660020Z ^[[2m            "v": 0,^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7660446Z ^[[2m          },^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7660822Z ^[[2m          {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7661081Z ^[[2m            "p": 1,^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7661391Z ^[[32m-           "v": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7661702Z ^[[31m+           "v": 400,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7661968Z ^[[2m          },^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7662215Z ^[[2m        ],^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7662453Z ^[[2m      },^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7662686Z ^[[2m    },^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7662961Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7663175Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7664283Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m129:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7665180Z     ^[[90m127|^[[39m     // all moved to a definition the Motion then refused, so the handl…
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7666071Z     ^[[90m128|^[[39m     // never took effect and the node composed values nothing had acce…
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7667229Z     ^[[90m129|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39mtrack)^[[33m.^[[39m^[[34mtoEqual^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m100^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7668101Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7668981Z     ^[[90m130|^[[39m     ^[[34mexpect^[[39m(^[[34mvaluesAfterSeek^[[39m(handle^[[33m,^[[39m ^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m50^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7669646Z     ^[[90m131|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7669782Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7670027Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7670243Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7670712Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m52 passed^[[39m^[[22m^[[90m (53)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7671519Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m207 passed^[[39m^[[22m^[[90m (209)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7672059Z ^[[2m   Start at ^[[22m 12:58:27
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7672722Z ^[[2m   Duration ^[[22m 4.54s^[[2m (transform 1.15s, setup 0ms, import 3.74s, tests 1.06s, environment 8ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7673116Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7696556Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7722902Z ##[error]AssertionError: expected true to be false // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- false
integration (node 24)	Run npm run test:integration	+ true
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ valuesAfterSeek packages/core/test/integration/replace-track-transactionality.test.ts:77:66
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:99:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7736819Z 
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.7740419Z ##[error]AssertionError: expected { id: 'arm', duration: +0, …(1) } to deeply equal { id: 'arm', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	+   "duration": 0,
integration (node 24)	Run npm run test:integration	    "id": "arm",
integration (node 24)	Run npm run test:integration	    "keyframes": {
integration (node 24)	Run npm run test:integration	      "x": {
integration (node 24)	Run npm run test:integration	        "stops": [
integration (node 24)	Run npm run test:integration	          {
integration (node 24)	Run npm run test:integration	            "p": 0,
integration (node 24)	Run npm run test:integration	            "v": 0,
integration (node 24)	Run npm run test:integration	          },
integration (node 24)	Run npm run test:integration	          {
integration (node 24)	Run npm run test:integration	            "p": 1,
integration (node 24)	Run npm run test:integration	-           "v": 100,
integration (node 24)	Run npm run test:integration	+           "v": 400,
integration (node 24)	Run npm run test:integration	          },
integration (node 24)	Run npm run test:integration	        ],
integration (node 24)	Run npm run test:integration	      },
integration (node 24)	Run npm run test:integration	    },
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:129:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T12:58:31.8104987Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-21T12:58:19.7435001Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.7435374Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.7477846Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.7478391Z env:
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.7478620Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.7478882Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.8491842Z 
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.8492866Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.8493642Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:19.8494042Z 
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:23.2717078Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(4,31): error TS2305: Module '"../../../src/runtime/project-runtime"' has no exported member 'StagedTrack'.
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:23.2731434Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(85,5): error TS2353: Object literal may only specify known properties, and 'stageTrack' does not exist in type 'ProjectRuntimeOptions'.
quality (node 24)	Run npm run typecheck	2026-08-21T12:58:23.3143076Z ##[error]Process completed with exit code 2.
```
