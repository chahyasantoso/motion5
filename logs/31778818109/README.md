# CI log archive: 31778818109

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31778818109
- Captured: 2026-08-14T07:09:36Z

## Failed job output

```text
integration (node 24)	Run npm run test:integration	﻿2026-08-14T07:09:02.9257310Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:02.9257688Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:02.9302079Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:02.9302537Z env:
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:02.9302730Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:02.9302934Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.0292206Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.0293263Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.0293843Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.0294119Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.3358871Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.3363743Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.3364663Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.7170600Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.7285339Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.7932676Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.9384379Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:03.9431635Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.0071195Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.1501610Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.1758276Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.2464508Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.3686664Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.3701554Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.4768209Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.5635305Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.5919181Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.7275114Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.7278302Z ^[[31m     ^[[31m×^[[31m adopts a free track under ~/id and publishes through the ordinary graph path^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.7280777Z ^[[31m     ^[[31m×^[[31m rejects duplicate adopted ids instead of silently replacing membership^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.7283715Z ^[[31m     ^[[31m×^[[31m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.8755739Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.9475144Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:04.9703138Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.0593738Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.1406215Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.1966857Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.2770576Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3405452Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3639242Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3669731Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3670507Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3671218Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3676645Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22madopts a free track under ~/id and publishes through the ordinary graph path
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3685005Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3686504Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3724480Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3726114Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3727650Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3731196Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3732774Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3734239Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3735934Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3737840Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3739709Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m21:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3740550Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3741251Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3741658Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3741878Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3743961Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects duplicate adopted ids instead of silently replacing membership
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3745984Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3747379Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3748602Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3749878Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3751026Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3751818Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3752912Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3753747Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3754473Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3755321Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3756322Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m33:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3757303Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3758117Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3758516Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3760536Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mlets a borrower unmount without destroying the adopted track, while only the owner can destroy it
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3763405Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3764823Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3766005Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3767325Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3768462Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3769242Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3769912Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3770824Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3772101Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3774120Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3775664Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m41:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3776288Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3776774Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3777166Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3778041Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m23 passed^[[39m^[[22m^[[90m (24)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3779546Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m63 passed^[[39m^[[22m^[[90m (66)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3780553Z ^[[2m   Start at ^[[22m 07:09:03
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3781818Z ^[[2m   Duration ^[[22m 2.01s^[[2m (transform 672ms, setup 0ms, import 1.60s, tests 298ms, environment 4ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3782837Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3782871Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3807710Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
integration (node 24)	Run npm run test:integration	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:21:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3818975Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3824199Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
integration (node 24)	Run npm run test:integration	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:33:13
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3826842Z 
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.3829649Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
integration (node 24)	Run npm run test:integration	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:41:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-14T07:09:05.4173752Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-14T07:09:07.3257878Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-14T07:09:07.3258201Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-14T07:09:07.3304216Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-14T07:09:07.3304554Z env:
quality (node 24)	Run npm test	2026-08-14T07:09:07.3304786Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-14T07:09:07.3305034Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-14T07:09:07.4414885Z 
quality (node 24)	Run npm test	2026-08-14T07:09:07.4415640Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-14T07:09:07.4416226Z > vitest run
quality (node 24)	Run npm test	2026-08-14T07:09:07.4416443Z 
quality (node 24)	Run npm test	2026-08-14T07:09:07.7420670Z 
quality (node 24)	Run npm test	2026-08-14T07:09:07.7425665Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:07.7426631Z 
quality (node 24)	Run npm test	2026-08-14T07:09:08.1183796Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:08.1948664Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:08.4178881Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:08.4307948Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:08.6486152Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:08.6672338Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:08.9033243Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:08.9573961Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 76^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:09.1554965Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:09.2172951Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:09.3794675Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:09.4561463Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:09.6303025Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:09.7104369Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:09.9112691Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.1441543Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.1672905Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.3866658Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.4172865Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.5948046Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.7112617Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.7638583Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2748^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.7641938Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2744^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.8159785Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:10.9118886Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.0126943Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.0372704Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.1067162Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.2643433Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.2754539Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.3075544Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.4662503Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.5000258Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.5432889Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.6714445Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.7071577Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.7618899Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.8740599Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.8843330Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:11.9844657Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.0992880Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.1246848Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-14T07:09:12.1249488Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T07:09:12.1251371Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:09:12.1252923Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:09:12.1254240Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:09:12.1269867Z 
quality (node 24)	Run npm test	2026-08-14T07:09:12.1271596Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.2053937Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.3477453Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.3683314Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.4414690Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.5814245Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.5816734Z ^[[31m     ^[[31m×^[[31m adopts a free track under ~/id and publishes through the ordinary graph path^[[39m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.5820648Z ^[[31m     ^[[31m×^[[31m rejects duplicate adopted ids instead of silently replacing membership^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.5823046Z ^[[31m     ^[[31m×^[[31m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.5825425Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.6807966Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.7893432Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.8414245Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:12.8774089Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.0244680Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.0452566Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.0818970Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.2113996Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.2554986Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.2819753Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.3918519Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.4596255Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.4613663Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.6066122Z  ^[[32m✓^[[39m packages/core/test/unit/domain/triggers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.6453943Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.6585210Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.8417133Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.8512992Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-14T07:09:13.8516096Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T07:09:13.8517566Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:09:13.8518765Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:09:13.8520022Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T07:09:13.8525603Z 
quality (node 24)	Run npm test	2026-08-14T07:09:13.8548622Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:13.8782920Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.0718793Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.0775908Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.0861294Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2258441Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2309993Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2348038Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2348579Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2348912Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2352821Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22madopts a free track under ~/id and publishes through the ordinary graph path
quality (node 24)	Run npm test	2026-08-14T07:09:14.2360046Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2362037Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2409351Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
quality (node 24)	Run npm test	2026-08-14T07:09:14.2410938Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2412122Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-14T07:09:14.2412902Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2413606Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
quality (node 24)	Run npm test	2026-08-14T07:09:14.2414515Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2415815Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2417416Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2418991Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m21:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2419528Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2419973Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2420673Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2422194Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects duplicate adopted ids instead of silently replacing membership
quality (node 24)	Run npm test	2026-08-14T07:09:14.2424051Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2425406Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2426585Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
quality (node 24)	Run npm test	2026-08-14T07:09:14.2427278Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2427937Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-14T07:09:14.2428544Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2428917Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
quality (node 24)	Run npm test	2026-08-14T07:09:14.2429385Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2430075Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2431966Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2432877Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m33:13^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2433230Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2433470Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2433684Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2434722Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mlets a borrower unmount without destroying the adopted track, while only the owner can destroy it
quality (node 24)	Run npm test	2026-08-14T07:09:14.2435865Z ^[[31m^[[1mTypeError^[[22m: track-id at freeTracks.id: Track id cannot contain '/'.^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2436575Z ^[[36m ^[[2m❯^[[22m requireGraph packages/core/src/graph/binding.ts:^[[2m20:11^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2437181Z     ^[[90m 18|^[[39m   ^[[35mif^[[39m (result^[[33m.^[[39mgraph ^[[33m===^[[39m undefined) {
quality (node 24)	Run npm test	2026-08-14T07:09:14.2438519Z     ^[[90m 19|^[[39m     ^[[35mconst^[[39m first ^[[33m=^[[39m result^[[33m.^[[39mdiagnostics[^[[34m0^[[39m]^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2439801Z     ^[[90m 20|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
quality (node 24)	Run npm test	2026-08-14T07:09:14.2440967Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2441760Z     ^[[90m 21|^[[39m       first ^[[33m===^[[39m undefined
quality (node 24)	Run npm test	2026-08-14T07:09:14.2442485Z     ^[[90m 22|^[[39m         ^[[33m?^[[39m ^[[32m"Graph candidate is invalid."^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2443201Z ^[[90m ^[[2m❯^[[22m GraphBinding.replace packages/core/src/graph/binding.ts:^[[2m67:23^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2444056Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m66:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2444864Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m41:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2445187Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2445425Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2445627Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2445672Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2446133Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m70 passed^[[39m^[[22m^[[90m (71)^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2446915Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m264 passed^[[39m^[[22m^[[90m (267)^[[39m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2447451Z ^[[2m   Start at ^[[22m 07:09:07
quality (node 24)	Run npm test	2026-08-14T07:09:14.2448180Z ^[[2m   Duration ^[[22m 6.47s^[[2m (transform 1.23s, setup 0ms, import 3.33s, tests 3.68s, environment 12ms)^[[22m
quality (node 24)	Run npm test	2026-08-14T07:09:14.2448919Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2448938Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2474282Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
quality (node 24)	Run npm test	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
quality (node 24)	Run npm test	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
quality (node 24)	Run npm test	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:21:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T07:09:14.2483100Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2486432Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
quality (node 24)	Run npm test	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
quality (node 24)	Run npm test	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
quality (node 24)	Run npm test	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:33:13
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T07:09:14.2488481Z 
quality (node 24)	Run npm test	2026-08-14T07:09:14.2492831Z ##[error]TypeError: track-id at freeTracks.id: Track id cannot contain '/'.
quality (node 24)	Run npm test	 ❯ requireGraph packages/core/src/graph/binding.ts:20:11
quality (node 24)	Run npm test	 ❯ GraphBinding.replace packages/core/src/graph/binding.ts:67:23
quality (node 24)	Run npm test	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:66:25
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/adoption.test.ts:41:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T07:09:14.2865669Z ##[error]Process completed with exit code 1.
```
