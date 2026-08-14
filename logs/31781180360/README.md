# CI log archive: 31781180360

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31781180360
- Captured: 2026-08-14T07:46:15Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-14T07:45:49.9940429Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:49.9940842Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:49.9988266Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:49.9988557Z env:
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:49.9988757Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:49.9988975Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.1114445Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.1115247Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.1116063Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.1116735Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.5361292Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.5365565Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.5366526Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.8988498Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.9030688Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:50.9847330Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.1156773Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.1615437Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.1922159Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.3561809Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.3620231Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.4529287Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.4551188Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.4583098Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.5622820Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.5710233Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.6933252Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.7747207Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.8109523Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.9282117Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:51.9639279Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.0550210Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.2240691Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.3001095Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.3308885Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.4379165Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.5099148Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.5403730Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.6584471Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7110701Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7334448Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7390807Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7391702Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7392052Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7399596Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7402150Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'blocked' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7402923Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7403197Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7403620Z "blocked"
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7403833Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7404097Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7404504Z undefined
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7404720Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7405561Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m43:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7440290Z     ^[[90m 41|^[[39m     ^[[35mconst^[[39m blocked ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(consumerId^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7442496Z     ^[[90m 42|^[[39m     const blockedConsumer = blocked.patches.find(({ nodeId }) => nodeI…
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7444418Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(blockedConsumer^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"blocked"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7446014Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7447542Z     ^[[90m 44|^[[39m     expect(blockedConsumer?.diagnostics[0]?.ruleId).toBe("observation-…
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7448432Z     ^[[90m 45|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7448683Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7449161Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7449562Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7451448Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7453758Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7454689Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7455005Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7455435Z "ready"
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7455640Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7455936Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7456628Z undefined
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7456857Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7457661Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m69:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7459642Z     ^[[90m 67|^[[39m       ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m (cycle ^[[33m+^[[39m ^[[34m1^[[39m) ^[[33m/^[[39m ^[[34m50^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7461430Z     ^[[90m 68|^[[39m       const patch = batch.patches.find(({ nodeId }) => nodeId === cons…
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7462998Z     ^[[90m 69|^[[39m       ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7464245Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7465976Z     ^[[90m 70|^[[39m       revisions^[[33m.^[[39m^[[34mpush^[[39m(patch^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7467741Z     ^[[90m 71|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7468021Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7468494Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7468905Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7468965Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7469896Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m25 passed^[[39m^[[22m^[[90m (26)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7471444Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m71 passed^[[39m^[[22m^[[90m (73)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7472512Z ^[[2m   Start at ^[[22m 07:45:50
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7473886Z ^[[2m   Duration ^[[22m 2.19s^[[2m (transform 666ms, setup 0ms, import 1.64s, tests 349ms, environment 4ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7474716Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7478249Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7499993Z ##[error]AssertionError: expected undefined to be 'blocked' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"blocked"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/remount.test.ts:43:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7508096Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7510542Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/remount.test.ts:69:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:45:52.7781287Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-14T07:45:49.7406627Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-14T07:45:49.7407084Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-14T07:45:49.7456835Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-14T07:45:49.7457247Z env:
quality (node 24)	Run npm test	2026-08-14T07:45:49.7457559Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-14T07:45:49.7457897Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-14T07:45:49.8584582Z 
quality (node 24)	Run npm test	2026-08-14T07:45:49.8585472Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-14T07:45:49.8586291Z > vitest run
quality (node 24)	Run npm test	2026-08-14T07:45:49.8586692Z 
quality (node 24)	Run npm test	2026-08-14T07:45:50.1724410Z 
quality (node 24)	Run npm test	2026-08-14T07:45:50.1803339Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:50.1853251Z 
quality (node 24)	Run npm test	2026-08-14T07:45:50.6253973Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:50.6933793Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:50.9556320Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:51.0102451Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:51.2495340Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:51.2575914Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:51.5232667Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:51.5953983Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:51.7754870Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:51.8873318Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:52.0408167Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:52.1353346Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:52.3033833Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:52.4133953Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:52.5636028Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:52.7176901Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:53.1063582Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:53.1443787Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:53.3794587Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:53.4242502Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:53.6473034Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:53.7305877Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:53.8716090Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.0283521Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.0858781Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3569^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.0860847Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3565^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.1106507Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.2983618Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.3074028Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.3437156Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.5542575Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.5545116Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.5548087Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.5852021Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.5993440Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.7784437Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.8093679Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.8136098Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:54.9942772Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.0043368Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.0308659Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.1852639Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.2070989Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.2441001Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.3871043Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.4344362Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-14T07:45:55.4362260Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T07:45:55.4363814Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:45:55.4365349Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:45:55.4366553Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:45:55.4367324Z 
quality (node 24)	Run npm test	2026-08-14T07:45:55.4382981Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.4558739Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.6073911Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.6439610Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.6638241Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.8260950Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.8753500Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:55.9123205Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.0337804Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.0881599Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.1157381Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.2543776Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.3050306Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.3513536Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.4663214Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.5198477Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.5265328Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.6694368Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.7153426Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.7184808Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.8763538Z  ^[[32m✓^[[39m packages/core/test/unit/domain/triggers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.9074585Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:56.9154668Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.1096386Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-14T07:45:57.1099625Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T07:45:57.1101569Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:45:57.1102946Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:45:57.1104240Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:45:57.1105096Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.1118390Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.1246187Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.1460422Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.3262698Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.3536562Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.4056131Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5017338Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5046638Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5089877Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5090875Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5091704Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5095895Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
quality (node 24)	Run npm test	2026-08-14T07:45:57.5103063Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'blocked' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5103815Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5104141Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5104552Z "blocked"
quality (node 24)	Run npm test	2026-08-14T07:45:57.5104751Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5105028Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5105428Z undefined
quality (node 24)	Run npm test	2026-08-14T07:45:57.5105638Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5106407Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m43:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5150186Z     ^[[90m 41|^[[39m     ^[[35mconst^[[39m blocked ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(consumerId^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5152262Z     ^[[90m 42|^[[39m     const blockedConsumer = blocked.patches.find(({ nodeId }) => nodeI…
quality (node 24)	Run npm test	2026-08-14T07:45:57.5153897Z     ^[[90m 43|^[[39m     ^[[34mexpect^[[39m(blockedConsumer^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"blocked"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5155121Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5156204Z     ^[[90m 44|^[[39m     expect(blockedConsumer?.diagnostics[0]?.ruleId).toBe("observation-…
quality (node 24)	Run npm test	2026-08-14T07:45:57.5158369Z     ^[[90m 45|^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5158617Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5159086Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5159431Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5161477Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
quality (node 24)	Run npm test	2026-08-14T07:45:57.5163599Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5164771Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5165085Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5165431Z "ready"
quality (node 24)	Run npm test	2026-08-14T07:45:57.5165588Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5165793Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5166116Z undefined
quality (node 24)	Run npm test	2026-08-14T07:45:57.5166286Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5166990Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m69:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5169218Z     ^[[90m 67|^[[39m       ^[[35mconst^[[39m batch ^[[33m=^[[39m runtime^[[33m.^[[39m^[[34mseek^[[39m(sourceId^[[33m,^[[39m (cycle ^[[33m+^[[39m ^[[34m1^[[39m) ^[[33m/^[[39m ^[[34m50^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5170937Z     ^[[90m 68|^[[39m       const patch = batch.patches.find(({ nodeId }) => nodeId === cons…
quality (node 24)	Run npm test	2026-08-14T07:45:57.5172640Z     ^[[90m 69|^[[39m       ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5173775Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5175049Z     ^[[90m 70|^[[39m       revisions^[[33m.^[[39m^[[34mpush^[[39m(patch^[[33m?.^[[39mrevision ^[[33m??^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5176056Z     ^[[90m 71|^[[39m     }
quality (node 24)	Run npm test	2026-08-14T07:45:57.5176344Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5176799Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5177187Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5177230Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5178160Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m72 passed^[[39m^[[22m^[[90m (73)^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5179649Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m272 passed^[[39m^[[22m^[[90m (274)^[[39m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5180591Z ^[[2m   Start at ^[[22m 07:45:50
quality (node 24)	Run npm test	2026-08-14T07:45:57.5182203Z ^[[2m   Duration ^[[22m 7.30s^[[2m (transform 1.28s, setup 0ms, import 3.69s, tests 4.54s, environment 14ms)^[[22m
quality (node 24)	Run npm test	2026-08-14T07:45:57.5182912Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5194930Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5220466Z ##[error]AssertionError: expected undefined to be 'blocked' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"blocked"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/remount.test.ts:43:37
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T07:45:57.5228806Z 
quality (node 24)	Run npm test	2026-08-14T07:45:57.5232055Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"ready"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/remount.test.ts:69:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T07:45:57.5645417Z ##[error]Process completed with exit code 1.
```
