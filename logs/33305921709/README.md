# CI log archive: 33305921709

- Workflow: CI
- Conclusion: failure
- Head branch: 220-dict-valued-requirement-slots
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33305921709
- Captured: 2026-08-30T10:13:27Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-30T10:12:57.0692099Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.0692574Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.0743436Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.0743963Z env:
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.0744172Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.0744395Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.2307669Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.2308352Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.2308773Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-30T10:12:57.2308983Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:13:00.7229385Z ##[error]packages/core/src/domain/plugins.ts(2,29): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:13:00.7239482Z ##[error]packages/core/src/graph/ir.ts(9,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:13:00.7241363Z ##[error]packages/core/src/plugins/ik.ts(1,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:13:00.7243764Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(76,76): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:13:00.7246428Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(89,64): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:13:00.7744664Z ##[error]Process completed with exit code 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-30T10:13:01.0731240Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:01.0732193Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:01.0758516Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:01.0758972Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:01.0759267Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:01.0759614Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:03.1493552Z ##[error]packages/core/src/domain/plugins.ts(2,29): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:03.1501265Z ##[error]packages/core/src/graph/ir.ts(9,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:03.1503737Z ##[error]packages/core/src/plugins/ik.ts(1,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:13:03.1700652Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-30T10:12:59.1687866Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.1688488Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.1727335Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.1727631Z env:
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.1727834Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.1728057Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.2745254Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.2745849Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.2746632Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.2747041Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.6751116Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.6755976Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:59.6756867Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2305910Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2754876Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 62^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2757499Z ^[[31m     ^[[31m×^[[31m LF-5 interpolates a bare array of stops^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2759279Z ^[[31m     ^[[31m×^[[31m LF-6 publishes a bare static value and holds it at every progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2761141Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2762628Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2763390Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2764140Z      ^[[32m✓^[[39m LF-10 closes the static domain instead of leaving it open^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2766105Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2767732Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2769152Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2770684Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2772030Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.2773430Z      ^[[32m✓^[[39m LF-16 leaves no authored schema in the repository on the retired form^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.3306252Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m0 test^[[22m^[[2m)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5029202Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5506947Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5509332Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5511770Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5514752Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5548611Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5572012Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5585754Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5595823Z      ^[[32m✓^[[39m Y-7 cites the section in a diagnostic about a leaf inside it^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5597968Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5601020Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5602964Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5605395Z ^[[31m     ^[[31m×^[[31m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5607596Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.5609755Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.6317244Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.7347342Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.9751959Z  ^[[31m❯^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.9754042Z ^[[31m     ^[[31m×^[[31m FB-11 a five-bone chain tracks an animated goal with every length intact^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:00.9756133Z ^[[31m     ^[[31m×^[[31m FB-12 two goals off one spine are both reached, and the spine is solved once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.0171423Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.0309624Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.0312599Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.0315286Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.0317668Z      ^[[32m✓^[[39m IK-16 DOM adapter skips a nested composite and writes nothing for a solver node^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.0319908Z ^[[31m     ^[[31m×^[[31m IK-17 handle.get for solver node returns solved rotations record^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.2189793Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.2851930Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.2854707Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.2862978Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.2892506Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.2894807Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.2896801Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.2898601Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.3256807Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.4781561Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.5736823Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.5857452Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.5860167Z      ^[[32m✓^[[39m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.5886035Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.5888333Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.5890451Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.5903791Z ^[[31m     ^[[31m×^[[31m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[39m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.5906213Z      ^[[32m✓^[[39m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.7424909Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.8205698Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.8730083Z  ^[[31m❯^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.8732990Z ^[[31m     ^[[31m×^[[31m MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.8735749Z ^[[31m     ^[[31m×^[[31m MG-13 seeding the goal node alone re-solves the whole chain^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.9734632Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.9746129Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.9757901Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:01.9759773Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.0806750Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.1617947Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.1623408Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.1625268Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.1626813Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.1628420Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.2254789Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.3054027Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.4436643Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.4818706Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.5644729Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.6876569Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.7350682Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.8007528Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.8026495Z ^[[31m     ^[[31m×^[[31m keeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.8051450Z ^[[31m     ^[[31m×^[[31m publishes the same ready output regardless of mount order^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.8066194Z      ^[[32m✓^[[39m rejects an unknown cross-motion source at load instead of treating it as pending^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.9532988Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:02.9749881Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.0607206Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.1893355Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.2374041Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.2801705Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.4309010Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.4842857Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.4845046Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.4846235Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.5002433Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.6866458Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.7106230Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.7157267Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.8999153Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.9196684Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:03.9267458Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.1298646Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.1345506Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.1813369Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.1836139Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.3005237Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.3925965Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.4002893Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.4926648Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.6461175Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.6587159Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.6745144Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.8736127Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.8739512Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:04.9435162Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0544888Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0679559Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0721274Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0721992Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Suites 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0722496Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0726790Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m [ packages/core/test/integration/phase7-walker-demo.test.ts ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0732535Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0734120Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0837438Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0838721Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0839924Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0840983Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0842076Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0844170Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0847092Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m248:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0847851Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0848386Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0848782Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0848794Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0849425Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 31 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0849936Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0851444Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-5 interpolates a bare array of stops
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0853087Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0854771Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0856217Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0857432Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0858563Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0859588Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0860618Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0862581Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0864987Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m133:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0866700Z ^[[90m ^[[2m❯^[[22m valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m163:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0868244Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m226:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0868971Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0869434Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0869816Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0871508Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-6 publishes a bare static value and holds it at every progress
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0873272Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0874821Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0876227Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0877357Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0878453Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0879442Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0880486Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0882428Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0884674Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m133:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0886346Z ^[[90m ^[[2m❯^[[22m valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m163:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0887869Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m231:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0888541Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0888969Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0889336Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0891366Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0893855Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0895242Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0951850Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0952754Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0955819Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0956934Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0958078Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0959014Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0960178Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0961595Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0963178Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0964964Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0966647Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0968202Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m50:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0968989Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0969523Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0969989Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0971731Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mpublishes the same ready output regardless of mount order
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0973541Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0975137Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0976316Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0977066Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0978079Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0979159Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0980241Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0981197Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0982311Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0983681Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0985466Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0987035Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0988553Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0990138Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m72:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0990910Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0991512Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0992031Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0994143Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-11 a five-bone chain tracks an animated goal with every length intact
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0996478Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0997955Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.0999472Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1001260Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1002524Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1003703Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1005290Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1007451Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1009638Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m24:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1011497Z ^[[90m ^[[2m❯^[[22m mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m154:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1013162Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m165:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1014021Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1014817Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1015345Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1017419Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-12 two goals off one spine are both reached, and the spine is solved once
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1019444Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1020938Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1022422Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1023718Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1025212Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1026180Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1027207Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1029150Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1031208Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m24:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1032838Z ^[[90m ^[[2m❯^[[22m mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m154:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1034625Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m210:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1035309Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1035764Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1036145Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1038095Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-12 the worked rig re-expressed with a goal dict solves to the same two numbers
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1040016Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1041288Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1042648Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1043738Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1045059Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1046033Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1047037Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1049591Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1051802Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-multi-goal.test.ts:^[[2m100:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1053288Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m112:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1053920Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1054556Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1054938Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1056709Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-13 seeding the goal node alone re-solves the whole chain
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1058482Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1059744Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1061057Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1062158Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1063243Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1064203Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1065665Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1067541Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1069389Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-multi-goal.test.ts:^[[2m100:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1070731Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m143:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1071305Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1071686Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1072013Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1073650Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1075612Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1076687Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1077888Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1078827Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1079437Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1080409Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1081383Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1083131Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1085133Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1086444Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m100:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1087057Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1087420Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1087772Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1089048Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1091592Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1092616Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1093505Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1094743Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1095782Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1096612Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1097325Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1099231Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1100796Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1101972Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m189:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1102563Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1102962Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1103313Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1104822Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-17 handle.get for solver node returns solved rotations record
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1106536Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1107772Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1108559Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1109194Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1109794Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1110330Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1110876Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1111931Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1113005Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1113797Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m255:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1114144Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1114538Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1114755Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1115903Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1117031Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1117721Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1118435Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1119037Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1119626Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1120154Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1120699Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1122076Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1123222Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1124129Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m87:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1124658Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1124892Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1125099Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1126053Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1127652Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1128970Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1130402Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1131193Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1132287Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1133223Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1134155Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1135662Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1137781Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1139511Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m120:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1140218Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1140630Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1140994Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1142495Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1144512Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1145873Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1147083Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1148032Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1149417Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1150509Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1151437Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1152896Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1154060Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1155544Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m141:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1156283Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1156606Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1176687Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1178582Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1179928Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1180683Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1181435Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1182408Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1183238Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1183788Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1184725Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1186235Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1187430Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m59:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1188785Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m91:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1189289Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1189535Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1189746Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1190704Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1192704Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1193601Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1193850Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1194401Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1194592Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1194748Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1195111Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1195454Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1196352Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m119:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1197239Z     ^[[90m117|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1198336Z     ^[[90m118|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1199009Z     ^[[90m119|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1199588Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1200554Z     ^[[90m120|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1201448Z     ^[[90m121|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1201623Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1201868Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1202079Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1203622Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1204920Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1206219Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1207089Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1208155Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1209033Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1209840Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1210742Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1212332Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1214683Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m59:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1216463Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m124:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1217016Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1217264Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1217629Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1219214Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m5. Requirement-scoped replacement updates edge identity consistently with GraphIR
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1220926Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1221976Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1222657Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1223249Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1223964Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1225089Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1225784Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1226224Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1227125Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1227972Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1229257Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1230462Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1231586Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1232693Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1233952Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m108:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1234922Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1235207Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1235446Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1237381Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1240101Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1241137Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1241906Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1243013Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1243778Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1244595Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1245648Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1247489Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1248736Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1249683Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m140:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1250196Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1250502Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1250714Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1251834Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1253141Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1253865Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1254882Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1255539Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1256135Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1256666Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1257224Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1258288Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1259448Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1260375Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m225:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1260795Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1261031Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1261240Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1262369Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-11 joins a bindings-only group to the composer chain and scopes its input
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1263498Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1264184Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1265159Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1265765Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1266353Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1266879Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1267739Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1268807Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1269961Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1270888Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m254:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1271553Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1271973Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1272309Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1274190Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1276543Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1277741Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1278963Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1279971Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1280937Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1281806Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1282736Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1284743Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1286774Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1288390Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m273:36^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1289087Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1289470Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1289801Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1291655Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1293467Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1294859Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1296086Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1297688Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1298701Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1299594Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1300513Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1302304Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1304519Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1306106Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m96:36^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1307010Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1307398Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1307963Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1309891Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1311760Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1312943Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1314141Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1315390Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1316396Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1317278Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1318226Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1320025Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1321964Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1323536Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m118:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1324408Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1324810Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1325155Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1326897Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1329496Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1330534Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1330744Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1331178Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1331455Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1331666Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1332228Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1332633Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1333459Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1334637Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1335165Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1335989Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1336933Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1337582Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1338036Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1338238Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1338618Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1338959Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1340866Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1342700Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1343855Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1345306Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1346334Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1347316Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1348596Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1349535Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1351321Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1353279Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1355058Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m152:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1355816Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1356232Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1356600Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1358534Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1360778Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1362582Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1364711Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1366527Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1367575Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1368464Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1369377Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1371164Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1373169Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1374960Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m185:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1375638Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1376034Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1376358Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1378096Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1380717Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1381747Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1381957Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1382382Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1382661Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1382864Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1383415Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1383809Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1384879Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m206:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1386148Z     ^[[90m204|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1387300Z     ^[[90m205|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1388363Z     ^[[90m206|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1389439Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1390175Z     ^[[90m207|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1390716Z     ^[[90m208|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1391015Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1391462Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1392252Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1394390Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1395801Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1396434Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1396956Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1397288Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1398125Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1398932Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1399482Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1399917Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1400431Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1401574Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1402794Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1403711Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1405085Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1406613Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1407744Z ^[[90m ^[[2m❯^[[22m createRuntime packages/core/test/integration/remount.test.ts:^[[2m29:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1408493Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m40:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1408813Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1409058Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1409277Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1410231Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1411445Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1412345Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1412971Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1413612Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1414747Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1415743Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1416663Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1417418Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1418311Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1419508Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1420845Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1422223Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1423623Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1425327Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1426841Z ^[[90m ^[[2m❯^[[22m createRuntime packages/core/test/integration/remount.test.ts:^[[2m29:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1428157Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m61:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1428730Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1429373Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1429896Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1431792Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1433801Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1435377Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1436730Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1437843Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1438935Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1439897Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1440926Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1442904Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1445144Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m34:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1446726Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m47:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1447360Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1447620Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1447833Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1447864Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1448329Z ^[[2m Test Files ^[[22m ^[[1m^[[31m13 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m47 passed^[[39m^[[22m^[[90m (60)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1449130Z ^[[2m      Tests ^[[22m ^[[1m^[[31m31 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m208 passed^[[39m^[[22m^[[90m (239)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1449674Z ^[[2m   Start at ^[[22m 10:12:59
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1450332Z ^[[2m   Duration ^[[22m 5.38s^[[2m (transform 1.37s, setup 392ms, import 4.07s, tests 1.15s, environment 9ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1450730Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1450736Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1474602Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/bare-authored-leaf.test.ts:133:40
integration (node 24)	Run npm run test:integration	 ❯ valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:163:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:226:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1483864Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1487848Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/bare-authored-leaf.test.ts:133:40
integration (node 24)	Run npm run test:integration	 ❯ valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:163:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:231:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1490155Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1494682Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:50:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1497004Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1500990Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:72:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1503242Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1506549Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:24:11
integration (node 24)	Run npm run test:integration	 ❯ mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:154:19
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:165:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1508368Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1511473Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:24:11
integration (node 24)	Run npm run test:integration	 ❯ mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:154:19
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:210:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1513290Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1515984Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-multi-goal.test.ts:100:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:112:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1517564Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1520024Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-multi-goal.test.ts:100:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:143:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1521525Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1523853Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:100:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1525648Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1528027Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:189:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1529679Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1532030Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:255:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1533550Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1536478Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:87:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1538189Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1540826Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:120:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1542816Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1545788Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:141:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1547473Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1550120Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:59:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:91:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1551769Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1554945Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:119:58
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1556828Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1559523Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:59:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:124:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1561172Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1566081Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ new ProjectRuntime packages/core/src/runtime/project-runtime.ts:146:21
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:108:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1568782Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1570599Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:248:11
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1571859Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1574667Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:140:40
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1576345Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1579055Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:225:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1580630Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1584179Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:254:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1586293Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1588838Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:273:36
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1590370Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1592793Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:96:36
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1594972Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1597719Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:118:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1599266Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1602812Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:139:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1605295Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1607903Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:152:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1609452Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1611851Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:185:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1613393Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1616535Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:206:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1618301Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1623001Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ new ProjectRuntime packages/core/src/runtime/project-runtime.ts:146:21
integration (node 24)	Run npm run test:integration	 ❯ createRuntime packages/core/test/integration/remount.test.ts:29:19
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/remount.test.ts:40:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1626204Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1630901Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ new ProjectRuntime packages/core/src/runtime/project-runtime.ts:146:21
integration (node 24)	Run npm run test:integration	 ❯ createRuntime packages/core/test/integration/remount.test.ts:29:19
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/remount.test.ts:61:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1633565Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1636143Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:34:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:47:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:13:05.1727733Z ##[error]Process completed with exit code 1.
```
