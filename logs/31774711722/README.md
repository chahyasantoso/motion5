# CI log archive: 31774711722

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31774711722
- Captured: 2026-08-14T05:59:07Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-14T05:58:42.0838714Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.0839114Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.0889211Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.0889726Z env:
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.0889932Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.0890152Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.1959823Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.1960548Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.1961252Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.1961632Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.4692227Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.4696897Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.4698135Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.8380881Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.9036271Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:42.9210315Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.0359763Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.1001567Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.1130700Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.2414569Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.3319583Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.3423089Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.4360056Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.5356241Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.5488212Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.6101416Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.7433394Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.8910009Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.9284634Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.9685526Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:43.9701874Z ^[[31m     ^[[31m×^[[31m keeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.0750949Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.0944278Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.1940133Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.2863480Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3149635Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3585775Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3616376Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3617303Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3618142Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3622522Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3628764Z ^[[31m^[[1mAssertionError^[[22m: expected 'error' to be 'blocked' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3629450Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3629768Z Expected: ^[[32m"blocked"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3630356Z Received: ^[[31m"error"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3630618Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3638921Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m40:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3661338Z     ^[[90m 38|^[[39m     ^[[35mconst^[[39m pending ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3662806Z     ^[[90m 39|^[[39m     const pendingPatch = pending.patches.find(({ nodeId }) => nodeId =…
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3664305Z     ^[[90m 40|^[[39m     ^[[34mexpect^[[39m(pendingPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"blocked"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3665551Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3666619Z     ^[[90m 41|^[[39m     expect(pendingPatch?.diagnostics[0]?.ruleId).toBe("pending-referen…
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3667455Z     ^[[90m 42|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3667753Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3668559Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3669086Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3669427Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3671734Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m22 passed^[[39m^[[22m^[[90m (23)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3673466Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m60 passed^[[39m^[[22m^[[90m (61)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3674685Z ^[[2m   Start at ^[[22m 05:58:42
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3676008Z ^[[2m   Duration ^[[22m 1.87s^[[2m (transform 723ms, setup 0ms, import 1.51s, tests 255ms, environment 5ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3676940Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3691777Z 
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.3721294Z ##[error]AssertionError: expected 'error' to be 'blocked' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Expected: "blocked"
integration (node 24)	Run npm run test:integration	Received: "error"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:40:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T05:58:44.4144007Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-14T05:58:44.3460626Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-14T05:58:44.3461117Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-14T05:58:44.3510151Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-14T05:58:44.3510554Z env:
quality (node 24)	Run npm test	2026-08-14T05:58:44.3510862Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-14T05:58:44.3511197Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-14T05:58:44.4693253Z 
quality (node 24)	Run npm test	2026-08-14T05:58:44.4693961Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-14T05:58:44.4694455Z > vitest run
quality (node 24)	Run npm test	2026-08-14T05:58:44.4694700Z 
quality (node 24)	Run npm test	2026-08-14T05:58:44.8100108Z 
quality (node 24)	Run npm test	2026-08-14T05:58:44.8120698Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:44.8131255Z 
quality (node 24)	Run npm test	2026-08-14T05:58:45.2675120Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:45.3494792Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:45.6831508Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:45.7902260Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 80^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:46.0121450Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:46.0622767Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:46.3431661Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:46.4204276Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:46.6251247Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:46.7056009Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:46.8878180Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:46.9776808Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:47.1592464Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:47.2057126Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:47.5439192Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:47.7293673Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:47.8471904Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:47.9677669Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.1351283Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.2821668Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.3674561Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.6088837Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.6152544Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.7331525Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3615^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.7380656Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3611^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.9176287Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:48.9941390Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.0111154Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.1892855Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.2649249Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.2730963Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.4531628Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.5076527Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.5220598Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.7135450Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.7377974Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.7511734Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.9322836Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:49.9921416Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.0217473Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-14T05:58:50.0265672Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.0272391Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T05:58:50.0301508Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T05:58:50.0334701Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T05:58:50.0406957Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T05:58:50.0409324Z 
quality (node 24)	Run npm test	2026-08-14T05:58:50.1731521Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.2445668Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.2653525Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.4270037Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.4750175Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.5589808Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.6651684Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.7275921Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.7694943Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.8920919Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.9429707Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:50.9744295Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.1250212Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.1252545Z ^[[31m     ^[[31m×^[[31m keeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order^[[39m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.1692185Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.1761452Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.3353617Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.3408677Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.3848286Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.5352034Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.5424458Z  ^[[32m✓^[[39m packages/core/test/unit/domain/triggers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.5934038Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.7199669Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.7616007Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-14T05:58:51.7623681Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T05:58:51.7625349Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T05:58:51.7626916Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T05:58:51.7629938Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T05:58:51.7631441Z 
quality (node 24)	Run npm test	2026-08-14T05:58:51.7646294Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.8257873Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.9362804Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:51.9820484Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.0525969Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.1708749Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.1722793Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2297866Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2335424Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2336201Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2336565Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2340449Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order
quality (node 24)	Run npm test	2026-08-14T05:58:52.2347325Z ^[[31m^[[1mAssertionError^[[22m: expected 'error' to be 'blocked' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2347964Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2348290Z Expected: ^[[32m"blocked"^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2349306Z Received: ^[[31m"error"^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2349771Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2350709Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m40:34^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2379823Z     ^[[90m 38|^[[39m     ^[[35mconst^[[39m pending ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2380936Z     ^[[90m 39|^[[39m     const pendingPatch = pending.patches.find(({ nodeId }) => nodeId =…
quality (node 24)	Run npm test	2026-08-14T05:58:52.2382346Z     ^[[90m 40|^[[39m     ^[[34mexpect^[[39m(pendingPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"blocked"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2383131Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2383906Z     ^[[90m 41|^[[39m     expect(pendingPatch?.diagnostics[0]?.ruleId).toBe("pending-referen…
quality (node 24)	Run npm test	2026-08-14T05:58:52.2384652Z     ^[[90m 42|^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2384824Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2385111Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2385369Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2385398Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2394451Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m68 passed^[[39m^[[22m^[[90m (69)^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2396222Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m254 passed^[[39m^[[22m^[[90m (255)^[[39m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2397168Z ^[[2m   Start at ^[[22m 05:58:44
quality (node 24)	Run npm test	2026-08-14T05:58:52.2399787Z ^[[2m   Duration ^[[22m 7.39s^[[2m (transform 1.35s, setup 0ms, import 3.74s, tests 4.59s, environment 11ms)^[[22m
quality (node 24)	Run npm test	2026-08-14T05:58:52.2401574Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2418141Z 
quality (node 24)	Run npm test	2026-08-14T05:58:52.2440504Z ##[error]AssertionError: expected 'error' to be 'blocked' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Expected: "blocked"
quality (node 24)	Run npm test	Received: "error"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/cross-motion.test.ts:40:34
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T05:58:52.2933966Z ##[error]Process completed with exit code 1.
```
