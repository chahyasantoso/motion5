# CI log archive: 31778597309

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31778597309
- Captured: 2026-08-14T07:06:11Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-14T07:05:47.1546442Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-14T07:05:47.1546818Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-14T07:05:47.1584829Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-14T07:05:47.1585379Z env:
quality (node 24)	Run npm test	2026-08-14T07:05:47.1585580Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-14T07:05:47.1585788Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-14T07:05:47.2646425Z 
quality (node 24)	Run npm test	2026-08-14T07:05:47.2646963Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-14T07:05:47.2647460Z > vitest run
quality (node 24)	Run npm test	2026-08-14T07:05:47.2647626Z 
quality (node 24)	Run npm test	2026-08-14T07:05:47.5613980Z 
quality (node 24)	Run npm test	2026-08-14T07:05:47.5623200Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:47.5625589Z 
quality (node 24)	Run npm test	2026-08-14T07:05:47.9547711Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:48.0183137Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:48.2440147Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:48.2896662Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:48.4697191Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:48.5352471Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:48.7756120Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 69^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:48.7855672Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:49.0247153Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:49.0307110Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:49.2705850Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:49.3103406Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:49.5062447Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:49.5506230Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:49.7666770Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.0150217Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.0224655Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.2750744Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.3165223Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.4887830Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2623^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.4891260Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2620^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.5095201Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.5745683Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.7029911Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.7150482Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.8266481Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.8997604Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:50.9012295Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.0810385Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.1176774Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.1247930Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.3023260Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.3333133Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.3877620Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.5073594Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.5467395Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.5957313Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.6963037Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.7551303Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.7926673Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.9242575Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-14T07:05:51.9248492Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T07:05:51.9250798Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:05:51.9252320Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:05:51.9253836Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:05:51.9254740Z 
quality (node 24)	Run npm test	2026-08-14T07:05:51.9258191Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.9648760Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:51.9917745Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.1428666Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.1859363Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.1926966Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.3567170Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.4084638Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.4087090Z ^[[31m     ^[[31m×^[[31m adopts a free track under ~/id and publishes through the ordinary graph path^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.4088947Z ^[[31m     ^[[31m×^[[31m rejects duplicate adopted ids instead of silently replacing membership^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.4090990Z ^[[31m     ^[[31m×^[[31m lets a borrower detach without destroying the adopted track, while only the owner can destroy it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.4927433Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.5607036Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.6429339Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.6666630Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.7904246Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.8411190Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.8944403Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:52.9631246Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.0621138Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.1007881Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.1537141Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.2459221Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.3297718Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.3383145Z  ^[[32m✓^[[39m packages/core/test/unit/domain/triggers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.4271472Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.5249389Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.5689022Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-14T07:05:53.5691590Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T07:05:53.5706720Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:05:53.5707961Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:05:53.5709020Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:05:53.5712987Z 
quality (node 24)	Run npm test	2026-08-14T07:05:53.5714151Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.6434344Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.7568118Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.8002500Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.8628685Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.9849851Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:53.9925353Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0324132Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0357246Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0358141Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0358970Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0362904Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22madopts a free track under ~/id and publishes through the ordinary graph path
quality (node 24)	Run npm test	2026-08-14T07:05:54.0369947Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0371449Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0416448Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
quality (node 24)	Run npm test	2026-08-14T07:05:54.0417774Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0418909Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-14T07:05:54.0419674Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0420362Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
quality (node 24)	Run npm test	2026-08-14T07:05:54.0421250Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0422550Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0424088Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0426812Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m21:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0427474Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0427945Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0428307Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0429969Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects duplicate adopted ids instead of silently replacing membership
quality (node 24)	Run npm test	2026-08-14T07:05:54.0431862Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0433123Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0434567Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
quality (node 24)	Run npm test	2026-08-14T07:05:54.0435990Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0438495Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-14T07:05:54.0439239Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0439634Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
quality (node 24)	Run npm test	2026-08-14T07:05:54.0440109Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0440799Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0441624Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0442375Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m33:13^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0442696Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0442950Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0443156Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0444174Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mlets a borrower detach without destroying the adopted track, while only the owner can destroy it
quality (node 24)	Run npm test	2026-08-14T07:05:54.0445618Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0446332Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0446943Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
quality (node 24)	Run npm test	2026-08-14T07:05:54.0447609Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0448203Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-14T07:05:54.0448604Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0448974Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
quality (node 24)	Run npm test	2026-08-14T07:05:54.0449432Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0450094Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0450897Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0451966Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m42:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0452535Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0452807Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0453018Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0453061Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0453741Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m70 passed^[[39m^[[22m^[[90m (71)^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0455664Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m264 passed^[[39m^[[22m^[[90m (267)^[[39m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0456630Z ^[[2m   Start at ^[[22m 07:05:47
quality (node 24)	Run npm test	2026-08-14T07:05:54.0457807Z ^[[2m   Duration ^[[22m 6.45s^[[2m (transform 1.14s, setup 0ms, import 3.33s, tests 3.54s, environment 11ms)^[[22m
quality (node 24)	Run npm test	2026-08-14T07:05:54.0458502Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0458514Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0482101Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
quality (node 24)	Run npm test	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
quality (node 24)	Run npm test	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
quality (node 24)	Run npm test	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:21:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T07:05:54.0492932Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0497486Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
quality (node 24)	Run npm test	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
quality (node 24)	Run npm test	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
quality (node 24)	Run npm test	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:33:13
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T07:05:54.0500456Z 
quality (node 24)	Run npm test	2026-08-14T07:05:54.0505678Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
quality (node 24)	Run npm test	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
quality (node 24)	Run npm test	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
quality (node 24)	Run npm test	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:42:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T07:05:54.0946728Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-14T07:05:42.5342738Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.5343126Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.5389556Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.5389841Z env:
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.5390031Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.5390236Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.6434271Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.6434866Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.6435868Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.6436301Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.9843902Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.9867585Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:42.9869011Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.3657923Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.3668359Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.4458389Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.5717815Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.6087666Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.6804767Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.8018645Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.8208434Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:43.9501198Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.0226087Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.0278330Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.1630555Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.2275109Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.2680922Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.3900919Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.3903973Z ^[[31m     ^[[31m×^[[31m adopts a free track under ~/id and publishes through the ordinary graph path^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.3906490Z ^[[31m     ^[[31m×^[[31m rejects duplicate adopted ids instead of silently replacing membership^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.3909111Z ^[[31m     ^[[31m×^[[31m lets a borrower detach without destroying the adopted track, while only the owner can destroy it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.4454539Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.6449562Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.6577414Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.6637684Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.8246638Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.8712915Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:44.8859219Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0121258Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0337769Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0389471Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0390099Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0390614Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0406945Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22madopts a free track under ~/id and publishes through the ordinary graph path
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0409161Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0410587Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0455222Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0456926Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0458214Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0459053Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0459776Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0460693Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0462041Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0463720Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0465411Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m21:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0466307Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0466832Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0467224Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0469008Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects duplicate adopted ids instead of silently replacing membership
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0471158Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0472538Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0473856Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0475208Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0478848Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0479657Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0480390Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0481309Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0482664Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0484304Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0486237Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m33:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0487258Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0487785Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0488519Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0490632Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mlets a borrower detach without destroying the adopted track, while only the owner can destroy it
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0492937Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0494387Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0495915Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0497268Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0498536Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0499438Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0500188Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0501120Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0502486Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0504075Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0505816Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m42:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0506457Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0506927Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0507314Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0507347Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0508213Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m23 passed^[[39m^[[22m^[[90m (24)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0509760Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m63 passed^[[39m^[[22m^[[90m (66)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0510793Z ^[[2m   Start at ^[[22m 07:05:43
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0512048Z ^[[2m   Duration ^[[22m 2.03s^[[2m (transform 636ms, setup 0ms, import 1.55s, tests 306ms, environment 4ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0512834Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0512849Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0545874Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
integration (node 24)	Run npm run test:integration	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:21:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0557903Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0560876Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
integration (node 24)	Run npm run test:integration	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:33:13
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0562510Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0565121Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
integration (node 24)	Run npm run test:integration	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:42:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:05:45.0867445Z ##[error]Process completed with exit code 1.
```
