# CI log archive: 31775234088

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31775234088
- Captured: 2026-08-14T06:08:17Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-14T06:07:57.6350217Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.6350591Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.6403193Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.6403731Z env:
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.6403948Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.6404175Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.8048536Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.8049181Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.8049770Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:57.8050026Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.2368029Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.2371977Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.2372427Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.6165147Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.6751799Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.6955175Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.8148861Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.9036583Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.9043760Z ^[[31m     ^[[31m×^[[31m keeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order^[[39m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.9045886Z ^[[31m     ^[[31m×^[[31m publishes the same child output when the source is mounted first^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.9047540Z      ^[[32m✓^[[39m rejects an unknown cross-motion source at load instead of treating it as pending^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:58.9132644Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.0063487Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.1178641Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.1303158Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.2223376Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.2942504Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.3454186Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.4214609Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.4917650Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.6967539Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.7165502Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.7419883Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.9134696Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.9188965Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:59.9242665Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1077148Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1166086Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1235303Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1263582Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1264319Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1264924Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1269446Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1275986Z ^[[31m^[[1mAssertionError^[[22m: expected { node: 'base/root' } to match object { parentWorld: { node: 'base/root' } }
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1277152Z (1 matching property omitted from actual)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1277645Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1277957Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1278469Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1278789Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1279062Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1279621Z ^[[32m-   "parentWorld": {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1280260Z ^[[2m    "node": "base/root",^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1280787Z ^[[32m-   },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1281402Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1281678Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1282462Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m47:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1319810Z     ^[[90m 45|^[[39m     const childPatch = recovered.patches.find(({ nodeId }) => nodeId =…
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1321481Z     ^[[90m 46|^[[39m     ^[[34mexpect^[[39m(childPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1322778Z     ^[[90m 47|^[[39m     expect(childPatch?.values).toMatchObject({ parentWorld: { node: "b…
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1323689Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1324987Z     ^[[90m 48|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(childPatch))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1326272Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(childPatch^[[33m?.^[[39mvalues))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1326772Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1327037Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1327274Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1328178Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mpublishes the same child output when the source is mounted first
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1329395Z ^[[31m^[[1mAssertionError^[[22m: expected { node: 'base/root' } to match object { parentWorld: { node: 'base/root' } }
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1330035Z (1 matching property omitted from actual)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1330257Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1330391Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1330675Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1330980Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1331121Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1331413Z ^[[32m-   "parentWorld": {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1331855Z ^[[2m    "node": "base/root",^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1332148Z ^[[32m-   },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1332380Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1332514Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1332941Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m63:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1333405Z     ^[[90m 61|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1333985Z     ^[[90m 62|^[[39m     ^[[34mexpect^[[39m(childPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1335607Z     ^[[90m 63|^[[39m     expect(childPatch?.values).toMatchObject({ parentWorld: { node: "b…
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1336377Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1336863Z     ^[[90m 64|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1337261Z     ^[[90m 65|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1337430Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1337677Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1337886Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1338272Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1339256Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m22 passed^[[39m^[[22m^[[90m (23)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1340591Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m61 passed^[[39m^[[22m^[[90m (63)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1341736Z ^[[2m   Start at ^[[22m 06:07:58
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1342919Z ^[[2m   Duration ^[[22m 1.87s^[[2m (transform 769ms, setup 0ms, import 1.50s, tests 262ms, environment 3ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1343431Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1346716Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1369747Z ##[error]AssertionError: expected { node: 'base/root' } to match object { parentWorld: { node: 'base/root' } }
integration (node 24)	Run npm run test:integration	(1 matching property omitted from actual)
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "parentWorld": {
integration (node 24)	Run npm run test:integration	    "node": "base/root",
integration (node 24)	Run npm run test:integration	-   },
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:47:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1378537Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1382426Z ##[error]AssertionError: expected { node: 'base/root' } to match object { parentWorld: { node: 'base/root' } }
integration (node 24)	Run npm run test:integration	(1 matching property omitted from actual)
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "parentWorld": {
integration (node 24)	Run npm run test:integration	    "node": "base/root",
integration (node 24)	Run npm run test:integration	-   },
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:63:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T06:08:00.1705090Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-14T06:07:56.3401490Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-14T06:07:56.3401822Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-14T06:07:56.3440276Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-14T06:07:56.3440859Z env:
quality (node 24)	Run npm test	2026-08-14T06:07:56.3441097Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-14T06:07:56.3441345Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-14T06:07:56.4619895Z 
quality (node 24)	Run npm test	2026-08-14T06:07:56.4620891Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-14T06:07:56.4621543Z > vitest run
quality (node 24)	Run npm test	2026-08-14T06:07:56.4621784Z 
quality (node 24)	Run npm test	2026-08-14T06:07:56.7852703Z 
quality (node 24)	Run npm test	2026-08-14T06:07:56.7854455Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:56.7855349Z 
quality (node 24)	Run npm test	2026-08-14T06:07:57.2635945Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:57.3386549Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:57.5972745Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:57.6239500Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:57.8529287Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:57.8872988Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:58.1941355Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:58.2127134Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 80^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:58.4623418Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:58.5952897Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:58.7062797Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:58.9199292Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:58.9332695Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:59.1813240Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:59.4513061Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:59.4967285Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:59.7367642Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:07:59.7705493Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.0309646Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.0524011Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.3098870Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.3338654Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.3358765Z ^[[31m     ^[[31m×^[[31m keeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order^[[39m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.3364256Z ^[[31m     ^[[31m×^[[31m publishes the same child output when the source is mounted first^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.3366170Z      ^[[32m✓^[[39m rejects an unknown cross-motion source at load instead of treating it as pending^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.4692887Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3329^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.4723381Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3325^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.5482542Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.6122787Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.7080230Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.8402750Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.8679678Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:00.9491342Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.0514140Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.0840796Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.1704700Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.2600316Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.2942557Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.3693185Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.4649333Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.4708862Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.5790042Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.6808066Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-14T06:08:01.6829123Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T06:08:01.6831111Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.6833336Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T06:08:01.6834744Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T06:08:01.6836044Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T06:08:01.6836741Z 
quality (node 24)	Run npm test	2026-08-14T06:08:01.6882124Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.7908244Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.8798875Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:01.8982602Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.0079287Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.1102775Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.1457997Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.2052790Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.3433005Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.3490207Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.4380176Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.5572366Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.5813017Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.6150069Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.7653107Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.7847501Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.8143162Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.9623067Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.9752974Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:02.9979019Z  ^[[32m✓^[[39m packages/core/test/unit/domain/triggers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.1493061Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.1653117Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.2493316Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-14T06:08:03.2506147Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T06:08:03.2508589Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.2510297Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T06:08:03.2513269Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T06:08:03.2514911Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T06:08:03.2515688Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.3599626Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.3833036Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.4740696Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.5872759Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.6112606Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.6533551Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7382353Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7414701Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7415759Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7416448Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7420882Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order
quality (node 24)	Run npm test	2026-08-14T06:08:03.7426549Z ^[[31m^[[1mAssertionError^[[22m: expected { node: 'base/root' } to match object { parentWorld: { node: 'base/root' } }
quality (node 24)	Run npm test	2026-08-14T06:08:03.7427844Z (1 matching property omitted from actual)^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7428254Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7428774Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7429398Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7429755Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7430885Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7431670Z ^[[32m-   "parentWorld": {^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7432412Z ^[[2m    "node": "base/root",^[[22m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7433076Z ^[[32m-   },^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7433572Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7433823Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7435206Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m47:32^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7480295Z     ^[[90m 45|^[[39m     const childPatch = recovered.patches.find(({ nodeId }) => nodeId =…
quality (node 24)	Run npm test	2026-08-14T06:08:03.7482227Z     ^[[90m 46|^[[39m     ^[[34mexpect^[[39m(childPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7483686Z     ^[[90m 47|^[[39m     expect(childPatch?.values).toMatchObject({ parentWorld: { node: "b…
quality (node 24)	Run npm test	2026-08-14T06:08:03.7484646Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7486107Z     ^[[90m 48|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(childPatch))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7488207Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(childPatch^[[33m?.^[[39mvalues))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7489197Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7489639Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7489963Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7492096Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mpublishes the same child output when the source is mounted first
quality (node 24)	Run npm test	2026-08-14T06:08:03.7494407Z ^[[31m^[[1mAssertionError^[[22m: expected { node: 'base/root' } to match object { parentWorld: { node: 'base/root' } }
quality (node 24)	Run npm test	2026-08-14T06:08:03.7495971Z (1 matching property omitted from actual)^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7496371Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7496623Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7497086Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7497336Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7497548Z ^[[2m  {^[[22m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7498340Z ^[[32m-   "parentWorld": {^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7498960Z ^[[2m    "node": "base/root",^[[22m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7499475Z ^[[32m-   },^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7499905Z ^[[2m  }^[[22m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7500128Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7501340Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m63:32^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7502237Z     ^[[90m 61|^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7503374Z     ^[[90m 62|^[[39m     ^[[34mexpect^[[39m(childPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7504770Z     ^[[90m 63|^[[39m     expect(childPatch?.values).toMatchObject({ parentWorld: { node: "b…
quality (node 24)	Run npm test	2026-08-14T06:08:03.7505795Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7506685Z     ^[[90m 64|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7507437Z     ^[[90m 65|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7507742Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7508158Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7508562Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7508622Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7509521Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m68 passed^[[39m^[[22m^[[90m (69)^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7511286Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m255 passed^[[39m^[[22m^[[90m (257)^[[39m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7512319Z ^[[2m   Start at ^[[22m 06:07:56
quality (node 24)	Run npm test	2026-08-14T06:08:03.7513596Z ^[[2m   Duration ^[[22m 6.92s^[[2m (transform 1.30s, setup 0ms, import 3.48s, tests 4.32s, environment 11ms)^[[22m
quality (node 24)	Run npm test	2026-08-14T06:08:03.7514352Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7517599Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7548973Z ##[error]AssertionError: expected { node: 'base/root' } to match object { parentWorld: { node: 'base/root' } }
quality (node 24)	Run npm test	(1 matching property omitted from actual)
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	-   "parentWorld": {
quality (node 24)	Run npm test	    "node": "base/root",
quality (node 24)	Run npm test	-   },
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/cross-motion.test.ts:47:32
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T06:08:03.7561785Z 
quality (node 24)	Run npm test	2026-08-14T06:08:03.7566189Z ##[error]AssertionError: expected { node: 'base/root' } to match object { parentWorld: { node: 'base/root' } }
quality (node 24)	Run npm test	(1 matching property omitted from actual)
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  {
quality (node 24)	Run npm test	-   "parentWorld": {
quality (node 24)	Run npm test	    "node": "base/root",
quality (node 24)	Run npm test	-   },
quality (node 24)	Run npm test	  }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/cross-motion.test.ts:63:32
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T06:08:03.8010812Z ##[error]Process completed with exit code 1.
```
