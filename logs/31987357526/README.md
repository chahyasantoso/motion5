# CI log archive: 31987357526

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31987357526
- Captured: 2026-08-17T02:14:40Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-17T02:14:11.2834390Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.2834762Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.2873994Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.2874491Z env:
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.2874690Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.2874903Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.3997828Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.3999046Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.4000030Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.4000669Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.7208798Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.7230370Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:11.7258808Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.2320606Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.2570220Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.3892910Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.3896037Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.3919374Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.3949348Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.3975173Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.3976462Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 81^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.4912563Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.5621019Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.7107409Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.7110639Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.7129904Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.7131838Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.7905395Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:12.8050433Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.0024416Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.0560395Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.0870700Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.2620696Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.3098843Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.3880715Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.4829509Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.5992929Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.6462908Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.7180432Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.8424609Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:13.9087645Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.0080418Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.0451109Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.1661103Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.2486570Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.3084739Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.5532543Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.6500322Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.6609249Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.7940021Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.8760914Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:14.9165289Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.0400114Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.0941305Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1242436Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1273231Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1274180Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1274854Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1279269Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1295987Z ^[[31m^[[1mAssertionError^[[22m: expected [ { nodeId: '~/root', …(6) } ] to have a length of +0 but got 1^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1296425Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1296569Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1296846Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1296978Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1297089Z ^[[32m- 0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1297306Z ^[[31m+ 1^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1297419Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1297941Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m78:68^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1347148Z     ^[[90m 76|^[[39m     // A failed destroy is not a destruction event. The graph and its …
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1349007Z     ^[[90m 77|^[[39m     // be live, and the adoption map must still make the same failure …
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1350466Z     ^[[90m 78|^[[39m     expect(patches.filter(({ status }) => status === "destroyed")).toH…
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1351656Z     ^[[90m   |^[[39m                                                                    ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1353469Z     ^[[90m 79|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(root^[[33m.^[[39mid)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(before[^[[34m0^[[39m]^[[33m?.^[[39mpatch^[[33m?.^[[39mstatus)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1355225Z     ^[[90m 80|^[[39m     expect(() => handle.seek(root.id, 0.7).patches.some(({ status }) =…
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1355843Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1356342Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1356749Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1359068Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1361154Z ^[[31m^[[1mTypeError^[[22m: Adopted track "~/child" already exists.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1362730Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m115:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1397951Z     ^[[90m113|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1404853Z     ^[[90m114|^[[39m     ^[[35mif^[[39m (^[[35mthis^[[39m^[[33m.^[[39m#graph^[[33m.^[[39mstate^[[33m.^[[39m^[[34mhasNode^[[39m(id) ^[[33m||^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#adopted^[[33m.^[[39m^[[34mhas^[[39m(id))
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1407444Z     ^[[90m115|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Adopted track "^[[39m^[[36m${^[[39mid^[[36m}^[[39m^[[32m" already exists.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1410230Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1411121Z     ^[[90m116|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1412305Z     ^[[90m117|^[[39m     ^[[90m// Validate keyframes at the same trust level as authored tracks.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1413960Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m59:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1415754Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m112:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1416744Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1419156Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1419770Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1421889Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1423994Z ^[[31m^[[1mTypeError^[[22m: Adopted track "~/self" already exists.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1425418Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m115:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1426458Z     ^[[90m113|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1427994Z     ^[[90m114|^[[39m     ^[[35mif^[[39m (^[[35mthis^[[39m^[[33m.^[[39m#graph^[[33m.^[[39mstate^[[33m.^[[39m^[[34mhasNode^[[39m(id) ^[[33m||^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#adopted^[[33m.^[[39m^[[34mhas^[[39m(id))
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1430416Z     ^[[90m115|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Adopted track "^[[39m^[[36m${^[[39mid^[[36m}^[[39m^[[32m" already exists.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1431601Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1432088Z     ^[[90m116|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1432951Z     ^[[90m117|^[[39m     ^[[90m// Validate keyframes at the same trust level as authored tracks.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1434166Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m59:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1435593Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m142:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1436318Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1436754Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1437116Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1437144Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1437935Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m33 passed^[[39m^[[22m^[[90m (34)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1439807Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m116 passed^[[39m^[[22m^[[90m (119)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1440896Z ^[[2m   Start at ^[[22m 02:14:11
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1442053Z ^[[2m   Duration ^[[22m 3.39s^[[2m (transform 1.10s, setup 0ms, import 2.74s, tests 619ms, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1442782Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1442795Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1466171Z ##[error]AssertionError: expected [ { nodeId: '~/root', …(6) } ] to have a length of +0 but got 1
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- 0
integration (node 24)	Run npm run test:integration	+ 1
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:78:68
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1475798Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1479577Z ##[error]TypeError: Adopted track "~/child" already exists.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:115:13
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:59:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:112:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1482171Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1486202Z ##[error]TypeError: Adopted track "~/self" already exists.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:115:13
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:59:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:142:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T02:14:15.1763017Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-17T02:14:17.3148367Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-17T02:14:17.3148671Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-17T02:14:17.3174781Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-17T02:14:17.3175082Z env:
quality (node 24)	Run npm test	2026-08-17T02:14:17.3175378Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-17T02:14:17.3175601Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-17T02:14:17.4178697Z 
quality (node 24)	Run npm test	2026-08-17T02:14:17.4179300Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-17T02:14:17.4179947Z > vitest run
quality (node 24)	Run npm test	2026-08-17T02:14:17.4180166Z 
quality (node 24)	Run npm test	2026-08-17T02:14:17.8253260Z 
quality (node 24)	Run npm test	2026-08-17T02:14:17.8257788Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:17.8258496Z 
quality (node 24)	Run npm test	2026-08-17T02:14:18.1734717Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:18.3025105Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:18.4055683Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-17T02:14:18.4058468Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T02:14:18.4060124Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:14:18.4061223Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:14:18.4062025Z 
quality (node 24)	Run npm test	2026-08-17T02:14:18.4116064Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 66^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:18.5304189Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:18.5693788Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:18.6089638Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:18.7757458Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:18.8452609Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.0027808Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.0413909Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.1905571Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.2425580Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.4672220Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.5427180Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.5452145Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.5471012Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.5481327Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.7623116Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:19.8483874Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.0352628Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.0821876Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.2962568Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.3091978Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.5149978Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.5312676Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.6955310Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.7537076Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.8972213Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:20.9873770Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.1169969Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.2434456Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.3736178Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.4125038Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2663^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.4140664Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2656^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.4501721Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.6011884Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.6148319Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.6237778Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.8037314Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.8111589Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.8329779Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:21.9804808Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.0242249Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.0768638Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.1517414Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.2418283Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.3025310Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.3901879Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.4302123Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.5122745Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.5653531Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.6194896Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.7428259Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.7481669Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.8372290Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.9148527Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:22.9304804Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.0343437Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.1103107Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.1223222Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.2219311Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-17T02:14:23.2231620Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T02:14:23.2233040Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:14:23.2234067Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:14:23.2235155Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:14:23.2235931Z 
quality (node 24)	Run npm test	2026-08-17T02:14:23.2242314Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.3083232Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.3306679Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.4351771Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.4792517Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.5152485Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.6729076Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.7096008Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.7283197Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.8608750Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.8895200Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:23.9423586Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.0347359Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.0835299Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.1322451Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.2367716Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.2515972Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.3212239Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.4184453Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.4240863Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.5227255Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.5907377Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.6262752Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-17T02:14:24.6265663Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T02:14:24.6267038Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:14:24.6268145Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:14:24.6269302Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:14:24.6270277Z 
quality (node 24)	Run npm test	2026-08-17T02:14:24.6297715Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.7465637Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.7962870Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.8512850Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:24.9558532Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0055192Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0461215Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0917556Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0962125Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.0963267Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0963599Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.0966210Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
quality (node 24)	Run npm test	2026-08-17T02:14:25.0974261Z ^[[31m^[[1mAssertionError^[[22m: expected [ { nodeId: '~/root', …(6) } ] to have a length of +0 but got 1^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0974946Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.0975189Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0976232Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0976496Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.0976690Z ^[[32m- 0^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0977058Z ^[[31m+ 1^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.0977254Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.0977930Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m78:68^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1015696Z     ^[[90m 76|^[[39m     // A failed destroy is not a destruction event. The graph and its …
quality (node 24)	Run npm test	2026-08-17T02:14:25.1017296Z     ^[[90m 77|^[[39m     // be live, and the adoption map must still make the same failure …
quality (node 24)	Run npm test	2026-08-17T02:14:25.1018877Z     ^[[90m 78|^[[39m     expect(patches.filter(({ status }) => status === "destroyed")).toH…
quality (node 24)	Run npm test	2026-08-17T02:14:25.1021793Z     ^[[90m   |^[[39m                                                                    ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1023821Z     ^[[90m 79|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(root^[[33m.^[[39mid)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(before[^[[34m0^[[39m]^[[33m?.^[[39mpatch^[[33m?.^[[39mstatus)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1025843Z     ^[[90m 80|^[[39m     expect(() => handle.seek(root.id, 0.7).patches.some(({ status }) =…
quality (node 24)	Run npm test	2026-08-17T02:14:25.1026684Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1027617Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1027913Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1028849Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
quality (node 24)	Run npm test	2026-08-17T02:14:25.1030008Z ^[[31m^[[1mTypeError^[[22m: Adopted track "~/child" already exists.^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1030760Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m115:13^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1045415Z     ^[[90m113|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1047151Z     ^[[90m114|^[[39m     ^[[35mif^[[39m (^[[35mthis^[[39m^[[33m.^[[39m#graph^[[33m.^[[39mstate^[[33m.^[[39m^[[34mhasNode^[[39m(id) ^[[33m||^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#adopted^[[33m.^[[39m^[[34mhas^[[39m(id))
quality (node 24)	Run npm test	2026-08-17T02:14:25.1049649Z     ^[[90m115|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Adopted track "^[[39m^[[36m${^[[39mid^[[36m}^[[39m^[[32m" already exists.`^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1051068Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1051801Z     ^[[90m116|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1052826Z     ^[[90m117|^[[39m     ^[[90m// Validate keyframes at the same trust level as authored tracks.^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1054246Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m59:47^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1054848Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1055784Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m112:32^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1056963Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1057514Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1057995Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1059856Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
quality (node 24)	Run npm test	2026-08-17T02:14:25.1062083Z ^[[31m^[[1mTypeError^[[22m: Adopted track "~/self" already exists.^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1063463Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m115:13^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1064314Z     ^[[90m113|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1065700Z     ^[[90m114|^[[39m     ^[[35mif^[[39m (^[[35mthis^[[39m^[[33m.^[[39m#graph^[[33m.^[[39mstate^[[33m.^[[39m^[[34mhasNode^[[39m(id) ^[[33m||^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#adopted^[[33m.^[[39m^[[34mhas^[[39m(id))
quality (node 24)	Run npm test	2026-08-17T02:14:25.1067750Z     ^[[90m115|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Adopted track "^[[39m^[[36m${^[[39mid^[[36m}^[[39m^[[32m" already exists.`^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1068416Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1068711Z     ^[[90m116|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1069266Z     ^[[90m117|^[[39m     ^[[90m// Validate keyframes at the same trust level as authored tracks.^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1070529Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m59:47^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1071305Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m142:32^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1071677Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1071904Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1072111Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1072744Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m85 passed^[[39m^[[22m^[[90m (86)^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1073481Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m353 passed^[[39m^[[22m^[[90m (356)^[[39m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1073979Z ^[[2m   Start at ^[[22m 02:14:17
quality (node 24)	Run npm test	2026-08-17T02:14:25.1074833Z ^[[2m   Duration ^[[22m 7.26s^[[2m (transform 1.41s, setup 0ms, import 4.05s, tests 3.75s, environment 12ms)^[[22m
quality (node 24)	Run npm test	2026-08-17T02:14:25.1075554Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1096450Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1121750Z ##[error]AssertionError: expected [ { nodeId: '~/root', …(6) } ] to have a length of +0 but got 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 0
quality (node 24)	Run npm test	+ 1
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:78:68
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T02:14:25.1130170Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1133115Z ##[error]TypeError: Adopted track "~/child" already exists.
quality (node 24)	Run npm test	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:115:13
quality (node 24)	Run npm test	 ❯ Object.adopt packages/core/src/engine.ts:59:47
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:112:32
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T02:14:25.1135354Z 
quality (node 24)	Run npm test	2026-08-17T02:14:25.1137980Z ##[error]TypeError: Adopted track "~/self" already exists.
quality (node 24)	Run npm test	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:115:13
quality (node 24)	Run npm test	 ❯ Object.adopt packages/core/src/engine.ts:59:47
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:142:32
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T02:14:25.1516866Z ##[error]Process completed with exit code 1.
```
