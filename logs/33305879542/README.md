# CI log archive: 33305879542

- Workflow: CI
- Conclusion: failure
- Head branch: 220-dict-valued-requirement-slots
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33305879542
- Captured: 2026-08-30T10:12:18Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-30T10:11:56.7570734Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.7571017Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.7610509Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.7610930Z env:
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.7611115Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.7611459Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.8471107Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.8471917Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.8472339Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:56.8472522Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:59.5801068Z ##[error]packages/core/src/domain/plugins.ts(2,29): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:59.5809679Z ##[error]packages/core/src/graph/ir.ts(9,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:59.5811473Z ##[error]packages/core/src/plugins/ik.ts(1,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:59.5813548Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(76,76): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:59.5815422Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(89,64): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:11:59.6190553Z ##[error]Process completed with exit code 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-30T10:11:58.5707191Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:11:58.5708218Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:11:58.5759068Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:11:58.5759494Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:11:58.5759812Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:11:58.5760153Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:12:01.0178444Z ##[error]packages/core/src/domain/plugins.ts(2,29): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:12:01.0189209Z ##[error]packages/core/src/graph/ir.ts(9,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:12:01.0192782Z ##[error]packages/core/src/plugins/ik.ts(1,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:12:01.0541369Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-30T10:11:56.4668369Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.4669252Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.4718549Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.4719489Z env:
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.4719757Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.4719986Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.5846435Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.5847393Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.5848162Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.5848721Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.9300862Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.9321428Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:56.9322487Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.6687395Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7016659Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 66^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7065324Z ^[[31m     ^[[31m×^[[31m LF-5 interpolates a bare array of stops^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7108730Z ^[[31m     ^[[31m×^[[31m LF-6 publishes a bare static value and holds it at every progress^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7124200Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7150729Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7152414Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7154166Z      ^[[32m✓^[[39m LF-10 closes the static domain instead of leaving it open^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7155841Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7157475Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7159367Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7161295Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7163263Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7165119Z      ^[[32m✓^[[39m LF-16 leaves no authored schema in the repository on the retired form^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.7961690Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m0 test^[[22m^[[2m)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:57.9602315Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.0760885Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.0762760Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.0790632Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.0847477Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.0880485Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.0893009Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.0950664Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.1012576Z      ^[[32m✓^[[39m Y-7 cites the section in a diagnostic about a leaf inside it^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.1040679Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.1100751Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.1130574Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.1160720Z ^[[31m     ^[[31m×^[[31m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.1170493Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.1200471Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.1618837Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 72^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.2399830Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.5650796Z  ^[[31m❯^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.5670582Z ^[[31m     ^[[31m×^[[31m FB-11 a five-bone chain tracks an animated goal with every length intact^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.5680991Z ^[[31m     ^[[31m×^[[31m FB-12 two goals off one spine are both reached, and the spine is solved once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.6041680Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.6240825Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.6274438Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.6296949Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.6320791Z      ^[[32m✓^[[39m IK-16 DOM adapter skips a nested composite and writes nothing for a solver node^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.6375314Z ^[[31m     ^[[31m×^[[31m IK-17 handle.get for solver node returns solved rotations record^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.8442460Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.9467605Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.9470568Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.9473058Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.9475254Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.9484504Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.9486672Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.9490429Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:58.9492513Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.1621305Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.2871325Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.3221732Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.3243877Z      ^[[32m✓^[[39m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.3280686Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.3340786Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.3363468Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.3391171Z ^[[31m     ^[[31m×^[[31m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.3414165Z      ^[[32m✓^[[39m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.4831330Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.6369226Z  ^[[31m❯^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.6400950Z ^[[31m     ^[[31m×^[[31m MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.6416654Z ^[[31m     ^[[31m×^[[31m MG-13 seeding the goal node alone re-solves the whole chain^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.6442597Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.7916416Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.7951165Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.7953539Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.7955484Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.9357168Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.9392229Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.9394208Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.9395984Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.9397723Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:11:59.9651728Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.0887076Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.2396416Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.3037153Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.4005332Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.5345395Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.5959397Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.7043119Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.7362453Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.7365326Z ^[[31m     ^[[31m×^[[31m keeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.7367505Z ^[[31m     ^[[31m×^[[31m publishes the same ready output regardless of mount order^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.7369556Z      ^[[32m✓^[[39m rejects an unknown cross-motion source at load instead of treating it as pending^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.8870562Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.9341809Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:00.9972119Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.1596523Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.1933855Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.2166895Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.3990279Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.4625752Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.4627665Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.4629446Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.4631768Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.6443783Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.6977297Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.7028855Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.8531051Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.9271127Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:01.9338954Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.0635982Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.1610881Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.1954225Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.1956713Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.2395852Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.3953910Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.4188894Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.4678789Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.6295135Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.6655083Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.6951210Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.8454213Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.8987370Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:02.9527741Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0632060Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0667335Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0710828Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0711623Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Suites 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0712132Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0716149Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m [ packages/core/test/integration/phase7-walker-demo.test.ts ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0722083Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0723672Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0838753Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0840405Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0841562Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0842236Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0842845Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0844336Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0846588Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m248:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0847224Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0847527Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0847749Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0847756Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0848087Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 31 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0848357Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0849965Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-5 interpolates a bare array of stops
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0851605Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0852892Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0854057Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0854758Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0855416Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0856290Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0857315Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0859602Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0861414Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m133:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0862389Z ^[[90m ^[[2m❯^[[22m valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m163:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0863267Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m226:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0863666Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0863921Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0864175Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0865142Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-6 publishes a bare static value and holds it at every progress
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0866153Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0866888Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0867661Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0868306Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0868934Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0869741Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0870332Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0871431Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0872590Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m133:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0873496Z ^[[90m ^[[2m❯^[[22m valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m163:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0874344Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m231:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0874720Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0874967Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0875173Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0876305Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0878080Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0879513Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0969689Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0970661Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0971692Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0972757Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0973833Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0974709Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0975718Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0977097Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0978534Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0980297Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0981790Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0983246Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m50:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0983879Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0984344Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0984760Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0986513Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mpublishes the same ready output regardless of mount order
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0988344Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0989862Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0990886Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0991465Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0992365Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0993301Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0994023Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0994599Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0995156Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0996495Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0997918Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.0999348Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1000214Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1001037Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m72:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1001539Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1001976Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1002377Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1003748Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-11 a five-bone chain tracks an animated goal with every length intact
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1005196Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1005955Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1006727Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1008187Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1009828Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1010715Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1011443Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1012572Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1014240Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m24:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1015596Z ^[[90m ^[[2m❯^[[22m mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m154:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1016552Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m165:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1016943Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1017207Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1017431Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1019224Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-12 two goals off one spine are both reached, and the spine is solved once
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1020752Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1021525Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1022304Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1023262Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1024230Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1025140Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1025764Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1026877Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1028635Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m24:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1030065Z ^[[90m ^[[2m❯^[[22m mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m154:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1030932Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m210:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1031327Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1031583Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1031858Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1033440Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-12 the worked rig re-expressed with a goal dict solves to the same two numbers
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1034868Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1035618Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1036497Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1037605Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1038566Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1039409Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1040023Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1041764Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1043541Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-multi-goal.test.ts:^[[2m100:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1044497Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m112:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1044861Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1045107Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1045323Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1046278Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-13 seeding the goal node alone re-solves the whole chain
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1047281Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1048005Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1048775Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1049659Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1050299Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1050848Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1051430Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1052540Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1054197Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-multi-goal.test.ts:^[[2m100:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1055294Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m143:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1055677Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1055927Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1056150Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1057399Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1058874Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1060170Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1061069Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1061727Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1062360Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1062930Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1063948Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1065855Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1067273Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1068101Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m100:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1068637Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1069275Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1069654Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1071072Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1072385Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1073238Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1074056Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1075010Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1076074Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1076988Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1077941Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1079986Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1081905Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1083253Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m189:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1083863Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1084257Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1084610Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1086293Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-17 handle.get for solver node returns solved rotations record
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1088106Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1089732Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1091167Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1092090Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1092738Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1093312Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1093899Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1095007Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1096139Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1097151Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m255:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1097781Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1098214Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1098591Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1100536Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1101876Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1103124Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1104089Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1104744Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1105377Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1106242Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1107080Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1109414Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1111440Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1112635Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m87:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1113061Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1113308Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1113571Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1115198Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1116377Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1117138Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1117906Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1118580Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1119480Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1120050Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1120638Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1121733Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1122932Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1123925Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m120:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1124344Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1124589Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1124800Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1125785Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1126821Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1127542Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1128296Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1129144Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1130004Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1130694Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1131280Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1132360Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1133578Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1134544Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m141:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1134954Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1135203Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1135420Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1136612Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1138521Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1139803Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1140586Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1162855Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1163888Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1164497Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1165117Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1166475Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1167936Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m59:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1169987Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m91:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1170443Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1170708Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1170936Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1172401Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1174220Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1175274Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1175465Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1175734Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1175907Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1176043Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1176589Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1177019Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1177718Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m119:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1178579Z     ^[[90m117|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1179878Z     ^[[90m118|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1180572Z     ^[[90m119|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1181174Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1181776Z     ^[[90m120|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1182472Z     ^[[90m121|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1182670Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1183039Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1183274Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1184287Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1185342Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1186085Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1186867Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1187521Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1188163Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1188739Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1189952Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1191533Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1192798Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m59:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1193776Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m124:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1194180Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1194433Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1194649Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1196463Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m5. Requirement-scoped replacement updates edge identity consistently with GraphIR
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1197715Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1198800Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1199757Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1200125Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1200665Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1201280Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1202271Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1202849Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1203391Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1204123Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1205127Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1205932Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1206737Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1207761Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1208670Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m108:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1209355Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1209629Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1209855Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1211303Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1212958Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1214399Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1215615Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1216314Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1216958Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1217612Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1218634Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1219951Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1221275Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1222744Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m140:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1223282Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1223706Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1224081Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1225587Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1227130Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1228259Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1229511Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1230576Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1231248Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1232026Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1233020Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1234321Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1235622Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1236837Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m225:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1237292Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1237565Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1237780Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1239278Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-11 joins a bindings-only group to the composer chain and scopes its input
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1240671Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1241424Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1242347Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1243015Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1243641Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1244260Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1245203Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1246569Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1248081Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1249424Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m254:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1249889Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1250161Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1250385Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1252298Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1254281Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1255600Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1256525Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1257597Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1258389Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1259349Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1260340Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1261608Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1263504Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1265502Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m273:36^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1266262Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1266685Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1267017Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1268182Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1269970Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1270976Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1271764Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1272618Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1273605Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1274175Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1275222Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1276399Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1277612Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1279388Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m96:36^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1280472Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1280986Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1281281Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1282955Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1284147Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1284896Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1285678Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1286324Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1286958Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1287546Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1288160Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1289575Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1290828Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1292044Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m118:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1292476Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1292731Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1292940Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1294003Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1295595Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1296206Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1296351Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1296617Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1296795Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1296931Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1297273Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1297521Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1298031Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1298832Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1299606Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1300456Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1301409Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1302066Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1302502Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1302721Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1303093Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1303418Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1305286Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1307132Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1308306Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1309756Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1310796Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1311837Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1312950Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1314073Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1315883Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1317880Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1319773Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m152:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1320485Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1320884Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1321237Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1323131Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1324995Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1326193Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1327476Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1328488Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1329738Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1330648Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1331590Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1333393Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1335407Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1337000Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m185:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1337700Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1338102Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1338444Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1340484Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1343135Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1344155Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1344378Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1344819Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1345108Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1345323Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1345883Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1346292Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1347150Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m206:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1348080Z     ^[[90m204|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1348610Z     ^[[90m205|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1349695Z     ^[[90m206|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1351038Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1351719Z     ^[[90m207|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1352220Z     ^[[90m208|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1352483Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1352877Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1353432Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1355233Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1357184Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1358263Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1359355Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1359904Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1360751Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1361624Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1362531Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1363282Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1364153Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1365293Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1366569Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1367878Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1369431Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1370893Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1372296Z ^[[90m ^[[2m❯^[[22m createRuntime packages/core/test/integration/remount.test.ts:^[[2m29:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1373562Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m40:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1374110Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1374511Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1374848Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1376472Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1378158Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1379942Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1380898Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1381468Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1382322Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1383215Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1384145Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1384889Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1385766Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1386938Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1388229Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1389780Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1391102Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1392537Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1393952Z ^[[90m ^[[2m❯^[[22m createRuntime packages/core/test/integration/remount.test.ts:^[[2m29:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1395225Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m61:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1395755Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1396377Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1396722Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1398555Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1400765Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1401961Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1403215Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1404278Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1405297Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1406249Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1407241Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1409235Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1410644Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m34:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1411532Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m47:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1412104Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1412512Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1412737Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1412766Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1413273Z ^[[2m Test Files ^[[22m ^[[1m^[[31m13 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m47 passed^[[39m^[[22m^[[90m (60)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1414100Z ^[[2m      Tests ^[[22m ^[[1m^[[31m31 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m208 passed^[[39m^[[22m^[[90m (239)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1414669Z ^[[2m   Start at ^[[22m 10:11:56
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1415359Z ^[[2m   Duration ^[[22m 6.12s^[[2m (transform 1.63s, setup 486ms, import 4.71s, tests 1.34s, environment 9ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1415929Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1415942Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1448102Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/bare-authored-leaf.test.ts:133:40
integration (node 24)	Run npm run test:integration	 ❯ valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:163:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:226:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1462063Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1467578Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/bare-authored-leaf.test.ts:133:40
integration (node 24)	Run npm run test:integration	 ❯ valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:163:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:231:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1471104Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1476958Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:50:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1479832Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1483697Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:72:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1486986Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1490693Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:24:11
integration (node 24)	Run npm run test:integration	 ❯ mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:154:19
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:165:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1492544Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1495542Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:24:11
integration (node 24)	Run npm run test:integration	 ❯ mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:154:19
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:210:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1497361Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1500282Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-multi-goal.test.ts:100:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:112:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1501938Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1504374Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-multi-goal.test.ts:100:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:143:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1505946Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1508420Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:100:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1510326Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1512797Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:189:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1514580Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1517019Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:255:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1518642Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1521624Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:87:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1523345Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1526132Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:120:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1528162Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1531521Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:141:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1533298Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1536094Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:59:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:91:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1537778Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1541067Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1542980Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1545775Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:59:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:124:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1547423Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1552430Z ##[error]TypeError: readGoalSlot is not a function
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1555177Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1557114Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:248:11
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1558399Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1561351Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:140:40
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1563077Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1565836Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:225:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1567532Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1570473Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:254:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1572343Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1575162Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:273:36
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1576924Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1579821Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:96:36
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1581823Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1584689Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:118:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1586586Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1589938Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1591865Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1594658Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:152:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1596390Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1599276Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:185:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1601060Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1604279Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1606121Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1611532Z ##[error]TypeError: readGoalSlot is not a function
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1614774Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1620962Z ##[error]TypeError: readGoalSlot is not a function
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1623799Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1626273Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:34:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:47:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:12:03.1766114Z ##[error]Process completed with exit code 1.
```
