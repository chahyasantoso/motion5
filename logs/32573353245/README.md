# CI log archive: 32573353245

- Workflow: CI
- Conclusion: failure
- Head branch: feat/plugin-group-values-section
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32573353245
- Captured: 2026-08-22T12:34:59Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-22T12:34:38.5068448Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.5068821Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.5113517Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.5114029Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.5114239Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.5114460Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.6139897Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.6140734Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.6141529Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:38.6141931Z 
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0478869Z ##[error]apps/react-demo/src/full-body-project.ts(27,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0490585Z ##[error]apps/react-demo/src/full-body-project.ts(56,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0494518Z ##[error]apps/react-demo/src/full-body-project.ts(85,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0498618Z ##[error]apps/react-demo/src/full-body-project.ts(114,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0502318Z ##[error]apps/react-demo/src/full-body-project.ts(145,9): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0506164Z ##[error]apps/react-demo/src/full-body-project.ts(183,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0510061Z ##[error]apps/react-demo/src/full-body-project.ts(208,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0513837Z ##[error]apps/react-demo/src/full-body-project.ts(233,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0518015Z ##[error]apps/react-demo/src/full-body-project.ts(262,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0521866Z ##[error]apps/react-demo/src/full-body-project.ts(291,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0525726Z ##[error]apps/react-demo/src/full-body-project.ts(320,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0529723Z ##[error]apps/react-demo/src/full-body-project.ts(349,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0533439Z ##[error]apps/react-demo/src/full-body-project.ts(378,9): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0539354Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(56,33): error TS2345: Argument of type '{ fk: { boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0542232Z   Property 'fk' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0543789Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0547213Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(70,41): error TS2353: Object literal may only specify known properties, and 'boneLength' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0551444Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(82,42): error TS2353: Object literal may only specify known properties, and 'boneLength' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0556136Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(50,7): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0560603Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(60,7): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0564741Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(36,22): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0569120Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(49,39): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0573497Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(111,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0578104Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(32,17): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0582522Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(57,17): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0587095Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(77,17): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0591499Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(58,11): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0596034Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(72,39): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0600440Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(119,26): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0604804Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(136,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0609355Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(147,11): error TS2353: Object literal may only specify known properties, and 'weight' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0613991Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(176,41): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0618669Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(198,15): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0623138Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(42,24): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0627664Z ##[error]packages/core/test/integration/single-input-channel.test.ts(23,29): error TS2353: Object literal may only specify known properties, and 'x' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0631972Z ##[error]packages/core/test/integration/single-input-channel.test.ts(28,11): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0637008Z ##[error]packages/core/test/unit/graph/requirement-edge-construction.test.ts(54,13): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0641678Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(59,19): error TS2353: Object literal may only specify known properties, and 'length' does not exist in type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-22T12:34:42.0904832Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-22T12:34:37.5951693Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.5952052Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.5994150Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.5994615Z env:
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.5994841Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.5995073Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.7051112Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.7051957Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.7052639Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.7053017Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:37.9979877Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.0001018Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.0001641Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.5212009Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.5272717Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.5444378Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.7785997Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8023185Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8503704Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8520930Z ^[[31m     ^[[31m×^[[31m 1. Load valid walker project through Engine with plugin registry^[[39m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8540757Z ^[[31m     ^[[31m×^[[31m 2. Render walker nodes through createDomPatchAdapter^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8550842Z ^[[31m     ^[[31m×^[[31m 3. Demonstrate time playback using single injected browser clock^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8552847Z ^[[31m     ^[[31m×^[[31m 4. Demonstrate progress through TriggerPort and manual signals^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8559448Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8561300Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8563059Z ^[[31m     ^[[31m×^[[31m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8564782Z ^[[31m     ^[[31m×^[[31m 8. Show blocked/pending/error diagnostics without crashing the app^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8566439Z ^[[31m     ^[[31m×^[[31m 9. Use React usePatch hook at the React boundary^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:38.8567913Z ^[[31m     ^[[31m×^[[31m 10. Automated end-to-end integration test passes clean^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.0383611Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.0484369Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.1199324Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.1239649Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.1250358Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.1270606Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.1300996Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.1330747Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.1353309Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.2447288Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.2855661Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.3928285Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.3930939Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.3932616Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.3934110Z      ^[[32m✓^[[39m U-3 changes nothing when the owning Motion refuses the replacement^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.3935597Z      ^[[32m✓^[[39m U-4 changes nothing when the candidate graph refuses a derived observation^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.5129296Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.5245176Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.6153760Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.7631389Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8048851Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8056336Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8058136Z      ^[[32m✓^[[39m leaves a rejected unknown-source adoption retryable^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8059596Z      ^[[32m✓^[[39m leaves a rejected self-reference adoption retryable^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8504811Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8522531Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8560852Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8570926Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:39.8572817Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.0091764Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.0308346Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.0757909Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.2505262Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.2768193Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.3048019Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.4949551Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.5108175Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.5331117Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.7417469Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.7521571Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.7552219Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.9704302Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.9867661Z  ^[[31m❯^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.9869715Z ^[[31m     ^[[31m×^[[31m F-10 interpolates grouped leaves without renaming the owning plugin^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.9871369Z ^[[31m     ^[[31m×^[[31m F-11 interpolates a grouped track when the Engine has no plugin registry^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.9873159Z ^[[31m     ^[[31m×^[[31m F-12 publishes identical values for the flat and grouped spellings^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:40.9900778Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.1813337Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.1881231Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.2411606Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.3827666Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.4031343Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.4352428Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.5928528Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.6235364Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.6310864Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.8046318Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.8301479Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.8303873Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:41.8636549Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.0128408Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.0591836Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.2320981Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.2424244Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.2628250Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.4367135Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.4635992Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.4933671Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6326478Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6371497Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6407879Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6409203Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 26 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6409642Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6414317Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-10 interpolates grouped leaves without renaming the owning plugin
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6420725Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6427827Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6491859Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6493375Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6494539Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6495291Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6496252Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6497278Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6498429Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6499939Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6501302Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m56:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6501916Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6502356Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6502697Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6504448Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-11 interpolates a grouped track when the Engine has no plugin registry
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6507593Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6509914Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6511040Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6512265Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6512975Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6513410Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6513955Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6514546Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6515177Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6515934Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6516674Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m70:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6517008Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6517259Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6517458Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6518412Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-12 publishes identical values for the flat and grouped spellings
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6520156Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6521143Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6521836Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6522643Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6523303Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6523722Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6524239Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6524822Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6525414Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6526116Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6526852Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m82:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6527199Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6527431Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6527646Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6528722Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6531530Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at addTrack(root).keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6533488Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6587888Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6589934Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6592381Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6594044Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6595164Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6596731Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6598510Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6600322Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6601906Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m75:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6602795Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6603413Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6603954Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6605832Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6611348Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6615014Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6616418Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6618001Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6619618Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6620497Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6621625Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6622915Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6624131Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6625682Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m71:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6627339Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m90:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6628227Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6628875Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6629574Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6631369Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6634079Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'keyframes-missing-values-section at m…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6635258Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6635702Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6636296Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6636718Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6637121Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6639872Z "keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6642122Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6643173Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m118:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6644788Z     ^[[90m116|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6646160Z     ^[[90m117|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6647384Z     ^[[90m118|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6648509Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6649861Z     ^[[90m119|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6650766Z     ^[[90m120|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6651199Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6651746Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6652237Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6654038Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6659361Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6662995Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6664366Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6665977Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6667386Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6668335Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6669630Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6670798Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6672009Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6673483Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m71:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6675121Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m123:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6675934Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6676483Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6677015Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6678884Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m1. Load valid walker project through Engine with plugin registry
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6686446Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6691229Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6692711Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6693971Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6695493Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6696260Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6697151Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6698117Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6699307Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6700533Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m136:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6701148Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6701545Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6701901Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6703448Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m2. Render walker nodes through createDomPatchAdapter
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6710491Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6715091Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6716260Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6717637Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6718794Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6719709Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6720581Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6721582Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6722651Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6723896Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m155:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6724524Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6724950Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6725304Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6727006Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m3. Demonstrate time playback using single injected browser clock
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6734230Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6739824Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6741303Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6742710Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6743872Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6744571Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6745430Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6746450Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6747500Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6748771Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m190:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6749591Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6750034Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6750384Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6752060Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m4. Demonstrate progress through TriggerPort and manual signals
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6759293Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6764101Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6765279Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6766667Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6767831Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6768531Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6769657Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6770695Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6771761Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6773038Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m210:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6773657Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6774075Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6774414Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6776089Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6783282Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6788207Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6789499Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6790854Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6792007Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6793541Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6794493Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6796443Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6797510Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6798741Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m234:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6799545Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6799970Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6800298Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6802047Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6808835Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6813562Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6814677Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6816053Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6817192Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6817865Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6818605Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6819799Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6820892Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6821662Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m260:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6822136Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6822533Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6822871Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6824566Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m7. Mount, unmount, remount, and dispose without duplicate subscriptions
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6831887Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6836432Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6837133Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6837924Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6839247Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6839969Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6840849Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6841850Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6842837Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6844357Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m296:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6844962Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6845628Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6845966Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6847900Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m8. Show blocked/pending/error diagnostics without crashing the app
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6854146Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6858614Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6859773Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6860603Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6861544Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6861991Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6862789Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6863685Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6864691Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6865843Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m321:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6866390Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6866737Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6867044Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6868413Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6876039Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6881100Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6882140Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6883298Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6884262Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6884845Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6885713Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6886611Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6887574Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6888672Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m342:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6889405Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6889748Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6890059Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6891659Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m10. Automated end-to-end integration test passes clean
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6898881Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6903694Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6905136Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6906503Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6907931Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6908598Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6909772Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6910991Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6912076Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6913322Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m378:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6913908Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6914311Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6914676Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6916489Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6921704Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6925031Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6926220Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6927620Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6928806Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6929652Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6930502Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6931496Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6932514Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6933849Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6935370Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m99:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6936010Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6936413Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6936774Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6938697Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6943070Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-missing-values-section at motions[0].tracks[1].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6945811Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6977021Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6978444Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6980367Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6980896Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6981745Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6982410Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6983106Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6983984Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6984938Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m121:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6985350Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6985619Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6985842Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6986893Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6988485Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'keyframes-missing-values-section at m…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6989297Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6989464Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6989772Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6989967Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6990122Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6992120Z "keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6993644Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6994204Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6994817Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6995202Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6995776Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6996394Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6996834Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6997152Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6997283Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6997548Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6997785Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.6998892Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7001595Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.reach.weight: Keyframe section 'weight' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7003162Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7003939Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7004811Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7005544Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7005998Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7006562Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7007406Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7008195Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7009200Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7010129Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m155:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7010538Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7010803Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7011027Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7012125Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7015140Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7017124Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7017854Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7018713Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7019584Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7020047Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7020605Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7021249Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7021949Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7022763Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m94:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7023678Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m183:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7024068Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7024321Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7024526Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7025576Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7027122Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'keyframes-missing-values-section at m…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7027740Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7027881Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7028186Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7028389Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7028527Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7030671Z "keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7032156Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7032689Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m201:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7033283Z     ^[[90m199|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7033635Z     ^[[90m200|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7034369Z     ^[[90m201|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7035117Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7035574Z     ^[[90m202|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7035948Z     ^[[90m203|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7036132Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7036370Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7036576Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7037630Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7039196Z ^[[31m^[[1mAssertionError^[[22m: expected 'keyframes-missing-values-section at r…' to match /^plugin-unknown-key at /^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7039669Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7039828Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7040228Z /^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7040471Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7040674Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7041977Z "keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7042842Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7043380Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7044131Z     ^[[90m 94|^[[39m     const thrown = thrownBy(() => handle.track(NODE_ID).replace(UNRESO…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7044554Z     ^[[90m 95|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7045011Z     ^[[90m 96|^[[39m     expect((thrown as Error).message).toMatch(/^plugin-unknown-key at …
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7045542Z     ^[[90m   |^[[39m                                       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7046073Z     ^[[90m 97|^[[39m     // Red on the parent: the graph was already replaced and the live …
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7046672Z     ^[[90m 98|^[[39m     // the next flush resolved nothing and published a composition fai…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7046979Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7047212Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7047427Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7048506Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7051506Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'keyframes-missing-values-section at r…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7052084Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7052228Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7052494Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7052636Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7052775Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7053536Z "keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7054111Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7054640Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m111:63^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7055362Z     ^[[90m109|^[[39m     ^[[35mconst^[[39m handle ^[[33m=^[[39m ^[[34mload^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7055759Z     ^[[90m110|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7056221Z     ^[[90m111|^[[39m     expect(() => handle.track(NODE_ID).replace(UNRESOLVABLE)).toThrow(…
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7056797Z     ^[[90m   |^[[39m                                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7057669Z     ^[[90m112|^[[39m     handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[33mNODE_ID^[[39m)^[[33m.^[[39m^[[34mreplace^[[39m(^[[34marmTrack^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m200^[[39m))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7058284Z     ^[[90m113|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7058401Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7058631Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7058835Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7060190Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7063377Z ^[[31m^[[1mTypeError^[[22m: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7065240Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7065908Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7066705Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7067383Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7067806Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7068317Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7070828Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7071961Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7072905Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m45:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7073714Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m52:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7074063Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7074303Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/26]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7074509Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7074538Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7075062Z ^[[2m Test Files ^[[22m ^[[1m^[[31m7 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m48 passed^[[39m^[[22m^[[90m (55)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7075827Z ^[[2m      Tests ^[[22m ^[[1m^[[31m26 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m199 passed^[[39m^[[22m^[[90m (225)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7076348Z ^[[2m   Start at ^[[22m 12:34:38
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7076991Z ^[[2m   Duration ^[[22m 4.62s^[[2m (transform 1.22s, setup 0ms, import 3.85s, tests 940ms, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7077363Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7077370Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7100643Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:56:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7109690Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7113216Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:70:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7115151Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7118146Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:82:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7120287Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7123708Z ##[error]TypeError: keyframes-missing-values-section at addTrack(root).keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:75:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7126175Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7131508Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:71:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:90:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7134216Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7139285Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'keyframes-missing-values-section at m…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:118:58
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7141697Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7146700Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:71:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:123:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7149684Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7156215Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:136:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7160252Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7166956Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:155:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7170820Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7176796Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:190:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7180276Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7186248Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:210:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7189699Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7195725Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:234:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7199121Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7206568Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:260:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7210284Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7216344Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:296:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7220275Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7226173Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:321:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7229526Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7235336Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:342:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7238530Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7244493Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[2].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:378:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7247672Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7252779Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:99:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7255923Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7260388Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-missing-values-section at motions[0].tracks[1].keyframes.fk: Plugin group 'fk' must author its properties under a 'values' section.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:121:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7262761Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7267854Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'keyframes-missing-values-section at m…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:139:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7270984Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7275155Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.reach.weight: Keyframe section 'weight' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:155:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7277494Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7282508Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:94:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:183:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7285322Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7290651Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'keyframes-missing-values-section at m…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:201:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7293530Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7296544Z ##[error]AssertionError: expected 'keyframes-missing-values-section at r…' to match /^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/^plugin-unknown-key at /
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7298660Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7301984Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'keyframes-missing-values-section at r…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"keyframes-missing-values-section at replaceTrack(scene/arm).keyframes.nope: Plugin group 'nope' must author its properties under a 'values' section."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:111:63
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7303840Z 
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7308616Z ##[error]TypeError: keyframes-missing-values-section at motions[0].tracks[0].keyframes.transform: Plugin group 'transform' must author its properties under a 'values' section. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.length: Keyframe section 'length' must be 'requires' or 'values'. keyframes-unknown-section at motions[0].tracks[1].keyframes.fk.rotation: Keyframe section 'rotation' must be 'requires' or 'values'.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:45:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:52:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T12:34:42.7313981Z ##[error]Process completed with exit code 1.
```
