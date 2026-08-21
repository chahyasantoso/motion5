# CI log archive: 32486614034

- Workflow: CI
- Conclusion: failure
- Head branch: fix/issue-176-transactional-track-replacement
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32486614034
- Captured: 2026-08-21T13:24:20Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-21T13:23:58.2515320Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.2515680Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.2539423Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.2539709Z env:
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.2539910Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.2540123Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.3497756Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.3498418Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.3498865Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.3499088Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.6651924Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.6655982Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:58.6656857Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.1298974Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.1387577Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.1485378Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.3612745Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.3643172Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.4846065Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.4873667Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.4874850Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 65^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.4903344Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.4914156Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.4914503Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.5772097Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.6574287Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.7137655Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.8159281Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.8160559Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.8161475Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.8166467Z      ^[[32m✓^[[39m U-3 changes nothing when the owning Motion refuses the replacement^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.8168041Z      ^[[32m✓^[[39m U-4 changes nothing when the candidate graph refuses a derived observation^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.8569940Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:23:59.9773930Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.0683980Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.0843457Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.1923419Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.2987365Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.3173595Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.4483534Z  ^[[31m❯^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.4486165Z ^[[31m     ^[[31m×^[[31m C-9 keeps a motion-owned track live through replacement^[[39m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.4495912Z ^[[31m     ^[[31m×^[[31m C-10 preserves the array index and stagger timing across a replacement^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.4497587Z      ^[[32m✓^[[39m C-11 keeps the observation replacement path resolvable^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.4508277Z      ^[[32m✓^[[39m C-12 disposes every compiled timeline exactly once^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.4509188Z      ^[[32m✓^[[39m C-13 keeps runtime add and remove in step with the resolver^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.5285899Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.5371430Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.6396885Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.7352088Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.7969091Z  ^[[31m❯^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.7971646Z ^[[31m     ^[[31m×^[[31m does not drive the disposed Track after direct replacement^[[39m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.7973684Z ^[[31m     ^[[31m×^[[31m preserves current progress when replacing^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.7975206Z ^[[31m     ^[[31m×^[[31m preserves the original array index and stagger timing^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.7976742Z ^[[31m     ^[[31m×^[[31m keeps sibling progress healthy after replacement^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.7978187Z      ^[[32m✓^[[39m keeps the observation replacement path live^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.8746161Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.8773611Z      ^[[32m✓^[[39m ingests authored tracks into the removable store without auto-mounting^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.8778038Z      ^[[32m✓^[[39m returns a capability handle and makes stale ABA handles inert^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.8779701Z ^[[31m     ^[[31m×^[[31m replaces a track non-destructively and preserves subscriber identity^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.8781130Z      ^[[32m✓^[[39m reads dependants from the committed graph and rejects source removal^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.8782568Z      ^[[32m✓^[[39m treats observation changes as replacement of the observer track^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:00.9518998Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.0410055Z  ^[[31m❯^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.0412558Z ^[[31m     ^[[31m×^[[31m re-registers the compiled Track without throwing on the next Motion update^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.0414056Z ^[[31m     ^[[31m×^[[31m preserves the replaced Track index and stagger timing^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.0414792Z      ^[[32m✓^[[39m updates a Motion-owned Track through observation mutations^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.1309113Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.1794382Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.2585574Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.3585220Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.3663831Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.4684118Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.5539492Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.5953585Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.6674107Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.7678596Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.7705426Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.8836132Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.9475883Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:01.9763293Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.0547804Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.1532453Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.1640766Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.3990816Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.4064128Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.4126810Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.5897815Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.6067282Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.6166240Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.7922031Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.8098244Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.8129193Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9263372Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9294700Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9295693Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 11 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9296171Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9299982Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mdoes not drive the disposed Track after direct replacement
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9305503Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 100 } to deeply equal { x: 250 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9305891Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9306136Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9306574Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9306773Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9306884Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9307122Z ^[[32m-   "x": 250,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9307374Z ^[[31m+   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9307605Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9307711Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9308236Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m51:45^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9347444Z     ^[[90m 49|^[[39m       scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9348597Z     ^[[90m 50|^[[39m     })^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/Track is disposed/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9350279Z     ^[[90m 51|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m250^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9351682Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9354124Z     ^[[90m 52|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9354815Z     ^[[90m 53|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9355149Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9355582Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9355956Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9357621Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves current progress when replacing
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9359637Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 50 } to deeply equal { x: 100 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9360116Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9360359Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9360820Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9361092Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9361273Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9361709Z ^[[32m-   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9362341Z ^[[31m+   "x": 50,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9362771Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9362968Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9363856Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m63:45^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9365262Z     ^[[90m 61|^[[39m     ^[[34mflushReplacement^[[39m(clock^[[33m,^[[39m scheduler)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9366055Z     ^[[90m 62|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9367559Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9369013Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9369906Z     ^[[90m 64|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9370634Z     ^[[90m 65|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9371199Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9371650Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9372315Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9374292Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves the original array index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9376377Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 100 } to deeply equal { x: 200 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9376960Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9377207Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9377673Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9377897Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9378065Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9378486Z ^[[32m-   "x": 200,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9378930Z ^[[31m+   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9379288Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9379471Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9380319Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m79:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9381654Z     ^[[90m 77|^[[39m     ^[[34mflushReplacement^[[39m(clock^[[33m,^[[39m scheduler)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9382589Z     ^[[90m 78|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9383911Z     ^[[90m 79|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/first"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m200^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9385213Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9386812Z     ^[[90m 80|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/second"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9389063Z     ^[[90m 81|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/third"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9390085Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9390543Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9390944Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9393034Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps sibling progress healthy after replacement
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9395030Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 50 } to deeply equal { x: 200 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9395627Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9395867Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9396361Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9396600Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9396801Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9397248Z ^[[32m-   "x": 200,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9397676Z ^[[31m+   "x": 50,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9398067Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9398260Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9399100Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m97:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9400235Z     ^[[90m 95|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9400808Z     ^[[90m 96|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9402394Z     ^[[90m 97|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/first"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m200^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9403749Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9405276Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/second"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9406616Z     ^[[90m 99|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9407110Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9407557Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9408028Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9410091Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-9 keeps a motion-owned track live through replacement
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9412799Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 50 } to deeply equal { x: 100 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9413520Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9413778Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9414270Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9414523Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9414720Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9415185Z ^[[32m-   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9415668Z ^[[31m+   "x": 50,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9416102Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9416314Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9417241Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m67:45^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9418402Z     ^[[90m 65|^[[39m     clock^[[33m.^[[39m^[[34mtick^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9419295Z     ^[[90m 66|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9420721Z     ^[[90m 67|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9422161Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9423020Z     ^[[90m 68|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9423801Z     ^[[90m 69|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9424064Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9424470Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9424809Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9426850Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-10 preserves the array index and stagger timing across a replacement
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9429306Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 100 } to deeply equal { x: 200 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9429944Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9430187Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9430676Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9430921Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9431149Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9431595Z ^[[32m-   "x": 200,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9432276Z ^[[31m+   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9432724Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9432935Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9433865Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m80:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9435111Z     ^[[90m 78|^[[39m     clock^[[33m.^[[39m^[[34mtick^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9436069Z     ^[[90m 79|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9437823Z     ^[[90m 80|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/first"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m200^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9439278Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9440773Z     ^[[90m 81|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/second"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9442902Z     ^[[90m 82|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/third"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9443885Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9444303Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9444672Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9446312Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mre-registers the compiled Track without throwing on the next Motion update
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9448175Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 50 } to deeply equal { x: 125 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9448682Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9448947Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9449393Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9449632Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9449797Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9450206Z ^[[32m-   "x": 125,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9450969Z ^[[31m+   "x": 50,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9451389Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9451684Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9452565Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m41:45^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9453634Z     ^[[90m 39|^[[39m       scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9454480Z     ^[[90m 40|^[[39m     })^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9455946Z     ^[[90m 41|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m125^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9457241Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9457921Z     ^[[90m 42|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9458523Z     ^[[90m 43|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9458928Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9459349Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9459721Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9461218Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mpreserves the replaced Track index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9463125Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 100 } to deeply equal { x: 200 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9463619Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9463864Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9464306Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9464539Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9464729Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9465115Z ^[[32m-   "x": 200,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9465539Z ^[[31m+   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9465923Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9466105Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9466899Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m77:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9467989Z     ^[[90m 75|^[[39m       scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9468834Z     ^[[90m 76|^[[39m     })^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9470377Z     ^[[90m 77|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/first"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m200^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9471685Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9473323Z     ^[[90m 78|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/second"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9475225Z     ^[[90m 79|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"scene/third"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9476092Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9476521Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9476875Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9478609Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9480433Z ^[[31m^[[1mError^[[22m: Expected the operation to throw.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9481738Z ^[[36m ^[[2m❯^[[22m thrownBy packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m87:9^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9483050Z     ^[[90m 85|^[[39m     ^[[35mreturn^[[39m error^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9483615Z     ^[[90m 86|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9484608Z     ^[[90m 87|^[[39m   ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mError^[[39m(^[[32m"Expected the operation to throw."^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9485565Z     ^[[90m   |^[[39m         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9486068Z     ^[[90m 88|^[[39m }
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9486465Z     ^[[90m 89|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9487589Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m94:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9488543Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9489015Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9489497Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9491412Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9493601Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw an error^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9494099Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9494335Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9494689Z null
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9494864Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9495089Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9495464Z undefined
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9495641Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9496537Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m111:63^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9497748Z     ^[[90m109|^[[39m     ^[[35mconst^[[39m handle ^[[33m=^[[39m ^[[34mload^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9498457Z     ^[[90m110|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9499260Z     ^[[90m111|^[[39m     expect(() => handle.track(NODE_ID).replace(UNRESOLVABLE)).toThrow(…
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9500238Z     ^[[90m   |^[[39m                                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9501751Z     ^[[90m112|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9502995Z     ^[[90m113|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9503209Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9503606Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9503955Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9505634Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreplaces a track non-destructively and preserves subscriber identity
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9507520Z ^[[31m^[[1mAssertionError^[[22m: expected { x: 100 } to deeply equal { x: 250 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9508068Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9508294Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9508738Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9508986Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9509162Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9509570Z ^[[32m-   "x": 250,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9509982Z ^[[31m+   "x": 100,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9510360Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9510541Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9511328Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m71:51^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9513150Z     ^[[90m 69|^[[39m     handleForTrack^[[33m.^[[39m^[[34mreplace^[[39m(^[[34mtrack^[[39m(^[[32m"arm"^[[39m^[[33m,^[[39m ^[[34m0^[[39m^[[33m,^[[39m ^[[34m250^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9514516Z     ^[[90m 70|^[[39m     handle^[[33m.^[[39m^[[34mseek^[[39m(handleForTrack^[[33m.^[[39mid^[[33m,^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9516291Z     ^[[90m 71|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(handleForTrack^[[33m.^[[39mid)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m250^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9517681Z     ^[[90m   |^[[39m                                                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9518725Z     ^[[90m 72|^[[39m     expect(handle.get(handleForTrack.id)?.revision).toBeGreaterThan(be…
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9520034Z     ^[[90m 73|^[[39m     ^[[34mexpect^[[39m(seen)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"destroyed"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9520711Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9521128Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9521499Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9521537Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9522503Z ^[[2m Test Files ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m48 passed^[[39m^[[22m^[[90m (53)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9523763Z ^[[2m      Tests ^[[22m ^[[1m^[[31m11 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m198 passed^[[39m^[[22m^[[90m (209)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9524642Z ^[[2m   Start at ^[[22m 13:23:58
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9525698Z ^[[2m   Duration ^[[22m 4.25s^[[2m (transform 1.12s, setup 0ms, import 3.56s, tests 1.04s, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9526689Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9526702Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9555919Z ##[error]AssertionError: expected { x: 100 } to deeply equal { x: 250 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 250,
integration (node 24)	Run npm run test:integration	+   "x": 100,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:51:45
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9567881Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9571164Z ##[error]AssertionError: expected { x: 50 } to deeply equal { x: 100 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 100,
integration (node 24)	Run npm run test:integration	+   "x": 50,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:63:45
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9573243Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9575591Z ##[error]AssertionError: expected { x: 100 } to deeply equal { x: 200 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 200,
integration (node 24)	Run npm run test:integration	+   "x": 100,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:79:47
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9576671Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9578623Z ##[error]AssertionError: expected { x: 50 } to deeply equal { x: 200 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 200,
integration (node 24)	Run npm run test:integration	+   "x": 50,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:97:47
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9579671Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9581383Z ##[error]AssertionError: expected { x: 50 } to deeply equal { x: 100 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 100,
integration (node 24)	Run npm run test:integration	+   "x": 50,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:67:45
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9583061Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9585588Z ##[error]AssertionError: expected { x: 100 } to deeply equal { x: 200 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 200,
integration (node 24)	Run npm run test:integration	+   "x": 100,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:80:47
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9587239Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9589613Z ##[error]AssertionError: expected { x: 50 } to deeply equal { x: 125 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 125,
integration (node 24)	Run npm run test:integration	+   "x": 50,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:41:45
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9591231Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9594048Z ##[error]AssertionError: expected { x: 100 } to deeply equal { x: 200 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 200,
integration (node 24)	Run npm run test:integration	+   "x": 100,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:77:47
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9595811Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9599141Z ##[error]Error: Expected the operation to throw.
integration (node 24)	Run npm run test:integration	 ❯ thrownBy packages/core/test/integration/replace-track-transactionality.test.ts:87:9
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:94:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9601134Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9603754Z ##[error]AssertionError: expected [Function] to throw an error
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	null
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:111:63
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9605434Z 
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9607962Z ##[error]AssertionError: expected { x: 100 } to deeply equal { x: 250 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "x": 250,
integration (node 24)	Run npm run test:integration	+   "x": 100,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:71:51
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T13:24:02.9777613Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run format:check	﻿2026-08-21T13:23:57.9447515Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:23:57.9447963Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-21T13:23:57.9481577Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-21T13:23:57.9481800Z env:
quality (node 24)	Run npm run format:check	2026-08-21T13:23:57.9481976Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-21T13:23:57.9482303Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-21T13:23:58.0249299Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:23:58.0249965Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:23:58.0250369Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-21T13:23:58.0250509Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:23:58.0892615Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-21T13:24:00.6370177Z [^[[33mwarn^[[39m] packages/core/src/runtime/project-runtime.ts
quality (node 24)	Run npm run format:check	2026-08-21T13:24:01.6060585Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-21T13:24:01.6443399Z ##[error]Process completed with exit code 1.
```
