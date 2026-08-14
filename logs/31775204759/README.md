# CI log archive: 31775204759

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31775204759
- Captured: 2026-08-14T06:07:43Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-14T06:07:25.1694534Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.1694815Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.1733107Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.1733323Z env:
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.1733479Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.1733649Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.2538624Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.2539383Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.2539919Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.2540207Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.4767041Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.4770884Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.4771565Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.7575881Z  ^[[31m❯^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.7577621Z      ^[[32m✓^[[39m preserves the last known good values when a node publishes error^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.7578725Z      ^[[32m✓^[[39m derives source revisions from the upstream patches consumed in the flush^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.7580160Z ^[[31m     ^[[31m×^[[31m reports a missing upstream instead of silently composing with an input hole^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.7581392Z      ^[[32m✓^[[39m chooses the blocked upstream deterministically by edge key, not authored edge order^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.7582580Z      ^[[32m✓^[[39m rejects host objects from interpolator state at the renderer edge^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.7583680Z      ^[[32m✓^[[39m kills a timeline exactly once when a Track is disposed repeatedly^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.8074710Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.8171825Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.9145974Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.9813102Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.9815233Z ^[[31m     ^[[31m×^[[31m keeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.9816968Z ^[[31m     ^[[31m×^[[31m publishes the same child output when the source is mounted first^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.9818246Z      ^[[32m✓^[[39m rejects an unknown cross-motion source at load instead of treating it as pending^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:25.9849710Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.0875288Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.1437813Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.1521016Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.2672519Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.2976941Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.3109046Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.4209874Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.4346335Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.6158695Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.6348040Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.6533697Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.7638614Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.7667225Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.8175920Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9255991Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9317457Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9525319Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9548036Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9548590Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9548925Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9552316Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9556405Z ^[[31m^[[1mAssertionError^[[22m: expected { node: 'base/root' } to deeply equal { node: 'arm/child', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9556906Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9557035Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9557366Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9557550Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9557678Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9558028Z ^[[32m-   "node": "arm/child",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9558349Z ^[[32m-   "parentWorld": {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9558606Z ^[[2m    "node": "base/root",^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9558821Z ^[[32m-   },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9559000Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9559095Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9559433Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m47:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9586746Z     ^[[90m 45|^[[39m     const childPatch = recovered.patches.find(({ nodeId }) => nodeId =…
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9587812Z     ^[[90m 46|^[[39m     ^[[34mexpect^[[39m(childPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9588931Z     ^[[90m 47|^[[39m     expect(childPatch?.values).toEqual({ node: "arm/child", parentWorl…
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9589714Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9590785Z     ^[[90m 48|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(childPatch))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9592270Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(childPatch^[[33m?.^[[39mvalues))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9593049Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9593460Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9593818Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9595010Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mpublishes the same child output when the source is mounted first
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9596579Z ^[[31m^[[1mAssertionError^[[22m: expected { node: 'base/root' } to deeply equal { node: 'arm/child', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9597547Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9597781Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9598164Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9598348Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9598499Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9598871Z ^[[32m-   "node": "arm/child",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9599368Z ^[[32m-   "parentWorld": {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9599686Z ^[[2m    "node": "base/root",^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9599911Z ^[[32m-   },^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9600092Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9600190Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9600517Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m63:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9600881Z     ^[[90m 61|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9601356Z     ^[[90m 62|^[[39m     ^[[34mexpect^[[39m(childPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9601934Z     ^[[90m 63|^[[39m     expect(childPatch?.values).toEqual({ node: "arm/child", parentWorl…
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9602533Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9603115Z     ^[[90m 64|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9603584Z     ^[[90m 65|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9603784Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9604110Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9604371Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9605622Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/p2-runtime-smells.test.ts^[[2m > ^[[22mP2 runtime smell hardening^[[2m > ^[[22mreports a missing upstream instead of silently composing with an input hole
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9607609Z ^[[31m^[[1mAssertionError^[[22m: expected 'blocked' to be 'error' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9608064Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9608298Z Expected: ^[[32m"error"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9608689Z Received: ^[[31m"blocked"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9608901Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9609431Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m72:46^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9611474Z     ^[[90m 70|^[[39m     )^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9612612Z     ^[[90m 71|^[[39m     publisher^[[33m.^[[39m^[[34mflush^[[39m(^[[34msnapshot^[[39m([consumer])^[[33m,^[[39m [^[[32m"consumer"^[[39m]^[[33m,^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9614250Z     ^[[90m 72|^[[39m     ^[[34mexpect^[[39m(registry^[[33m.^[[39m^[[35mget^[[39m(^[[32m"consumer"^[[39m)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"error"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9615446Z     ^[[90m   |^[[39m                                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9616582Z     ^[[90m 73|^[[39m     expect(registry.get("consumer")?.diagnostics[0]?.ruleId).toBe("obs…
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9617049Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9617426Z     ^[[90m 74|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9617769Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9618217Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9618637Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9625389Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m21 passed^[[39m^[[22m^[[90m (23)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9626818Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m60 passed^[[39m^[[22m^[[90m (63)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9627683Z ^[[2m   Start at ^[[22m 06:07:25
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9628770Z ^[[2m   Duration ^[[22m 1.46s^[[2m (transform 589ms, setup 0ms, import 1.17s, tests 204ms, environment 2ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9629465Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9631462Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9654951Z ##[error]AssertionError: expected { node: 'base/root' } to deeply equal { node: 'arm/child', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "node": "arm/child",
integration (node 24)	Run npm run test:integration	-   "parentWorld": {
integration (node 24)	Run npm run test:integration	    "node": "base/root",
integration (node 24)	Run npm run test:integration	-   },
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:47:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9663652Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9666674Z ##[error]AssertionError: expected { node: 'base/root' } to deeply equal { node: 'arm/child', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "node": "arm/child",
integration (node 24)	Run npm run test:integration	-   "parentWorld": {
integration (node 24)	Run npm run test:integration	    "node": "base/root",
integration (node 24)	Run npm run test:integration	-   },
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:63:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9669601Z 
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:26.9672001Z ##[error]AssertionError: expected 'blocked' to be 'error' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Expected: "error"
integration (node 24)	Run npm run test:integration	Received: "blocked"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/p2-runtime-smells.test.ts:72:46
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T06:07:27.0083882Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-14T06:07:22.1270679Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.1271065Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.1292003Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.1292351Z env:
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.1292619Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.1292924Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.2047424Z 
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.2048177Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.2048739Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:22.2048956Z 
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7960791Z ##[error]packages/core/test/integration/cross-motion.test.ts(70,7): error TS2322: Type '(MotionDefinition | { tracks: { observes: { source: string; role: "input"; target: string; }[]; id?: string | undefined; duration?: number | undefined; keyframes?: Readonly<Record<string, AuthoredProperty>> | undefined; }[]; id: string; trigger: { ...; }; stagger?: number | undefined; })[]' is not assignable to type 'readonly MotionDefinition[]'.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7971384Z   Type 'MotionDefinition | { tracks: { observes: { source: string; role: "input"; target: string; }[]; id?: string | undefined; duration?: number | undefined; keyframes?: Readonly<Record<string, AuthoredProperty>> | undefined; }[]; id: string; trigger: { ...; }; stagger?: number | undefined; }' is not assignable to type 'MotionDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7974578Z     Type '{ tracks: { observes: { source: string; role: "input"; target: string; }[]; id?: string | undefined; duration?: number; keyframes?: Readonly<Record<string, AuthoredProperty>>; }[]; id: string; trigger: { readonly type: TriggerType; readonly [key: string]: unknown; }; stagger?: number; }' is not assignable to type 'MotionDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7976309Z       Types of property 'tracks' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7977713Z         Type '{ observes: { source: string; role: "input"; target: string; }[]; id?: string | undefined; duration?: number | undefined; keyframes?: Readonly<Record<string, AuthoredProperty>> | undefined; }[]' is not assignable to type 'readonly TrackDefinition[]'.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7979767Z           Type '{ observes: { source: string; role: "input"; target: string; }[]; id?: string | undefined; duration?: number; keyframes?: Readonly<Record<string, AuthoredProperty>>; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7981023Z             Types of property 'id' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7981627Z               Type 'string | undefined' is not assignable to type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.7982324Z                 Type 'undefined' is not assignable to type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-14T06:07:23.8132692Z ##[error]Process completed with exit code 2.
```
