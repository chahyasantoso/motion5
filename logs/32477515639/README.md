# CI log archive: 32477515639

- Workflow: CI
- Conclusion: failure
- Head branch: feat/issue-173-plugin-owned-requirements
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32477515639
- Captured: 2026-08-21T11:31:03Z

## Failed job output

```text
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-21T11:30:46.1886899Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:46.1887406Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:46.1928778Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:46.1929066Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:46.1929342Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:46.1929568Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:48.3755955Z ##[error]packages/core/src/plugins/fk.ts(74,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { x: number; y: number; rotation: number; }' is not assignable to type 'PluginComposer'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:48.3764190Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:48.3765619Z ##[error]packages/core/src/plugins/fk.ts(74,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:48.3767325Z ##[error]packages/core/src/plugins/fk.ts(74,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:48.3769456Z ##[error]packages/core/src/plugins/fk.ts(74,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-21T11:30:48.4123583Z ##[error]Process completed with exit code 2.
quality (node 24)	Run npm run typecheck	﻿2026-08-21T11:30:45.1205395Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.1205768Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.1244456Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.1244722Z env:
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.1244928Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.1245394Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.2263192Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.2263630Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.2264180Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:45.2264449Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3473337Z ##[error]packages/core/src/plugins/fk.ts(74,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { x: number; y: number; rotation: number; }' is not assignable to type 'PluginComposer'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3482113Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3483479Z ##[error]packages/core/src/plugins/fk.ts(74,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3485423Z ##[error]packages/core/src/plugins/fk.ts(74,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3487087Z ##[error]packages/core/src/plugins/fk.ts(74,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3489434Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,3): error TS2322: Type '(values: any, progress: any, inputs: any) => { span: number; }' is not assignable to type 'PluginComposer'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3490889Z   Target signature provides too few arguments. Expected 3 or more, but got 2.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3492019Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,13): error TS7006: Parameter 'values' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3493810Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,21): error TS7006: Parameter 'progress' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3495964Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(50,31): error TS7006: Parameter 'inputs' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3498477Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(34,3): error TS2353: Object literal may only specify known properties, and 'requirements' does not exist in type 'PluginDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3500896Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(50,48): error TS2353: Object literal may only specify known properties, and 'requirements' does not exist in type 'PluginDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3502991Z ##[error]packages/core/test/unit/domain/plugin-requirements.test.ts(72,21): error TS2339: Property 'requirements' does not exist on type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:30:48.3850619Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-21T11:30:44.8949313Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:44.8949699Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:44.8989229Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:44.8989799Z env:
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:44.8990030Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:44.8990249Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:45.0333181Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:45.0334315Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:45.0335466Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:45.0336321Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:45.4598807Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:45.4603724Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:45.4604471Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:45.9963523Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.0067694Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1149391Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1153091Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1173933Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1175379Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1176831Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1282552Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 73^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1347697Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1379558Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1407605Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1434041Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1446399Z      ^[[32m✓^[[39m 5. Render multiple tracks from one Motion in one published batch^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1448459Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1450120Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1451678Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1452781Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.1453521Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.2667012Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.2844868Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.3977408Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.5107049Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.6138473Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.6147953Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.6150925Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.6164257Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.6165449Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.6167734Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.6169610Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.6554693Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.7376731Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.9011428Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.9489982Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:46.9888996Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.1835644Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.1966467Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.2575249Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.4147905Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.5070196Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.5100258Z ^[[31m     ^[[31m×^[[31m N-7 claims the natural bone key names and composes world space from them^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.5107474Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.5108862Z      ^[[32m✓^[[39m N-9 refuses the flat spelling of a key both plugins claim^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.5110128Z      ^[[32m✓^[[39m N-10 publishes grouped leaves under their unprefixed names^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.5148229Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.6493817Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.7312039Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.7799133Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.9043693Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:47.9852590Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.0298519Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.1422871Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.2550907Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.3198889Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.3753977Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.4942320Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.5917376Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.6121442Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.6958246Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.8094998Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.8431490Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:48.9304767Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.0367012Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.0422318Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.1818482Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.2244099Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.2879951Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.3908361Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.5858054Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.6067898Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.6180513Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.7779584Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.8401313Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:49.8576861Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.0027531Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.0688819Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.0854228Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1659323Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1690696Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1691806Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 9 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1692269Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1696984Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-7 claims the natural bone key names and composes world space from them
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1702812Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'base')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1704322Z ^[[36m ^[[2m❯^[[22m Object.compose packages/core/src/plugins/fk.ts:^[[2m75:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1739250Z     ^[[90m 73|^[[39m   outputs^[[33m:^[[39m [^[[32m"x"^[[39m^[[33m,^[[39m ^[[32m"y"^[[39m^[[33m,^[[39m ^[[32m"rotation"^[[39m]^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1740876Z     ^[[90m 74|^[[39m   compose^[[33m:^[[39m (values^[[33m,^[[39m progress^[[33m,^[[39m inputs) ^[[33m=>^[[39m {
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1742362Z     ^[[90m 75|^[[39m     ^[[35mconst^[[39m base ^[[33m=^[[39m ^[[34mreadBase^[[39m(inputs^[[33m.^[[39mbase)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1743475Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1744660Z     ^[[90m 76|^[[39m     ^[[35mconst^[[39m length ^[[33m=^[[39m ^[[34mreadNumber^[[39m(values^[[33m.^[[39mlength)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1746442Z     ^[[90m 77|^[[39m     ^[[35mconst^[[39m localRotation ^[[33m=^[[39m ^[[34mreadNumber^[[39m(values^[[33m.^[[39mrotation)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1748145Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m85:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1748908Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1749390Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1749792Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1751691Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1754228Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1756286Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m103:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1761815Z     ^[[90m101|^[[39m     // ownership change that stopped the interpolator reading a leaf w…
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1763190Z     ^[[90m102|^[[39m     ^[[90m// and then hold still.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1765105Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1767093Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1768896Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1771342Z     ^[[90m105|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1772584Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1773201Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1773749Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1776155Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1779077Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1780965Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m292:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1798246Z     ^[[90m290|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1799277Z     ^[[90m291|^[[39m     // Thigh (parentRot=0, own rotation=45): worldRot=45, x = 0 + 50*c…
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1801401Z     ^[[90m292|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1802777Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1804357Z     ^[[90m293|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1806886Z     ^[[90m294|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1807924Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1808398Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1808782Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1810828Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1812365Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1813345Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m108:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1816646Z     ^[[90m106|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"walk/pelvis"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1818100Z     ^[[90m107|^[[39m     const thigh = batch.patches.find(({ nodeId }) => nodeId === "walk/…
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1819827Z     ^[[90m108|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1821122Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1822579Z     ^[[90m109|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1824570Z     ^[[90m110|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1825517Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1826208Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1826585Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1828609Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1831027Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 50, received difference is NaN, but expected 5e-13^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1832657Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m126:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1833563Z     ^[[90m124|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1834814Z     ^[[90m125|^[[39m     ^[[35mconst^[[39m values ^[[33m=^[[39m handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"walk/thigh"^[[39m)^[[33m?.^[[39mvalues ^[[33m??^[[39m {}^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1836791Z     ^[[90m126|^[[39m     ^[[34mexpect^[[39m(values^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m50^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1837900Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1839141Z     ^[[90m127|^[[39m     ^[[34mexpect^[[39m(values^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1840461Z     ^[[90m128|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[34mdependantsOf^[[39m(^[[32m"walk/pelvis"^[[39m))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1840965Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1841208Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1841636Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1842647Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1843878Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw an error^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1844185Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1844316Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1844543Z null
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1844643Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1844780Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1844996Z undefined
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1845109Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1845606Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1847019Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1847638Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1848598Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1849722Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1850133Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1850431Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1850558Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1850803Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1851022Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1852759Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1854710Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1855347Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1855537Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1855774Z "ready"
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1856116Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1856276Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1856499Z undefined
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1856615Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1857146Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m161:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1858403Z     ^[[90m159|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"walk/pelvis"^[[39m^[[33m,^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1859242Z     ^[[90m160|^[[39m     const patch = batch.patches.find(({ nodeId }) => nodeId === "walk/…
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1860129Z     ^[[90m161|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1861347Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1862916Z     ^[[90m162|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mvalues^[[33m.^[[39mspan)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m400^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1864164Z     ^[[90m163|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1864676Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1864994Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1865238Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1866999Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1868425Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 75, received difference is NaN, but expected 5e-13^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1869379Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m190:55^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1870133Z     ^[[90m188|^[[39m     // Parent 30 plus local 45. This number is the separation proof: a…
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1870777Z     ^[[90m189|^[[39m     // replaced the bone's authored 45 with the upstream 30 and compos…
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1871417Z     ^[[90m190|^[[39m     expect(handle.get("walk/thigh")?.values.rotation).toBeCloseTo(75, …
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1871984Z     ^[[90m   |^[[39m                                                       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1872701Z     ^[[90m191|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1873228Z     ^[[90m192|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1873397Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1873627Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1873834Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1874853Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1876092Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw an error^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1876396Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1876531Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1876889Z null
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1877067Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1877490Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1877731Z undefined
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1877981Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1878518Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m201:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1879097Z     ^[[90m199|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1879576Z     ^[[90m200|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1880237Z     ^[[90m201|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1880799Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1881205Z     ^[[90m202|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1881519Z     ^[[90m203|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1881680Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1882087Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/9]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1882323Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1882357Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1882821Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m49 passed^[[39m^[[22m^[[90m (52)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1883599Z ^[[2m      Tests ^[[22m ^[[1m^[[31m9 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m196 passed^[[39m^[[22m^[[90m (205)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1884280Z ^[[2m   Start at ^[[22m 11:30:45
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1884985Z ^[[2m   Duration ^[[22m 4.69s^[[2m (transform 1.23s, setup 0ms, import 3.89s, tests 1.11s, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1885390Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1885408Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1906881Z ##[error]TypeError: Cannot read properties of undefined (reading 'base')
integration (node 24)	Run npm run test:integration	 ❯ Object.compose packages/core/src/plugins/fk.ts:75:34
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:85:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1914499Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1916775Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:103:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1918006Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1919661Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:292:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1920726Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1922708Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:108:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1923898Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1925567Z ##[error]AssertionError: expected undefined to be close to 50, received difference is NaN, but expected 5e-13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:126:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1926884Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1928954Z ##[error]AssertionError: expected [Function] to throw an error
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	null
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:139:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1930384Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1932243Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:161:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1934096Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1937329Z ##[error]AssertionError: expected undefined to be close to 75, received difference is NaN, but expected 5e-13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:190:55
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1939950Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.1942878Z ##[error]AssertionError: expected [Function] to throw an error
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	null
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:201:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:30:50.2237818Z ##[error]Process completed with exit code 1.
```
