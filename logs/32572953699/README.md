# CI log archive: 32572953699

- Workflow: CI
- Conclusion: failure
- Head branch: feat/plugin-group-values-section
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32572953699
- Captured: 2026-08-22T12:26:06Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-22T12:25:46.3998619Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.3999170Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.4042489Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.4042790Z env:
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.4043027Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.4043259Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.5071101Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.5071733Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.5072224Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.5072479Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.8173885Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.8178222Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:46.8179320Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.2822004Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3002589Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3650989Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m11 failed^[[39m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3658883Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3661035Z ^[[31m     ^[[31m×^[[31m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3663211Z ^[[31m     ^[[31m×^[[31m Y-3 reports an unknown section once and names both legal sections^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3665311Z ^[[31m     ^[[31m×^[[31m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3667391Z ^[[31m     ^[[31m×^[[31m Y-5 refuses a malformed or an empty values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3669223Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3671119Z ^[[31m     ^[[31m×^[[31m Y-7 cites the section in a diagnostic about a leaf inside it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3693812Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3695819Z ^[[31m     ^[[31m×^[[31m Y-9 keeps the perspective warning for 3D content inside the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3697872Z ^[[31m     ^[[31m×^[[31m Y-10 refuses one compiled key authored under two groups' values sections^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3699624Z      ^[[32m✓^[[39m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3701507Z ^[[31m     ^[[31m×^[[31m Y-12 declares the group as two named sections and deletes the member union^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.3703441Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.5467286Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.6379058Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.6640139Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.6663371Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.6678011Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.6679453Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.6701712Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.6702530Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.7899199Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.8703712Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:47.9339566Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.0280224Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.0826704Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.1661390Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.2859414Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.3281616Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.3975446Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.5137047Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.5879705Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.6424061Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.7689534Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.7946740Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.8788595Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:48.9815396Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.0521610Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.0818278Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.2173424Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.2789653Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.3344284Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.4623945Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.4999241Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.5751158Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.7050769Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.7651940Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.7654767Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.9029123Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:49.9763257Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.0054065Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.1138675Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.1904591Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.1984941Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.3434226Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.3897975Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.3998076Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.5489234Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.5860237Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.6469386Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.7377869Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.8951002Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.9530167Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:50.9588609Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.0871720Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.1497817Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.1937312Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.2984424Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3442441Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3656049Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3692444Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3693018Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 11 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3693595Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3697258Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3707544Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[1].keyframes.fk.values.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3708553Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3801594Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3802543Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3803632Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3804277Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3805160Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3806153Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3808074Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3809515Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m134:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3810969Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m148:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3811630Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3812047Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3812823Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3815135Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-2 refuses the legacy leaf form by name rather than as a missing stops array
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3817923Z ^[[31m^[[1mAssertionError^[[22m: expected [] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3818792Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3819205Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3819770Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3820307Z   "path": "keyframes.fk",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3820993Z   "ruleId": "keyframes-missing-values-section",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3821661Z }
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3821990Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3822381Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3822913Z []
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3823246Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3824288Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m168:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3855390Z     ^[[90m166|^[[39m   it("Y-2 refuses the legacy leaf form by name rather than as a missin…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3857550Z     ^[[90m167|^[[39m     ^[[35mconst^[[39m diagnostics ^[[33m=^[[39m ^[[34mdiagnose^[[39m({ fk^[[33m:^[[39m { length^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3859340Z     ^[[90m168|^[[39m     ^[[34mexpect^[[39m(diagnostics)^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3860402Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3861316Z     ^[[90m169|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3862475Z     ^[[90m170|^[[39m         ruleId^[[33m:^[[39m ^[[32m"keyframes-missing-values-section"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3863134Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3863535Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3863906Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3865198Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-3 reports an unknown section once and names both legal sections
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3867311Z ^[[31m^[[1mAssertionError^[[22m: expected [] to have a length of 1 but got +0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3867789Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3868060Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3868816Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3869093Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3869475Z ^[[32m- 1^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3869848Z ^[[31m+ 0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3870089Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3870750Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m184:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3871729Z     ^[[90m182|^[[39m       ({ ruleId }) ^[[33m=>^[[39m ruleId ^[[33m===^[[39m ^[[32m"keyframes-unknown-section"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3872406Z     ^[[90m183|^[[39m     )^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3873411Z     ^[[90m184|^[[39m     ^[[34mexpect^[[39m(unknown)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3874482Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3875356Z     ^[[90m185|^[[39m     ^[[34mexpect^[[39m(unknown[^[[34m0^[[39m]^[[33m?.^[[39mpath)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"keyframes.fk.typo"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3876438Z     ^[[90m186|^[[39m     ^[[34mexpect^[[39m(unknown[^[[34m0^[[39m]^[[33m?.^[[39mmessage)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"'requires'"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3877041Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3878009Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3878483Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3880411Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-4 reserves a top-level values under the rule id a top-level requires gets
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3882607Z ^[[31m^[[1mAssertionError^[[22m: expected [] to deeply equal [ 'keyframes-reserved-section' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3883238Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3883472Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3883888Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3884107Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3884238Z ^[[32m- [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3884578Z ^[[32m-   "keyframes-reserved-section",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3884912Z ^[[32m- ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3885137Z ^[[31m+ []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3885263Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3885803Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m193:57^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3886644Z     ^[[90m191|^[[39m     // A top-level section name addresses no plugin, so nothing writte…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3887491Z     ^[[90m192|^[[39m     // owner. One reservation, one rule id, for both members of a grou…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3888164Z     ^[[90m193|^[[39m     expect(ruleIds({ values: { length: ramp(0, 1) } })).toEqual(["keyf…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3888755Z     ^[[90m   |^[[39m                                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3889326Z     ^[[90m194|^[[39m     expect(ruleIds({ requires: { base: "hero/root" } })).toEqual(["key…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3889800Z     ^[[90m195|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3889969Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3890216Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3890434Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3891435Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-5 refuses a malformed or an empty values section
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3892733Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'stops-shape' ] to deeply equal [ 'keyframes-values-shape' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3893208Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3893345Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3893626Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3893757Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3893873Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3894184Z ^[[32m-   "keyframes-values-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3894598Z ^[[31m+   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3894870Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3894990Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3895513Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m198:45^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3896049Z     ^[[90m196|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3896654Z     ^[[90m197|^[[39m   ^[[34mit^[[39m(^[[32m"Y-5 refuses a malformed or an empty values section"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3898070Z     ^[[90m198|^[[39m     expect(ruleIds({ fk: { values: [] } })).toEqual(["keyframes-values…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3899184Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3900129Z     ^[[90m199|^[[39m     expect(ruleIds({ fk: { values: "x" } })).toEqual(["keyframes-value…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3901199Z     ^[[90m200|^[[39m     expect(ruleIds({ fk: { values: 3 } })).toEqual(["keyframes-values-…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3901726Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3902134Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3902852Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3904688Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-7 cites the section in a diagnostic about a leaf inside it
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3907009Z ^[[31m^[[1mAssertionError^[[22m: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3907959Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3908236Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3908640Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3909172Z   "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3909764Z   "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3910190Z }
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3910363Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3910604Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3910951Z [
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3911242Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3911726Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3912376Z     "path": "keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3912865Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3913273Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3913646Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3913944Z ]
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3914115Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3915012Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m215:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3916302Z     ^[[90m213|^[[39m   it("Y-7 cites the section in a diagnostic about a leaf inside it", (…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3917602Z     ^[[90m214|^[[39m     const authored = { fk: { values: { length: { stops: [{ p: 2, v: 1 …
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3918652Z     ^[[90m215|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3919434Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3919921Z     ^[[90m216|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3920496Z     ^[[90m217|^[[39m         ruleId^[[33m:^[[39m ^[[32m"stop-position-range"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3920792Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3921041Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3921253Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3922616Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3924267Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'stops-shape' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3924856Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3925069Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3925469Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3925676Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3925877Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3926209Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3926484Z ^[[31m+   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3926788Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3926903Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3927811Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m229:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3928584Z     ^[[90m227|^[[39m     // a property called `values` that `fk` claims, and nothing about …
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3929572Z     ^[[90m228|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m { fk^[[33m:^[[39m { values^[[33m:^[[39m { values^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } } }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3930647Z     ^[[90m229|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m(authored))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3931464Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3931945Z     ^[[90m230|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3932426Z     ^[[90m231|^[[39m     const resolved = registry(passthrough).resolveForKeyframes(authore…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3932893Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3933292Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3933625Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3935102Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-9 keeps the perspective warning for 3D content inside the values section
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3936514Z ^[[31m^[[1mAssertionError^[[22m: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3936965Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3937335Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3937592Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3937868Z   "ruleId": "perspective-usage",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3938172Z   "severity": "warning",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3938418Z }
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3938530Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3938667Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3938898Z [
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3939097Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3939402Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3939869Z     "path": "motions[0].tracks[0].keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3940224Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3940473Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3940710Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3940900Z ]
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3941007Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3941523Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m238:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3942269Z     ^[[90m236|^[[39m   it("Y-9 keeps the perspective warning for 3D content inside the valu…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3942930Z     ^[[90m237|^[[39m     const result = validateV5(project({ fk: { values: { rotationY: ram…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3943651Z     ^[[90m238|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mdiagnostics)^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3944230Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3944791Z     ^[[90m239|^[[39m       expect.objectContaining({ ruleId: "perspective-usage", severity:…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3945259Z     ^[[90m240|^[[39m     )^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3945483Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3945858Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3946324Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3947563Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-10 refuses one compiled key authored under two groups' values sections
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3949004Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(3) ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3949383Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3949537Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3949811Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3950098Z   "path": "keyframes.ik.values.length",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3950448Z   "ruleId": "keyframes-duplicate-key",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3950724Z }
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3950835Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3951018Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3951328Z [
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3951511Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3951816Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3952212Z     "path": "keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3952507Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3952757Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3952993Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3953223Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3953699Z     "message": "Keyframe key 'values' is already authored at 'keyframes.fk.values'.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3954165Z     "path": "keyframes.ik.values",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3954480Z     "ruleId": "keyframes-duplicate-key",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3954761Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3954985Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3955398Z   {
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3955836Z     "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3956459Z     "path": "keyframes.ik.values.stops",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3956759Z     "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3957005Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3957392Z   },
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3957684Z ]
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3957845Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3958771Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m248:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3959767Z     ^[[90m246|^[[39m       ik^[[33m:^[[39m { values^[[33m:^[[39m { length^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m2^[[39m) } }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3960353Z     ^[[90m247|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3960935Z     ^[[90m248|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3961881Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3962657Z     ^[[90m249|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3963621Z     ^[[90m250|^[[39m         ruleId^[[33m:^[[39m ^[[32m"keyframes-duplicate-key"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3963949Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3964276Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3964609Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3966073Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-12 declares the group as two named sections and deletes the member union
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3967981Z ^[[31m^[[1mAssertionError^[[22m: expected 'export const AUTHORED_SCHEMA_VERSION …' not to contain 'AuthoredPluginMember'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3968457Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3968603Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3968875Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3969019Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3969194Z ^[[32m- AuthoredPluginMember^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3969668Z ^[[31m+ export const AUTHORED_SCHEMA_VERSION = 5 as const;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3970340Z ^[[31m+ export const SUPPORTED_TRIGGER_TYPES = ["scroll", "time", "manual"] as const;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3971174Z ^[[31m+ export const DIAGNOSTIC_SEVERITIES = ["error", "warning"] as const;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3971895Z ^[[31m+^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3972694Z ^[[31m+ export type TriggerType = (typeof SUPPORTED_TRIGGER_TYPES)[number];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3973458Z ^[[31m+ export type DiagnosticSeverity = (typeof DIAGNOSTIC_SEVERITIES)[number];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3973915Z ^[[31m+^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3974279Z ^[[31m+ export interface ManualTriggerDefinition {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3974722Z ^[[31m+   readonly type: "manual";^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3975150Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3975704Z ^[[31m+ export interface TimeTriggerDefinition {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3976302Z ^[[31m+   readonly type: "time";^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3976681Z ^[[31m+   readonly duration: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3977053Z ^[[31m+   readonly autoplay?: true;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3977626Z ^[[31m+   /**^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3978263Z ^[[31m+    * Passes after the initial one, so a finite loop runs `repeat + 1` cycles and the initial pass is^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3979136Z ^[[31m+    * never one of the repeats. `-1` is infinite; any other negative value or non-integer is^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3979694Z ^[[31m+    * rejected. See ADR-040.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3979993Z ^[[31m+    */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3980294Z ^[[31m+   readonly repeat?: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3980696Z ^[[31m+   /**^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3981685Z ^[[31m+    * Reverse every odd cycle. Requires a `repeat` that actually repeats, because a yoyo with^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3983086Z ^[[31m+    * nothing to reverse would be a field accepted and then ignored. Ping-pong is this with^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3983981Z ^[[31m+    * `repeat: -1` rather than a third field.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3984390Z ^[[31m+    */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3984701Z ^[[31m+   readonly yoyo?: boolean;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3985323Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3985826Z ^[[31m+ export interface ScrollTriggerDefinition {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3986248Z ^[[31m+   readonly type: "scroll";^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3986646Z ^[[31m+   readonly source?: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3986949Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3987412Z ^[[31m+ export type TriggerDefinition =^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3987796Z ^[[31m+   | ManualTriggerDefinition^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3988156Z ^[[31m+   | ScrollTriggerDefinition^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3988522Z ^[[31m+   | TimeTriggerDefinition;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3988815Z ^[[31m+^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3989130Z ^[[31m+ export interface TriggerSignal {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3989537Z ^[[31m+   readonly type: TriggerType;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3989918Z ^[[31m+   readonly progress?: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3990210Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3990441Z ^[[31m+^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3990748Z ^[[31m+ export interface Diagnostic {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3991135Z ^[[31m+   readonly ruleId: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3991498Z ^[[31m+   readonly path: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3991872Z ^[[31m+   readonly message: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3992343Z ^[[31m+   readonly severity: DiagnosticSeverity;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3992912Z ^[[31m+   readonly ids?: readonly string[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3993238Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3993460Z ^[[31m+^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3993676Z ^[[31m+ /**^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3994251Z ^[[31m+  * `"ready"`, `"blocked"`, and `"error"` all describe a node that still exists and may publish^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3995060Z ^[[31m+  * again. `"destroyed"` is terminal: the node has been evicted from the graph and will never^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3995577Z ^[[31m+  * publish again.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3995858Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3996432Z ^[[31m+  * The terminal status exists because destruction previously had no representation on the^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3997394Z ^[[31m+  * observation wire at all. Eviction dropped the retained patch silently, so the last `"ready"`^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3998289Z ^[[31m+  * patch a subscriber had received stayed authoritative forever and consumers kept rendering a^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3998910Z ^[[31m+  * node the graph had already destroyed.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3999388Z ^[[31m+  */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.3999875Z ^[[31m+ export type PatchStatus = "ready" | "blocked" | "error" | "destroyed";^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4000298Z ^[[31m+^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4000591Z ^[[31m+ export interface Patch {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4000954Z ^[[31m+   readonly nodeId: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4001333Z ^[[31m+   readonly revision: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4001813Z ^[[31m+   readonly values: Readonly<Record<string, unknown>>;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4002286Z ^[[31m+   readonly sourceProgress: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4003053Z ^[[31m+   readonly sourceRevisions: Readonly<Record<string, number>>;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4003550Z ^[[31m+   readonly status: PatchStatus;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4004002Z ^[[31m+   readonly diagnostics: readonly Diagnostic[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4004414Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4004888Z ^[[31m+ export interface PatchBatch {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4005323Z ^[[31m+   readonly tick: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4005720Z ^[[31m+   readonly seeds: readonly string[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4006302Z ^[[31m+   readonly patches: readonly Patch[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4034298Z ^[[31m+   readonly diagnostics: readonly Diagnostic[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4035042Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4035760Z ^[[31m+ export type PatchListener = (patch: Patch) => void;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4036512Z ^[[31m+ export interface AuthoredStop {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4037044Z ^[[31m+   readonly p: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4037652Z ^[[31m+   readonly v: unknown;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4038178Z ^[[31m+   readonly ease?: unknown;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4038606Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4039557Z ^[[31m+ export interface AuthoredProperty {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4040085Z ^[[31m+   readonly stops: readonly AuthoredStop[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4040559Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4040788Z ^[[31m+ /**^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4041443Z ^[[31m+  * The optional bindings section of a plugin-named group: one graph source id per requirement slot^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4042069Z ^[[31m+  * the named plugin declares.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4042378Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4042983Z ^[[31m+  * The slot name is the destination, so there is no author-facing projection map and no naming^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4043881Z ^[[31m+  * convention such as `parentX` for the author to keep synchronized with the plugin. Omitting the^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4044734Z ^[[31m+  * section, or a slot within it, derives no edge and leaves the unbound case to the plugin.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4045268Z ^[[31m+  * See ADR-044.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4045535Z ^[[31m+  */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4046046Z ^[[31m+ export type AuthoredPluginRequires = Readonly<Record<string, string>>;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4046864Z ^[[31m+ /** One member of a plugin-named group: an authored property, or the bindings section. */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4047877Z ^[[31m+ export type AuthoredPluginMember = AuthoredProperty | AuthoredPluginRequires;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4048354Z ^[[31m+ /**^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4048975Z ^[[31m+  * A plugin-named group: the properties that plugin claims, plus its optional `requires` section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4049481Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4050081Z ^[[31m+  * The section is reserved by name rather than typed as a distinct key, because the contract layer^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4050887Z ^[[31m+  * has no plugin registry and a group's property names are the plugin's to choose.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4052635Z ^[[31m+  * `contract/keyframe-shape` owns telling the two apart.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4053518Z ^[[31m+  */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4055118Z ^[[31m+ export type AuthoredPluginGroup = Readonly<Record<string, AuthoredPluginMember>>;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4056206Z ^[[31m+ /**^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4057295Z ^[[31m+  * One authored keyframe entry: a property, or a plugin-named group of properties.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4057787Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4058380Z ^[[31m+  * The group form names the plugin that owns its leaves, so `{ fk: { length } }` scopes the leaf^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4059230Z ^[[31m+  * without the author inventing a disambiguated flat name. The group is flattened back to its^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4060109Z ^[[31m+  * unprefixed leaves before compilation, so no interpolator, adapter, or renderer ever receives a^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4060653Z ^[[31m+  * nested value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4060931Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4061535Z ^[[31m+  * The flat form is unchanged, and stays legal for every key exactly one registered plugin claims.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4062441Z ^[[31m+  * For a key several plugins claim it is not sugar: the flat spelling is `plugin-ambiguous-key`, and^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4063189Z ^[[31m+  * the group is the only way to name an owner. See ADR-041 and ADR-043.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4063635Z ^[[31m+  */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4064183Z ^[[31m+ export type AuthoredKeyframe = AuthoredProperty | AuthoredPluginGroup;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4065013Z ^[[31m+ /** One `keyframes.<plugin>.requires.<slot>` entry, as read from authored input. See ADR-044. */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4065696Z ^[[31m+ export interface PluginRequiresBinding {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4066145Z ^[[31m+   readonly plugin: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4066513Z ^[[31m+   readonly slot: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4066877Z ^[[31m+   readonly source: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4067807Z ^[[31m+   /** `plugin.requires.slot`, relative to the keyframes record. Diagnostics cite this. */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4068411Z ^[[31m+   readonly authoredPath: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4068728Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4069067Z ^[[31m+ export interface TrackDefinition {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4069657Z ^[[31m+   readonly id: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4070140Z ^[[31m+   readonly duration?: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4070705Z ^[[31m+   readonly keyframes?: Readonly<Record<string, AuthoredKeyframe>>;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4071312Z ^[[31m+   readonly observes?: readonly ObservationDefinition[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4071694Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4071932Z ^[[31m+ /**^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4072545Z ^[[31m+  * One generic `observes` entry: a graph edge the author writes by hand, declaring an output edge^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4073127Z ^[[31m+  * and nothing else.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4073443Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4073846Z ^[[31m+  * One authored field, and deliberately only one.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4074219Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4074807Z ^[[31m+  * There is no `target`. It named a destination key that no consumer ever read, on either role.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4075335Z ^[[31m+  * See ADR-046.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4075607Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4076258Z ^[[31m+  * There is no `role`. Every edge this form derives is `role: "output"`, so writing the only legal^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4077000Z ^[[31m+  * value would be a field accepted and then ignored.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4077579Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4078279Z ^[[31m+  * There is no `projection`. Renaming an upstream key existed to keep it from colliding inside a^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4079247Z ^[[31m+  * flat input bag, and an output edge merges the source's patch whole rather than renaming anything.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4079799Z ^[[31m+  *^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4080422Z ^[[31m+  * A dependency that feeds composition is bound under `keyframes.<plugin>.requires` and arrives^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4081325Z ^[[31m+  * scoped to that plugin, which is now the only way a value enters composition. All three removed^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4082143Z ^[[31m+  * fields are refused rather than accepted and ignored: `graph/ir.ts` reports^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4082926Z ^[[31m+  * `observation-target-unsupported`, `observation-role-unsupported`, and^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4083620Z ^[[31m+  * `observation-projection-unsupported`. See ADR-047.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4084027Z ^[[31m+  */^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4084417Z ^[[31m+ export interface ObservationDefinition {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4084858Z ^[[31m+   readonly source: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4085181Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4085559Z ^[[31m+ export interface MotionDefinition {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4085973Z ^[[31m+   readonly id: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4086325Z ^[[31m+   readonly trigger:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4086753Z ^[[31m+     | TriggerDefinition^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4087516Z ^[[31m+     | { readonly type: TriggerType; readonly [key: string]: unknown };^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4088113Z ^[[31m+   readonly tracks: readonly TrackDefinition[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4088567Z ^[[31m+   readonly stagger?: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4088880Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4089223Z ^[[31m+ export interface ProjectDefinition {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4089629Z ^[[31m+   readonly schemaVersion: 5;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4090055Z ^[[31m+   readonly projectId?: string;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4090479Z ^[[31m+   readonly perspective?: number;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4091028Z ^[[31m+   readonly templates?: readonly Record<string, unknown>[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4091609Z ^[[31m+   readonly motions: readonly MotionDefinition[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4092165Z ^[[31m+   readonly freeTracks?: readonly TrackDefinition[];^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4092549Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4092986Z ^[[31m+ export interface MigrationDiagnostic extends Diagnostic {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4093539Z ^[[31m+   readonly ruleId: "schema-v4-migration";^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4093988Z ^[[31m+ }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4094275Z ^[[31m+^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4094426Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4095105Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m275:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4096335Z     ^[[90m273|^[[39m     // `AuthoredPluginMember` was the escape hatch the open record nee…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4097049Z     ^[[90m274|^[[39m     // than left declared and unused, and the declaring source is the …
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4097924Z     ^[[90m275|^[[39m     expect(readFileSync(V5_SOURCE, "utf8")).not.toContain("AuthoredPlu…
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4098537Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4098974Z     ^[[90m276|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4099292Z     ^[[90m277|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4099448Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4099692Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4099930Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4101063Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4103656Z ^[[31m^[[1mTypeError^[[22m: stops-shape at motions[0].tracks[0].keyframes.transform.values.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[1].keyframes.fk.values.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[2].keyframes.fk.values.stops: Authored properties require a stops array.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4105305Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4106055Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4106917Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4107832Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4108284Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4108857Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4109506Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4110163Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4111012Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m134:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4111950Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m279:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4112383Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4112626Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/11]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4112860Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4112881Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4113368Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m54 passed^[[39m^[[22m^[[90m (55)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4114168Z ^[[2m      Tests ^[[22m ^[[1m^[[31m11 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m214 passed^[[39m^[[22m^[[90m (225)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4114738Z ^[[2m   Start at ^[[22m 12:25:46
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4115461Z ^[[2m   Duration ^[[22m 4.53s^[[2m (transform 1.17s, setup 0ms, import 3.81s, tests 1.01s, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4115883Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4115916Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4141116Z ##[error]TypeError: stops-shape at motions[0].tracks[1].keyframes.fk.values.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:134:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:148:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4149366Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4152313Z ##[error]AssertionError: expected [] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.fk",
integration (node 24)	Run npm run test:integration	  "ruleId": "keyframes-missing-values-section",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:168:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4154230Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4155980Z ##[error]AssertionError: expected [] to have a length of 1 but got +0
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- 1
integration (node 24)	Run npm run test:integration	+ 0
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:184:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4157496Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4159610Z ##[error]AssertionError: expected [] to deeply equal [ 'keyframes-reserved-section' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- [
integration (node 24)	Run npm run test:integration	-   "keyframes-reserved-section",
integration (node 24)	Run npm run test:integration	- ]
integration (node 24)	Run npm run test:integration	+ []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:193:57
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4160885Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4163040Z ##[error]AssertionError: expected [ 'stops-shape' ] to deeply equal [ 'keyframes-values-shape' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	-   "keyframes-values-shape",
integration (node 24)	Run npm run test:integration	+   "stops-shape",
integration (node 24)	Run npm run test:integration	  ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:198:45
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4164403Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4168336Z ##[error]AssertionError: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	  "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:215:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4170472Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4172307Z ##[error]AssertionError: expected [ 'stops-shape' ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "stops-shape",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:229:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4173470Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4177048Z ##[error]AssertionError: expected [ { ruleId: 'stops-shape', …(3) } ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "ruleId": "perspective-usage",
integration (node 24)	Run npm run test:integration	  "severity": "warning",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "motions[0].tracks[0].keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:238:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4179391Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4184949Z ##[error]AssertionError: expected [ …(3) ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.ik.values.length",
integration (node 24)	Run npm run test:integration	  "ruleId": "keyframes-duplicate-key",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Keyframe key 'values' is already authored at 'keyframes.fk.values'.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.ik.values",
integration (node 24)	Run npm run test:integration	    "ruleId": "keyframes-duplicate-key",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Authored properties require a stops array.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.ik.values.stops",
integration (node 24)	Run npm run test:integration	    "ruleId": "stops-shape",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:248:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4188182Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4239290Z ##[error]AssertionError: expected 'export const AUTHORED_SCHEMA_VERSION …' not to contain 'AuthoredPluginMember'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- AuthoredPluginMember
integration (node 24)	Run npm run test:integration	+ export const AUTHORED_SCHEMA_VERSION = 5 as const;
integration (node 24)	Run npm run test:integration	+ export const SUPPORTED_TRIGGER_TYPES = ["scroll", "time", "manual"] as const;
integration (node 24)	Run npm run test:integration	+ export const DIAGNOSTIC_SEVERITIES = ["error", "warning"] as const;
integration (node 24)	Run npm run test:integration	+
integration (node 24)	Run npm run test:integration	+ export type TriggerType = (typeof SUPPORTED_TRIGGER_TYPES)[number];
integration (node 24)	Run npm run test:integration	+ export type DiagnosticSeverity = (typeof DIAGNOSTIC_SEVERITIES)[number];
integration (node 24)	Run npm run test:integration	+
integration (node 24)	Run npm run test:integration	+ export interface ManualTriggerDefinition {
integration (node 24)	Run npm run test:integration	+   readonly type: "manual";
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+ export interface TimeTriggerDefinition {
integration (node 24)	Run npm run test:integration	+   readonly type: "time";
integration (node 24)	Run npm run test:integration	+   readonly duration: number;
integration (node 24)	Run npm run test:integration	+   readonly autoplay?: true;
integration (node 24)	Run npm run test:integration	+   /**
integration (node 24)	Run npm run test:integration	+    * Passes after the initial one, so a finite loop runs `repeat + 1` cycles and the initial pass is
integration (node 24)	Run npm run test:integration	+    * never one of the repeats. `-1` is infinite; any other negative value or non-integer is
integration (node 24)	Run npm run test:integration	+    * rejected. See ADR-040.
integration (node 24)	Run npm run test:integration	+    */
integration (node 24)	Run npm run test:integration	+   readonly repeat?: number;
integration (node 24)	Run npm run test:integration	+   /**
integration (node 24)	Run npm run test:integration	+    * Reverse every odd cycle. Requires a `repeat` that actually repeats, because a yoyo with
integration (node 24)	Run npm run test:integration	+    * nothing to reverse would be a field accepted and then ignored. Ping-pong is this with
integration (node 24)	Run npm run test:integration	+    * `repeat: -1` rather than a third field.
integration (node 24)	Run npm run test:integration	+    */
integration (node 24)	Run npm run test:integration	+   readonly yoyo?: boolean;
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+ export interface ScrollTriggerDefinition {
integration (node 24)	Run npm run test:integration	+   readonly type: "scroll";
integration (node 24)	Run npm run test:integration	+   readonly source?: string;
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+ export type TriggerDefinition =
integration (node 24)	Run npm run test:integration	+   | ManualTriggerDefinition
integration (node 24)	Run npm run test:integration	+   | ScrollTriggerDefinition
integration (node 24)	Run npm run test:integration	+   | TimeTriggerDefinition;
integration (node 24)	Run npm run test:integration	+
integration (node 24)	Run npm run test:integration	+ export interface TriggerSignal {
integration (node 24)	Run npm run test:integration	+   readonly type: TriggerType;
integration (node 24)	Run npm run test:integration	+   readonly progress?: number;
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+
integration (node 24)	Run npm run test:integration	+ export interface Diagnostic {
integration (node 24)	Run npm run test:integration	+   readonly ruleId: string;
integration (node 24)	Run npm run test:integration	+   readonly path: string;
integration (node 24)	Run npm run test:integration	+   readonly message: string;
integration (node 24)	Run npm run test:integration	+   readonly severity: DiagnosticSeverity;
integration (node 24)	Run npm run test:integration	+   readonly ids?: readonly string[];
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+
integration (node 24)	Run npm run test:integration	+ /**
integration (node 24)	Run npm run test:integration	+  * `"ready"`, `"blocked"`, and `"error"` all describe a node that still exists and may publish
integration (node 24)	Run npm run test:integration	+  * again. `"destroyed"` is terminal: the node has been evicted from the graph and will never
integration (node 24)	Run npm run test:integration	+  * publish again.
integration (node 24)	Run npm run test:integration	+  *
integration (node 24)	Run npm run test:integration	+  * The terminal status exists because destruction previously had no representation on the
integration (node 24)	Run npm run test:integration	+  * observation wire at all. Eviction dropped the retained patch silently, so the last `"ready"`
integration (node 24)	Run npm run test:integration	+  * patch a subscriber had received stayed authoritative forever and consumers kept rendering a
integration (node 24)	Run npm run test:integration	+  * node the graph had already destroyed.
integration (node 24)	Run npm run test:integration	+  */
integration (node 24)	Run npm run test:integration	+ export type PatchStatus = "ready" | "blocked" | "error" | "destroyed";
integration (node 24)	Run npm run test:integration	+
integration (node 24)	Run npm run test:integration	+ export interface Patch {
integration (node 24)	Run npm run test:integration	+   readonly nodeId: string;
integration (node 24)	Run npm run test:integration	+   readonly revision: number;
integration (node 24)	Run npm run test:integration	+   readonly values: Readonly<Record<string, unknown>>;
integration (node 24)	Run npm run test:integration	+   readonly sourceProgress: number;
integration (node 24)	Run npm run test:integration	+   readonly sourceRevisions: Readonly<Record<string, number>>;
integration (node 24)	Run npm run test:integration	+   readonly status: PatchStatus;
integration (node 24)	Run npm run test:integration	+   readonly diagnostics: readonly Diagnostic[];
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+ export interface PatchBatch {
integration (node 24)	Run npm run test:integration	+   readonly tick: number;
integration (node 24)	Run npm run test:integration	+   readonly seeds: readonly string[];
integration (node 24)	Run npm run test:integration	+   readonly patches: readonly Patch[];
integration (node 24)	Run npm run test:integration	+   readonly diagnostics: readonly Diagnostic[];
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+ export type PatchListener = (patch: Patch) => void;
integration (node 24)	Run npm run test:integration	+ export interface AuthoredStop {
integration (node 24)	Run npm run test:integration	+   readonly p: number;
integration (node 24)	Run npm run test:integration	+   readonly v: unknown;
integration (node 24)	Run npm run test:integration	+   readonly ease?: unknown;
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+ export interface AuthoredProperty {
integration (node 24)	Run npm run test:integration	+   readonly stops: readonly AuthoredStop[];
integration (node 24)	Run npm run test:integration	+ }
integration (node 24)	Run npm run test:integration	+ /**
integration (node 24)	Run npm run test:integration	+  * The optional bindings section of a plugin-named group: one graph source id per requirement slot
integration (node 24)	Run npm run test:integration	+  * the named plugin declares.
integration (node 24)	Run npm run test:integration	+  *
integration (node 24)	Run npm run test:integration	+  * The slot name is the destination, so there is no author-facing projection map and no naming
integration (node 24)	Run npm run test:integration	+  * convention such as `parentX` for the author to keep synchronized with the plugin. Omitting the
integration (node 24)	Run npm run test:integration	+  * section, or a slot within it, derives no edge and leaves the unbound case to the plugin.
integration (node 24)	Run npm run test:integration	+  * See ADR-044.
integration (node 24)	Run npm run test:integration	+  */
integration (node 24)	Run npm run test:integration	+ export type AuthoredPluginRequires = Readonly<Record<string, string>>;
integration (node 24)	Run npm run test:integration	+ /** One member of a plugin-named group: an authored property, or the bindings section. */
integration (node 24)	Run npm run test:integration	+ export type AuthoredPluginMember = AuthoredProperty | AuthoredPluginRequires;
integration (node 24)	Run npm run test:integration	+ /**
integration (node 24)	Run npm run test:integration	+  * A plugin-named group: the properties that plugin claims, plus its optional `requires` section.
integration (node 24)	Run npm run test:integration	+  *
integration (node 24)	Run npm run test:integration	+  * The section is reserved by name rather than typed a
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4262480Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4270392Z ##[error]TypeError: stops-shape at motions[0].tracks[0].keyframes.transform.values.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[1].keyframes.fk.values.stops: Authored properties require a stops array. stops-shape at motions[0].tracks[2].keyframes.fk.values.stops: Authored properties require a stops array.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:134:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:279:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:25:51.4352482Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-22T12:25:46.4969972Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.4970432Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.5015188Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.5015498Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.5015723Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.5015954Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.6138121Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.6139166Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.6140051Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:46.6140399Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:50.1034715Z ##[error]packages/core/test/integration/plugin-group-values-section.test.ts(42,7): error TS2322: Type 'true' is not assignable to type 'false'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:25:50.1483708Z ##[error]Process completed with exit code 2.
```
