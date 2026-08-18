# CI log archive: 32129333099

- Workflow: CI
- Conclusion: failure
- Head branch: fix/138-trigger-progress-range
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32129333099
- Captured: 2026-08-18T10:58:21Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-18T10:57:55.1052996Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1053387Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1079338Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1079898Z env:
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1080168Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1080429Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1923169Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1923918Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1924680Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.1925055Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.4494917Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.4498552Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.4499110Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.8236795Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.8295767Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.9016255Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.9032704Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.9037176Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.9038266Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.9038892Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:55.9050661Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.0173440Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.0405428Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.0625568Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.2122347Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.2456318Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.2495594Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.4334860Z  ^[[31m❯^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.4335869Z      ^[[32m✓^[[39m 1. Port lifecycle: subscribe, emit, unsubscribe, and resubscribe cleanly^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.4336881Z ^[[31m     ^[[31m×^[[31m 2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.4337790Z      ^[[32m✓^[[39m 3. Manual and custom trigger ports operate without DOM imports in core^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.4338748Z      ^[[32m✓^[[39m 4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.4339838Z      ^[[32m✓^[[39m 5. Idempotent teardown: pause, unmount, and dispose cleanly detach ports without leaks^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.4382898Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.4552544Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.6114330Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.6212813Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.6350625Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.7824308Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.8136299Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.8164301Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.9631467Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.9876461Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:56.9971093Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.1319489Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.1767276Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.2029990Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.3051596Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.3318856Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.3759408Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.4726937Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.5061890Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.5257685Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.6545219Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.6791310Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.6792691Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.7928453Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.8381139Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:57.8495695Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.0243895Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.0719661Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.1005577Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.1471502Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.2630031Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.2668330Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.3149463Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.3996719Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4166823Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4189603Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4190944Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4191374Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4193730Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4199141Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4200358Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m85:38^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4234049Z     ^[[90m 83|^[[39m     // three owners and NaN passed all of them. ADR-034 gives the rule…
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4235110Z     ^[[90m 84|^[[39m     // Motion.#scheduleProgress, which rejects at the emit site rather…
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4237077Z     ^[[90m 85|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[33m-^[[39m^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mRangeError^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4238090Z     ^[[90m   |^[[39m                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4239170Z     ^[[90m 86|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[34m1.5^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mRangeError^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4241062Z     ^[[90m 87|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[33mNaN^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTypeError^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4241766Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4241847Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4242435Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m44 passed^[[39m^[[22m^[[90m (45)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4243334Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4244321Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m169 passed^[[39m^[[22m^[[90m (170)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4245147Z ^[[2m   Start at ^[[22m 10:57:55
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4246057Z ^[[2m   Duration ^[[22m 2.95s^[[2m (transform 918ms, setup 0ms, import 2.53s, tests 589ms, environment 4ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4246887Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4247944Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4258878Z 
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4275943Z ##[error]AssertionError: expected function to throw an error, but it didn't
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:85:38
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-18T10:57:58.4468237Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-18T10:57:57.1113360Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-18T10:57:57.1115067Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-18T10:57:57.1155665Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-18T10:57:57.1155951Z env:
quality (node 24)	Run npm test	2026-08-18T10:57:57.1156161Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-18T10:57:57.1156383Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-18T10:57:57.2196148Z 
quality (node 24)	Run npm test	2026-08-18T10:57:57.2196545Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-18T10:57:57.2196962Z > vitest run
quality (node 24)	Run npm test	2026-08-18T10:57:57.2197177Z 
quality (node 24)	Run npm test	2026-08-18T10:57:57.5154844Z 
quality (node 24)	Run npm test	2026-08-18T10:57:57.5161466Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:57.5162326Z 
quality (node 24)	Run npm test	2026-08-18T10:57:57.9260692Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.0551387Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.1549358Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.1663138Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-18T10:57:58.1666942Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 65^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.1669416Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T10:57:58.1694975Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:57:58.1710915Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:57:58.1711704Z 
quality (node 24)	Run npm test	2026-08-18T10:57:58.2847968Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.4353864Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.5316849Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.5485995Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.6686672Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.7597859Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.9168040Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:58.9966315Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.1192601Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.2797043Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.3309957Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.5196224Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.6186739Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.7796174Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.9014771Z  ^[[31m❯^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.9055680Z      ^[[32m✓^[[39m 1. Port lifecycle: subscribe, emit, unsubscribe, and resubscribe cleanly^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.9065324Z ^[[31m     ^[[31m×^[[31m 2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.9067199Z      ^[[32m✓^[[39m 3. Manual and custom trigger ports operate without DOM imports in core^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.9068459Z      ^[[32m✓^[[39m 4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:57:59.9069952Z      ^[[32m✓^[[39m 5. Idempotent teardown: pause, unmount, and dispose cleanly detach ports without leaks^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:00.1006062Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:00.1887338Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:00.3456147Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:00.4435092Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:00.6156155Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:00.7321426Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:00.9286043Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 77^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.0066054Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.1846229Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.2629722Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.4235892Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.4432036Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2722^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.4437419Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2718^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.4540585Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.6324575Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.6516022Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.6926601Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.8225845Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.8874700Z  ^[[31m❯^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.8883420Z ^[[31m     ^[[31m×^[[31m R-1 rejects an out-of-range port emission exactly as signal() rejects it^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.8903407Z ^[[31m     ^[[31m×^[[31m R-2 rejects a non-finite emission at the boundary instead of poisoning position^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.8905374Z ^[[31m     ^[[31m×^[[31m R-3 rejects a malformed emission on a mounted Motion that is not playing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.8906481Z      ^[[32m✓^[[39m R-5 detaches a paused Motion's port instead of swallowing an emission^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:01.9511726Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.0515279Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.1416569Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.1816110Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.2450972Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.3537294Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.4077953Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.4656164Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.5408589Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.6695093Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.7277403Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.7376064Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.8607009Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.9730663Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:02.9825770Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.0620376Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.1636718Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.2355946Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.2772430Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.3899571Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.4591574Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.4974358Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.6216077Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.6684678Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.7067851Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.8473339Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.8712412Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:03.9127711Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.0518672Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.0580224Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.1008270Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.2399532Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.2462336Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.3191783Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.4435373Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.4437792Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.5413821Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-18T10:58:04.5424855Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T10:58:04.5426424Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:58:04.5427616Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:58:04.5428760Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:58:04.5430421Z 
quality (node 24)	Run npm test	2026-08-18T10:58:04.5461952Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.6217333Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.6665512Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.7251520Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.8359818Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.8794717Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:04.9033841Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.0819517Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.1155143Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.1266211Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.3017803Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.3096003Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.3736018Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.5134382Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.5338518Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.5565980Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.7095240Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.7158576Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.7528321Z  ^[[31m❯^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.7530788Z ^[[31m     ^[[31m×^[[31m R-4 clamps a measured overshoot and rejects a non-finite push^[[39m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.8924064Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.8995825Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:05.9405960Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.0971751Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.0975788Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.1128176Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.3138803Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-18T10:58:06.3141284Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-18T10:58:06.3143532Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:58:06.3144995Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:58:06.3146090Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-18T10:58:06.3147669Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.3155577Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.3236040Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.3301149Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.5300141Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.5498438Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.5662067Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7346624Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7382734Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7599204Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7659478Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7660732Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7661668Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7665158Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly
quality (node 24)	Run npm test	2026-08-18T10:58:06.7669722Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7671069Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m85:38^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7707340Z     ^[[90m 83|^[[39m     // three owners and NaN passed all of them. ADR-034 gives the rule…
quality (node 24)	Run npm test	2026-08-18T10:58:06.7708860Z     ^[[90m 84|^[[39m     // Motion.#scheduleProgress, which rejects at the emit site rather…
quality (node 24)	Run npm test	2026-08-18T10:58:06.7710777Z     ^[[90m 85|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[33m-^[[39m^[[34m0.5^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mRangeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7712328Z     ^[[90m   |^[[39m                                      ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7715367Z     ^[[90m 86|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[34m1.5^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mRangeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7717597Z     ^[[90m 87|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[33mNaN^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTypeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7718894Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7719509Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7720049Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7721984Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion-progress-range.test.ts^[[2m > ^[[22mMotion owns the trigger progress range once^[[2m > ^[[22mR-1 rejects an out-of-range port emission exactly as signal() rejects it
quality (node 24)	Run npm test	2026-08-18T10:58:06.7724363Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7725971Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion-progress-range.test.ts:^[[2m48:37^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7727528Z     ^[[90m 46|^[[39m     // Red before ADR-034: emit() clamped to 1 in silence, so the same…
quality (node 24)	Run npm test	2026-08-18T10:58:06.7729306Z     ^[[90m 47|^[[39m     ^[[90m// contracts depending on which door it entered through.^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7731045Z     ^[[90m 48|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[34m1.5^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mRangeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7732483Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7733777Z     ^[[90m 49|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7762117Z     ^[[90m 50|^[[39m     ^[[34mexpect^[[39m(setProgress)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7762744Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7762987Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7763761Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7765012Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m104 passed^[[39m^[[22m^[[90m (107)^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7766725Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m446 passed^[[39m^[[22m^[[90m (451)^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7767507Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7769450Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion-progress-range.test.ts^[[2m > ^[[22mMotion owns the trigger progress range once^[[2m > ^[[22mR-2 rejects a non-finite emission at the boundary instead of poisoning position
quality (node 24)	Run npm test	2026-08-18T10:58:06.7771276Z ^[[2m   Start at ^[[22m 10:57:57
quality (node 24)	Run npm test	2026-08-18T10:58:06.7772466Z ^[[2m   Duration ^[[22m 9.23s^[[2m (transform 1.57s, setup 0ms, import 5.23s, tests 4.25s, environment 14ms)^[[22m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7773174Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7774222Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7775779Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion-progress-range.test.ts:^[[2m59:44^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7777144Z     ^[[90m 57|^[[39m     // Red before ADR-034: NaN survived both clamps, so the throw was …
quality (node 24)	Run npm test	2026-08-18T10:58:06.7778347Z     ^[[90m 58|^[[39m     // flush and blamed the Track for a value the port handed in, with…
quality (node 24)	Run npm test	2026-08-18T10:58:06.7779016Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7780336Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[33mNaN^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTypeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7808389Z ##[error]AssertionError: expected function to throw an error, but it didn't
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:85:38
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:58:06.7817645Z     ^[[90m   |^[[39m                                            ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7818428Z     ^[[90m 60|^[[39m     ^[[34mexpect^[[39m(scheduler^[[33m.^[[39mpending)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7819279Z     ^[[90m 61|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mposition)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7819683Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7819956Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7820200Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7821243Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion-progress-range.test.ts^[[2m > ^[[22mMotion owns the trigger progress range once^[[2m > ^[[22mR-3 rejects a malformed emission on a mounted Motion that is not playing
quality (node 24)	Run npm test	2026-08-18T10:58:06.7822393Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7823512Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion-progress-range.test.ts:^[[2m72:35^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7824562Z     ^[[90m 70|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mplaying)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7825569Z     ^[[90m 71|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39mstate)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"mounted"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7826633Z     ^[[90m 72|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m trigger^[[33m.^[[39m^[[34memit^[[39m(^[[34m2^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mRangeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7827584Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7828116Z     ^[[90m 73|^[[39m     motion^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7828730Z     ^[[90m 74|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7829002Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7829384Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7829715Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7831041Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/adapters/scroll-trigger-range.test.ts^[[2m > ^[[22mscroll adapter normalizes what it can and rejects what it cannot^[[2m > ^[[22mR-4 clamps a measured overshoot and rejects a non-finite push
quality (node 24)	Run npm test	2026-08-18T10:58:06.7832992Z ^[[31m^[[1mAssertionError^[[22m: expected function to throw an error, but it didn't^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7834517Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/adapters/scroll-trigger-range.test.ts:^[[2m40:43^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7836020Z     ^[[90m 38|^[[39m     // Red before ADR-034. Math.max(0, Math.min(1, NaN)) is NaN, so th…
quality (node 24)	Run npm test	2026-08-18T10:58:06.7837110Z     ^[[90m 39|^[[39m     // non-finite push reached Motion, where it poisoned position and …
quality (node 24)	Run npm test	2026-08-18T10:58:06.7838770Z     ^[[90m 40|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m source^[[33m.^[[39m^[[34mpush^[[39m(^[[33mNumber^[[39m^[[33m.^[[39m^[[33mNaN^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[33mTypeError^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7840090Z     ^[[90m   |^[[39m                                           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7840994Z     ^[[90m 41|^[[39m     expect(() => source.push(Number.POSITIVE_INFINITY)).toThrow(TypeEr…
quality (node 24)	Run npm test	2026-08-18T10:58:06.7842166Z     ^[[90m 42|^[[39m     ^[[34mexpect^[[39m(seen)^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[34m1^[[39m^[[33m,^[[39m ^[[34m0^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7842724Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7843130Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-18T10:58:06.7843475Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7843496Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7846361Z ##[error]AssertionError: expected function to throw an error, but it didn't
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion-progress-range.test.ts:48:37
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:58:06.7847865Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7849381Z ##[error]AssertionError: expected function to throw an error, but it didn't
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion-progress-range.test.ts:59:44
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:58:06.7850332Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7851626Z ##[error]AssertionError: expected function to throw an error, but it didn't
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion-progress-range.test.ts:72:35
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:58:06.7852561Z 
quality (node 24)	Run npm test	2026-08-18T10:58:06.7854381Z ##[error]AssertionError: expected function to throw an error, but it didn't
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/adapters/scroll-trigger-range.test.ts:40:43
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-18T10:58:06.8199190Z ##[error]Process completed with exit code 1.
```
