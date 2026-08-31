# CI log archive: 33350472628

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-03-interpolated-resolves-its-track
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33350472628
- Captured: 2026-08-31T02:23:02Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-31T02:22:43.9530195Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:43.9530557Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:43.9570054Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:43.9570344Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:43.9570539Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:43.9570756Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:44.0609654Z 
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:44.0610087Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:44.0610736Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:44.0611091Z 
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:47.8802081Z ##[error]packages/core/src/runtime/project-runtime.ts(319,9): error TS2322: Type '((node: GraphNode) => (() => MemberState) | undefined) | undefined' is not assignable to type '((node: GraphNode) => () => MemberState) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:47.8810941Z   Type '(node: GraphNode) => (() => MemberState) | undefined' is not assignable to type '(node: GraphNode) => () => MemberState'.
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:47.8811802Z     Type '(() => MemberState) | undefined' is not assignable to type '() => MemberState'.
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:47.8812442Z       Type 'undefined' is not assignable to type '() => MemberState'.
quality (node 24)	Run npm run typecheck	2026-08-31T02:22:47.9200215Z ##[error]Process completed with exit code 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-31T02:22:41.6186720Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:41.6187181Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:41.6208825Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:41.6209185Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:41.6209421Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:41.6209722Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:43.1130530Z ##[error]packages/core/src/runtime/project-runtime.ts(319,9): error TS2322: Type '((node: GraphNode) => (() => MemberState) | undefined) | undefined' is not assignable to type '((node: GraphNode) => () => MemberState) | undefined'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:43.1137184Z   Type '(node: GraphNode) => (() => MemberState) | undefined' is not assignable to type '(node: GraphNode) => () => MemberState'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:43.1137938Z     Type '(() => MemberState) | undefined' is not assignable to type '() => MemberState'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:43.1138418Z       Type 'undefined' is not assignable to type '() => MemberState'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T02:22:43.1299372Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-31T02:22:41.2495353Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.2495727Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.2534299Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.2534809Z env:
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.2535015Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.2535239Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.3761221Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.3762321Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.3763614Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.3764246Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.7233843Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.7236497Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:41.7263809Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.4682130Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.5033951Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 79^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6715280Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6736659Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6774423Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6802761Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6830391Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6831240Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6844305Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6864542Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6865481Z });
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6866125Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6866671Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6867994Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.6869124Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.7153572Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 149^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.8125360Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:42.8655588Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 53^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.0390359Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.0837667Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.2216241Z  ^[[31m❯^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.2265729Z ^[[31m     ^[[31m×^[[31m RA-14 reads the recompiled Track when a declining backend escalated a live write^[[39m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.2271669Z      ^[[32m✓^[[39m RA-15 reads the recompiled Track when a replacement rebuilt the graph^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.2273864Z      ^[[32m✓^[[39m RA-16 exposes no publisher cache clear, because nothing could ever call it^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.2275697Z      ^[[32m✓^[[39m RA-17 escalates a live write on an ordinary node, which never needed this fix^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.5479358Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.5553440Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.5723677Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.8671245Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.8744718Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:43.8817245Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.1555167Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.1669496Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.1724552Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.4378143Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.4631967Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.4893597Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.7294340Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.7355088Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.7486613Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.9573922Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:44.9901054Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.0335149Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.2049920Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.2686096Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.2955406Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.4906523Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.5039428Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.5504817Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.7455136Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.7500870Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:45.8018020Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.0068551Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.0144377Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.0181840Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.2632645Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.2635031Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.2768056Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.4642170Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.5155373Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.5252279Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.6842548Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.7235377Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.7438200Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.9116024Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:46.9488824Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.0125402Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.1021024Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.2065632Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.2257764Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.3294447Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.4615657Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.5017270Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.5114787Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.7177796Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.7184565Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.7515378Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.8946541Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9127116Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9158082Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9159009Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9159585Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9163414Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/solver-member-cache.test.ts^[[2m > ^[[22ma solver member is read from the compiled map rather than from a captured Track^[[2m > ^[[22mRA-14 reads the recompiled Track when a declining backend escalated a live write
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9168081Z ^[[31m^[[1mAssertionError^[[22m: expected 'error' to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9168820Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9169285Z Expected: ^[[32m"ready"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9169851Z Received: ^[[31m"error"^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9170093Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9170985Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/solver-member-cache.test.ts:^[[2m152:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9221993Z     ^[[90m150|^[[39m     // of its chain blocks; reading `rotations` before asserting this …
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9225523Z     ^[[90m151|^[[39m     ^[[90m// failing it, and a crash is a broken file rather than evidence.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9227728Z     ^[[90m152|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[33mSOLVER^[[39m)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9242345Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9242811Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9244597Z     ^[[90m153|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[33mUPPER^[[39m)^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9248534Z     ^[[90m154|^[[39m     ^[[34mexpect^[[39m(runtime^[[33m.^[[39mdiagnostics^[[33m.^[[39mentries)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(diagnosed)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9254793Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9255612Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9256276Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9264241Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m61 passed^[[39m^[[22m^[[90m (62)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9265809Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m257 passed^[[39m^[[22m^[[90m (258)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9266810Z ^[[2m   Start at ^[[22m 02:22:41
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9268087Z ^[[2m   Duration ^[[22m 6.16s^[[2m (transform 1.58s, setup 453ms, import 5.11s, tests 1.69s, environment 10ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9268845Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9268859Z 
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9292196Z ##[error]AssertionError: expected 'error' to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Expected: "ready"
integration (node 24)	Run npm run test:integration	Received: "error"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/solver-member-cache.test.ts:152:40
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-31T02:22:47.9623292Z ##[error]Process completed with exit code 1.
```
