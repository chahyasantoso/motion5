# CI log archive: 33310291004

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lv-live-value-updates
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33310291004
- Captured: 2026-08-30T12:00:02Z

## Failed job output

```text
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-30T11:59:44.7111726Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T11:59:44.7112206Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T11:59:44.7137878Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T11:59:44.7138189Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T11:59:44.7138413Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T11:59:44.7138723Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T11:59:46.7270051Z ##[error]packages/core/src/runtime/project-runtime.ts(326,5): error TS2739: Type 'Readonly<{ id: string; readonly live: boolean; readonly track: TrackDefinition; remove: () => void; replace: (next: TrackDefinition) => void; addObserve: (observation: ObservationDefinition) => void; removeObserve: (observation: ObservationDefinition) => void; }>' is missing the following properties from type 'TrackHandle': overrideValues, setValues
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T11:59:46.7475984Z ##[error]Process completed with exit code 2.
quality (node 24)	Run npm run typecheck	﻿2026-08-30T11:59:41.6411997Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.6412458Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.6439287Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.6439945Z env:
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.6440252Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.6440564Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.7428512Z 
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.7429612Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.7430413Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:41.7430775Z 
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:45.1808633Z ##[error]packages/core/src/runtime/project-runtime.ts(326,5): error TS2739: Type 'Readonly<{ id: string; readonly live: boolean; readonly track: TrackDefinition; remove: () => void; replace: (next: TrackDefinition) => void; addObserve: (observation: ObservationDefinition) => void; removeObserve: (observation: ObservationDefinition) => void; }>' is missing the following properties from type 'TrackHandle': overrideValues, setValues
quality (node 24)	Run npm run typecheck	2026-08-30T11:59:45.2083702Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-30T11:59:39.2098538Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2098854Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2133809Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2134261Z env:
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2134431Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2134610Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2957811Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2958511Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2959127Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.2959621Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.5490774Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.5495799Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:39.5496522Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.1113448Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.1333432Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2677060Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2696272Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2697391Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2721693Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2747369Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2775811Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2776425Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2800812Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2821515Z });
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2840165Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2840784Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2841820Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2843617Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.2870687Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 97^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.3536314Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.4181507Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.5271556Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.5577206Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.8058151Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.8114262Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:40.8618684Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.0318172Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.0841393Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.0961102Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.2689113Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.2801699Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.3181135Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.4949991Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.5480780Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.5789521Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.7421663Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.7866609Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.8141115Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:41.9691909Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.0071366Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.0457304Z  ^[[31m❯^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.0511122Z ^[[31m     ^[[31m×^[[31m LV-2 reaches both surfaces from one call^[[39m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.0531535Z ^[[31m     ^[[31m×^[[31m LV-3 makes a dependent IK solver recompute from the masked member^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.2025188Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.2378092Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.2825260Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.4328411Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.4591198Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.4769342Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.6358027Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.6484021Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.6671986Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.8026504Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.8538843Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.8604320Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:42.9970332Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.0281202Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.0530927Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.1897789Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.1941715Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.2180888Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.3580932Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.3722637Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.3813221Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.5393067Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.5428967Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.5988434Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.6715575Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.7361585Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.7708470Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.8314016Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.9359960Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.9746714Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:43.9847402Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.1190404Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.1460185Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.1530838Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2784461Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2810586Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2835315Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2836118Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2836484Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2839591Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/live-value-composition.test.ts^[[2m > ^[[22ma masked value reaches composition and the publisher's MemberState^[[2m > ^[[22mLV-2 reaches both surfaces from one call
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2844070Z ^[[31m^[[1mTypeError^[[22m: liveTrack(...).overrideValues is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2845360Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/live-value-composition.test.ts:^[[2m99:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2880920Z     ^[[90m 97|^[[39m     ^[[34mexpect^[[39m(^[[34msolved^[[39m(handle)[^[[33mUPPER^[[39m])^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m40.168^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2881881Z     ^[[90m 98|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2885281Z     ^[[90m 99|^[[39m     ^[[34mliveTrack^[[39m(handle^[[33m,^[[39m ^[[33mUPPER^[[39m)^[[33m.^[[39m^[[34moverrideValues^[[39m({ length^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2886258Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2886973Z     ^[[90m100|^[[39m     // The solver's own flush. One seam is the whole claim, and `LV-5`…
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2887897Z     ^[[90m101|^[[39m     handle^[[33m.^[[39m^[[34mseek^[[39m(^[[33mSHOULDER^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2888530Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2888555Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2889441Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2889751Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2891292Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/live-value-composition.test.ts^[[2m > ^[[22ma masked value reaches composition and the publisher's MemberState^[[2m > ^[[22mLV-3 makes a dependent IK solver recompute from the masked member
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2893622Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m60 passed^[[39m^[[22m^[[90m (61)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2894695Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m252 passed^[[39m^[[22m^[[90m (254)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2895390Z ^[[2m   Start at ^[[22m 11:59:39
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2896239Z ^[[31m^[[1mTypeError^[[22m: liveTrack(...).overrideValues is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2897363Z ^[[2m   Duration ^[[22m 4.70s^[[2m (transform 1.22s, setup 310ms, import 3.94s, tests 1.15s, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2898699Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/live-value-composition.test.ts:^[[2m119:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2899496Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2900866Z     ^[[90m117|^[[39m     ^[[34mexpect^[[39m(rotations[^[[33mFOREARM^[[39m])^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[33m-^[[39m^[[34m51.318^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2901721Z     ^[[90m118|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2902703Z     ^[[90m119|^[[39m     ^[[34mliveTrack^[[39m(handle^[[33m,^[[39m ^[[33mFOREARM^[[39m)^[[33m.^[[39m^[[34moverrideValues^[[39m({ length^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2903675Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2904446Z     ^[[90m120|^[[39m     handle^[[33m.^[[39m^[[34mseek^[[39m(^[[33mSHOULDER^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2905018Z     ^[[90m121|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2905170Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2905482Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2905753Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2911034Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2928443Z ##[error]TypeError: liveTrack(...).overrideValues is not a function
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/live-value-composition.test.ts:99:30
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2934705Z 
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.2936386Z ##[error]TypeError: liveTrack(...).overrideValues is not a function
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/live-value-composition.test.ts:119:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T11:59:44.3354369Z ##[error]Process completed with exit code 1.
```
