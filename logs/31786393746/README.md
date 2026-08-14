# CI log archive: 31786393746

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31786393746
- Captured: 2026-08-14T09:03:09Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-14T09:02:28.7518940Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-14T09:02:28.7519236Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-14T09:02:28.7563848Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-14T09:02:28.7564172Z env:
quality (node 24)	Run npm test	2026-08-14T09:02:28.7564359Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-14T09:02:28.7564563Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-14T09:02:28.9068407Z 
quality (node 24)	Run npm test	2026-08-14T09:02:28.9069015Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-14T09:02:28.9069479Z > vitest run
quality (node 24)	Run npm test	2026-08-14T09:02:28.9069688Z 
quality (node 24)	Run npm test	2026-08-14T09:02:29.2834718Z 
quality (node 24)	Run npm test	2026-08-14T09:02:29.2865227Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:29.2893726Z 
quality (node 24)	Run npm test	2026-08-14T09:02:29.7273111Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:29.7714550Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:29.9905762Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:30.0666955Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:30.2270373Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:30.3075345Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:30.5066054Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:30.5745964Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:30.7281646Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:30.8259257Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:30.9626811Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:31.0525283Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:31.1975751Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:31.2942790Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:31.4605323Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:31.5471896Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:31.8441424Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:31.8695766Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.0854397Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.1247487Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.2117303Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2604^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.2148433Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2601^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.2804336Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.3663902Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.4230679Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.5115546Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.5666861Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.6690348Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.7041901Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.7800189Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.9085678Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:32.9295940Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.0120012Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.1232487Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.1366146Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.2271271Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.3260698Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.3451513Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.4587306Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.5233793Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.5315103Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.6328349Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.7334305Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.7926519Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-14T09:02:33.7967787Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T09:02:33.7969569Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.7977099Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T09:02:33.7996884Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T09:02:33.8045189Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T09:02:33.8046533Z 
quality (node 24)	Run npm test	2026-08-14T09:02:33.8246398Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:33.9865927Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.0398251Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.0702467Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.2113165Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.2597156Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.3125815Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.4430614Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.4932710Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.5352278Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.7098878Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.7100974Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.7433316Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.8906021Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:34.9093130Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.0899179Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.1251591Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.2954435Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.3365848Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.5225147Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/documentation-consistency.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.5282339Z ^[[31m     ^[[31m×^[[31m does not claim the old reopened Phase 4 reality^[[39m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.5323877Z      ^[[32m✓^[[39m documents the Phase 6 base and the shipped packed consumer^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.5325517Z      ^[[32m✓^[[39m keeps the documentation map pointed at files that exist^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.5692116Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.7525559Z  ^[[32m✓^[[39m packages/core/test/unit/domain/triggers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.7909829Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:35.9706428Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:36.0225333Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-14T09:02:36.0227788Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:36.0232939Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T09:02:36.0244670Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T09:02:36.0288045Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T09:02:36.0300072Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T09:02:36.0301090Z 
quality (node 24)	Run npm test	2026-08-14T09:02:36.2447952Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:36.2747109Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:36.4637576Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:36.5215992Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:36.7565437Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:36.9875685Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:37.1923676Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:37.5178996Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/api-surface-check.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[33m 2572^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:37.5205127Z      ^[[33m^[[2m✓^[[22m^[[39m accepts the committed public declaration surface ^[[33m 2565^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8305512Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/packed-consumer-check.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 8152^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8307521Z      ^[[33m^[[2m✓^[[22m^[[39m accepts documented ESM and TypeScript imports from the packed core artifact ^[[33m 5677^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8308549Z      ^[[33m^[[2m✓^[[22m^[[39m rejects deep wildcard imports that bypass the documented export map ^[[33m 2473^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8342230Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8342735Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8343035Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8346596Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/documentation-consistency.test.ts^[[2m > ^[[22mP6-03 public documentation^[[2m > ^[[22mdoes not claim the old reopened Phase 4 reality
quality (node 24)	Run npm test	2026-08-14T09:02:44.8354965Z ^[[31m^[[1mAssertionError^[[22m: expected '# motion5\n\nmotion5 is a renderer-ne…' not to contain 'Phase 4 is reopened'^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8355613Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8356007Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8356355Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8356653Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8356963Z ^[[32m- Phase 4 is reopened^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8357762Z ^[[31m+ # motion5^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8358240Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8359815Z ^[[31m+ motion5 is a renderer-neutral, transactional dataflow animation runtime. It evaluates authored animation projects as one dependency graph and publishes immutable patches for DOM, React, or any other renderer.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8361227Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8367791Z ^[[31m+ > **Status:** Phase 4 is reopened. The 2026-08-10 consolidated audit found that R1-R8 repaired the graph infrastructure and adapter boundaries, but not the animation value pipeline. `Engine.load()` currently publishes empty or input-only patches, Track instances are rebuilt on every flush, and the plugin/keyframe compiler is not implemented. Start with [the consolidated audit](docs/PHASE-3-4-CONSOLIDATED-AUDIT.md), [the recovery plan](docs/PHASE-3-4-RECOVERY-PLAN.md), and [the implementor brief](docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md). Do not resume P4-05, packaging, or performance hardening until the Phase 0R/1R recovery work has real failing-first evidence.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8370613Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8372148Z ^[[31m+ > **Workflow handoff:** GitHub-MCP implementors should read [RECOVERY.md](RECOVERY.md), [the formatter workflow](docs/FORMAT-WORKFLOW.md), and [the PR workflow](docs/PR-WORKFLOW.md) before making changes. Failed CI and recovery-audit logs are archived on the separate `ci-logs` branch.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8373285Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8375917Z ^[[31m+ > **Lineage:** motion5 is a clean-room successor to [motionpath](https://github.com/chahyasantoso/motionpath), a data-first animation runtime built on GSAP. motionpath is the behavioral oracle for what these animations should do. motion5 is a different answer to how the runtime should own that behavior.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8378132Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8378627Z ^[[31m+ ## Why motion5 exists^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8379085Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8381541Z ^[[31m+ Timeline engines are good at answering “what is this value at progress 0.42?” They are much less good at answering “what is the value of this thing when it depends on three other animated things, one of which failed, one of which was unmounted, and all of which changed during the same tick?”^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8382682Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8384755Z ^[[31m+ motion5 treats those dependencies as a first-class graph. A project is loaded, validated, normalized into qualified node ids, evaluated in canonical topological order, and published as one immutable batch per clock tick. Consumers render the batch. They do not traverse the graph, call `Track.compose()`, or inspect runtime internals.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8386085Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8386356Z ^[[31m+ ## What is shipped^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8386615Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8387158Z ^[[31m+ - one project-wide graph runtime, publisher, patch registry, and clock subscription;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8387795Z ^[[31m+ - transactional graph replacement with rollback;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8388322Z ^[[31m+ - immutable, revisioned, batched patch publication;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8388943Z ^[[31m+ - input and output observation publication with deterministic ordering;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8389509Z ^[[31m+ - explicit attach/detach membership gating;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8390069Z ^[[31m+ - `@motion5/core` and `@motion5/core/internal` package entrypoints;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8390711Z ^[[31m+ - a mechanical boundary scanner covering core and React consumers;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8391352Z ^[[31m+ - target-aware DOM patch application with diffing and key removal.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8391821Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8393995Z ^[[31m+ The authored animation value/compiler pipeline is **not yet shipped**: authored keyframes are not compiled into proxy-backed interpolation, plugins are not resolved from authored keys, and real Track state does not survive a flush.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8395801Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8396234Z ^[[31m+ ## What remains^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8396657Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8398231Z ^[[31m+ - Phase 0R/1R value-pipeline recovery: interpolator state, typed stops, plugin compilation/composition, Track lifetime, and progress invalidation;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8400355Z ^[[31m+ - Phase 2/3 hardening: final-value memo consistency, batch error preservation, reentrancy proof, and boundary self-test repair;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8402708Z ^[[31m+ - Phase 4R consumer work: DOM writer contract, React hooks/subscription lifecycle, public runtime exports, and the required P4-05 build/end-to-end gate;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8405005Z ^[[31m+ - cross-motion membership and adoption remain Phase 5 work;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8406745Z ^[[31m+ - API report, packed package consumer, required performance budget, and transitional-code deletion remain Phase 6 work.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8409374Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8409914Z ^[[31m+ ## Authored schema^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8410387Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8413209Z ^[[31m+ The current authored contract is **schema v5**. It includes motions, free tracks, perspective, observation edges with `input` and `output` roles, and diagnostics with `error` and `warning` severity. v4 is not accepted as an alias; use the explicit migration guide before loading a project.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8415569Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8416083Z ^[[31m+ ## Toolchain and commands^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8416561Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8417211Z ^[[31m+ Node 24, ESM, TypeScript, Vitest, and Prettier.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8417797Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8418181Z ^[[31m+ ```bash^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8418622Z ^[[31m+ npm install^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8419086Z ^[[31m+ npm run check^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8419561Z ^[[31m+ npm run format^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8420115Z ^[[31m+ npm run format:check^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8420643Z ^[[31m+ npm run typecheck^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8421118Z ^[[31m+ npm test^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8421507Z ^[[31m+ ```^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8421793Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8423966Z ^[[31m+ `package-lock.json` is committed and CI uses `npm ci`. Workspace package manifests are included in the lockfile; regenerate it with `npm install --package-lock-only` whenever package manifests change.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8429080Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8429418Z ^[[31m+ ## Documentation map^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8429761Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8432968Z ^[[31m+ Read in this order: [Session status](docs/SESSION-STATUS.md), [Consolidated audit](docs/PHASE-3-4-CONSOLIDATED-AUDIT.md), [Recovery plan](docs/PHASE-3-4-RECOVERY-PLAN.md), [Implementor brief](docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md), [Formatter and CI handoff](docs/FORMAT-WORKFLOW.md), [PR workflow](docs/PR-WORKFLOW.md), [CI workflow](docs/CI-WORKFLOW.md), [PRD](docs/PRD.md), [TRD](docs/TRD.md), [Architecture](docs/ARCHITECTURE.md), [Authored schema](docs/AUTHORED-SCHEMA.md), [Implementation plan](docs/IMPLEMENTATION-PLAN.md), [Testing strategy](docs/TESTING-STRATEGY.md), and [Decision records](docs/DECISIONS.md).^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8435963Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8436286Z ^[[31m+ ## Contributing rule of thumb^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8436592Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8437835Z ^[[31m+ Write the invariant first. Name the owner. Add a test that fails without the change. Implement the smallest vertical slice. Update code, types, docs, and tests together. Formatting stays separate from behavior.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8439280Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8439532Z ^[[31m+ ## License^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8439763Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8439966Z ^[[31m+ MIT.^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8440307Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8440504Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8441481Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/documentation-consistency.test.ts:^[[2m17:24^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8442829Z     ^[[90m 15|^[[39m       ^[[34mtext^[[39m(^[[32m"docs/README.md"^[[39m)^[[33m,^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8443915Z     ^[[90m 16|^[[39m     ])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8445160Z     ^[[90m 17|^[[39m     ^[[34mexpect^[[39m(readme)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"Phase 4 is reopened"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8446041Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8446758Z     ^[[90m 18|^[[39m     ^[[34mexpect^[[39m(docsReadme)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"Phase 4 reopened"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8447343Z     ^[[90m 19|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8447639Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8447888Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8448106Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8448125Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8448583Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m76 passed^[[39m^[[22m^[[90m (77)^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8449349Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m285 passed^[[39m^[[22m^[[90m (286)^[[39m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8449869Z ^[[2m   Start at ^[[22m 09:02:29
quality (node 24)	Run npm test	2026-08-14T09:02:44.8450533Z ^[[2m   Duration ^[[22m 15.51s^[[2m (transform 1.28s, setup 0ms, import 3.57s, tests 14.31s, environment 13ms)^[[22m
quality (node 24)	Run npm test	2026-08-14T09:02:44.8450928Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8450944Z 
quality (node 24)	Run npm test	2026-08-14T09:02:44.8520288Z ##[error]AssertionError: expected '# motion5\n\nmotion5 is a renderer-ne…' not to contain 'Phase 4 is reopened'
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Phase 4 is reopened
quality (node 24)	Run npm test	+ # motion5
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ motion5 is a renderer-neutral, transactional dataflow animation runtime. It evaluates authored animation projects as one dependency graph and publishes immutable patches for DOM, React, or any other renderer.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ > **Status:** Phase 4 is reopened. The 2026-08-10 consolidated audit found that R1-R8 repaired the graph infrastructure and adapter boundaries, but not the animation value pipeline. `Engine.load()` currently publishes empty or input-only patches, Track instances are rebuilt on every flush, and the plugin/keyframe compiler is not implemented. Start with [the consolidated audit](docs/PHASE-3-4-CONSOLIDATED-AUDIT.md), [the recovery plan](docs/PHASE-3-4-RECOVERY-PLAN.md), and [the implementor brief](docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md). Do not resume P4-05, packaging, or performance hardening until the Phase 0R/1R recovery work has real failing-first evidence.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ > **Workflow handoff:** GitHub-MCP implementors should read [RECOVERY.md](RECOVERY.md), [the formatter workflow](docs/FORMAT-WORKFLOW.md), and [the PR workflow](docs/PR-WORKFLOW.md) before making changes. Failed CI and recovery-audit logs are archived on the separate `ci-logs` branch.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ > **Lineage:** motion5 is a clean-room successor to [motionpath](https://github.com/chahyasantoso/motionpath), a data-first animation runtime built on GSAP. motionpath is the behavioral oracle for what these animations should do. motion5 is a different answer to how the runtime should own that behavior.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ ## Why motion5 exists
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ Timeline engines are good at answering “what is this value at progress 0.42?” They are much less good at answering “what is the value of this thing when it depends on three other animated things, one of which failed, one of which was unmounted, and all of which changed during the same tick?”
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ motion5 treats those dependencies as a first-class graph. A project is loaded, validated, normalized into qualified node ids, evaluated in canonical topological order, and published as one immutable batch per clock tick. Consumers render the batch. They do not traverse the graph, call `Track.compose()`, or inspect runtime internals.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ ## What is shipped
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ - one project-wide graph runtime, publisher, patch registry, and clock subscription;
quality (node 24)	Run npm test	+ - transactional graph replacement with rollback;
quality (node 24)	Run npm test	+ - immutable, revisioned, batched patch publication;
quality (node 24)	Run npm test	+ - input and output observation publication with deterministic ordering;
quality (node 24)	Run npm test	+ - explicit attach/detach membership gating;
quality (node 24)	Run npm test	+ - `@motion5/core` and `@motion5/core/internal` package entrypoints;
quality (node 24)	Run npm test	+ - a mechanical boundary scanner covering core and React consumers;
quality (node 24)	Run npm test	+ - target-aware DOM patch application with diffing and key removal.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ The authored animation value/compiler pipeline is **not yet shipped**: authored keyframes are not compiled into proxy-backed interpolation, plugins are not resolved from authored keys, and real Track state does not survive a flush.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ ## What remains
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ - Phase 0R/1R value-pipeline recovery: interpolator state, typed stops, plugin compilation/composition, Track lifetime, and progress invalidation;
quality (node 24)	Run npm test	+ - Phase 2/3 hardening: final-value memo consistency, batch error preservation, reentrancy proof, and boundary self-test repair;
quality (node 24)	Run npm test	+ - Phase 4R consumer work: DOM writer contract, React hooks/subscription lifecycle, public runtime exports, and the required P4-05 build/end-to-end gate;
quality (node 24)	Run npm test	+ - cross-motion membership and adoption remain Phase 5 work;
quality (node 24)	Run npm test	+ - API report, packed package consumer, required performance budget, and transitional-code deletion remain Phase 6 work.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ ## Authored schema
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ The current authored contract is **schema v5**. It includes motions, free tracks, perspective, observation edges with `input` and `output` roles, and diagnostics with `error` and `warning` severity. v4 is not accepted as an alias; use the explicit migration guide before loading a project.
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ ## Toolchain and commands
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+ Node 24,
quality (node 24)	Run npm test	2026-08-14T09:02:44.8783357Z ##[error]Process completed with exit code 1.
```
