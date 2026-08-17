# CI log archive: 31987793436

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31987793436
- Captured: 2026-08-17T02:23:22Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-17T02:22:54.6646191Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.6646586Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.6690301Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.6690800Z env:
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.6691027Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.6691259Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.7839617Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.7840424Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.7840999Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:54.7841273Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.1996453Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.2001154Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.2001903Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.6466894Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.6600303Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.7758865Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.7761777Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.7763648Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.7765140Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.7767036Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.7825473Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 70^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.8646410Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:55.9130825Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.0689007Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.0864418Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.1416777Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.2830897Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.3371481Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.3680311Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.5080794Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.5703486Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.6078640Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.7651771Z  ^[[31m❯^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.7653240Z ^[[31m     ^[[31m×^[[31m returns a deeply frozen runtime-owned definition^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.7654438Z ^[[31m     ^[[31m×^[[31m rejects caller mutation instead of allowing the graph identity to drift^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.7655714Z ^[[31m     ^[[31m×^[[31m uses the authored validation owner for malformed runtime track structure^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.7657707Z ^[[31m     ^[[31m×^[[31m keeps the existing same-source destroy and readopt path working^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.8003164Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.8440601Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.9749031Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:56.9970159Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.0609464Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.1907872Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.2441031Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.2723553Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.3833316Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.4546746Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.5132157Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.7307285Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.7399198Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.7711051Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.9340840Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.9420402Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:57.9805637Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1473329Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1532997Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1758521Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1789697Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1790225Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 4 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1790528Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1800768Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mreturns a deeply frozen runtime-owned definition
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1819905Z ^[[31m^[[1mAssertionError^[[22m: expected { id: 'arm', …(1) } not to be { id: 'arm', …(1) } // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1820565Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1820866Z ^[[2mCompared values have no visual difference.^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1821131Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1821715Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m30:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1851848Z     ^[[90m 28|^[[39m     ^[[35mconst^[[39m adopted ^[[33m=^[[39m handle^[[33m.^[[39m^[[34madopt^[[39m(source^[[33m,^[[39m owner)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1853098Z     ^[[90m 29|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1854145Z     ^[[90m 30|^[[39m     ^[[34mexpect^[[39m(adopted^[[33m.^[[39mtrack)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBe^[[39m(source)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1855230Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1856742Z     ^[[90m 31|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(adopted^[[33m.^[[39mtrack))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1859058Z     ^[[90m 32|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(adopted^[[33m.^[[39mtrack^[[33m.^[[39mkeyframes))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1860084Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1860534Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1860904Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1862911Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mrejects caller mutation instead of allowing the graph identity to drift
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1865068Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1866522Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m52:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1867653Z     ^[[90m 50|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m {
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1868831Z     ^[[90m 51|^[[39m       (source.keyframes!.x!.stops[1] as { p: number; v: unknown }).v =…
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1869899Z     ^[[90m 52|^[[39m     })^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTypeError^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1870639Z     ^[[90m   |^[[39m        ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1871115Z     ^[[90m 53|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1871894Z     ^[[90m 54|^[[39m     handle^[[33m.^[[39m^[[34mseek^[[39m(adopted^[[33m.^[[39mid^[[33m,^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1872273Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1872721Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1873071Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1875067Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22muses the authored validation owner for malformed runtime track structure
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1877778Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observes-shape/ but got '(track.observes ?? []).entries is not…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1889239Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1889590Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1890012Z /observes-shape/
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1890246Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1890494Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1891323Z "(track.observes ?? []).entries is not a function or its return value is not iterable"
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1891955Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1892906Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m70:50^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1894584Z     ^[[90m 68|^[[39m     } ^[[35mas^[[39m unknown ^[[35mas^[[39m ^[[33mTrackDefinition^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1895424Z     ^[[90m 69|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1896527Z     ^[[90m 70|^[[39m     expect(() => handle.adopt(malformed, owner)).toThrow(/observes-sha…
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1897653Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1898973Z     ^[[90m 71|^[[39m     expect(() => handle.adopt({ id: "broken", keyframes: { x: ramp(0, …
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1900053Z     ^[[90m 72|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1900328Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1900809Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1901192Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1903598Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mkeeps the existing same-source destroy and readopt path working
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1906324Z ^[[31m^[[1mAssertionError^[[22m: expected { id: 'arm', …(1) } not to be { id: 'arm', …(1) } // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1907372Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1907846Z ^[[2mCompared values have no visual difference.^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1908257Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1909219Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m86:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1910121Z     ^[[90m 84|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1911098Z     ^[[90m 85|^[[39m     ^[[34mexpect^[[39m(second^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(first^[[33m.^[[39mid)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1912582Z     ^[[90m 86|^[[39m     ^[[34mexpect^[[39m(second^[[33m.^[[39mtrack)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBe^[[39m(source)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1913691Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1915197Z     ^[[90m 87|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(second^[[33m.^[[39mtrack))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1916432Z     ^[[90m 88|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1916678Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1917159Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1917547Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1917585Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1918719Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m34 passed^[[39m^[[22m^[[90m (35)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1920214Z ^[[2m      Tests ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m119 passed^[[39m^[[22m^[[90m (123)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1921205Z ^[[2m   Start at ^[[22m 02:22:55
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1922444Z ^[[2m   Duration ^[[22m 2.96s^[[2m (transform 1.02s, setup 0ms, import 2.48s, tests 558ms, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1923179Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1923192Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1947385Z ##[error]AssertionError: expected { id: 'arm', …(1) } not to be { id: 'arm', …(1) } // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Compared values have no visual difference.
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:30:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1958217Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1961223Z ##[error]AssertionError: expected function to throw an error, but it didn't
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:52:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1962861Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1966026Z ##[error]AssertionError: expected [Function] to throw error matching /observes-shape/ but got '(track.observes ?? []).entries is not…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observes-shape/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"(track.observes ?? []).entries is not a function or its return value is not iterable"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:70:50
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1967701Z 
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.1969866Z ##[error]AssertionError: expected { id: 'arm', …(1) } not to be { id: 'arm', …(1) } // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Compared values have no visual difference.
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:86:30
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T02:22:58.2257047Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-17T02:22:57.6791146Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-17T02:22:57.6791470Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-17T02:22:57.6828940Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-17T02:22:57.6829205Z env:
quality (node 24)	Run npm test	2026-08-17T02:22:57.6829401Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-17T02:22:57.6829610Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-17T02:22:57.7849186Z 
quality (node 24)	Run npm test	2026-08-17T02:22:57.7849781Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-17T02:22:57.7850485Z > vitest run
quality (node 24)	Run npm test	2026-08-17T02:22:57.7850669Z 
quality (node 24)	Run npm test	2026-08-17T02:22:58.0867965Z 
quality (node 24)	Run npm test	2026-08-17T02:22:58.0892111Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:58.0892934Z 
quality (node 24)	Run npm test	2026-08-17T02:22:58.4481178Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:58.5943998Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:58.7798745Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-17T02:22:58.7801667Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T02:22:58.7803263Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:22:58.7804586Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:22:58.7805460Z 
quality (node 24)	Run npm test	2026-08-17T02:22:58.7818207Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 68^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:58.9285863Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:58.9364959Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:59.0622609Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:59.1842814Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:59.3302982Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:59.4766531Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:59.6015083Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:59.7062406Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:59.9402622Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:22:59.9842181Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:00.1945151Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:00.3266837Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:00.4782395Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 68^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:00.6092662Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:00.7739256Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:00.8912715Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:01.0351010Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:01.1713490Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:01.2769988Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:01.4282290Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:01.5292311Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:01.6863121Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:01.8124225Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:01.9345980Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.1429125Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.2232302Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.4294209Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.5444611Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.6673177Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.7083693Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3553^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.7101871Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3549^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.8202368Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.9453784Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:02.9592405Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.0703025Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.2156278Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.2455866Z  ^[[31m❯^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.2491337Z ^[[31m     ^[[31m×^[[31m returns a deeply frozen runtime-owned definition^[[39m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.2493107Z ^[[31m     ^[[31m×^[[31m rejects caller mutation instead of allowing the graph identity to drift^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.2498807Z ^[[31m     ^[[31m×^[[31m uses the authored validation owner for malformed runtime track structure^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.2501410Z ^[[31m     ^[[31m×^[[31m keeps the existing same-source destroy and readopt path working^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.3154230Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.5152016Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.5255613Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.5722353Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.7628937Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.7832340Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:03.8441375Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.0195053Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.0284781Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.0924442Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.2561276Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.2890897Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.3342272Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.5020805Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.5341929Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.5421743Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.7422654Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.7642519Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.8001758Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-17T02:23:04.8021752Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T02:23:04.8056713Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:23:04.8061360Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:23:04.8062526Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:23:04.8063218Z 
quality (node 24)	Run npm test	2026-08-17T02:23:04.8139457Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:04.9569987Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.0038643Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.0531961Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.1488978Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.2235776Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.3057528Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.3652949Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.4555039Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.4752718Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.6141767Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.6522319Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.6862506Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.8021737Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.8541305Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:05.8778745Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.0076881Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.0372297Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.0869017Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.1822131Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.2252308Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.2882333Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.4074865Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-17T02:23:06.4088756Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T02:23:06.4090608Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:23:06.4092386Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:23:06.4094010Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T02:23:06.4094885Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.4106675Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.4684403Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.4894740Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.6521242Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.6617493Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.7373499Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8185602Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8367903Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8404064Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8404756Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 4 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8405066Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8408519Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mreturns a deeply frozen runtime-owned definition
quality (node 24)	Run npm test	2026-08-17T02:23:06.8414116Z ^[[31m^[[1mAssertionError^[[22m: expected { id: 'arm', …(1) } not to be { id: 'arm', …(1) } // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8414560Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8414938Z ^[[2mCompared values have no visual difference.^[[22m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8415350Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8416263Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m30:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8449140Z     ^[[90m 28|^[[39m     ^[[35mconst^[[39m adopted ^[[33m=^[[39m handle^[[33m.^[[39m^[[34madopt^[[39m(source^[[33m,^[[39m owner)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8450954Z     ^[[90m 29|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8452501Z     ^[[90m 30|^[[39m     ^[[34mexpect^[[39m(adopted^[[33m.^[[39mtrack)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBe^[[39m(source)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8454013Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8456042Z     ^[[90m 31|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(adopted^[[33m.^[[39mtrack))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8458886Z     ^[[90m 32|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(adopted^[[33m.^[[39mtrack^[[33m.^[[39mkeyframes))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8460648Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8461378Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8461767Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8463211Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mrejects caller mutation instead of allowing the graph identity to drift
quality (node 24)	Run npm test	2026-08-17T02:23:06.8464939Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8466585Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m52:8^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8467801Z     ^[[90m 50|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m {
quality (node 24)	Run npm test	2026-08-17T02:23:06.8468894Z     ^[[90m 51|^[[39m       (source.keyframes!.x!.stops[1] as { p: number; v: unknown }).v =…
quality (node 24)	Run npm test	2026-08-17T02:23:06.8470050Z     ^[[90m 52|^[[39m     })^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTypeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8471142Z     ^[[90m   |^[[39m        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8471668Z     ^[[90m 53|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8472627Z     ^[[90m 54|^[[39m     handle^[[33m.^[[39m^[[34mseek^[[39m(adopted^[[33m.^[[39mid^[[33m,^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8473330Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8473619Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8474290Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8475650Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22muses the authored validation owner for malformed runtime track structure
quality (node 24)	Run npm test	2026-08-17T02:23:06.8477359Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observes-shape/ but got '(track.observes ?? []).entries is not…'^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8478097Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8478249Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8478488Z /observes-shape/
quality (node 24)	Run npm test	2026-08-17T02:23:06.8478618Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8478751Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8479201Z "(track.observes ?? []).entries is not a function or its return value is not iterable"
quality (node 24)	Run npm test	2026-08-17T02:23:06.8479726Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8480485Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m70:50^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8481277Z     ^[[90m 68|^[[39m     } ^[[35mas^[[39m unknown ^[[35mas^[[39m ^[[33mTrackDefinition^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8481717Z     ^[[90m 69|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8482188Z     ^[[90m 70|^[[39m     expect(() => handle.adopt(malformed, owner)).toThrow(/observes-sha…
quality (node 24)	Run npm test	2026-08-17T02:23:06.8482741Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8483532Z     ^[[90m 71|^[[39m     expect(() => handle.adopt({ id: "broken", keyframes: { x: ramp(0, …
quality (node 24)	Run npm test	2026-08-17T02:23:06.8484328Z     ^[[90m 72|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8484551Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8484975Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8485243Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8486332Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mkeeps the existing same-source destroy and readopt path working
quality (node 24)	Run npm test	2026-08-17T02:23:06.8487620Z ^[[31m^[[1mAssertionError^[[22m: expected { id: 'arm', …(1) } not to be { id: 'arm', …(1) } // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8488040Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8488270Z ^[[2mCompared values have no visual difference.^[[22m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8488498Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8488979Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m86:30^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8489489Z     ^[[90m 84|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8490033Z     ^[[90m 85|^[[39m     ^[[34mexpect^[[39m(second^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(first^[[33m.^[[39mid)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8491090Z     ^[[90m 86|^[[39m     ^[[34mexpect^[[39m(second^[[33m.^[[39mtrack)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoBe^[[39m(source)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8491831Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8492656Z     ^[[90m 87|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(second^[[33m.^[[39mtrack))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8493275Z     ^[[90m 88|^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8493401Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8493635Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8493844Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8493869Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8494330Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m86 passed^[[39m^[[22m^[[90m (87)^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8495107Z ^[[2m      Tests ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m356 passed^[[39m^[[22m^[[90m (360)^[[39m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8495629Z ^[[2m   Start at ^[[22m 02:22:58
quality (node 24)	Run npm test	2026-08-17T02:23:06.8496282Z ^[[2m   Duration ^[[22m 8.73s^[[2m (transform 1.54s, setup 0ms, import 4.72s, tests 4.96s, environment 14ms)^[[22m
quality (node 24)	Run npm test	2026-08-17T02:23:06.8496669Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8497823Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8521993Z ##[error]AssertionError: expected { id: 'arm', …(1) } not to be { id: 'arm', …(1) } // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Compared values have no visual difference.
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:30:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T02:23:06.8529800Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8531788Z ##[error]AssertionError: expected function to throw an error, but it didn't
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:52:8
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T02:23:06.8533087Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8535924Z ##[error]AssertionError: expected [Function] to throw error matching /observes-shape/ but got '(track.observes ?? []).entries is not…'
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	/observes-shape/
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	"(track.observes ?? []).entries is not a function or its return value is not iterable"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:70:50
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T02:23:06.8538814Z 
quality (node 24)	Run npm test	2026-08-17T02:23:06.8541552Z ##[error]AssertionError: expected { id: 'arm', …(1) } not to be { id: 'arm', …(1) } // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Compared values have no visual difference.
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:86:30
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T02:23:06.8905551Z ##[error]Process completed with exit code 1.
```
