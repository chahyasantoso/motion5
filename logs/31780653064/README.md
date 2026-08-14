# CI log archive: 31780653064

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31780653064
- Captured: 2026-08-14T07:38:06Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-14T07:37:48.3697531Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.3698038Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.3724274Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.3724747Z env:
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.3724949Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.3725167Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.4658037Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.4658977Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.4659466Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.4659689Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.7523929Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.7525843Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:48.7526758Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.1350968Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.1353037Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.1985081Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.3502251Z  ^[[31m❯^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.3505494Z ^[[31m     ^[[31m×^[[31m bounds the retained diagnostic history at a fixed capacity and reports a drop count once exceeded^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.3507819Z ^[[31m     ^[[31m×^[[31m still surfaces the same diagnostic inline on the affected patch and the batch summary^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.3509797Z ^[[31m     ^[[31m×^[[31m uses the one shared Diagnostic shape for every retained entry, load-time or runtime^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.3511509Z ^[[31m     ^[[31m×^[[31m exposes diagnostics as one bounded read-only snapshot, never a second subscribe/emit surface^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.3881299Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.3928662Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.5654108Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.5698184Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.6155285Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.7486992Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.7965604Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.8096650Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:49.9466816Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.0016737Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.0066102Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.1066962Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.2156407Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.3541221Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.4136837Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.4286885Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.5254630Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.6104265Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.6293724Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7030637Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7484308Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7512290Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7513076Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 4 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7513363Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7518001Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/diagnostics.test.ts^[[2m > ^[[22mP5-03 unified inline diagnostics^[[2m > ^[[22mbounds the retained diagnostic history at a fixed capacity and reports a drop count once exceeded
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7523416Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'entries')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7524826Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/diagnostics.test.ts:^[[2m49:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7568447Z     ^[[90m 47|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"~/consumer3"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7569563Z     ^[[90m 48|^[[39m     ^[[35mconst^[[39m snapshot ^[[33m=^[[39m runtime^[[33m.^[[39mdiagnostics^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7570764Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(snapshot^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7571688Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7572707Z     ^[[90m 50|^[[39m     ^[[34mexpect^[[39m(snapshot^[[33m.^[[39mdroppedCount)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7573978Z     ^[[90m 51|^[[39m     expect(snapshot.entries.map((entry) => entry.path)).toEqual(["~/co…
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7574949Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7575332Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7575678Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7577383Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/diagnostics.test.ts^[[2m > ^[[22mP5-03 unified inline diagnostics^[[2m > ^[[22mstill surfaces the same diagnostic inline on the affected patch and the batch summary
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7579339Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'entries')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7580593Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/diagnostics.test.ts:^[[2m62:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7581738Z     ^[[90m 60|^[[39m     expect(patch?.diagnostics[0]?.ruleId).toBe("observation-pending-re…
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7583077Z     ^[[90m 61|^[[39m     ^[[34mexpect^[[39m(batch^[[33m.^[[39mdiagnostics)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7584855Z     ^[[90m 62|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mdiagnostics^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7585771Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7586303Z     ^[[90m 63|^[[39m     expect(runtime.diagnostics.entries[0]).toEqual(patch?.diagnostics[…
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7586849Z     ^[[90m 64|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7587330Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7587572Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7587856Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7588758Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/diagnostics.test.ts^[[2m > ^[[22mP5-03 unified inline diagnostics^[[2m > ^[[22muses the one shared Diagnostic shape for every retained entry, load-time or runtime
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7589780Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'entries')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7590472Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/diagnostics.test.ts:^[[2m70:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7591081Z     ^[[90m 68|^[[39m     const runtime = new ProjectRuntime(pendingProject(), { clock: crea…
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7591740Z     ^[[90m 69|^[[39m     runtime^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"~/consumer1"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7592447Z     ^[[90m 70|^[[39m     ^[[35mconst^[[39m [entry] ^[[33m=^[[39m runtime^[[33m.^[[39mdiagnostics^[[33m.^[[39mentries^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7593005Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7593520Z     ^[[90m 71|^[[39m     ^[[34mexpect^[[39m(entry)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7605451Z     ^[[90m 72|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(entry^[[33m!^[[39m)^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7606361Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7606908Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7607264Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7609089Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/diagnostics.test.ts^[[2m > ^[[22mP5-03 unified inline diagnostics^[[2m > ^[[22mexposes diagnostics as one bounded read-only snapshot, never a second subscribe/emit surface
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7611050Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'entries')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7612267Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/diagnostics.test.ts:^[[2m86:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7613409Z     ^[[90m 84|^[[39m     ^[[35mconst^[[39m snapshot ^[[33m=^[[39m runtime^[[33m.^[[39mdiagnostics^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7615036Z     ^[[90m 85|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(snapshot))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7616858Z     ^[[90m 86|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(snapshot^[[33m.^[[39mentries))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7618069Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7619093Z     ^[[90m 87|^[[39m     const runtimeAsRecord = runtime as unknown as Record<string, unkno…
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7620571Z     ^[[90m 88|^[[39m     ^[[34mexpect^[[39m(runtimeAsRecord[^[[32m"onDiagnostic"^[[39m])^[[33m.^[[39m^[[34mtoBeUndefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7621340Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7621788Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7622147Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7622233Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7623025Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m24 passed^[[39m^[[22m^[[90m (25)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7624389Z ^[[2m      Tests ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m67 passed^[[39m^[[22m^[[90m (71)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7625403Z ^[[2m   Start at ^[[22m 07:37:48
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7626538Z ^[[2m   Duration ^[[22m 1.98s^[[2m (transform 758ms, setup 0ms, import 1.57s, tests 276ms, environment 3ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7627224Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7627236Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7649844Z ##[error]TypeError: Cannot read properties of undefined (reading 'entries')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/diagnostics.test.ts:49:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7656895Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7658551Z ##[error]TypeError: Cannot read properties of undefined (reading 'entries')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/diagnostics.test.ts:62:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7659513Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7660700Z ##[error]TypeError: Cannot read properties of undefined (reading 'entries')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/diagnostics.test.ts:70:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7661841Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7663002Z ##[error]TypeError: Cannot read properties of undefined (reading 'entries')
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/diagnostics.test.ts:86:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:37:50.7972237Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-14T07:37:46.6831404Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.6831830Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.6875136Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.6875665Z env:
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.6875918Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.6876179Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.7724167Z 
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.7725213Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.7725779Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:46.7726013Z 
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:48.5255531Z ##[error]packages/core/test/integration/diagnostics.test.ts(43,7): error TS2353: Object literal may only specify known properties, and 'diagnosticsCapacity' does not exist in type 'ProjectRuntimeOptions'.
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:48.5265410Z ##[error]packages/core/test/integration/diagnostics.test.ts(48,30): error TS2339: Property 'diagnostics' does not exist on type 'ProjectRuntime'.
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:48.5267470Z ##[error]packages/core/test/integration/diagnostics.test.ts(51,34): error TS7006: Parameter 'entry' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:48.5269557Z ##[error]packages/core/test/integration/diagnostics.test.ts(62,20): error TS2339: Property 'diagnostics' does not exist on type 'ProjectRuntime'.
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:48.5271588Z ##[error]packages/core/test/integration/diagnostics.test.ts(63,20): error TS2339: Property 'diagnostics' does not exist on type 'ProjectRuntime'.
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:48.5273780Z ##[error]packages/core/test/integration/diagnostics.test.ts(70,29): error TS2339: Property 'diagnostics' does not exist on type 'ProjectRuntime'.
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:48.5275854Z ##[error]packages/core/test/integration/diagnostics.test.ts(84,30): error TS2339: Property 'diagnostics' does not exist on type 'ProjectRuntime'.
quality (node 24)	Run npm run typecheck	2026-08-14T07:37:48.5535674Z ##[error]Process completed with exit code 2.
```
