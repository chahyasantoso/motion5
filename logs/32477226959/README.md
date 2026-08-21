# CI log archive: 32477226959

- Workflow: CI
- Conclusion: failure
- Head branch: feat/issue-173-plugin-owned-requirements
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32477226959
- Captured: 2026-08-21T11:27:21Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-21T11:26:50.1763529Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.1763766Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.1794010Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.1794152Z env:
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.1794259Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.1794377Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.2368747Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.2369337Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.2369622Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.2369749Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.4222439Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.4224207Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.4224837Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7079417Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7149909Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7603718Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7605287Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7606084Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7606796Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7607205Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7693032Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7769304Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7779184Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7780292Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7781243Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7782105Z      ^[[32m✓^[[39m 5. Render multiple tracks from one Motion in one published batch^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7783130Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7784186Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7785092Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7785960Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.7786777Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.8601892Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.8731920Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:50.9351194Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0293401Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0884651Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0909101Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0926575Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0943720Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0961439Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0962422Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0963302Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.0964018Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.1566078Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.2370007Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.2616210Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.3058149Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.3676313Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.4298414Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.4436918Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.5251946Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.5252743Z ^[[31m     ^[[31m×^[[31m N-7 claims the natural bone key names and composes world space from them^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.5255192Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.5255592Z      ^[[32m✓^[[39m N-9 refuses the flat spelling of a key both plugins claim^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.5256066Z      ^[[32m✓^[[39m N-10 publishes grouped leaves under their unprefixed names^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.5717312Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.5872981Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.6494169Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.7069561Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.7302707Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.8040589Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.8332222Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.8897339Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.9349432Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:51.9782572Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.0468535Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.0927516Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.0963954Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.1900034Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.2211580Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.2261912Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.3067076Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.3517478Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.3582370Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.4302079Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.4719711Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.5092779Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.5444675Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.6151200Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.6326084Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.7644676Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.7730675Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.7792890Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.8895340Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.9009260Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:52.9044327Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0060228Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0341559Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0342658Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0943357Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0962025Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0962573Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 9 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0962835Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0989193Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-7 claims the natural bone key names and composes world space from them
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0995648Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'base')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0996466Z ^[[36m ^[[2m❯^[[22m Object.compose packages/core/src/plugins/fk.ts:^[[2m73:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0997290Z     ^[[90m 71|^[[39m   outputs^[[33m:^[[39m [^[[32m"x"^[[39m^[[33m,^[[39m ^[[32m"y"^[[39m^[[33m,^[[39m ^[[32m"rotation"^[[39m]^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0998429Z     ^[[90m 72|^[[39m   compose^[[33m:^[[39m (values^[[33m,^[[39m progress^[[33m,^[[39m inputs) ^[[33m=>^[[39m {
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0999385Z     ^[[90m 73|^[[39m     ^[[35mconst^[[39m base ^[[33m=^[[39m ^[[34mreadBase^[[39m(inputs^[[33m.^[[39mbase)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.0999950Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1000515Z     ^[[90m 74|^[[39m     ^[[35mconst^[[39m length ^[[33m=^[[39m ^[[34mreadNumber^[[39m(values^[[33m.^[[39mlength)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1001217Z     ^[[90m 75|^[[39m     ^[[35mconst^[[39m localRotation ^[[33m=^[[39m ^[[34mreadNumber^[[39m(values^[[33m.^[[39mrotation)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1002005Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m85:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1002348Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1002579Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1002758Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1003654Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1004851Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1005697Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m103:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1006372Z     ^[[90m101|^[[39m     // ownership change that stopped the interpolator reading a leaf w…
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1006856Z     ^[[90m102|^[[39m     ^[[90m// and then hold still.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1007628Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1008499Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1009271Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1010344Z     ^[[90m105|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1010835Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1011044Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1011224Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1012199Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1013422Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1014226Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m292:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1020490Z     ^[[90m290|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1021174Z     ^[[90m291|^[[39m     // Thigh (parentRot=0, own rotation=45): worldRot=45, x = 0 + 50*c…
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1022179Z     ^[[90m292|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1022840Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1023615Z     ^[[90m293|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1024718Z     ^[[90m294|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1025210Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1025430Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1025619Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1026574Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1028058Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1028839Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m102:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1051090Z     ^[[90m100|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1068747Z     ^[[90m101|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1069969Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1074011Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m49 passed^[[39m^[[22m^[[90m (52)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1074862Z ^[[2m      Tests ^[[22m ^[[1m^[[31m9 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m196 passed^[[39m^[[22m^[[90m (205)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1075545Z ^[[2m   Start at ^[[22m 11:26:50
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1076270Z ^[[2m   Duration ^[[22m 2.66s^[[2m (transform 750ms, setup 0ms, import 2.19s, tests 573ms, environment 3ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1076858Z     ^[[90m102|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1077460Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1087280Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1106486Z ##[error]TypeError: Cannot read properties of undefined (reading 'base')
integration (node 24)	Run npm run test:integration	 ❯ Object.compose packages/core/src/plugins/fk.ts:73:34
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:85:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1114201Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1114707Z     ^[[90m103|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1115223Z     ^[[90m104|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1115759Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m171:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1116466Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1117201Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m99:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1117927Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1118147Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1118319Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1119270Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1120388Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 50, received difference is NaN, but expected 5e-13^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1121146Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m126:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1121570Z     ^[[90m124|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1122439Z     ^[[90m125|^[[39m     ^[[35mconst^[[39m values ^[[33m=^[[39m handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walk/thigh"^[[39m)^[[33m?.^[[39mvalues ^[[33m??^[[39m {}^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1123435Z     ^[[90m126|^[[39m     ^[[34mexpect^[[39m(values^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m50^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1123958Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1124616Z     ^[[90m127|^[[39m     ^[[34mexpect^[[39m(values^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1125460Z     ^[[90m128|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mdependantsOf^[[39m(^[[32m"walk/pelvis"^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1125797Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1125934Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1126043Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1126712Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1128142Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'stops-shape at motions[0].tracks[1].k…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1128525Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1128644Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1128892Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1129052Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1129174Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1129694Z "stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1130060Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1130502Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1131003Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1131293Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1131747Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1132283Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1132632Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1132879Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1132993Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1133205Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1133390Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1134338Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1135610Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[1].keyframes.reach.requires.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1136431Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m102:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1137047Z     ^[[90m100|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1137898Z     ^[[90m101|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1138449Z     ^[[90m102|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1138821Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1139275Z     ^[[90m103|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1139778Z     ^[[90m104|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1140275Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m171:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1140944Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1141680Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m155:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1142194Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1142407Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1142717Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1143643Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1144877Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1145598Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m102:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1145941Z     ^[[90m100|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1146651Z     ^[[90m101|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1147231Z     ^[[90m102|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1147588Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1148159Z     ^[[90m103|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1148702Z     ^[[90m104|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1149233Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m171:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1149833Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1150413Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m183:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1150607Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1150731Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1150832Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1151434Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1152704Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'stops-shape at motions[0].tracks[1].k…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1153198Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1153320Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1153545Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1153687Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1153794Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1154119Z "stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array."
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1154351Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1154593Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m201:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1154873Z     ^[[90m199|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1155045Z     ^[[90m200|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1155310Z     ^[[90m201|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1155603Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1155808Z     ^[[90m202|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1155969Z     ^[[90m203|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1156057Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1156179Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1156282Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1156290Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1157463Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:103:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1158296Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1159124Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:292:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1159666Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1161194Z ##[error]TypeError: stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:102:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:171:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:99:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1162288Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1163102Z ##[error]AssertionError: expected undefined to be close to 50, received difference is NaN, but expected 5e-13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:126:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1163662Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1165213Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'stops-shape at motions[0].tracks[1].k…'
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
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1166096Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1167656Z ##[error]TypeError: stops-shape at motions[0].tracks[1].keyframes.reach.requires.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:102:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:171:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:155:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1168691Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1170199Z ##[error]TypeError: stops-shape at motions[0].tracks[1].keyframes.fk.requires.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:102:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:171:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:183:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1171104Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1172648Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'stops-shape at motions[0].tracks[1].k…'
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
integration (node 24)	Run npm run test:integration	2026-08-21T11:26:53.1545564Z ##[error]Process completed with exit code 1.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-21T11:26:51.1690945Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:51.1691670Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:51.1745959Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:51.1746402Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:51.1747071Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:51.1747459Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:53.8609766Z ##[error]packages/core/src/plugins/fk.ts(72,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { x: number; y: number; rotation: number; }' is not assignable to type 'PluginComposer'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:53.8621564Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:53.8623742Z ##[error]packages/core/src/plugins/fk.ts(72,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:53.8626948Z ##[error]packages/core/src/plugins/fk.ts(72,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:53.8629800Z ##[error]packages/core/src/plugins/fk.ts(72,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:26:53.9055291Z ##[error]Process completed with exit code 2.
quality (node 24)	Run npm run typecheck	﻿2026-08-21T11:26:56.8184162Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.8184534Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.8223887Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.8224211Z env:
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.8224428Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.8224647Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.9302410Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.9303373Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.9303992Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-21T11:26:56.9304270Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3364343Z ##[error]packages/core/src/plugins/fk.ts(72,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { x: number; y: number; rotation: number; }' is not assignable to type 'PluginComposer'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3375179Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3378054Z ##[error]packages/core/src/plugins/fk.ts(72,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3380941Z ##[error]packages/core/src/plugins/fk.ts(72,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3383678Z ##[error]packages/core/src/plugins/fk.ts(72,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3387921Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { span: number; }' is not assignable to type 'PluginComposer'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3390499Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3392494Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3395686Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3399207Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3403461Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(34,3): error TS2353: Object literal may only specify known properties, and 'requirements' does not exist in type 'PluginDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3408011Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(50,48): error TS2353: Object literal may only specify known properties, and 'requirements' does not exist in type 'PluginDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3411673Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(72,21): error TS2339: Property 'requirements' does not exist on type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:27:00.3806954Z ##[error]Process completed with exit code 2.
```
